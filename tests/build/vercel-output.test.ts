import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { SECURITY_HEADERS } from '../../integrations/security-headers.mjs';

const config = JSON.parse(readFileSync('.vercel/output/config.json', 'utf-8')) as {
  routes: { src?: string; status?: number; headers?: Record<string, string>; continue?: boolean }[];
};
const route = (src: string) => config.routes.find((r) => r.src === src);

describe('redirecionamentos na saída da Vercel', () => {
  test.each([
    ['^/servicos$', 301, '/#produtos'],
    ['^/contato$', 301, '/#contato'],
    ['^/portugal$', 301, '/#sobre'],
    ['^/planosdesaude$', 301, '/plano-de-saude'],
    ['^/seguroaluguel$', 301, '/fianca-locaticia'],
    ['^/avaliar$', 302, 'https://www.google.com/search?q=portugal+corretora+de+seguros#lrd=0x94ce42600eb7bcaf:0x491b7e07925c034e,3'],
  ])('%s → %i %s', (src, status, location) => {
    expect(route(src)?.status).toBe(status);
    expect(route(src)?.headers?.Location).toBe(location);
  });
  test('barra final é removida antes dos redirecionamentos (308)', () => {
    const i = config.routes.findIndex((r) => r.src === '^/(.*)/$' && r.status === 308);
    expect(i).toBeGreaterThanOrEqual(0);
    expect(i).toBeLessThan(config.routes.findIndex((r) => r.src === '^/servicos$'));
  });
});

describe('headers de segurança na saída da Vercel', () => {
  test('primeira rota aplica os headers a tudo e continua', () => {
    expect(config.routes[0]).toEqual({ src: '^/(.*)$', headers: SECURITY_HEADERS, continue: true });
  });
  test('aparecem uma única vez', () => {
    expect(config.routes.filter((r) => r.headers?.['Content-Security-Policy'])).toHaveLength(1);
  });
  test('CSP libera só o necessário para o Pixel e bloqueia o resto', () => {
    const csp = SECURITY_HEADERS['Content-Security-Policy'];
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain('https://connect.facebook.net');
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
  });
});
