import { validateUrl } from '../helper/validation/validateUrl';
import type { Collection } from 'tinacms';

export const Jobs: Collection = {
  name: `jobs`,
  label: `Jobs`,
  path: `content/jobs`,
  fields: [
    {
      label: `Company`,
      name: `company`,
      type: `string`,
      required: true,
      ui: {
        description: `The name of the company you worked for.`,
      },
    },
    {
      label: `Position`,
      name: `position`,
      type: `string`,
      required: true,
      ui: {
        description: `The position you held at this company.`,
      },
    },
    {
      label: `Start Date`,
      name: `startDate`,
      type: `datetime`,
      required: true,
      ui: {
        description: `The date you started working at this company.`,
      },
    },
    {
      label: `End Date`,
      name: `endDate`,
      type: `datetime`,
      ui: {
        description: `The date you stopped working at this company. Leave blank if you still work here.`,
      },
    },
    {
      label: `Description`,
      name: `description`,
      type: `rich-text`,
      required: true,
      ui: {
        description: `A short description of the main responsibilities you had at this job.`,
      },
    },
    {
      label: `URL`,
      name: `url`,
      type: `string`,
      required: true,
      ui: {
        description: `A URL to the company's website.`,
        validate: validateUrl(true),
      },
    },
  ],
};
