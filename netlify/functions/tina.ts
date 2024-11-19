import express from 'express';
import cookieParser from 'cookie-parser';
import ServerlessHttp from 'serverless-http';
import { TinaNodeBackend, LocalBackendAuthProvider } from '@tinacms/datalayer';
import { AuthJsBackendAuthProvider, TinaAuthJSOptions } from 'tinacms-authjs';
import cors from 'cors';
import dotenv from 'dotenv';

import { databaseClient } from '../../tina/__generated__/databaseClient';

dotenv.config();

const app = express();

const nextAuthSecret = process.env.NEXTAUTH_SECRET;
if (!nextAuthSecret) {
  throw new Error(`NEXTAUTH_SECRET is required`);
}

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === `true`;

const tinaBackend = TinaNodeBackend({
  authProvider: isLocal
    ? LocalBackendAuthProvider()
    : AuthJsBackendAuthProvider({
        authOptions: TinaAuthJSOptions({
          databaseClient,
          secret: nextAuthSecret,
          debug: true,
        }),
      }),
  databaseClient,
});

app.post(`/api/tina/*`, async (req, res) => {
  tinaBackend(req, res);
});

app.get(`/api/tina/*`, async (req, res) => {
  tinaBackend(req, res);
});

export const handler = ServerlessHttp(app);
