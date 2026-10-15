import { describe, expect, test } from 'vitest';
import { ORIGIN_STORAGE_KEY, captureArrival, describeOrigin, referrerHost, sanitizeArrival } from '../../src/lib/origin';

function memoryStorage(initial: Record<string, string> = {}) {
  const data = { ...initial };
  return { data, getItem: (k: string) => data[k] ?? null, setItem: (k: string, v: string) => { data[k] = v; } };
}
const throwing = { getItem: () => { throw new Error('x'); }, setItem: () => { throw new Error('x'); } };
const OWN = 'www.portugalcorretora.com.br';

describe('referrerHost', () => {
  test('guarda só o host, em minúsculas', () => {
    expect(referrerHost('https://WWW.Google.com.br/search?q=seguro', OWN)).toBe('www.google.com.br');
  });
  test('vazio, inválido e o próprio site', () => {
    expect(referrerHost('', OWN)).toBe('');
    expect(referrerHost('não é url', OWN)).toBe('');
    expect(referrerHost('https://www.portugalcorretora.com.br/seguro-auto', OWN)).toBe('interno');
  });
});

describe('captureArrival', () => {
  test('a primeira página da sessão vale', () => {
    const s = memoryStorage();
    expect(captureArrival(s, 'https://www.google.com/', OWN, '/seguro-auto')).toEqual({ referrer: 'www.google.com', landing: '/seguro-auto' });
    expect(captureArrival(s, 'https://www.portugalcorretora.com.br/seguro-auto', OWN, '/consorcio')).toEqual({
      referrer: 'www.google.com',
      landing: '/seguro-auto',
    });
    expect(JSON.parse(s.data[ORIGIN_STORAGE_KEY]).landing).toBe('/seguro-auto');
  });
  test('armazenamento bloqueado ou corrompido não quebra', () => {
    expect(captureArrival(throwing, 'https://chatgpt.com/', OWN, '/')).toEqual({ referrer: 'chatgpt.com', landing: '/' });
    expect(captureArrival(null, '', OWN, '/')).toEqual({ referrer: '', landing: '/' });
    expect(captureArrival(memoryStorage({ [ORIGIN_STORAGE_KEY]: '{quebrado' }), '', OWN, '/x')).toEqual({ referrer: '', landing: '/x' });
  });
});

describe('sanitizeArrival', () => {
  test('descarta host com caracteres estranhos e página fora do site', () => {
    expect(sanitizeArrival({ referrer: '<b>x</b>', landing: 'https://mal.com' })).toEqual({ referrer: '', landing: '/' });
    expect(sanitizeArrival({ referrer: 'a'.repeat(101), landing: '/' + 'a'.repeat(250) })).toEqual({ referrer: '', landing: '/' });
    expect(sanitizeArrival({ referrer: 'x.com', landing: '//mal.com' })).toEqual({ referrer: 'x.com', landing: '/' });
    expect(sanitizeArrival('lixo')).toEqual({ referrer: '', landing: '/' });
  });
});

describe('describeOrigin', () => {
  const a = (referrer: string) => ({ referrer, landing: '/' });
  test.each([
    ['www.google.com.br', 'Google (busca)'],
    ['com.google.android.googlequicksearchbox', 'Google (busca)'],
    ['gemini.google.com', 'Gemini'],
    ['www.bing.com', 'Bing (busca)'],
    ['copilot.microsoft.com', 'Copilot'],
    ['chatgpt.com', 'ChatGPT'],
    ['www.perplexity.ai', 'Perplexity'],
    ['l.instagram.com', 'Instagram'],
    ['lm.facebook.com', 'Facebook'],
    ['', 'Acesso direto ou link sem origem (WhatsApp, apps)'],
    ['interno', 'Não identificada (navegação interna)'],
    ['www.exemplo.com.br', 'Outro site (www.exemplo.com.br)'],
  ])('%s → %s', (host, label) => {
    expect(describeOrigin(a(host), {})).toBe(label);
  });
  test('UTM tem prioridade: ChatGPT marca utm_source', () => {
    expect(describeOrigin(a(''), { utm_source: 'chatgpt.com' })).toBe('ChatGPT');
    expect(describeOrigin(a('l.facebook.com'), { utm_source: 'meta', utm_campaign: 'auto-set' })).toBe('Campanha (meta / auto-set)');
  });
});
