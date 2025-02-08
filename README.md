# MCDL-V3

This is an experimental [Next.js](https://nextjs.org/) client for the MCDL meet management system.

## Development Framework
Bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Development - Getting Started

The client requires configuration for Amazon Cognito (used a the authorization backend) and the "MCDL Server" which provides the API to the backend database.
This configuration is provided by the `.env.local` file in the root directory. Sample:
```
DATA_URL=http://serverhost:8095
AUTH_SECRET=/somefancysecret=
AUTH_COGNITO_ID=alongidstring
AUTH_COGNITO_SECRET=salongersecretstring
AUTH_COGNITO_ISSUER=https://cognito-idp.us-east-1.amazonaws.com/us-east-1_blah
```
Ensure the server is running before starting.

To run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## URL Design
Get a list of meets for a season
```
/meets                  // All the meets for the current season
/meets?season-id=2024   // All the meets for 2024
/meets/123              // Meet 123 results

## Meet Operations
* List - any user
* View Roster / Scoring Sheet - any logged in user

* Enter Divers (explicitly rostered meets only) - team rep

* Print Labels - home team rep

* Enter/Edit Results - home team rep for dual meets
* Preview Results - any participating team rep
* View Results - any user

* Publish - dual meets - home team rep
* Unpublish - admin

Inputs to action list:
- logged in
- groups/roles
- meet type
- meet status - published / unpublished

## Permissions Flow

## Obscure
Mantine Appshell scroll padding issue
https://github.com/orgs/mantinedev/discussions/3588