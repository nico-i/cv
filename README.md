# astro-tinacms-authjs-netlify-starter

GitHub repo template for a fully self hosted static site with [Astro](https://astro.build/), [TinaCMS](https://tina.io/), [Netlify](https://app.netlify.com/), [MongoDB](https://www.mongodb.com/), and [NextAuth.js](https://next-auth.js.org/).

## Pre-requisites

- [Netlify CLI](https://docs.netlify.com/cli/get-started/#installation)
- [Node.js>=v18](https://nodejs.org/en/download/)
- [Running MongoDB](https://www.mongodb.com/resources/products/fundamentals/create-database)

## Use this template

### Deploy directly

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/extension/start/deploy?repository=https://github.com/nico-i/astro-tinacms-authjs-netlify-starter#GITHUB_REPO=astro-tinacms-authjs-netlify-starter&GITHUB_BRANCH=main)

_Note: The initial login data is in [`content/users/index.json`](./content/users/index.json)._

### Manual setup

1. Click the **Use this template** button and create a new repository based on this template.
2. Clone your new repository to your local machine and navigate to the project directory.

```bash
git clone <your-repo-url> && cd <your-repo-name>
```

1. Copy [`.env.example`](./.env.example), rename it to `.env` and fill in the required environment variables.

```bash
cp .env.example .env
```

4. Install the dependencies.

```bash
npm install
```

5. (Optionally) edit the [seed user](./content/users/index.json).
6. Start the TinaCMS server, Astro dev server and Netlify functions server.

```bash
npm run dev
```

7. Visit the `/admin/index.html` route to access the TinaCMS interface.
8. You should automatically be prompted to login and afterwards update the seed user password.
9. Update the seed user password and save the changes.
10. Deploy your site to Netlify manually.
