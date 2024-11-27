import { Me } from './domain/entities/globals/Me';
import { Certificates } from './domain/entities/collections/Certificates';
import { Concepts } from './domain/entities/collections/Concepts';
import { Educations } from './domain/entities/collections/Educations';
import { Frameworks } from './domain/entities/collections/Frameworks';
import { Interests } from './domain/entities/collections/Interests';
import { Jobs } from './domain/entities/collections/Jobs';
import { Languages } from './domain/entities/collections/Languages';
import { Platforms } from './domain/entities/collections/Platforms';
import { ProgrammingLanguages } from './domain/entities/collections/ProgrammingLanguages';
import { Projects } from './domain/entities/collections/Projects';
import { Tools } from './domain/entities/collections/Tools';
import { VolunteerProjects } from './domain/entities/collections/VolunteerProjects';

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
      Me,
    ].toSorted((a, b) => a.name.localeCompare(b.name)),
  },
});
