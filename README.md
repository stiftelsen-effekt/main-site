<p align="center">
  <img 
    src="docs/logo.svg"
    alt="Gi Effektivt logo"
    width="340" />
</p>

[![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=main-site-qeprf4g0x-effective-altruism-norway)](https://gieffektivt.no)
[![Main site](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/simple/wfkg9n&style=flat&logo=cypress)](https://dashboard.cypress.io/projects/wfkg9n/runs)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

[![Powered by Vercel](docs/vercel-banner.svg)](https://vercel.com?utm_source=effective-altruism-norway&utm_campaign=oss)

# Table of Contents

- [Getting started <g-emoji class="g-emoji" alias="zap" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/26a1.png">⚡</g-emoji>](#getting-started-)
- [Project structure](#project-structure)
  - [Pages](#pages)
  - [Components](#components)
- [Sanity (Content Managment System) <g-emoji class="g-emoji" alias="book" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/1f4d6.png">📖</g-emoji>](#sanity-content-managment-system-)
- [Profile page <g-emoji class="g-emoji" alias="people_holding_hands" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/1f9d1-1f91d-1f9d1.png">🧑‍🤝‍🧑</g-emoji>](#profile-page-)
  - [Fetching and mutating data via the API](#fetching-and-mutating-data-via-the-api)
- [Build and deployment <g-emoji class="g-emoji" alias="gear" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/2699.png">⚙️</g-emoji>](#build-and-deployment-️)
- [Testing <g-emoji class="g-emoji" alias="boom" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/1f4a5.png">💥</g-emoji>](#testing-)

---

This is the repository for the main Gi Effektivt site. [Next.js](https://nextjs.org) is the react based frontend framework. It's created using a combination of static site generation for the public facing pages with [sanity.io](https://sanity.io) as the cms, as well as client side logic and data fetching on the protected profile pages.

Authentification is handled with [Auth0](https://auth0.com), and the API used for data fetching and mutation is found in the [backend repository](https://github.com/stiftelsen-effekt/effekt-backend).

<p align="center">
  <img src="docs/overview.svg" width="420" alt="Architecture Overview Diagram" />
</p>

## Getting started ⚡

To get started, install the packages using npm.

`npm install`

Copy the `.env.example` file to `.env.local` and replace missing values.

To start the development server run

`npm run dev`

Navigating to `localhost:3000/` in your browser should yield something like this

<img src="docs/frontpage.png" width="420" alt="Gi Effektivt front page" />

## Project structure

The project is structured around to major parts of the application. We have divided the site into a main part, and a profile part. This is done to reduce the payload for the users visiting the site that do not intend to log in, which is the majority of users. By seperating out the code for login and API calls, this is contained to only the users that require it.

The file `pages/_app.tsx` defines which layout that is to be used for site rendering. Each page specifies which layout to use on as a `.Layout` property on the export.

### Pages

While Next.js router uses the folder structure of the `/pages` folder by default, this is insufficient when serving localized paths, hence we're using a custom routing solution. Only pages with the `page.tsx` extension are magically picked up by the Next.js router. The `/pages/[[...slug]].page.tsx` file is central in the custom routing implementation - it is responsible for parsing the slug and rendering the correct page type.

Conventionally, each page type is defined inside the `/pages` directory as regular modules without the magic `page.tsx` extension. Each page type exports some function that returns static paths for that page type as well as a function returning static props (using the `withStaticProps()` helper). The `[[...slug]].page.tsx` file then imports all page types and uses them to generate the static paths and props for each.

All pages under `/pages/dashboard` should specify the profile layout (found under `components/min-side/layout.tsx`). This is because this layout is wrapped with the Auth0 provider, which is needed for authentification. It also uses a different navigation bar than the public facing site.

Conversely, all public facing pages should use the main layout (found under `components/main/layout.tsx`).

### Components

Reusable components not tied to a concrete page, are located in the `/components` folder. These are normal React components.

## Sanity (Content Managment System) 📖

We use Sanity as our content managment system. Sanity provides us with a nice API to fetch data when rendering statically generated content. Next uses a special function called `getStaticProps` to fetch data used for static site generation, which is then provided as props to the page in question.

To fetch data from sanity, we make use of the [next-sanity](https://github.com/sanity-io/next-sanity) SDK To query our data in sanity, we make use of the [groq](https://www.sanity.io/docs/groq) query language.

Let's have a look at an example.

<Details>
<Summary>Example page</Summary>

```typescript
import { PortableText } from "@portabletext/react";
import { InferGetStaticPropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { groq } from "next-sanity";
import React from "react";
import { withStaticProps } from "../util/withStaticProps";
import { getClient } from "../lib/sanity.server";
import { getAppStaticProps } from "./_app";

const fetchAboutUs = groq`
  {
    "about": *[_type == "about_us"] {
      content
    }
  }
`;

export const ExamplePage = withStaticProps(async ({ preview = false }) => {
  const appStaticProps = await getAppStaticProps({ preview });
  const data = await getClient(preview).fetch(fetchAboutUs);

  return {
    appStaticProps,
    preview,
    data,
  };
})(({ data, preview }) => {
  const router = useRouter();

  if (!router.isFallback && !data.about) {
    return <h1>404</h1>;
  }

  return (
    <>
      <Head>
        <title>Gi Effektivt. | Example Page</title>
        <meta name="description" content="Gi Effektivt example page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Example page</h1>

      <PortableText blocks={data.about[0].content}></PortableText>
    </>
  );
});
```

</Details>
<br>
In this example page, we use the publicly available main layout for the page. We fetch the data we are interested in on site generation, using the `getStaticProps` method, a sanity client and a groq query. If no data was found, we render a 404 message.

### Sanity Studio

The content managment panel is not strictly needed to run the main site. However, if you wish to use the sanity studio to change cms content, using the dataset configured in your `.env.local`, install dependencies in the `/studio` directory and run

`npm run sanity`

> To use the CMS you need a sanity CMS managment user. Enquire in the tech slack channel to be added as a user.

This will make sanity studio available at `localhost:3333/`. It should look something like this

<img src="docs/sanity.png" width="420" alt="Gi Effektivt front page" />

If you wish to edit documents with JSON in VSCode, you may run:

`npm run sanity:edit {documentId}`

> To edit draft documents, use the `drafts.` prefix with your document id.

The dataset will default to the `SANITY_STUDIO_API_DATASET` variable configured in the `.env.local` file, but you can override this by passing it as the second argument, for example:

`npm run sanity:edit drafts.75407a6f-ff17-401d-bc37-50e866ada48e dev-se`

You can also list pages using the `npm run sanity:list:pages` command.

## Profile page 🧑‍🤝‍🧑

We utilize Auth0 as our identity provider. Under `components/min-side/layout` we wrap the profile page with the [Auth0 react SDK](https://github.com/auth0/auth0-react) provider. When querying the [API](https://github.com/stiftelsen-effekt/effekt-backend) for data, we provide the access token from Auth0. Depending on whether the resource accessed is a protected resource, the backend API validates the token, and returns the data. The following diagram illustrates the process.

<div style="text-align: center">
  <img src="docs/profilepageflow.svg" width="420" alt="Profile Page Flow Diagram" />
</div>

### Fetching and mutating data via the API

For convenience, we have created a custom hook for fetching data from the API. The `useApi` hook is located under `hooks/useApi.ts`. This will a HTTP REST request **once** on the initial component mounting.

You provide the API route, method, required scopes and the auth0 SDK's getAccessTokenSilently method to the hook.

```typescript
const { getAccessTokenSilently, user } = useAuth0();

if (!user)
  // User is not logged in, handle in an apropriate way

  const { loading, error, data } = useApi<Donor>(
    `/donors/${user["https://gieffektivt.no/user-id"]}/`,
    "GET",
    "read:profile",
    getAccessTokenSilently,
  );
```

> ⚠️ The donor id used for the backend API is not the same as the id of the auth0 user. The donor id used in the backend api is available on the user object as the `https://gieffektivt.no/user-id` property.

The hook functions can be viewed as a finite state machine.

<img src="docs/useapi.svg" width="220" alt="useApi FSM" />

## Build and deployment ⚙️

This repository is connected to the [vercel edge cdn](https://vercel.com/). On any commit to the `main` branch, the application as automatically built, tested and deployed.

When editing content in sanity for the `production` dataset, a webhook triggers a build of the most recent version of the main branch. This generates static sites with the most recent content. Building typically takes somewhere in the range of 4 minutes.

## Testing 💥

Currently, we have two types of tests. Unit tests and end-to-end tests.

### Unit tests

Unit tests are located in the `__tests__` folder. We use [Jest](https://jestjs.io/) as our test runner. To run the tests, run `npm run test`.

### E2E

Tests can be found in the `cypress` folder. We utilize [Cypress](https://www.cypress.io/) for end-to-end testing. To execute the tests, initiate the development server by running `npm run dev` with either the Norwegian or Swedish production Sanity datasets specified in `.env.local`. After that, run either `npm run cypress:se` or `npm run cypress:no` to execute the tests for the corresponding domain.
