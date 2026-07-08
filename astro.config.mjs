import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://my-ui-kit.example.com',
  integrations: [sitemap()],
  output: 'static'
});
