import type { UIField } from 'node_modules/@tinacms/schema-tools/dist/types';

export function validateImageField(
  required: boolean,
  fileExts?: string | string[],
): UIField<string, false>[`validate`] {
  return function (value) {
    if (required) {
      if (!value) {
        return `Required`;
      }

      if (fileExts === undefined) return;

      const fileExtArr = Array.isArray(fileExts) ? fileExts : [fileExts];
      if (!fileExtArr.some((fileExt) => value.endsWith(fileExt))) {
        return `Only "${fileExtArr.join(`", "`)}" files are allowed`;
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
