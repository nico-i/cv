import { validateImageField } from '../../services/ValidationService';
import { parseGitHubImage } from '../GitHubFile';
import { type Collection } from 'tinacms';

export const Languages: Collection = {
  name: `Languages`,
  label: `Languages`,
  path: `content/languages`,
  fields: [
    {
      label: `Flag icon`,
      name: `icon`,
      type: `image`,
      required: true,
      ui: {
        description: `A SVG of the flag of the country where this language is spoken. See <a href="https://flagicons.lipis.dev/">https://flagicons.lipis.dev/</a> for a list of available flag SVGs.`,
        parse: parseGitHubImage,
        validate: validateImageField(true, `.svg`),
      },
    },
    {
      label: `Certification document`,
      name: `document`,
      type: `image`,
      ui: {
        description: `Upload a PDF that certifies your proficiency in the language`,
        parse: parseGitHubImage,
      },
    },
    {
      label: `Name`,
      name: `name`,
      type: `string`,
      required: true,
      ui: {
        description: `The name of the language`,
      },
    },
    {
      label: `Level`,
      name: `level`,
      type: `string`,
      options: [`A1`, `A2`, `B1`, `B2`, `C1`, `C2`],
      required: true,
      ui: {
        description: `Your Common European Framework of Reference for Languages (CEFR) level in this language`,
      },
    },
  ],
};
