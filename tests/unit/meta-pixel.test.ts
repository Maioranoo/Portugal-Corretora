import { describe, expect, test } from 'vitest';
import { isValidPixelId, loadPixel, trackEvent, type PixelWindow } from '../../src/lib/meta-pixel';

function fakeDoc() {
  const appended: { src: string; async: boolean }[] = [];
  const doc = {
    createElement: () => ({ src: '', async: false }),
    head: { appendChild: (el: { src: string; async: boolean }) => appended.push(el) },
  } as unknown as Document;
  return { doc, appended };
}

describe('isValidPixelId', () => {
  test.each([['1234567890123456', true], ['', false], [undefined, false], ['abc123', false], ['123', false]])(
    '%s → %s',
    (id, ok) => expect(isValidPixelId(id as string | undefined)).toBe(ok),
  );
});

describe('loadPixel', () => {
  test('injeta o script oficial e enfileira init + PageView', () => {
    const win: PixelWindow = {};
    const { doc, appended } = fakeDoc();
    expect(loadPixel('1234567890123456', win, doc)).toBe(true);
    expect(appended).toHaveLength(1);
    expect(appended[0].src).toBe('https://connect.facebook.net/en_US/fbevents.js');
    expect(appended[0].async).toBe(true);
    expect(win.fbq?.queue).toEqual([
      ['init', '1234567890123456'],
      ['track', 'PageView'],
    ]);
  });
  test('não carrega duas vezes', () => {
    const win: PixelWindow = {};
    const { doc, appended } = fakeDoc();
    loadPixel('1234567890123456', win, doc);
    expect(loadPixel('1234567890123456', win, doc)).toBe(false);
    expect(appended).toHaveLength(1);
  });
  test('ID inválido não carrega nada', () => {
    const win: PixelWindow = {};
    const { doc, appended } = fakeDoc();
    expect(loadPixel(undefined, win, doc)).toBe(false);
    expect(appended).toHaveLength(0);
    expect(win.fbq).toBeUndefined();
  });
});

describe('trackEvent', () => {
  test('sem Pixel não faz nada', () => {
    expect(() => trackEvent('Lead', { content_name: 'Seguro Auto' }, {})).not.toThrow();
  });
  test('com Pixel enfileira o evento', () => {
    const win: PixelWindow = {};
    loadPixel('1234567890123456', win, fakeDoc().doc);
    trackEvent('Lead', { content_name: 'Seguro Auto' }, win);
    expect(win.fbq?.queue.at(-1)).toEqual(['track', 'Lead', { content_name: 'Seguro Auto' }]);
  });
});
