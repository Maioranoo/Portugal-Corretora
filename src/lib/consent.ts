export type ConsentStatus = 'granted' | 'denied';
export type KeyValueStorage = Pick<Storage, 'getItem' | 'setItem'>;
export const CONSENT_KEY = 'pc-consent';
export const CONSENT_MAX_AGE_DAYS = 180;
const DAY_MS = 24 * 60 * 60 * 1000;

export function readConsent(storage: KeyValueStorage | null, now: Date): ConsentStatus | null {
  try {
    const raw = storage?.getItem(CONSENT_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as { status?: unknown; at?: unknown };
    if ((v.status !== 'granted' && v.status !== 'denied') || typeof v.at !== 'string') return null;
    const at = Date.parse(v.at);
    if (Number.isNaN(at)) return null;
    if (now.getTime() - at > CONSENT_MAX_AGE_DAYS * DAY_MS) return null;
    return v.status;
  } catch {
    return null;
  }
}

export function writeConsent(storage: KeyValueStorage | null, status: ConsentStatus, now: Date): boolean {
  if (!storage) return false;
  try {
    storage.setItem(CONSENT_KEY, JSON.stringify({ status, at: now.toISOString() }));
    return true;
  } catch {
    return false;
  }
}

export function safeLocalStorage(): KeyValueStorage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
