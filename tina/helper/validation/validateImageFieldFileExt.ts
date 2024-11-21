import type { UIField } from 'node_modules/@tinacms/schema-tools/dist/types';

export function validateImageFieldFileExt(
  fileExt: string,
  required: boolean,
): UIField<string, false>[`validate`] {
  return function (value) {
    if (required && !value) {
      return `Required`;
    }
    if (value?.endsWith(fileExt)) {
      return `Only "${fileExt}" files are allowed`;
    }
  };
}
