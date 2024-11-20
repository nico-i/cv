import globals from 'globals';
import configs from '@nico-i/eslint-config';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: [`**/*.{js,mjs,cjs,ts}`] },
  {
    ignores: [
      `node_modules`,
      `dist`,
      `build`,
      `out`,
      `coverage`,
      `.astro`,
      `.netlify`,
      `**/__generated__`,
      `.husky`,
      `public/admin`,
    ],
  },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  ...configs,
];
