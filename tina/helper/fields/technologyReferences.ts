import { ProgrammingLanguages } from '../../collections/ProgrammingLanguages';
import { Tools } from '../../collections/Tools';
import type { TinaField } from 'tinacms';

export const technologyReferences: TinaField[] = [
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
  {
    label: ProgrammingLanguages.label,
    name: ProgrammingLanguages.name,
    type: `object`,
    list: true,
    fields: [
      {
        label: `Programming Language`,
        name: `programmingLanguage`,
        type: `reference`,
        collections: [ProgrammingLanguages.name],
      },
    ],
  },
] as const;
