# Creation
[Procedure Framework](https://nextjs.org/learn/dashboard-app/getting-started)

```
npx create-next-app@latest mcdl-v2 --use-npm 
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … No
✔ Would you like to use `src/` directory? … No 
✔ Would you like to use App Router? (recommended) … Yes
✔ Would you like to customize the default import alias (@/*)? … No
```

# Install MUI
[Procedure](https://mui.com/material-ui/integrations/nextjs/)

* Location of theme.js file different - docs reference src directory - put in root
* use V14 in layout.tsx file
* had to manually install @emotion/styled and @emotion/react


# Install TailwindCSS, Flowbite

* [Procedure](https://flowbite.com/docs/getting-started/next-js/)
* [Example of Navbar](https://www.flowbite-react.com/docs/components/navbar)
* [Component List](https://github.com/themesberg/flowbite-react)

# Useful Tools
* [Suspense and Streaming](https://nextjs.org/learn/dashboard-app/streaming)
* [WP CMS Integration](https://vercel.com/guides/wordpress-with-vercel)
* [Data Caching Deep Dive](https://github.com/vercel/next.js/discussions/54075)

# Sequalize
* [Setup](https://stackoverflow.com/questions/76239621/critical-dependency-the-request-of-a-dependency-sequelize-is-an-expression-in)

## NextJS Wierdness
* loading.jsx file location for dynamic routes: must be in PARENT: [ISSUE](https://github.com/vercel/next.js/issues/43548)


# Sanity integration
https://www.sanity.io/learn/course/day-one-with-sanity-studio/bringing-content-to-a-next-js-front-end
https://icons.sanity.build/all?scheme=light
https://www.sanity.io/docs/ids

# Test setup:
https://nextjs.org/docs/app/guides/testing/jest

## Meet views:
* entries list (implicit and explicit)
* diver entry input
* blank scoring worksheet
* labels
* scoring
* results preview
* results (published)

# Meet Groups Thinking - Deferred pending MCDL decision

## Database
* meet table is reduced. visiting pool info removed. score info removed. meet_type? div?
* match table
** index
** meet_id
** meet_type
* meets_pools becomes matches_pools
* new meets_pools just to contain who is attending the meet (e.g entries list)

Scores remain linked to meet.

For a dual meet:
* one meet record
* two meets_pools record
* one match record
* two matches_pools records (one per team), created at scoring time

For a tri meet:
* one meet records
* three meets_pools records
* three match records (A-B, B-C, A-C)
* six matches_pools records one per team per match (A score in A-B, A score in A-C, etc.)

Scoring is by Match
* get all scores for the match via the meets record
* granular to age Group





