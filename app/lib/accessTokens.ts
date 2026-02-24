"use server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { loggerFactory } from '@/app/lib/logger'
import { redirect } from "next/navigation"

const logger = loggerFactory({ module: 'accessTokens' })

/**
 * Get a valid access token for the current session.
 * 
 * Uses better-auth's built-in token management which:
 * - Retrieves the Cognito account for the current user
 * - Checks if the access token is expired
 * - Automatically refreshes the token if needed
 * - Updates the database with new tokens
 * 
 * @returns The access token string, or null if no session/account exists
 */
export const getAccessToken = async (): Promise<string | null> => {
  try {
    // Use better-auth's built-in getAccessToken API
    // This handles token refresh automatically
    const result = await auth.api.getAccessToken({
      body: { providerId: 'cognito' },
      headers: await headers()
    })
    
    if (!result?.accessToken) {
      logger.warn('No access token available')
      return null
    }

    return result.accessToken
  } catch (error: any) {
    // Handle authentication errors by redirecting to logout
    if (error?.status === 401 || error?.message?.includes('UNAUTHORIZED')) {
      logger.warn('Unauthorized - redirecting to logout')
      redirect('/logging-out')
    }

    logger.error('Error getting access token:', error)
    return null
  }
}
