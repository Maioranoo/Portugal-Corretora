export type PixelEvent = 'Lead' | 'Contact' | 'ViewContent';

type FbqArgs = unknown[];
export interface FbqFn {
  (...args: FbqArgs): void;
  callMethod?: (...args: FbqArgs) => void;
  queue: FbqArgs[];
  push: FbqFn;
  loaded: boolean;
  version: string;
}
export interface PixelWindow {
  fbq?: FbqFn;
  _fbq?: FbqFn;
}

const PIXEL_SRC = 'https://connect.facebook.net/en_US/fbevents.js';

export function isValidPixelId(id: string | undefined): id is string {
  return typeof id === 'string' && /^\d{10,20}$/.test(id);
}

export function loadPixel(
  pixelId: string | undefined,
  win: PixelWindow = window as unknown as PixelWindow,
  doc: Document = document,
): boolean {
  if (!isValidPixelId(pixelId) || win.fbq) return false;

  const fbq = function (...args: FbqArgs) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  } as FbqFn;
  fbq.queue = [];
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  win.fbq = fbq;
  if (!win._fbq) win._fbq = fbq;

  const script = doc.createElement('script');
  script.async = true;
  script.src = PIXEL_SRC;
  doc.head.appendChild(script);

  fbq('init', pixelId);
  fbq('track', 'PageView');
  return true;
}

export function trackEvent(
  name: PixelEvent,
  params?: Record<string, string>,
  win: PixelWindow = (typeof window === 'undefined' ? {} : window) as unknown as PixelWindow,
): void {
  if (!win.fbq) return;
  if (params) win.fbq('track', name, params);
  else win.fbq('track', name);
}
