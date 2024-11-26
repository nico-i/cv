import type { Collection } from 'tinacms';
import { parseGitHubImage } from './GitHubFile';
import { validateImageFieldFileExt } from '../services/ValidationService';

export const Educations: Collection = {
  name: `educations`,
  label: `Educations`,
  path: `content/educations`,
  fields: [
    {
      label: `Certificate document`,
      name: `document`,
      type: `image`,
      ui: {
        description: `A PDF certifying your completion of this degree.`,
        validate: validateImageFieldFileExt(`.pdf`, false),
        parse: parseGitHubImage,
      },
    },
    {
      label: `Degree`,
      name: `degree`,
      type: `string`,
      required: true,
      ui: {
        description: `The degree you received or are working towards`,
      },
    },
    {
      label: `Grade`,
      name: `grade`,
      type: `string`,
      required: true,
      ui: {
        description: `The grade you received or your current average`,
      },
    },
    {
      label: `Start Date`,
      name: `startDate`,
      type: `datetime`,
      required: true,
      ui: {
        description: `The date you started studying for this degree`,
      },
    },
    {
      label: `End Date`,
      name: `endDate`,
      type: `datetime`,
      required: true,
      ui: {
        description: `The date you finished or expect to finish studying for this degree`,
      },
    },
    {
      label: `Institute`,
      name: `institute`,
      type: `string`,
      required: true,
      ui: {
        description: `The name of the institution you studied at`,
      },
    },
    {
      label: `URL`,
      name: `url`,
      type: `string`,
      required: true,
      ui: {
        description: `A URL to the institution's website.`,
      },
    },
  ],
};
