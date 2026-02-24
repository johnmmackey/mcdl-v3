"use server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { loggerFactory } from '@/app/lib/logger'
import { redirect } from "next/navigation"
import Database from "better-sqlite3"

const logger = loggerFactory({ module: 'accessTokens' })

interface RefreshResponse extends Record<string, string | number> {
  id_token: string,
  access_token: string,
  expires_in: number,
  token_type: string
}

interface OpenIDConfig extends Record<string, string | string[] | number> {
  authorization_endpoint: string,
  end_session_endpoint: string,
  id_token_signing_alg_values_supported: string[],
  issuer: string,
  jwks_uri: string,
  response_types_supported: string[],
  revocation_endpoint: string,
  scopes_supported: string[],
  subject_types_supported: string[],
  token_endpoint: string,
  token_endpoint_auth_methods_supported: string[],
  userinfo_endpoint: string
}

// Get database connection
const getDb = () => {
  return new Database("./mcdl-auth.db")
}

// Get the access token for the current session
export const getAccessToken = async (): Promise<string | null> => {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session || !session.user) {
    logger.warn('No session found')
    return null
  }

  const userId = session.user.id
  logger.debug(`getting access token for ${userId}`)

  try {
    const db = getDb()
    
    // Get the account information from better-auth database
    const account = db.prepare(`
      SELECT * FROM account 
      WHERE userId = ? AND providerId = 'cognito'
      ORDER BY createdAt DESC 
      LIMIT 1
    `).get(userId) as any

    if (!account) {
      logger.warn(`no account found for user ${userId}`)
      db.close()
      redirect('/logging-out')
    }

    if (!account.accessToken) {
      logger.warn(`no access token found for ${userId}`)
      db.close()
      redirect('/logging-out')
    }

    // Check if token needs refresh (5 minutes buffer)
    const expiresAt = new Date(account.accessTokenExpiresAt).getTime()
    const now = Date.now()
    
    if (expiresAt - now > 5 * 60 * 1000) {
      // Token is still valid
      db.close()
      return account.accessToken
    }

    // Token needs refresh
    logger.debug(`refreshing token for user ${userId}`)
    
    if (!account.refreshToken) {
      logger.error('no refresh token available')
      db.close()
      redirect('/logging-out')
    }

    const newTokens = await refreshAccessToken(account.refreshToken)
    
    // Update the account with new tokens
    const newExpiresAt = new Date(Date.now() + newTokens.expires_in * 1000).toISOString()
    
    db.prepare(`
      UPDATE account 
      SET accessToken = ?, 
          idToken = ?, 
          accessTokenExpiresAt = ?
      WHERE id = ?
    `).run(newTokens.access_token, newTokens.id_token, newExpiresAt, account.id)

    db.close()
    return newTokens.access_token
  } catch (error) {
    logger.error('Error getting access token:', error)
    redirect('/logging-out')
  }
}

const refreshAccessToken = async (refresh_token: string): Promise<RefreshResponse> => {
  const openIdConfig = await getOpenIdConfig()

  const response = await fetch(openIdConfig.token_endpoint, {
    method: 'POST',
    body: new URLSearchParams({
      'grant_type': 'refresh_token',
      'client_id': process.env.AUTH_COGNITO_ID!,
      'client_secret': process.env.AUTH_COGNITO_SECRET!,
      'refresh_token': refresh_token
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })

  if (!response.ok) {
    logger.error('Failed to refresh token:', await response.text())
    redirect('/logging-out')
  }

  return await response.json()
}

// Cache OpenID config
let openIdConfig: OpenIDConfig | null = null

const getOpenIdConfig = async (): Promise<OpenIDConfig> => {
  if (openIdConfig) {
    return openIdConfig
  }

  const response = await fetch(`${process.env.AUTH_COGNITO_ISSUER}/.well-known/openid-configuration`)
  
  if (!response.ok) {
    throw new Error(`Can't get Open ID config`)
  }

  openIdConfig = await response.json()
  return openIdConfig as OpenIDConfig
}

// Kept for backwards compatibility - better-auth handles account storage automatically
export const storeAccount = async (userId: string, account: any, refresh?: boolean): Promise<void> => {
  logger.debug(`storeAccount called - better-auth handles this automatically`)
  // Better-auth stores accounts automatically during OAuth flow
  // This function is kept for compatibility but doesn't need to do anything
}
