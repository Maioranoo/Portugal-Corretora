import { expect, test } from '@playwright/test';

test('com reduzir movimento, nenhuma transição ou animação longa', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const long = await page.evaluate(() =>
    [...document.querySelectorAll<Element>('body *')].filter((el) => {
      const s = getComputedStyle(el);
      const secs = (v: string) => Math.max(...v.split(',').map((x) => parseFloat(x) || 0));
      return secs(s.transitionDuration) > 0.01 || secs(s.animationDuration) > 0.01;
    }).length,
  );
  expect(long).toBe(0);
});

test('conteúdo visível sem JavaScript', async ({ browser }, info) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false, baseURL: info.project.use.baseURL });
  const page = await ctx.newPage();
  await page.goto('/');
  const hidden = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('[data-reveal]')].filter((el) => getComputedStyle(el).opacity !== '1').length,
  );
  expect(hidden).toBe(0);
  await ctx.close();
});

test('o que já está na tela nunca começa escondido', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(100);
  const hiddenInView = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('[data-reveal]')]
      .filter((el) => el.getBoundingClientRect().top < window.innerHeight)
      .filter((el) => el.classList.contains('reveal-pending')).length,
  );
  expect(hiddenInView).toBe(0);
});

test('seções abaixo da dobra aparecem ao rolar', async ({ page }) => {
  await page.goto('/');
  const faq = page.locator('.faq [data-reveal]').first();
  await expect(faq).toHaveClass(/reveal-pending/);
  await faq.scrollIntoViewIfNeeded();
  await expect(faq).not.toHaveClass(/reveal-pending/);
  await expect.poll(() => faq.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
});

test('pular direto para o fim da página revela tudo o que ficou para trás', async ({ page }) => {
  await page.goto('/fianca-locaticia');
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
  // Sem o conserto, 18 blocos ficavam ocultos para sempre; no navegador sem janela o aviso do observador leva ~750ms
  await expect.poll(() => page.evaluate(() => document.querySelectorAll('.reveal-pending').length), { timeout: 3000 }).toBe(0);
});

test('arcos do globo se desenham na abertura (sem reduzir movimento)', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const names = await page.locator('.orbit__track').evaluateAll((els) => els.map((el) => getComputedStyle(el).animationName));
  expect(names).toHaveLength(6);
  for (const n of names) expect(n).not.toBe('none');
});

test('foco visível ao navegar pelo teclado', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab'); // link de pular
  await page.keyboard.press('Tab');
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle);
  expect(outline).not.toBe('none');
});

test('áreas de toque de pelo menos 44px no celular', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'só no celular');
  await page.goto('/');
  const small = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('a.button, button, .wa-float, [data-menu-toggle], .orbit__chip')]
      .filter((el) => el.offsetParent !== null)
      .map((el) => el.getBoundingClientRect())
      .filter((r) => r.height < 44 || r.width < 44).length,
  );
  expect(small).toBe(0);
});
