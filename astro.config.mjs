import tailwind from '@astrojs/tailwind';
import astroI18next from 'astro-i18next';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: import.meta.env.SITE_URL,
  devToolbar: { enabled: false },
  integrations: [
    astroI18next(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  redirects: {
    '/admin': `/admin/index.html`,
  },
});
