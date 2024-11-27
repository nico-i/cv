import type { Collection } from 'tinacms';

export const Interests: Collection = {
  name: `interests`,
  label: `Interests`,
  path: `content/interests`,
  fields: [
    {
      label: `Name`,
      name: `name`,
      type: `string`,
      required: true,
      ui: {
        description: `The name of this interest.`,
      },
    },
  ],
};
