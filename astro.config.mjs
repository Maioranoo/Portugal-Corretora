import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://www.portugalcorretora.com.br',
  output: 'static',
  adapter: vercel(),
  trailingSlash: 'never',
  // A barra de ferramentas do modo dev injeta títulos (h1) que o Playwright enxerga nos testes.
  devToolbar: { enabled: false },
  // Endereços do site antigo (Wix) levados para as páginas novas; /consorcio e /seguro-de-vida já existem com o mesmo nome.
  redirects: {
    '/servicos': '/#produtos',
    '/contato': '/#contato',
    '/portugal': '/#sobre',
    '/planosdesaude': '/plano-de-saude',
    '/seguroresidencial': '/seguro-residencial',
    '/cotacao-seguro-residencial': '/seguro-residencial',
    '/cotacao-seguro-vida': '/seguro-de-vida',
    '/seguroaluguel': '/fianca-locaticia',
    '/seguro-viagem': '/#produtos',
    '/cotacao-seguro-viagem': '/#produtos',
    '/seguro-empresarial': '/#produtos',
    // Temporário (302): o navegador não guarda o destino, caso o link do Google mude.
    // Manter igual a COMPANY.google.writeReviewUrl em src/content/site.ts (o teste de build confere).
    '/avaliar': {
      status: 302,
      destination: 'https://www.google.com/search?q=portugal+corretora+de+seguros#lrd=0x94ce42600eb7bcaf:0x491b7e07925c034e,3',
    },
  },
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
