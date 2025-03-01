import { Account } from "@auth/core/types"
import { createClient } from '@redis/client';
import { loggerFactory } from '@/app/lib/logger'

const id = Date.now();
const logger = loggerFactory({ module: 'accessTokens', subModule: `${id}` })

const client = createClient({
  username: process.env.REDIS_USERNAME!,
  password: process.env.REDIS_PASSWORD!,
  socket: {
    host: process.env.REDIS_HOST!,
    port: parseInt(process.env.REDIS_PORT!),
  },

});

client.on('error', err => logger.error({ err }, 'Redis Client Error'));
logger.debug('creating REDIS client...')
await client.connect();

interface RefreshResponse extends Record<string, string | number> {
  id_token: string,
  access_token: string,
  expires_in: number,
  token_type: string
}

interface ActiveRefresh extends Record<string, string | Promise<RefreshResponse>> {
  userId: string,
  promiseOfRefreshedTokens: Promise<RefreshResponse>
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


export const storeAccount = async (userId: string, account: Account): Promise<void> => {
  logger.debug({ userId }, `storing account`);

  await client.set(
    process.env.UPSTASH_BASE_KEY_PREFIX + userId,
    JSON.stringify(account),
    {
      EXAT: Math.floor(Date.now() / 1000) + (process.env.REFRESH_TOKEN_LIFE ? parseInt(process.env.REFRESH_TOKEN_LIFE) : 30 * 24 * 60 * 60)
    }
  );
}

// list of active refreshes
// only want to do one refresh for a user, so we keep a static list
let activeRefreshes: ActiveRefresh[] = [];


// IMPORTANT: the userId here is the auth.js user id, NOT the provider ID or the Cognito "sub"
export const getAccessToken = async (userId: string): Promise<string | undefined> => {
  logger.debug({ userId }, `getting access token`);
  let account:Account = JSON.parse(await client.get(process.env.UPSTASH_BASE_KEY_PREFIX + userId) as string);
  logger.debug({ userId }, `access token found`); 

  //logger.debug(`getAccessToken found a token; expires at ${(new Date(account.expires_at * 1000)).toISOString()}`);
  if (!account.expires_at || account.expires_at * 1000 - Date.now() > 5 * 60 * 1000) // if the token has 5 min or more of life
    return account.access_token;

  // we need to refresh the token
  // but it might already be underway, so check for that and short circuit if so
  //logger.debug('getAccessToken refreshing tokens...');

  const existingRefresh = activeRefreshes.find(e => e.userId === userId);
  if (existingRefresh) {
    return existingRefresh.promiseOfRefreshedTokens.then(r => r.access_token);
  }

  // new one, so lets start it
  if (!account.refresh_token)
    throw new Error('no refresh token available')
  const promiseOfRefreshedTokens = getRefreshedTokens(account.refresh_token);
  activeRefreshes.push({ userId, promiseOfRefreshedTokens });

  // wait for completion...
  const newTokens = await promiseOfRefreshedTokens;

  const newAccount = { ...account, id_token: newTokens.id_token, access_token: newTokens.access_token, expires_at: Math.floor(Date.now() / 1000) + newTokens.expires_in };
  await storeAccount(process.env.UPSTASH_BASE_KEY_PREFIX + userId, newAccount);

  // all cleaned up with new kv in redis, so can allow new token refreshes
  // race condition potential here, but I believe this works
  activeRefreshes = activeRefreshes.filter(e => e.userId !== userId);
  return newTokens.access_token;
}


const getRefreshedTokens = async (refresh_token: string): Promise<RefreshResponse> => {
  let openIdConfig = await getOpenIdConfig();

  let response = await fetch(`${openIdConfig.token_endpoint}`, {
    method: 'POST',
    body: new URLSearchParams({
      'grant_type': 'refresh_token',
      'client_id': process.env.AUTH_COGNITO_ID,
      'client_secret': process.env.AUTH_COGNITO_SECRET,
      'refresh_token': refresh_token
    } as Record<string, string>),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (!response.ok)
    throw new Error(`Post to COGNITO token endpoint failed: ${response.statusText}: ${await response.text()}`);

  return await response.json();
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
