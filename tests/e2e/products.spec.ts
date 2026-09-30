import { expect, test } from '@playwright/test';

const PRODUCTS = [
  ['seguro-auto', 'Seguro Auto'],
  ['seguro-residencial', 'Seguro Residencial'],
  ['plano-de-saude', 'Plano de Saúde'],
  ['consorcio', 'Consórcio'],
  ['fianca-locaticia', 'Fiança Locatícia'],
  ['seguro-de-vida', 'Seguro de Vida'],
  ['seguro-viagem', 'Seguro Viagem'],
  ['seguro-empresarial', 'Seguro Empresarial'],
] as const;

for (const [slug, name] of PRODUCTS) {
  test(`${slug}: página de destino completa`, async ({ page }) => {
    const res = await page.goto(`/${slug}`);
    expect(res?.status()).toBe(200);
    await expect(page.locator('body')).toHaveAttribute('data-product-name', name);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page).toHaveTitle(/.+/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://www.portugalcorretora.com.br/${slug}`,
    );
    await expect(page.locator(`[data-lead-form] input[name="produto"][value="${slug}"]`)).toHaveCount(1);
    await expect(page.locator('[data-product-select]')).toHaveCount(0);
    await expect(page.locator('[data-menu-toggle]')).toHaveCount(0); // cabeçalho enxuto
    const wa = await page.locator('.wa-float').getAttribute('href');
    expect(new URL(wa!).searchParams.get('text')).toContain(name);
    await expect(page.locator('details').first()).toBeAttached();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  });
}

test('mobile: formulário visível logo abaixo do título', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'só no celular');
  await page.goto('/seguro-auto');
  await expect(page.locator('h1')).toBeInViewport();
  await page.getByLabel('Seu nome').scrollIntoViewIfNeeded();
  await expect(page.getByLabel('Seu nome')).toBeInViewport();
});
