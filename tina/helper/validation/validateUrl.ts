import type { UIField } from 'node_modules/@tinacms/schema-tools/dist/types';

export function validateUrl(
  required: boolean,
): UIField<string, false>[`validate`] {
  return function (value) {
    if (required && !value) {
      return `Required`;
    }
    try {
      new URL(value);
    } catch {
      return `Must be a valid URL`;
    }
  };
}
