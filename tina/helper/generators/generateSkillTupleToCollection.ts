import { validateImageFieldFileExt } from '../validation/validateImageFieldFileExt';
import { validateUrl } from '../validation/validateUrl';
import type { Collection, TinaField } from 'tinacms';

export const generateSkillTupleToCollection = (
  [name, label]: [string, string],
  withIcon = true,
): Collection => {
  const singularCollectionItemName = name.slice(0, -1);
  return {
    name,
    label,
    path: `content/${name}`,
    fields: [
      ...(withIcon
        ? [
            {
              label: `Icon`,
              name: `icon`,
              type: `image`,
              required: true,

              ui: {
                description: `A SVG icon representing this ${singularCollectionItemName}.`,
                validate: validateImageFieldFileExt(`.svg`, true),
              },
            } satisfies TinaField,
          ]
        : []),
      {
        label: `Name`,
        name: `name`,
        type: `string`,
        required: true,
        ui: {
          description: `The name of this ${singularCollectionItemName}.`,
        },
      },
      {
        label: `URL`,
        name: `url`,
        type: `string`,
        required: true,
        ui: {
          description: `A URL to where you can learn more about this ${singularCollectionItemName}.`,
          validate: validateUrl(true),
        },
      },
      {
        label: `Description`,
        name: `description`,
        type: `rich-text`,
        required: true,
        ui: {
          description: `A short description of this ${singularCollectionItemName}.`,
        },
      },
      {
        label: `Proficiency`,
        name: `proficiency`,
        type: `number`,
        required: true,
        ui: {
          description: `A value between 0 and 100 determining your proficiency with this ${singularCollectionItemName}.`,
          validate: (value: number) => {
            const max = 100;
            if (value < 0 || value > max) {
              return `Proficiency must be between 0 and ${max}`;
            }
          },
        },
      },
      {
        label: `Priority`,
        name: `priority`,
        type: `number`,
        ui: {
          description: `A value between 0 and 10. Higher values are displayed first.`,
          validate: (value: number) => {
            const max = 10;
            if (value < 0 || value > max) {
              return `Priority must be between 0 and ${max}`;
            }
          },
        },
      },
    ],
  };
};
