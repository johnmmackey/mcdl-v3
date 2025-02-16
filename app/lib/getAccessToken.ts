import {  defaultOptions } from "@auth/upstash-redis-adapter"
import { upStashOpt } from '@/auth'

import { Redis } from "@upstash/redis"
import { logger } from "@/app/lib/logger"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
})



interface Account extends Record<string, unknown> {
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

interface RefreshResponse extends Record<string, unknown> {
  id_token: string,
  access_token: string,
  expires_in: number,
  token_type: string
}

// only want to do one refresh for a user
interface ActiveRefresh extends Record<string, unknown> {
  id: string,
  p: Promise<string>
}

// list of active refreshes
let activeRefreshes: ActiveRefresh[] = [];

export const getAccessToken = async (id: string): Promise<string | null> => {
  const start = Date.now();
  const opt = { ...defaultOptions, ...upStashOpt };
  const client = redis;

  const accountKey = await client.get<string>(opt.baseKeyPrefix + opt.accountByUserIdPrefix + id)

  if (!accountKey) return null
  let account = (await client.get<Account>(accountKey)) as Account;

  logger.debug(`got access token in ${Date.now() - start} ms`)

  logger.debug(`Access Token expires at ${(new Date(account.expires_at * 1000)).toISOString()}`)
  if (account.expires_at * 1000 - Date.now() < 5 * 60 * 1000) { // if the token is (nearly) expired
    logger.debug('refreshing token');
    // if there is already one active, use it.

    const existingRefresh = activeRefreshes.find(e => e.id === id);
    if (existingRefresh) {
      logger.debug('short circuiting duplicate refresh')
      return existingRefresh.p;
    }

    // new one, so lets start it and save
    const p = refreshTokens(accountKey, account);
    activeRefreshes.push({ id, p });
    const newAccessToken = await p;
    activeRefreshes = activeRefreshes.filter(e => e.id !== id);
    logger.debug('refresh complete')
    return newAccessToken;
  } else {
    return account.access_token;
  }
}


const refreshTokens = async (accountKey: string, account: Account): Promise<string> => {
  const client = redis;
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

  await client.set(accountKey, JSON.stringify(newAccount));
  return newTokens.access_token;
}




interface OpenIDConfig extends Record<string, unknown> {
  token_endpoint: string
}
// open ID config never should change in a run, so get it once
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
