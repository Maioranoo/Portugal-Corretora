import { expect, test } from '@playwright/test';

const SLUGS = [
  'seguro-auto',
  'seguro-residencial',
  'plano-de-saude',
  'consorcio',
  'fianca-locaticia',
  'seguro-de-vida',
  'seguro-viagem',
  'seguro-empresarial',
];

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

test('JSON-LD traz a corretora com dados oficiais e sem nota autodeclarada', async ({ page }) => {
  await page.goto('/');
  const data = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}');
  const org = data['@graph'].find((n: { '@type': string }) => n['@type'] === 'InsuranceAgency');
  expect(org['@id']).toBe('https://www.portugalcorretora.com.br/#corretora');
  expect(org.address.postalCode).toBe('09040-011');
  expect(org.areaServed.map((c: { name: string }) => c.name)).toEqual([
    'Santo André',
    'São Bernardo do Campo',
    'São Caetano do Sul',
  ]);
  expect(org.aggregateRating).toBeUndefined();
});

test('sem rolagem horizontal', async ({ page }) => {
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
});
