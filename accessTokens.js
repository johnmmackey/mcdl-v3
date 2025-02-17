import { defaultOptions } from "@auth/upstash-redis-adapter"
import { redis, upStashOpt } from '@/auth'
import { logger } from "@/app/lib/logger"

interface Account extends Record<string, string | number> {
  access_token: string,
  id_token: string,
  refresh_token: string,
  expires_at: number,
  token_type: string,
  providerAccountId: string,
  provider: string,
  type: string,
  userId: string,
  id: string
}

interface RefreshResponse extends Record<string, string | number> {
  id_token: string,
  access_token: string,
  expires_in: number,
  token_type: string
}

interface ActiveRefresh extends Record<string, string | Promise<string>> {
  userId: string,
  promiseOfToken: Promise<string>
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


// list of active refreshes
// only want to do one refresh for a user, so we keep a static list
let activeRefreshes: ActiveRefresh[] = [];

// IMPORTANT: the userId here is the auth.js user id, NOT the provider ID or the Cognito "sub"
export const getAccessToken = async (userId: string): Promise<string | null> => {
  const opt = { ...defaultOptions, ...upStashOpt };

  const accountKey = await redis.get<string>(opt.baseKeyPrefix + opt.accountByUserIdPrefix + userId);
  if (!accountKey)
    throw new Error('Account Key not found')

  let account = (await redis.get<Account>(accountKey)) as Account;

  logger.debug(`Obtained Access Token. Expires at ${(new Date(account.expires_at * 1000)).toISOString()}`);

  if (account.expires_at * 1000 - Date.now() > 5 * 60 * 1000) // if the token has 5 min or more of life
    return account.access_token;

  // we need to refresh the token
  logger.debug('Refreshing token...');
  // if there is already one active, use it.

  const existingRefresh = activeRefreshes.find(e => e.userId === userId);
  if (existingRefresh) {
    logger.debug('short circuiting duplicate refresh')
    return existingRefresh.promiseOfToken;
  }

  // new one, so lets start it and save
  const promiseOfToken = getRefreshedToken(accountKey, account);
  activeRefreshes.push({ userId, promiseOfToken });
  const newAccessToken = await promiseOfToken;
  activeRefreshes = activeRefreshes.filter(e => e.userId !== userId);
  logger.debug('refresh complete')
  return newAccessToken;
}


const getRefreshedToken = async (accountKey: string, account: Account): Promise<string> => {
  let openIdConfig = await getOpenIdConfig();

  let response = await fetch(`${openIdConfig.token_endpoint}`, {
    method: 'POST',
    body: new URLSearchParams({
      'grant_type': 'refresh_token',
      'client_id': process.env.AUTH_COGNITO_ID,
      'client_secret': process.env.AUTH_COGNITO_SECRET,
      'refresh_token': account.refresh_token
    } as Record<string, string>),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (!response.ok)
    throw new Error(`Post to COGNITO token endpoint failed: ${response.statusText}: ${await response.text()}`);

  let newTokens: RefreshResponse = await response.json();
  let newAccount = { ...account, id_token: newTokens.id_token, access_token: newTokens.access_token, expires_at: Math.floor(Date.now() / 1000) + newTokens.expires_in }

  await redis.set(accountKey, JSON.stringify(newAccount));
  return newTokens.access_token;
}

// open ID config never should not change, so get it once
let openIdConfig: OpenIDConfig | null = null;

const getOpenIdConfig = async (): Promise<OpenIDConfig> => {
  if (openIdConfig)
    return openIdConfig;

  let response = await fetch(`${process.env.AUTH_COGNITO_ISSUER}/.well-known/openid-configuration`)
  if (!response.ok)
    throw new Error(`Can't get Open ID config`);

  openIdConfig = await response.json();

  return openIdConfig as OpenIDConfig;
}
