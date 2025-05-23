import { LocalBackendAuthProvider, TinaNodeBackend } from '@tinacms/datalayer';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import ServerlessHttp from 'serverless-http';
import { AuthJsBackendAuthProvider, TinaAuthJSOptions } from 'tinacms-authjs';

import { databaseClient } from '../../tina/__generated__/databaseClient';
import { createMediaHandler } from '../../tina/infrastructure/persisitence/github/GitHubMediaHandler';

dotenv.config();

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === `true`;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;
if (!nextAuthSecret) {
  throw new Error(`NEXTAUTH_SECRET is required`);
}
const githubOwner = process.env.GITHUB_REPOSITORY_OWNER;
if (!githubOwner) {
  throw new Error(`GITHUB_REPOSITORY_OWNER is required`);
}
const githubRepo = process.env.GITHUB_REPOSITORY;
if (!githubRepo) {
  throw new Error(`GITHUB_REPOSITORY is required`);
}
const githubBranch = process.env.GITHUB_REF_NAME;
if (!githubBranch) {
  throw new Error(`GITHUB_REF_NAME is required`);
}
const githubToken = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
if (!githubToken) {
  throw new Error(`GITHUB_PERSONAL_ACCESS_TOKEN is required`);
}

const app = express();

const authProvider = isLocal
  ? LocalBackendAuthProvider()
  : AuthJsBackendAuthProvider({
      authOptions: TinaAuthJSOptions({
        databaseClient,
        secret: nextAuthSecret,
        debug: true,
      }),
    });

const mediaHandler = createMediaHandler({
  authorized: async (req, _res) => {
    try {
      const user = await authProvider.isAuthorized(req, _res);

      return user && user.isAuthorized;
    } catch (e) {
      // eslint-disable-next-line no-console -- Ok since this will only be logged in the server
      console.error(e);
      return false;
    }
  },
  token: githubToken,
  branch: githubBranch,
  owner: githubOwner,
  repo: githubRepo,
  basePath: `public/uploads`,
});

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const tinaBackend = TinaNodeBackend({
  authProvider,
  databaseClient,
});

app.post(`/api/tina/*`, async (req, res) => {
  tinaBackend(req, res);
});
app.get(`/api/tina/*`, async (req, res) => {
  tinaBackend(req, res);
});

if (!isLocal) {
  app.get(`/api/github/media`, mediaHandler);
  app.post(`/api/github/media`, mediaHandler);
  app.delete(`/api/github/media`, mediaHandler);
}

export const handler = ServerlessHttp(app);
