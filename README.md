
<div style="text-align: center; padding-bottom: 40px;">
  <img src="docs/logo.svg" width="240" alt="Konduit. logo" />
</div>

# Homepage

This is the repository for the main Konduit site. [Next.js](https://nextjs.org) is the react based frontend framework. It's created using a combination of static site generation for the public facing pages with [sanity.io](https://sanity.io) as the cms, as well as client side logic and data fetching on the protected profile pages.

Authentification is handled with [Auth0](https://auth0.com), and the API used for data fetching and mutation is found in the [backend repository](https://github.com/stiftelsen-effekt/effekt-backend).

<div style="text-align: center">
  <img src="docs/overview.svg" width="420" alt="Architecture Overview Diagram" />
</div>

## Getting started ⚡

To get started, install the packages using npm.

``` npm install ```

To start the development server run

``` npm run dev ```

The content managment panel is not strictly needed to run the main site. 

## Project structure

The project is structured around to major parts of the application. We have divided the site into a main part, and a profile part. This is done to reduce the payload for the users visiting the site that do not intend to log in, which is the majority of users. By seperating out the code for login and API calls, this is contained to only the users that require it.

The file `pages/_app.tsx` defines which layout that is to be used for site rendering. Each page specifies which layout to use on as a `.Layout` property on the export.

### Pages

The default Next.js router uses the folder structure of the `/pages` folder. The page will be available at the coresponding route in the application, for example `/pages/about.tsx` will be served at `/about`.

All pages under `/pages/profile` should specify the profile layout (found under `components/profile/layout.tsx`). This is beceause this layout is wrapped with the Auth0 provider, which is needed for authentification. It also uses a different navigation bar than the public facing site.

Conversely, all public facing pages should use the main layout (found under `components/main/layout.tsx`).

### Components

Reusable components not tied to a concrete page, are located in the `/components` folder. These are normal React components.

## Sanity (Content Managment System) 📖

We use Sanity as our content managment system. Sanity provides us with a nice API to fetch data 

## Profile page 🧑‍🤝‍🧑

<div style="text-align: center">
  <img src="docs/profilepageflow.svg" width="420" alt="Profile Page Flow Diagram" />
</div>

## Build and deployment ⚙️

## Testing 💥