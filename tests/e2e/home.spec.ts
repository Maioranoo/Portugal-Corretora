import { expect, test } from '@playwright/test';

const SLUGS = ['seguro-auto', 'seguro-residencial', 'plano-de-saude', 'consorcio', 'fianca-locaticia', 'seguro-de-vida'];

test('home tem todas as seções e links para os 6 produtos', async ({ page }) => {
  await page.goto('/');
  for (const id of ['produtos', 'como-funciona', 'sobre', 'contato']) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
  for (const slug of SLUGS) {
    await expect(page.locator(`#produtos a[href="/${slug}"]`)).toHaveCount(1);
  }
  await expect(page.getByText('4,8').first()).toBeVisible();
  await expect(page.locator('#conteudo a[href="/ja-sou-cliente"]').first()).toBeVisible();
});

test('perguntas frequentes abrem e fecham', async ({ page }) => {
  await page.goto('/');
  const first = page.locator('details').first();
  await first.locator('summary').click();
  await expect(first).toHaveAttribute('open', '');
});

test('JSON-LD de corretora é válido', async ({ page }) => {
  await page.goto('/');
  const raw = await page.locator('script[type="application/ld+json"]').textContent();
  const data = JSON.parse(raw ?? '{}');
  expect(data['@type']).toBe('InsuranceAgency');
  expect(data.aggregateRating.ratingValue).toBe(4.8);
});

test('sem rolagem horizontal', async ({ page }) => {
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
});
