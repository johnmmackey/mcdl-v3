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
      console.log('signin callback', user, account, profile, email, credentials)
      return true
    },
    async redirect({ url, baseUrl }) {
      return baseUrl
    },
    async session({ session, user, token }) {
      console.log('session callback',session, user, token );
      session.user.name = `${token.givenName} ${token.familyName}`;
      //session.givenName = token.givenName;
      return session
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log('jwt callback', token, user, account, profile, isNewUser);
      if(profile) {
        // user logged in and we have cognito profile
        token.familyName = profile.family_name;
        token.givenName = profile.given_name;
      }
      return token
    }
  }
})