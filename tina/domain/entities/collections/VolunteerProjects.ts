import type { Collection } from 'tinacms';
import { validateImageField } from '../../services/ValidationService';
import { parseGitHubImage } from '../GitHubFile';

export const VolunteerProjects: Collection = {
  name: `volunteerProjects`,
  label: `Volunteer Projects`,
  path: `content/volunteerProjects`,
  fields: [
    {
      label: `Certificate document`,
      name: `document`,
      type: `image`,
      ui: {
        description: `A copy of the document that proves you volunteered for this project.`,
        validate: validateImageField(false, `.pdf`),
        parse: parseGitHubImage,
      },
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
      label: `Role`,
      name: `role`,
      type: `string`,
      required: true,
      ui: {
        description: `The role you had in this project.`,
      },
    },
    {
      label: `Organization`,
      name: `organization`,
      type: `string`,
      required: true,
      ui: {
        description: `The name of the organization that you volunteered with or for.`,
      },
    },
    {
      label: `Description`,
      name: `description`,
      type: `rich-text`,
      required: true,
      ui: {
        description: `A short description of what this project entailed.`,
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
        description: `The date you finished this project. Leave blank if still ongoing.`,
      },
    },
  ],
};
