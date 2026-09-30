import { expect, test } from '@playwright/test';

test('já sou cliente: WhatsApp de sinistro e telefones de assistência', async ({ page }) => {
  const res = await page.goto('/ja-sou-cliente');
  expect(res?.status()).toBe(200);
  await expect(page.locator('h1')).toHaveCount(1);
  const wa = page.locator('#conteudo a[data-wa-context="Já sou cliente"]').first();
  expect(new URL((await wa.getAttribute('href'))!).searchParams.get('text')).toBe(
    'Olá! Já sou cliente da Portugal Corretora e preciso de ajuda com meu seguro.',
  );
  await expect(page.locator('a[href^="tel:"]').first()).toBeAttached();
  await expect(page.locator('a[href="tel:08003186546"]')).toHaveCount(1); // Tokio Marine
});

test('privacidade: dados da corretora, encarregado e cookies', async ({ page }) => {
  await page.goto('/privacidade');
  const main = page.locator('main');
  for (const t of ['21.427.722/0001-05', 'atendimento@portugalcorretora.com.br', 'Resend', 'Vercel', 'Meta', 'pc-consent']) {
    await expect(main).toContainText(t);
  }
  await expect(page.locator('#cookies')).toHaveCount(1);
  await expect(main.locator('[data-cookie-preferences]')).toHaveCount(1);
});

test('avaliar: redireciona para a avaliação no Google', async ({ page }) => {
  await page.route('https://www.google.com/**', (r) => r.fulfill({ status: 200, body: 'google' }));
  await page.goto('/avaliar');
  await page.waitForURL(/google\.com\/search.*#lrd=0x94ce42600eb7bcaf:0x491b7e07925c034e,3/);
});

test('404 personalizado com links para os produtos', async ({ page }) => {
  const res = await page.goto('/pagina-que-nao-existe');
  expect(res?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('#conteudo a[href="/seguro-auto"]')).toBeAttached();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
});

test('redirecionamentos do site antigo', async ({ request }) => {
  const map: [string, string][] = [
    ['/servicos', '/#produtos'],
    ['/contato', '/#contato'],
    ['/portugal', '/#sobre'],
    ['/planosdesaude', '/plano-de-saude'],
    ['/seguroresidencial', '/seguro-residencial'],
    ['/cotacao-seguro-residencial', '/seguro-residencial'],
    ['/cotacao-seguro-vida', '/seguro-de-vida'],
    ['/seguroaluguel', '/fianca-locaticia'],
    ['/seguro-viagem', '/#produtos'],
    ['/cotacao-seguro-viagem', '/#produtos'],
    ['/seguro-empresarial', '/#produtos'],
  ];
  for (const [from, to] of map) {
    const res = await request.get(from, { maxRedirects: 0 });
    expect(res.status(), from).toBe(301);
    expect(res.headers()['location'], from).toBe(to);
  }
});

test('sitemap lista as páginas públicas', async ({ request }) => {
  const res = await request.get('/sitemap.xml');
  expect(res.status()).toBe(200);
  const xml = await res.text();
  for (const p of ['/', '/seguro-auto', '/consorcio', '/ja-sou-cliente', '/privacidade']) {
    expect(xml).toContain(`<loc>https://www.portugalcorretora.com.br${p}</loc>`);
  }
  expect(xml).not.toContain('/avaliar');
});
