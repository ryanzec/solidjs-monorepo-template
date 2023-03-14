# SolidJS Monorepo Template

This is a basic monorepo for SolidJS. This is not intended as a repository that manages the monorepo structure but more as a starter and then you maintain the repository yourself after that.

# What Is Included

The following is includes:

## 3rd Party Libraries

- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [ESLint](https://eslint.org/)
- [Playwright](https://playwright.dev/)
- [Vitest unit testing](https://vitest.dev/)
- Auto Code Formatting
- Example Application
  - [SolidJS](https://www.solidjs.com/) 
  - CSS with PostCSS Styling
  - [Font Awesome Icons](https://fontawesome.com/icons)
  - [Immer (data immutability)](https://immerjs.github.io/immer/)
  - [Inter Font](https://www.npmjs.com/package/@fontsource/inter)
  - [Lodash](https://lodash.com/)
  - [Solid Router](https://github.com/solidjs/solid-router)
  - [Zod (data validation)](https://zod.dev/)
  - [Felte (form validation)](https://felte.dev/)
  - [Tanstack Query (server side api request management / caching)](https://tanstack.com/query/latest)
  - [Solid DND (drag and drop)](https://solid-dnd.com/)
  - .nvmrc

## Custom Solutions

- A SUPER SUPER SUPER (did I mention SUPER?) basic Vite / SolidJS based Storybook solution
- Auto Complete
- Global Notification (Toaster-like)
- Fastify / LowDB based api for simple testing

# Setup Documentation

These are the following steps to setup this monorepo template.

## Tools You Need

- Node 16.15.x+: Recommend NVM (https://github.com/nvm-sh/nvm#installing-and-updating)

## Running Locally

### Running the Code
- run `npm install`
- copy `.evn-template` to `.env` and fill in values
- copy `applications/web/src/index.html-template` to `applications/web/src/index.html` and fill in values
- run `npm run start:api` and `npm run start:web`

# Library Notes

## LowDB

This uses the `4.x.x` version as the `5.x.x` version is ESM only which seems to have issues working so doing this for now.

# Libraries To Look At

- https://use-gesture.netlify.app/
- https://auto-animate.formkit.com/
