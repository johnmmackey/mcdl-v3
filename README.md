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