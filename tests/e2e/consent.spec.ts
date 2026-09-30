import { expect, test, type Page } from '@playwright/test';

async function watchPixel(page: Page) {
  const hits: string[] = [];
  await page.route('https://connect.facebook.net/**', async (route) => {
    hits.push(route.request().url());
    await route.fulfill({ status: 200, contentType: 'application/javascript', body: '' });
  });
  return hits;
}
const banner = (page: Page) => page.locator('[data-cookie-banner]');

test('Pixel não carrega antes do Aceitar e carrega depois', async ({ page }) => {
  const hits = await watchPixel(page);
  await page.goto('/seguro-auto');
  await expect(banner(page)).toBeVisible();
  await page.waitForTimeout(500);
  expect(hits).toHaveLength(0);
  expect(await page.evaluate(() => typeof (window as any).fbq)).toBe('undefined');

  await banner(page).getByRole('button', { name: 'Aceitar' }).click();
  await expect(banner(page)).toBeHidden();
  await expect.poll(() => hits.length).toBe(1);
  const queue = await page.evaluate(() => (window as any).fbq.queue);
  expect(queue).toContainEqual(['init', '1234567890123456']);
  expect(queue).toContainEqual(['track', 'ViewContent', { content_name: 'Seguro Auto' }]);

  await page.reload();
  await expect(banner(page)).toBeHidden();
  await expect.poll(() => hits.length).toBe(2);
});

test('Recusar: nunca carrega o Pixel e o aviso não volta', async ({ page }) => {
  const hits = await watchPixel(page);
  await page.goto('/');
  await banner(page).getByRole('button', { name: 'Recusar' }).click();
  await expect(banner(page)).toBeHidden();
  await page.reload();
  await expect(banner(page)).toBeHidden();
  await page.waitForTimeout(500);
  expect(hits).toHaveLength(0);
});

test('Preferências de cookies no rodapé reabre o aviso', async ({ page }) => {
  await page.goto('/');
  await banner(page).getByRole('button', { name: 'Recusar' }).click();
  await page.locator('footer [data-cookie-preferences]').click();
  await expect(banner(page)).toBeVisible();
});

test('clique no WhatsApp com consentimento dispara Contact', async ({ page }) => {
  await watchPixel(page);
  await page.goto('/');
  await banner(page).getByRole('button', { name: 'Aceitar' }).click();
  await page.evaluate(() => document.querySelector('.wa-float')?.addEventListener('click', (e) => e.preventDefault()));
  await page.locator('.wa-float').click();
  const queue = await page.evaluate(() => (window as any).fbq.queue);
  expect(queue).toContainEqual(['track', 'Contact', { content_name: 'Botão flutuante' }]);
});

test('armazenamento bloqueado: aviso funciona na visita e nada quebra', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('bloqueado'); } });
    Object.defineProperty(window, 'sessionStorage', { get() { throw new Error('bloqueado'); } });
  });
  const hits = await watchPixel(page);
  await page.goto('/');
  await expect(banner(page)).toBeVisible();
  await banner(page).getByRole('button', { name: 'Aceitar' }).click();
  await expect(banner(page)).toBeHidden();
  await expect.poll(() => hits.length).toBe(1);
  expect(errors).toEqual([]);
});

test('mobile: aviso não cobre o botão de WhatsApp', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'só no celular');
  await page.goto('/');
  const b = await banner(page).boundingBox();
  const w = await page.locator('.wa-float').boundingBox();
  expect(b && w && (w.y + w.height <= b.y || w.y >= b.y + b.height)).toBe(true);
});
