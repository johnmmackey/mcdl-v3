import NextAuth from "next-auth"
import Cognito from "next-auth/providers/cognito"

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
      //console.log('session callback',session, user, token );
      let ns = Object.assign(session, {profile: token.profile});
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