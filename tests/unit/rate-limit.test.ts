import { describe, expect, test } from 'vitest';
import { clientKey, createRateLimiter } from '../../src/lib/rate-limit';

describe('createRateLimiter', () => {
  test('libera até o limite e barra o excedente dentro da janela', () => {
    const allow = createRateLimiter({ limit: 3, windowMs: 1000 });
    expect([allow('a', 0), allow('a', 10), allow('a', 20), allow('a', 30)]).toEqual([true, true, true, false]);
  });

  test('cada endereço tem a própria contagem', () => {
    const allow = createRateLimiter({ limit: 1, windowMs: 1000 });
    expect(allow('a', 0)).toBe(true);
    expect(allow('b', 0)).toBe(true);
    expect(allow('a', 1)).toBe(false);
  });

  test('libera de novo depois que a janela passa', () => {
    const allow = createRateLimiter({ limit: 1, windowMs: 1000 });
    expect(allow('a', 0)).toBe(true);
    expect(allow('a', 999)).toBe(false);
    expect(allow('a', 1000)).toBe(true);
  });

  test('não cresce sem limite na memória', () => {
    const allow = createRateLimiter({ limit: 1, windowMs: 1000, maxKeys: 10 });
    for (let i = 0; i < 50; i++) allow(`ip${i}`, i);
    // Um endereço antigo foi descartado e volta a ser aceito
    expect(allow('ip0', 60)).toBe(true);
  });
});

describe('clientKey', () => {
  const r = (headers: Record<string, string>) => new Request('https://x.com/api/lead', { headers });
  test('usa o IP informado pela Vercel', () => expect(clientKey(r({ 'x-real-ip': '1.2.3.4' }))).toBe('1.2.3.4'));
  test('usa o primeiro IP de x-forwarded-for', () =>
    expect(clientKey(r({ 'x-forwarded-for': '5.6.7.8, 10.0.0.1' }))).toBe('5.6.7.8'));
  test('sem IP, todos caem na mesma chave', () => expect(clientKey(r({}))).toBe('desconhecido'));
});
