import { technologyReferences } from '../helper/fields/technologyReferences';
import { validateUrl } from '../helper/validation/validateUrl';
import type { Collection } from 'tinacms';

export const Projects: Collection = {
  name: `projects`,
  label: `Projects`,
  path: `content/projects`,
  fields: [
    {
      label: `Hero Image`,
      name: `heroImage`,
      type: `image`,
      required: true,
    },
    {
      label: `Name`,
      name: `name`,
      type: `string`,
      required: true,
      ui: {
        description: `The name of this project.`,
      },
    },
    {
      label: `Work hours`,
      name: `workHours`,
      type: `number`,
      ui: {
        description: `An estimate of the number of hours you worked on this project.`,
      },
    },
    {
      label: `Too long; didn't read`,
      name: `tldr`,
      type: `string`,
      ui: {
        description: `A summary of this project in no more than 140 characters.`,
        validate: (input: string) => {
          if (input?.length > 140) {
            return `The TL;DR must be no more than 140 characters.`;
          }
        },
      },
    },
    {
      label: `Description`,
      name: `description`,
      type: `rich-text`,
      required: true,
      ui: {
        description: `A description of what this project was about.`,
      },
    },
    {
      label: `Demo URL`,
      name: `demoUrl`,
      type: `string`,
      ui: {
        description: `A URL to a live demo of this project.`,
        validate: validateUrl(false),
      },
    },
    {
      label: `Start Date`,
      name: `startDate`,
      type: `datetime`,
      required: true,
      ui: {
        description: `The date you started this project.`,
      },
    },
    {
      label: `End Date`,
      name: `endDate`,
      type: `datetime`,
      ui: {
        description: `The date you finished this project. Leave blank if it's ongoing.`,
      },
    },
    ...technologyReferences,
  ],
};
