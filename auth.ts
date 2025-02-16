import NextAuth from "next-auth"
import Cognito from "next-auth/providers/cognito"
import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter"
import { Adapter, } from "@auth/core/adapters"
import { Redis } from "@upstash/redis"

type Profile = {
  familyName: string,
  givenName: string,
  groups: string[],
  zoneinfo: string
}

declare module "next-auth" {
  interface User {
    /** The user's postal address. */
    //address: string,
    //email: string | undefined | null,
    profile: Profile
  }
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
})

export const upStashOpt = { baseKeyPrefix: process.env.UPSTASH_BASE_KEY_PREFIX }

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  adapter: UpstashRedisAdapter(redis, upStashOpt) as Adapter,
  debug: false,
  providers: [
    Cognito({
      profile(profile) {
        return {

          profile: {
            email: profile.email,
            givenName: profile.given_name,
            familyName: profile.family_name,
            zoneinfo: profile.zoneinfo,
            groups: profile["cognito:groups"]
          }
        }
      },
    })
    //Cognito
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      //console.log('*** In signin callback', JSON.stringify({user, account, profile, email, credentials}, null, 4));
      return true
    },
    async redirect({ url, baseUrl }) {
      return baseUrl
    },

    async session({ session, user, token }) {
      //console.log('*** In session callback', JSON.stringify({session, user, token}, null, 4) );
      // session.user.profile = <Profile>token.profile; 
      //session.tokens = { accessToken: 'at', refreshToken: 'rt'}
      //session.profile = {test: 1}
      return session
    },

    async jwt({ token, user, account, profile, isNewUser }) {
      console.log('*** In jwt callback', JSON.stringify({token, user, account, profile, isNewUser}, null, 4));
      if (profile) {
        // user logged in and we have cognito profile
        token.profile = {
          familyName: profile.family_name,
          givenName: profile.given_name,
          groups: profile['cognito:groups'],
          //accessToken: account?.access_token
        }
      }
      return token
    }
  }
})
