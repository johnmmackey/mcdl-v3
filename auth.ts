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
  providers: [Cognito],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      //console.log('signin callback', user, account, profile, email, credentials)
      return true
    },
    async redirect({ url, baseUrl }) {
      return baseUrl
    },
    async session({ session, user, token }) {
      //console.log('session callback',session);
      session.user.profile = <Profile>token.profile; 
      return session
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      //console.log('jwt callback', token, user, account, profile, isNewUser);
      if(profile) {
        // user logged in and we have cognito profile
        token.profile = {
          familyName: profile.family_name,
          givenName: profile.given_name,
          groups: profile['cognito:groups']
        }
      }
      return token
    }
  }
})
