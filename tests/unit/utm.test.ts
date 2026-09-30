import { describe, expect, test } from 'vitest';
import { UTM_STORAGE_KEY, captureUtm, parseUtm, sanitizeUtm } from '../../src/lib/utm';

function memoryStorage(initial: Record<string, string> = {}) {
  const data = { ...initial };
  return {
    data,
    getItem: (k: string) => data[k] ?? null,
    setItem: (k: string, v: string) => { data[k] = v; },
  };
}
const throwingStorage = {
  getItem: () => { throw new Error('bloqueado'); },
  setItem: () => { throw new Error('bloqueado'); },
};

describe('parseUtm / sanitizeUtm', () => {
  test('lê só as chaves utm conhecidas', () => {
    expect(parseUtm('?utm_source=meta&utm_campaign=auto-set&fbclid=x&foo=1')).toEqual({
      utm_source: 'meta',
      utm_campaign: 'auto-set',
    });
  });
  test('corta em 100 caracteres, remove controles e ignora vazios', () => {
    const r = sanitizeUtm({ utm_source: 'a'.repeat(150), utm_medium: ' \u0000pago\n ', utm_term: '  ' });
    expect(r.utm_source).toHaveLength(100);
    expect(r.utm_medium).toBe('pago');
    expect(r.utm_term).toBeUndefined();
  });
  test('entrada inválida vira objeto vazio', () => {
    expect(sanitizeUtm(null)).toEqual({});
    expect(sanitizeUtm('x')).toEqual({});
    expect(sanitizeUtm({ utm_source: 5 })).toEqual({});
  });
});

describe('captureUtm', () => {
  test('UTM na URL é gravado e retornado', () => {
    const s = memoryStorage();
    expect(captureUtm(s, '?utm_campaign=auto-set')).toEqual({ utm_campaign: 'auto-set' });
    expect(JSON.parse(s.data[UTM_STORAGE_KEY])).toEqual({ utm_campaign: 'auto-set' });
  });
  test('sem UTM na URL, retorna o gravado na sessão', () => {
    const s = memoryStorage({ [UTM_STORAGE_KEY]: JSON.stringify({ utm_campaign: 'auto-set' }) });
    expect(captureUtm(s, '')).toEqual({ utm_campaign: 'auto-set' });
  });
  test('nova campanha substitui a anterior', () => {
    const s = memoryStorage({ [UTM_STORAGE_KEY]: JSON.stringify({ utm_campaign: 'velha', utm_source: 'meta' }) });
    expect(captureUtm(s, '?utm_campaign=nova')).toEqual({ utm_campaign: 'nova' });
  });
  test('armazenamento bloqueado não quebra', () => {
    expect(captureUtm(throwingStorage, '?utm_source=meta')).toEqual({ utm_source: 'meta' });
    expect(captureUtm(null, '')).toEqual({});
  });
  test('JSON corrompido na sessão é ignorado', () => {
    expect(captureUtm(memoryStorage({ [UTM_STORAGE_KEY]: '{quebrado' }), '')).toEqual({});
  });
});
