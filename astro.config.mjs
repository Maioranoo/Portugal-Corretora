import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://www.portugalcorretora.com.br',
  output: 'static',
  adapter: vercel(),
  trailingSlash: 'never',
  // A barra de ferramentas do modo dev injeta títulos (h1) que o Playwright enxerga nos testes.
  devToolbar: { enabled: false },
  vite: { build: { assetsInlineLimit: 0 } },
  env: {
    schema: {
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      LEAD_TO_EMAIL: envField.string({
        context: 'server',
        access: 'secret',
        default: 'atendimento@portugalcorretora.com.br',
      }),
      LEAD_FROM_EMAIL: envField.string({
        context: 'server',
        access: 'secret',
        default: 'Site Portugal Corretora <site@portugalcorretora.com.br>',
      }),
      PUBLIC_META_PIXEL_ID: envField.string({ context: 'client', access: 'public', optional: true }),
    },
  },
});
