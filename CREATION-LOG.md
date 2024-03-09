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

