import { Platforms } from '../../domain/entities/collections/Platforms';
import { ProgrammingLanguages } from '../../domain/entities/collections/ProgrammingLanguages';
import { Tools } from '../../domain/entities/collections/Tools';
import type { TinaField } from 'tinacms';

function createLabel(mdFilePath: string | undefined): string {
  const name = mdFilePath?.split(`/`)?.at(-1)?.replace(`.md`, ``);

  if (!name) {
    return ``;
  }

  return name.charAt(0).toUpperCase() + name.slice(1);
}

export const TechnologyReferences: TinaField[] = [
  {
    label: Tools.label,
    name: Tools.name,
    type: `object`,
    list: true,
    ui: {
      itemProps: (item) => {
        return { label: `${createLabel(item.tool)}` };
      },
    },
    fields: [
      {
        label: `Tool`,
        name: `tool`,
        type: `reference`,
        collections: [Tools.name],
      },
    ],
  },
  {
    label: ProgrammingLanguages.label,
    name: ProgrammingLanguages.name,
    type: `object`,
    list: true,
    ui: {
      itemProps: (item) => {
        return { label: `${createLabel(item.programmingLanguage)}` };
      },
    },
    fields: [
      {
        label: `Programming Language`,
        name: `programmingLanguage`,
        type: `reference`,
        collections: [ProgrammingLanguages.name],
      },
    ],
  },
  {
    label: Platforms.label,
    name: Platforms.name,
    type: `object`,
    list: true,
    ui: {
      itemProps: (item) => {
        return { label: `${createLabel(item.platform)}` };
      },
    },
    fields: [
      {
        label: `Platform`,
        name: `platform`,
        type: `reference`,
        collections: [Platforms.name],
      },
    ],
  },
] as const;
