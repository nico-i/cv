import { parseGitHubImage } from './GitHubFile';
import {
  validateImageFieldFileExt,
  validateUrl,
} from '../services/ValidationService';
import type { Collection } from 'tinacms';

export const Certificates: Collection = {
  name: `certificates`,
  label: `Certificates`,
  path: `content/certificates`,
  fields: [
    {
      label: `Certificate document`,
      name: `document`,
      type: `image`,
      ui: {
        description: `A PDF of the certificate.`,
        validate: validateImageFieldFileExt(`.pdf`, false),
        parse: parseGitHubImage,
      },
    },
    {
      label: `Name`,
      name: `name`,
      type: `string`,
      required: true,
      ui: {
        description: `The name or title of this certificate.`,
      },
    },
    {
      label: `Description`,
      name: `description`,
      type: `rich-text`,
      required: true,
      ui: {
        description: `A short description of this certificate.`,
      },
    },
    {
      label: `Issuer`,
      name: `issuer`,
      type: `string`,
      required: true,
      ui: {
        description: `The name of the organization that issued this certificate.`,
      },
    },
    {
      label: `Received on`,
      name: `receivedDate`,
      type: `datetime`,
      required: true,
      ui: {
        description: `The date you received this certificate.`,
      },
    },
    {
      label: `Expires on`,
      name: `expiresDate`,
      type: `datetime`,
      ui: {
        description: `The date this certificate expires. Leave blank if it doesn't expire.`,
      },
    },
    {
      label: `URL`,
      name: `url`,
      type: `string`,
      ui: {
        description: `A URL to where you can learn more about this certificate.`,
        validate: validateUrl(false),
      },
    },
  ],
};
