import { defineConfig, LocalAuthProvider } from 'tinacms';
import {
  TinaUserCollection,
  UsernamePasswordAuthJSProvider,
} from 'tinacms-authjs/dist/tinacms';

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
    tina: {
      mediaRoot: ``,
      publicFolder: `public`,
    },
  },
  schema: {
    collections: [
      TinaUserCollection,
      {
        name: `post`,
        label: `Posts`,
        path: `content/posts`,
        fields: [
          {
            type: `string`,
            name: `title`,
            label: `Title`,
            isTitle: true,
            required: true,
          },
          {
            type: `rich-text`,
            name: `body`,
            label: `Body`,
            isBody: true,
          },
        ],
      },
    ],
  },
});
