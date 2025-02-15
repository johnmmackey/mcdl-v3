import NextAuth from "next-auth"
import Cognito from "next-auth/providers/cognito"

type Profile = {
  familyName: string,
  givenName: string,
  groups: string[]
}

declare module "next-auth" {
  interface User {
    /** The user's postal address. */
    address: string,
    profile: Profile
  }
}

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  debug: true,
  providers: [Cognito],
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
      session.user.profile = <Profile>token.profile; 
      return session
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      //console.log('*** In jwt callback', JSON.stringify({token, user, account, profile, isNewUser}, null, 4));
      if(profile) {
        // user logged in and we have cognito profile
        token.profile = {
          familyName: profile.family_name,
          givenName: profile.given_name,
          groups: profile['cognito:groups'],
          accessToken: account?.access_token
        }
      }
      return token
    }
  }
})
