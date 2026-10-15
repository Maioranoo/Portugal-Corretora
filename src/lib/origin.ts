import type { Utm } from './utm';

export const ORIGIN_STORAGE_KEY = 'pc-origem';
export const INTERNAL = 'interno';

/** De onde a pessoa chegou ao site: só o host do site anterior e a primeira página aberta. Nada que identifique a pessoa. */
export interface Arrival {
  referrer: string;
  landing: string;
}

const HOST = /^[a-z0-9.-]{1,100}$/;
const CONTROL = /[\u0000-\u001F\u007F]/;

export function safeSessionStorage(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function referrerHost(referrer: string, ownHost: string): string {
  if (!referrer) return '';
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    return host === ownHost.toLowerCase() ? INTERNAL : host;
  } catch {
    return '';
  }
}

// Vale tanto para o que vem do navegador quanto para o que chega à API: só host simples e caminho interno passam.
export function sanitizeArrival(raw: unknown): Arrival {
  const r = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const referrer = typeof r.referrer === 'string' && HOST.test(r.referrer) ? r.referrer : '';
  const l = r.landing;
  const landing =
    typeof l === 'string' && l.startsWith('/') && !l.startsWith('//') && l.length <= 200 && !CONTROL.test(l) ? l : '/';
  return { referrer, landing };
}

// A primeira página da sessão vale: ao navegar dentro do site, o navegador passa a informar o próprio site como origem.
export function captureArrival(
  storage: Pick<Storage, 'getItem' | 'setItem'> | null,
  referrer: string,
  ownHost: string,
  pathname: string,
): Arrival {
  try {
    const saved = storage?.getItem(ORIGIN_STORAGE_KEY);
    if (saved) return sanitizeArrival(JSON.parse(saved));
  } catch {
    /* armazenamento indisponível ou corrompido: calcula de novo */
  }
  const arrival = sanitizeArrival({ referrer: referrerHost(referrer, ownHost), landing: pathname });
  try {
    storage?.setItem(ORIGIN_STORAGE_KEY, JSON.stringify(arrival));
  } catch {
    /* segue sem guardar */
  }
  return arrival;
}

const RULES: readonly [RegExp, string][] = [
  [/(^|\.)chatgpt\.com$|(^|\.)openai\.com$/, 'ChatGPT'],
  [/(^|\.)perplexity\.ai$/, 'Perplexity'],
  [/^gemini\.google\.com$/, 'Gemini'],
  [/(^|\.)copilot\.microsoft\.com$/, 'Copilot'],
  [/(^|\.)google\.[a-z.]+$|googlequicksearchbox/, 'Google (busca)'],
  [/(^|\.)bing\.com$/, 'Bing (busca)'],
  [/(^|\.)duckduckgo\.com$/, 'DuckDuckGo (busca)'],
  [/(^|\.)yahoo\.com$/, 'Yahoo (busca)'],
  [/(^|\.)instagram\.com$/, 'Instagram'],
  [/(^|\.)facebook\.com$/, 'Facebook'],
];
const match = (value: string) => RULES.find(([re]) => re.test(value))?.[1];

export function describeOrigin(arrival: Arrival, utm: Utm): string {
  const source = utm.utm_source?.toLowerCase();
  if (source) {
    return match(source) ?? `Campanha (${[utm.utm_source, utm.utm_campaign].filter(Boolean).join(' / ')})`;
  }
  if (!arrival.referrer) return 'Acesso direto ou link sem origem (WhatsApp, apps)';
  if (arrival.referrer === INTERNAL) return 'Não identificada (navegação interna)';
  return match(arrival.referrer) ?? `Outro site (${arrival.referrer})`;
}
