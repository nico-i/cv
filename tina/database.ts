import { createDatabase, createLocalDatabase } from '@tinacms/datalayer';
import MongodbLevel from 'mongodb-level';
import { GitHubProvider } from 'tinacms-gitprovider-github/dist/index';

const branch = process.env.GITHUB_BRANCH;
if (!branch) {
  throw new Error(`GITHUB_BRANCH is required`);
}

const owner = process.env.GITHUB_OWNER;
if (!owner) {
  throw new Error(`GITHUB_OWNER is required`);
}

const repo = process.env.GITHUB_REPO;
if (!repo) {
  throw new Error(`GITHUB_REPO is required`);
}

const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
if (!token) {
  throw new Error(`GITHUB_PERSONAL_ACCESS_TOKEN is required`);
}

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  throw new Error(`MONGODB_URI is required`);
}

const isLocal = process.env.IS_LOCAL_ENV === `true`;

const db = isLocal
  ? createLocalDatabase()
  : createDatabase({
      gitProvider: new GitHubProvider({
        owner,
        repo,
        token,
        branch,
      }),
      databaseAdapter: new MongodbLevel.MongodbLevel({
        collectionName: branch,
        dbName: `tinacms`,
        mongoUri: mongoUri,
      }),
    });

export default db;
