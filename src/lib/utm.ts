export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
export type UtmKey = (typeof UTM_KEYS)[number];
export type Utm = Partial<Record<UtmKey, string>>;
export const UTM_STORAGE_KEY = 'pc-utm';

const MAX = 100;
const CONTROL = /[\u0000-\u001F\u007F]/g;

export function sanitizeUtm(raw: unknown): Utm {
  if (!raw || typeof raw !== 'object') return {};
  const src = raw as Record<string, unknown>;
  const out: Utm = {};
  for (const key of UTM_KEYS) {
    const v = src[key];
    if (typeof v !== 'string') continue;
    const clean = v.replace(CONTROL, '').trim().slice(0, MAX);
    if (clean) out[key] = clean;
  }
  return out;
}

export function parseUtm(search: string): Utm {
  const params = new URLSearchParams(search);
  const found: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const v = params.get(key);
    if (v) found[key] = v;
  }
  return sanitizeUtm(found);
}

export function captureUtm(storage: Pick<Storage, 'getItem' | 'setItem'> | null, search: string): Utm {
  const incoming = parseUtm(search);
  if (Object.keys(incoming).length > 0) {
    try {
      storage?.setItem(UTM_STORAGE_KEY, JSON.stringify(incoming));
    } catch {
      /* armazenamento indisponível: segue só com a URL */
    }
    return incoming;
  }
  try {
    return sanitizeUtm(JSON.parse(storage?.getItem(UTM_STORAGE_KEY) ?? 'null'));
  } catch {
    return {};
  }
}
