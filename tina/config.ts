import { Certificates } from './collections/Certificates';
import { Concepts } from './collections/Concepts';
import { Educations } from './collections/Educations';
import { Frameworks } from './collections/Frameworks';
import { Interests } from './collections/Interests';
import { Jobs } from './collections/Jobs';
import { Tools } from './collections/Tools';
import { Languages } from './collections/Languages';
import { Platforms } from './collections/Platforms';
import { ProgrammingLanguages } from './collections/ProgrammingLanguages';
import { Projects } from './collections/Projects';
import { VolunteerProjects } from './collections/VolunteerProjects';

import { defineConfig, LocalAuthProvider } from 'tinacms';
import {
  TinaUserCollection,
  UsernamePasswordAuthJSProvider,
} from 'tinacms-authjs/dist/tinacms';
import { GitHubMediaStore } from './helper/media/GitHubMediaStore';

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === `true`;

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
    loadCustomStore: async () => GitHubMediaStore,
  },
  schema: {
    collections: [
      TinaUserCollection,
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
    ],
  },
});
