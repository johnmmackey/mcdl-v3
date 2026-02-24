import { betterAuth } from "better-auth"
import Database from "better-sqlite3"

// Extract Cognito configuration from environment
const cognitoIssuer = process.env.AUTH_COGNITO_ISSUER || ""
const cognitoRegion = cognitoIssuer.match(/cognito-idp\.([^.]+)\.amazonaws/)?.[1] || ""
const cognitoUserPoolId = cognitoIssuer.split('/').pop() || ""

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  database: new Database("./mcdl-auth.db"),
  
  emailAndPassword: {
    enabled: false,
  },

  socialProviders: {
    cognito: {
      enabled: true,
      clientId: process.env.AUTH_COGNITO_ID!,
      clientSecret: process.env.AUTH_COGNITO_SECRET!,
      region: cognitoRegion,
      userPoolId: cognitoUserPoolId,
      domain: process.env.AUTH_COGNITO_DOMAIN!,
      mapProfileToUser: (profile) => ({
        givenName: profile.given_name,
        familyName: profile.family_name,
        sub: profile.sub,
      }),
    },
  },

  user: {
    additionalFields: {
      givenName: {
        type: "string",
        required: false,
      },
      familyName: {
        type: "string",
        required: false,
      },
      sub: {
        type: "string",
        required: false,
      },
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["cognito"],
    },
  },

  // Use Cognito sub as the user ID with provider prefix
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (user.sub) {
            return { data: { ...user, id: `cognito:${user.sub}` } }
          }
          return { data: user }
        },
      },
    },
  },

  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
})

// Helper to get session on the server
export const getSession = async (headers: Headers) => {
  return await auth.api.getSession({ headers })
}

// Export types
export type Session = typeof auth.$Infer.Session
