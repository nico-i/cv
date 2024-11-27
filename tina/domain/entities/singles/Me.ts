import type { Collection } from 'tinacms';
import { validateImageField } from '../../services/ValidationService';
import { parseGitHubImage } from '../GitHubFile';

export const Me: Collection = {
  label: `Me`,
  name: `me`,
  path: `content/me`,
  ui: {
    allowedActions: {
      //   create: false,
      delete: false,
    },
  },
  fields: [
    {
      required: true,
      type: `image`,
      name: `avatar`,
      label: `Avatar`,
      ui: {
        parse: parseGitHubImage,
        validate: validateImageField(true),
      },
    },
    { required: true, type: `string`, name: `name`, label: `Name` },
    {
      required: true,
      type: `string`,
      name: `currentPosition`,
      label: `Current Position`,
    },
    { required: true, type: `rich-text`, name: `bio`, label: `Bio` },
    {
      required: true,
      type: `datetime`,
      name: `birthDate`,
      label: `Birth date`,
    },
    { required: true, type: `string`, name: `phone`, label: `Phone number` },
    {
      required: true,
      type: `string`,
      name: `residence`,
      label: `Current hometown`,
    },
    {
      type: `string`,
      name: `interests`,
      label: `Interests`,
      list: true,
    },
    {
      type: `object`,
      list: true,
      name: `contactLinks`,
      label: `Contact Links`,
      ui: {
        itemProps: (item) => {
          return { label: `${item.platform} - ${item.username}` };
        },
      },
      fields: [
        {
          type: `image`,
          name: `icon`,
          label: `Icon`,
          required: true,
          ui: {
            validate: validateImageField(true, `.svg`),
            parse: parseGitHubImage,
          },
        },
        {
          required: true,
          type: `string`,
          name: `platform`,
          label: `Platform`,
        },
        {
          required: true,
          type: `string`,
          name: `username`,
          label: `username`,
        },
        { required: true, type: `string`, name: `url`, label: `URL` },
      ],
    },
  ],
};
