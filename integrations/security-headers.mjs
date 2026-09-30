import { readFile, writeFile } from 'node:fs/promises';

export const SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=31536000',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' https://connect.facebook.net",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://www.facebook.com",
    "font-src 'self'",
    "connect-src 'self' https://www.facebook.com https://connect.facebook.net",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    'upgrade-insecure-requests',
  ].join('; '),
};

/**
 * Insere os headers de segurança no começo das rotas da Vercel, depois que o adaptador escreve o config.json.
 * O vercel.json não é aplicado na saída de build do adaptador do Astro (ver "Resultados do teste prático" no plano).
 */
export default function securityHeaders(headers = SECURITY_HEADERS) {
  return {
    name: 'security-headers',
    hooks: {
      'astro:build:done': async ({ logger }) => {
        const file = new URL('../.vercel/output/config.json', import.meta.url);
        const config = JSON.parse(await readFile(file, 'utf-8'));
        config.routes.unshift({ src: '^/(.*)$', headers, continue: true });
        await writeFile(file, JSON.stringify(config, null, 2));
        logger.info('headers de segurança adicionados ao config.json da Vercel');
      },
    },
  };
}
