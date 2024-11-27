import type { UIField } from 'node_modules/@tinacms/schema-tools/dist/types';

export function validateImageFieldFileExt(
  fileExt: string,
  required: boolean,
): UIField<string, false>[`validate`] {
  return function (value) {
    if (required) {
      if (!value) {
        return `Required`;
      }
      if (!value?.endsWith(fileExt)) {
        return `Only "${fileExt}" files are allowed`;
      }
    }
  };
}

export function validateUrl(
  required: boolean,
): UIField<string, false>[`validate`] {
  return function (value) {
    if (required) {
      if (!value) return `Required`;
      try {
        new URL(value);
      } catch {
        return `Must be a valid URL`;
      }
    }
  };
}
