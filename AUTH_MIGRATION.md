# Authentication Migration: NextAuth → Better-Auth

## Overview

This project has been migrated from NextAuth v5 to Better-Auth, while retaining OAuth authentication via AWS Cognito and using SQLite for the authentication database.

## Changes Made

### 1. **Packages**
- **Removed**: `next-auth` 
- **Added**: `better-auth`, `better-sqlite3`, `@types/better-sqlite3`

### 2. **File Structure**

#### New Files:
- `lib/auth.ts` - Better-auth server configuration
- `lib/auth-client.ts` - Client-side auth utilities
- `app/api/auth/[...all]/route.ts` - Better-auth API route handlers

#### Modified Files:
- `app/lib/accessTokens.ts` - Updated to use Better-auth database for token storage
- `app/ui/ProfileDropdown.tsx` - Updated to use better-auth client methods
- `app/ui/AppShell.tsx` - Updated Session type import
- `app/layout.tsx` - Updated auth session retrieval
- `app/auth/signin/page.tsx` - Updated signIn method
- `app/logging-out/page.tsx` - Updated signOut method
- `app/user-advanced/page.tsx` - Updated auth session retrieval

#### Removed/Backed Up:
- `auth.ts` → `auth.ts.old`
- `app/api/auth/[...nextauth]/` → `app/api/auth/[...nextauth].old/`

### 3. **Database**

Better-auth uses **SQLite** with the `better-sqlite3` driver. The database file is stored at `./mcdl-auth.db` in the project root.

