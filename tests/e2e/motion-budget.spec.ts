import { expect, test } from '@playwright/test';

// Regras da revisão de animações (review-animations): hover curto, só propriedades de GPU, saída mais rápida que a entrada.
const secs = (v: string) => Math.max(...v.split(',').map((x) => parseFloat(x) * (x.includes('ms') ? 0.001 : 1) || 0));

test.use({ viewport: { width: 1440, height: 900 } });

test('hover responde em até 250ms e sem box-shadow ou stroke-dashoffset animados', async ({ page }) => {
  await page.goto('/');
  const report = await page.evaluate(() => {
    const pick = (sel: string) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const s = getComputedStyle(el);
      return { sel, prop: s.transitionProperty, dur: s.transitionDuration };
    };
    return ['.orbit__draw', '.orbit__dot', '.tile', '.tile__go svg', '.insurers__logo', 'summary svg'].map(pick);
  });
  for (const r of report) {
    expect(r, 'seletor encontrado').not.toBeNull();
    expect(secs(r!.dur), `${r!.sel} dura ${r!.dur}`).toBeLessThanOrEqual(0.25);
    expect(r!.prop, `${r!.sel} anima ${r!.prop}`).not.toMatch(/box-shadow|stroke-dashoffset|\ball\b/);
  }
});

test('arco do globo acende e apaga por opacidade, apagando mais rápido', async ({ page }) => {
  await page.goto('/');
  const draw = page.locator('.orbit__draw').first();
  const off = await draw.evaluate((el) => getComputedStyle(el).transitionDuration);
  await page.locator('.orbit__chip').first().hover();
  await expect.poll(() => draw.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
  const on = await draw.evaluate((el) => getComputedStyle(el).transitionDuration);
  expect(secs(off)).toBeLessThan(secs(on));
});

test('menu do celular fecha mais rápido do que abre', async ({ browser }, info) => {
  const page = await (await browser.newContext({ viewport: { width: 390, height: 844 }, baseURL: info.project.use.baseURL })).newPage();
  await page.goto('/');
  const nav = page.locator('[data-menu]');
  const closed = await nav.evaluate((el) => getComputedStyle(el).transitionDuration);
  await page.locator('[data-menu-toggle]').click();
  const open = await nav.evaluate((el) => getComputedStyle(el).transitionDuration);
  expect(secs(closed)).toBeLessThan(secs(open));
  expect(secs(open)).toBeLessThanOrEqual(0.25);
});
