import NextAuth from "next-auth"
import Cognito from "next-auth/providers/cognito"
import { Account } from "@auth/core/types"
import { storeAccount } from "./app/lib/accessTokens"
import { Redis } from "@upstash/redis"
import { loggerFactory } from '@/app/lib/logger'

const logger = loggerFactory({module: 'auth'})

declare module "next-auth" {
  interface User {
    id?: string | undefined,
    email?: string | null | undefined,
    name?: string | null | undefined,
    sub: string,
    givenName: string,
    familyName: string,
    zoneinfo?: string,
    groups?: string[],
    serializedGroups?: string,
  }
}

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  //adapter: UpstashRedisAdapter(redis, upStashOpt) as Adapter,
  debug: false,
  providers: [
    Cognito({
      profile(profile) {
        logger.debug(profile, 'in cognito callback')
        return {
          id: profile.sub, // required by the db adapter, ignored if JWT
          sub: profile.sub,
          email: profile.email, // required by db adapter
          name: profile.given_name + ' ' + profile.family_name,
          givenName: profile.given_name,
          familyName: profile.family_name,
          zoneinfo: profile.zoneinfo,
          groups: profile["cognito:groups"],
          serializedGroups: profile["custom:serialized_groups"],
        }
      },
    })

//    Cognito
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true
    },
    async redirect({ url, baseUrl }) {
      return baseUrl
    },

    async session({ session, user, token }) {
      // session in a basic session, user comes from the db adapter (if present), token comes from the jwt callback below
      // copy all the user details in the token to the session user prop
      // logger.debug({session, user, token}, 'in session callback')
      session.user.id = token.id as string;
      session.user.sub = token.sub as string;
      session.user.givenName = token.givenName as string;
      session.user.familyName = token.familyName as string;
      session.user.groups = token.groups as string[];
      session.user.zoneinfo = token.zoneinfo as string;
      session.user.serializedGroups = token.serializedGroups as string;

      return session
    },

    async jwt({ token, user, account, profile, isNewUser }) {
      // token is a basic token
      // user is what is returned by cognito profile callback above (on login)
      // account is the cognito return, with the tokens
      // profile is the cognito profile
      if(user)
        logger.debug({token, user, account, profile, isNewUser}, 'in jwt callback')
      // expose all the Cognito user profile to the token.
      if(user?.id && account)
        await storeAccount(user.id, account);
      if (user)
        token = { ...token, ...user }
      return token
    }
  }
})
