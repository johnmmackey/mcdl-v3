# Authentication Setup

## Overview

This application uses [Better-Auth](https://better-auth.com) for authentication, with AWS Cognito as the OAuth provider and SQLite for session and user data storage.

## Architecture

### Authentication Stack
- **Framework**: Better-Auth v1.4.19 - Modern, type-safe authentication framework
- **OAuth Provider**: AWS Cognito - User pool managed via Terraform
- **Database**: SQLite via better-sqlite3 - Local database for users, sessions, and OAuth accounts
- **Session Management**: Cookie-based sessions with server-side validation

### Key Features
- ✅ OAuth authentication via Cognito
- ✅ Automatic access token refresh
- ✅ Type-safe session management
- ✅ Custom user ID format with provider prefixes
- ✅ Account linking support
- ✅ Server-side and client-side auth utilities

## File Structure

### Core Authentication Files

**Server Configuration:**
- `lib/auth.ts` - Better-auth server configuration and setup
- `app/api/auth/[...all]/route.ts` - Better-auth API route handlers (handles all auth endpoints)

**Client Utilities:**
- `lib/auth-client.ts` - Client-side authentication hooks and methods

**Token Management:**
- `app/lib/accessTokens.ts` - OAuth access token retrieval and refresh

**UI Components:**
- `app/ui/ProfileDropdown.tsx` - User authentication menu
- `app/ui/AppShell.tsx` - Layout wrapper with session context
- `app/auth/signin/page.tsx` - Sign-in page
- `app/logging-out/page.tsx` - Logout handler

## Database

### SQLite Schema

Better-auth uses SQLite with the `better-sqlite3` driver. The database file is located at `./mcdl-auth.db` in the project root.

**Database Tables:**
- `user` - User accounts with custom fields (givenName, familyName, sub)
- `session` - Active user sessions with device information
- `account` - OAuth provider accounts (stores access tokens, refresh tokens, expiry)
- `verification` - Email verification tokens

**Configuration** ([lib/auth.ts](lib/auth.ts)):
```typescript
import { betterAuth } from "better-auth"
import Database from "better-sqlite3"

export const auth = betterAuth({
  database: new Database("./mcdl-auth.db"),
  // ... rest of config
})
```

**Note:** Better-auth handles the Kysely adapter internally - no additional ORM setup required.

### User ID Strategy

User IDs use a provider-prefixed format: `cognito:${sub}`

**Example**: `cognito:12345678-abcd-1234-5678-1234567890ab`

**Benefits:**
- Uses Cognito's stable `sub` (subject identifier) as the durable user ID
- Provider prefix allows for future multi-provider support (e.g., `github:`, `google:`)
- Prevents ID collisions between authentication providers

**Implementation** ([lib/auth.ts](lib/auth.ts)):
```typescript
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
}
```

### Database Initialization

Generate the database schema using the Better-Auth CLI:

```bash
npx @better-auth/cli@latest migrate
```

This creates:
- The `mcdl-auth.db` SQLite database file
- All required tables with proper schema
- Custom fields for user profiles


## Environment Variables

### Core Configuration

**Cognito OAuth Provider** (from Terraform outputs):
```env
COGNITO_REGION=us-east-1
COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx       # AWS Cognito user pool ID
COGNITO_CLIENT_ID=your-cognito-client-id      # OAuth client ID
COGNITO_CLIENT_SECRET=your-client-secret      # OAuth client secret
COGNITO_DOMAIN=https://your-domain.auth.region.amazoncognito.com
```

**Application URLs:**
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000     # Base application URL
```

## Authentication Flow

### Sign In

**Client-side** ([app/auth/signin/page.tsx](app/auth/signin/page.tsx)):
```typescript
import { signIn } from '@/lib/auth-client'

// Redirect to Cognito OAuth flow
signIn.social({ provider: 'cognito', callbackURL: '/dashboard' })
```

### Sign Out

Redirect to ([/logging-out](app/logging-out)), which has logic similar to the following.
Note that it appears `signOut` must be called from a client component. 
```typescript
import { signOut } from '@/lib/auth-client'
signOut()
```

### Get Session

**Server-side** ([app/layout.tsx](app/layout.tsx)):
```typescript
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

const session = await auth.api.getSession({ headers: await headers() })
```

**Client-side** (React components):
```typescript
import { useSession } from '@/lib/auth-client'

const { data: session, isPending } = useSession()
```

### Session Type

```typescript
import type { Session } from '@/lib/auth'

// Session structure:
{
  user: {
    id: "cognito:12345678-abcd-...",  // Provider-prefixed user ID
    email: "user@example.com",
    name: "John Doe",
    emailVerified: true,
    image: null,
    givenName: "John",                 // From Cognito profile.given_name
    familyName: "Doe",                 // From Cognito profile.family_name
    sub: "12345678-abcd-..."          // Original Cognito sub
  },
  session: {
    id: "session-id",
    userId: "cognito:12345678-abcd-...",
    expiresAt: Date,
    token: "session-token",
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0..."
  }
}
```

## Access Token Management

Better-auth automatically manages OAuth access tokens and handles refresh when needed.

**Implementation** ([app/lib/accessTokens.ts](app/lib/accessTokens.ts)):
```typescript
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export const getAccessToken = async (): Promise<string | null> => {
  const result = await auth.api.getAccessToken({
    body: { providerId: 'cognito' },
    headers: await headers()
  })
  return result?.accessToken || null
}
```

**How it works:**
1. Retrieves the user's Cognito account from the database
2. Checks if the access token is expired (5-second buffer)
3. Automatically refreshes using Cognito's refresh token endpoint if needed
4. Updates the database with new tokens
5. Returns the valid access token

**Usage:**
```typescript
import { getAccessToken } from '@/app/lib/accessTokens'

const token = await getAccessToken()
// Use token for authenticated API calls
```

## Configuration Details

The auth configuration in [lib/auth.ts](lib/auth.ts) includes:

**Profile Mapping:**
```typescript
mapProfileToUser: (profile) => ({
  givenName: profile.given_name,
  familyName: profile.family_name,
  sub: profile.sub,
})
```

**Database Hooks:**
```typescript
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
}
```

**Additional User Fields:**
```typescript
user: {
  additionalFields: {
    givenName: { type: "string", required: false },
    familyName: { type: "string", required: false },
    sub: { type: "string", required: false },
  },
}
```

## Setup Instructions

### Initial Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   - Copy `.env.local.example` to `.env.local`
   - Set Cognito configuration variables (from Terraform outputs)
   - Set `NEXT_PUBLIC_APP_URL` to your application URL

3. **Generate Database Schema:**
   ```bash
   npx @better-auth/cli@latest migrate
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```

5. **Test Authentication:**
   - Navigate to http://localhost:3000
   - Click "Sign In" to test Cognito OAuth flow
   - Verify session persists after authentication

### Deployment

1. **Environment Variables**: Ensure all Cognito variables are configured in your production environment
2. **Database**: The SQLite database file (`mcdl-auth.db`) should be created in the deployment environment
3. **Run Migrations**: Execute `npx @better-auth/cli@latest migrate` in production before first use
4. **URL Configuration**: Update `NEXT_PUBLIC_APP_URL` to your production domain

## Troubleshooting

### Database Errors

**"no such table: verification"**

The database schema hasn't been generated. Run:
```bash
npx @better-auth/cli@latest migrate
```

**Reset database:**
```bash
rm mcdl-auth.db
npx @better-auth/cli@latest migrate
```
### Session Not Persisting

- Verify cookies are enabled in the browser
- Ensure `NEXT_PUBLIC_APP_URL` matches your application domain
- Check that secure cookies are properly configured for production (`useSecureCookies: process.env.NODE_ENV === "production"`)

### OAuth Redirect Issues

Verify the callback URL is registered in Cognito:
- Development: `http://localhost:3000/api/auth/callback/cognito`
- Production: `https://your-domain.com/api/auth/callback/cognito`

## Additional Resources

- [Better-Auth Documentation](https://better-auth.com)
- [Better-Auth GitHub](https://github.com/better-auth/better-auth)
- [AWS Cognito OAuth Documentation](https://docs.aws.amazon.com/cognito/latest/developerguide/authorization-endpoint.html)
- [Better-Auth SQLite Adapter](https://www.better-auth.com/docs/adapters/sqlite)