**Setup is minimal (per [official docs](https://www.better-auth.com/docs/adapters/sqlite)):**
```typescript
import { betterAuth } from "better-auth"
import Database from "better-sqlite3"

export const auth = betterAuth({
  database: new Database("./mcdl-auth.db"),  // Pass Database instance directly
  // ... rest of config
})
```

**Note:** Better-auth handles the Kysely adapter internally - you don't need to install or configure Kysely yourself.

**User ID Strategy:**
User IDs use the Cognito `sub` (subject identifier) with a `cognito:` prefix (e.g., `cognito:12345678-abcd-1234-5678-1234567890ab`). This approach:
- Uses Cognito's stable identifier as the durable user ID
- Prefixes with provider name to support future authentication providers (e.g., `github:`, `google:`)
- Is implemented via `databaseHooks.user.create.before` to intercept user creation and customize the ID

**Tables created by better-auth:**
- `user` - User accounts with custom fields (givenName, familyName, sub)
- `session` - Active sessions with device info
- `account` - OAuth provider accounts (stores access tokens, refresh tokens)
- `verification` - Email verification tokens

### 4. **Environment Variables**

#### Required Variables:
```env
AUTH_COGNITO_ID=your-cognito-client-id
AUTH_COGNITO_SECRET=your-cognito-client-secret
AUTH_COGNITO_ISSUER=https://cognito-idp.{region}.amazonaws.com/{userPoolId}
AUTH_COGNITO_DOMAIN=your-domain-prefix  # e.g., "mcdl-app" (not the full URL)
BETTER_AUTH_URL=http://localhost:3000  # or your production URL
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Fallback for baseURL
```

#### Optional Variables:
```env
NEXT_PUBLIC_LOGOUT_URL=/  # Redirect URL after logout
```

#### No Longer Needed:
- `REDIS_USERNAME`, `REDIS_PASSWORD`, `REDIS_HOST`, `REDIS_PORT`, `REDIS_KEY_PREFIX` - Better-auth uses SQLite instead of Redis

### 5. **Authentication Flow**

#### Sign In:
```typescript
// Client-side
import { signIn } from '@/lib/auth-client'

signIn.social({ provider: 'cognito', callbackURL: '/dashboard' })
```

#### Sign Out:
```typescript
// Client-side
import { signOut } from '@/lib/auth-client'

await signOut()
```

#### Get Session (Server):
```typescript
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

const session = await auth.api.getSession({ headers: await headers() })
```

#### Get Session (Client):
```typescript
import { useSession } from '@/lib/auth-client'

const { data: session, isPending } = useSession()
```

### 6. **Access Token Management**

Access tokens are now stored in the SQLite database's `account` table. The `getAccessToken()` function in `app/lib/accessTokens.ts` has been updated to:
1. Query the Better-auth database for the user's account
2. Check token expiration
3. Automatically refresh tokens if needed
4. Update the database with new tokens

The token refresh logic using AWS Cognito's token endpoint remains the same.

### 7. **Session Type**

```typescript
import type { Session } from '@/lib/auth'

// Session structure from better-auth includes:
// - user: { 
//     id,              // Format: "cognito:${cognito-sub}" e.g., "cognito:12345678-abcd-..."
//     email, 
//     name, 
//     emailVerified, 
//     image, 
//     givenName,       // Mapped from Cognito profile.given_name
//     familyName,      // Mapped from Cognito profile.family_name
//     sub              // Original Cognito sub
//   }
// - session: { id, userId, expiresAt, token, ipAddress, userAgent }
```

### 8. **Configuration Details**

The auth configuration in `lib/auth.ts` uses:
- **`mapProfileToUser`**: Extracts `givenName`, `familyName`, and `sub` from Cognito's OAuth profile
- **`databaseHooks.user.create.before`**: Intercepts user creation to set `id` to `cognito:${sub}` format
- **`additionalFields`**: Defines custom user fields (givenName, familyName, sub) in the database schema


## Migration Steps for Deployment

1. **Update Environment Variables**: Add `AUTH_COGNITO_DOMAIN` and `BETTER_AUTH_URL` to your environment
2. **Remove Redis**: If you were using Redis only for auth, you can remove it
3. **Generate Database Schema**: Run the better-auth CLI to create database tables:
   ```bash
   npx @better-auth/cli@latest migrate
   ```
   This will:
   - Create the SQLite database file (`mcdl-auth.db`)
   - Add tables: `user`, `session`, `account`, `verification`
   - Configure custom fields (givenName, familyName, sub)
   
   **Important:** You must run this command before the first authentication attempt, or you'll get "no such table" errors.

   **Note:** If you previously created the database without the custom ID format, delete `mcdl-auth.db` and run the migration again to start fresh.

4. **Test Authentication**: Verify sign-in, sign-out, and token refresh work correctly
5. **Migrate Existing Sessions** (if needed): Users will need to sign in again as sessions are stored differently, and user IDs now use the `cognito:${sub}` format

## Benefits of Better-Auth

1. **Simpler Setup**: No need for Redis; everything is in SQLite
2. **Type Safety**: Better TypeScript support out of the box
3. **Built-in Features**: Account linking, session management, token refresh
4. **Modern API**: Cleaner API design with better React hooks
5. **Stable User IDs**: Uses Cognito's `sub` as durable identifier with provider prefix for future multi-provider support
6. **Active Development**: Better-auth is actively maintained and growing

## Troubleshooting

### Database Issues:

**"no such table: verification" error:**
Run the schema migration command:
```bash
npx @better-auth/cli@latest migrate
```

**Regenerating the database from scratch:**
If you need to reset or recreate the database (e.g., after changing the schema or custom ID format):
```bash
rm mcdl-auth.db
npx @better-auth/cli@latest migrate
```
This will:
1. Create a new `mcdl-auth.db` file in the project root
2. Generate all required tables (`user`, `session`, `account`, `verification`)
3. Configure custom fields (givenName, familyName, sub)

Then restart your dev server.

### Token Refresh Issues:
Check that `AUTH_COGNITO_ISSUER` is correctly formatted and includes both the region and user pool ID.

### Session Not Persisting:
Ensure cookies are enabled and `AUTH_URL` matches your application domain in production.

## Additional Resources

- [Better-Auth Documentation](https://better-auth.com)
- [Better-Auth GitHub](https://github.com/better-auth/better-auth)
- [AWS Cognito OAuth Documentation](https://docs.aws.amazon.com/cognito/latest/developerguide/authorization-endpoint.html)
