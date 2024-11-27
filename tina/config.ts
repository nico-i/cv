import { Certificates } from './domain/entities/Certificates';
import { Concepts } from './domain/entities/Concepts';
import { Educations } from './domain/entities/Educations';
import { Frameworks } from './domain/entities/Frameworks';
import { Interests } from './domain/entities/Interests';
import { Jobs } from './domain/entities/Jobs';
import { Languages } from './domain/entities/Languages';
import { Platforms } from './domain/entities/Platforms';
import { ProgrammingLanguages } from './domain/entities/ProgrammingLanguages';
import { Projects } from './domain/entities/Projects';
import { Tools } from './domain/entities/Tools';
import { VolunteerProjects } from './domain/entities/VolunteerProjects';

import { defineConfig, LocalAuthProvider } from 'tinacms';
import {
  TinaUserCollection,
  UsernamePasswordAuthJSProvider,
} from 'tinacms-authjs/dist/tinacms';

const isLocal = process.env.IS_LOCAL_ENV === `true`;

export default defineConfig({
  contentApiUrlOverride: `/api/tina/gql`,
  authProvider: isLocal
    ? new LocalAuthProvider()
    : new UsernamePasswordAuthJSProvider(),
  build: {
    outputFolder: `admin`,
    publicFolder: `public`,
  },
  media: {
    loadCustomStore: async () => {
      const pack = await import(
        `./infrastructure/persisitence/github/GitHubMediaStore`
      );
      return pack.GitHubMediaStore;
    },
  },
  schema: {
    collections: [
      Projects,
      Educations,
      Jobs,
      Interests,
      Languages,
      ProgrammingLanguages,
      Frameworks,
      Tools,
      Platforms,
      Concepts,
      Certificates,
      VolunteerProjects,
      TinaUserCollection,
    ],
  },
});
