import { describe, expect, test } from 'vitest';
import { CONSENT_KEY, readConsent, writeConsent } from '../../src/lib/consent';

function memory(initial: Record<string, string> = {}) {
  const data = { ...initial };
  return { data, getItem: (k: string) => data[k] ?? null, setItem: (k: string, v: string) => void (data[k] = v) };
}
const broken = {
  getItem: () => { throw new Error('x'); },
  setItem: () => { throw new Error('x'); },
};
const now = new Date('2026-09-29T12:00:00Z');

describe('consent', () => {
  test('sem registro retorna null', () => expect(readConsent(memory(), now)).toBeNull());
  test('grava e lê granted', () => {
    const s = memory();
    expect(writeConsent(s, 'granted', now)).toBe(true);
    expect(readConsent(s, now)).toBe('granted');
    expect(JSON.parse(s.data[CONSENT_KEY])).toEqual({ status: 'granted', at: '2026-09-29T12:00:00.000Z' });
  });
  test('lê denied', () => {
    const s = memory();
    writeConsent(s, 'denied', now);
    expect(readConsent(s, now)).toBe('denied');
  });
  test('expira depois de 180 dias', () => {
    const s = memory();
    writeConsent(s, 'granted', new Date('2026-01-01T00:00:00Z'));
    expect(readConsent(s, new Date('2026-06-29T00:00:00Z'))).toBe('granted'); // 179 dias
    expect(readConsent(s, new Date('2026-07-01T00:00:00Z'))).toBeNull();      // 181 dias
  });
  test.each(['{quebrado', '{"status":"talvez","at":"2026-09-29T12:00:00Z"}', '{"status":"granted"}', '{"status":"granted","at":"ontem"}'])(
    'registro inválido %s retorna null',
    (raw) => expect(readConsent(memory({ [CONSENT_KEY]: raw }), now)).toBeNull(),
  );
  test('armazenamento bloqueado não lança erro', () => {
    expect(readConsent(broken, now)).toBeNull();
    expect(writeConsent(broken, 'granted', now)).toBe(false);
    expect(readConsent(null, now)).toBeNull();
    expect(writeConsent(null, 'granted', now)).toBe(false);
  });
});
