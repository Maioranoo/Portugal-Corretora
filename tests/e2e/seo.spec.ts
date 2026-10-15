import { expect, test } from '@playwright/test';

const INDEXABLE = [
  '/',
  '/seguro-auto',
  '/seguro-residencial',
  '/plano-de-saude',
  '/consorcio',
  '/consorcio-auto',
  '/consorcio-imobiliario',
  '/fianca-locaticia',
  '/seguro-de-vida',
  '/seguro-viagem',
  '/seguro-empresarial',
  '/ja-sou-cliente',
  '/privacidade',
];

for (const path of INDEXABLE) {
  test(`${path}: indexável, com metadados e grafo JSON-LD`, async ({ page }) => {
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBe(`https://www.portugalcorretora.com.br${path === '/' ? '/' : path}`);
    const desc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(desc!.length).toBeGreaterThanOrEqual(70);
    expect(desc!.length).toBeLessThanOrEqual(165);
    const graph = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}')['@graph'];
    const types = graph.map((n: { '@type': string }) => n['@type']);
    expect(types.slice(0, 2)).toEqual(['InsuranceAgency', 'WebSite']);
    if (!['/', '/ja-sou-cliente', '/privacidade'].includes(path)) {
      expect(types).toEqual(expect.arrayContaining(['BreadcrumbList', 'Service', 'FAQPage']));
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  });
}

test('404 não é indexável e não tem canonical', async ({ page }) => {
  const res = await page.goto('/pagina-que-nao-existe');
  expect(res?.status()).toBe(404);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});

test('mobile: H1 da home aparece inteiro na primeira tela', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'só no celular');
  await page.goto('/');
  await expect(page.locator('h1')).toBeInViewport({ ratio: 1 });
});
