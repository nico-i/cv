import { Tools } from './Tools';
import { validateImageFieldFileExt } from '../helper/validation/validateImageFieldFileExt';
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
        validate: validateImageFieldFileExt(`.svg`, true),
      },
    },
    {
      label: `Certification document`,
      name: `document`,
      type: `image`,
      ui: {
        description: `Upload a PDF that certifies your proficiency in the language`,
        validate: validateImageFieldFileExt(`.pdf`, false),
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
    {
      label: Tools.label,
      name: Tools.name,
      type: `object`,
      list: true,
      fields: [
        {
          label: `Tool`,
          name: `tool`,
          type: `reference`,
          collections: [Tools.name],
        },
      ],
    },
  ],
};