import { test } from '@playwright/test';

test.setTimeout(60000);
// Prints com "reduzir movimento": a página fica no estado final, sem depender de animações.
// (O navegador sem janela não desenha quadros durante a rolagem automática no desktop; as animações têm testes próprios.)
test.use({ reducedMotion: 'reduce' });

// Gera prints de página inteira de todas as rotas (desktop 1440 e celular 390) em test-results/screens.
// Rode com: npx playwright test tests/e2e/screenshots.spec.ts
const PAGES = [
  '/',
  '/seguro-auto',
  '/seguro-residencial',
  '/plano-de-saude',
  '/consorcio',
  '/fianca-locaticia',
  '/seguro-de-vida',
  '/seguro-viagem',
  '/seguro-empresarial',
  '/ja-sou-cliente',
  '/privacidade',
  '/pagina-inexistente',
];

for (const path of PAGES) {
  test(`print ${path}`, async ({ page }, info) => {
    await page.goto(path);
    // Esconde o aviso de cookies e deixa as seções surgirem antes do print
    await page.evaluate(async () => {
      document.querySelector('[data-cookie-banner]')?.setAttribute('hidden', '');
      // Imagens com carregamento tardio usam o mesmo observador que não roda sem janela: carrega tudo para o print
      document.querySelectorAll('img[loading="lazy"]').forEach((img) => img.setAttribute('loading', 'eager'));
      for (let y = 0; y <= document.body.scrollHeight; y += 500) {
        window.scrollTo({ top: y, behavior: 'instant' });
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    // Espera as seções terminarem de surgir e as imagens carregarem (válido como print de verificação)
    await page.waitForFunction(
      () => !document.querySelector('.reveal-pending') && [...document.images].every((img) => img.complete),
      null,
      { timeout: 10000 },
    );
    await page.waitForTimeout(700);
    const name = path === '/' ? 'home' : path.slice(1);
    await page.screenshot({ path: `test-results/screens/${name}-${info.project.name}.png`, fullPage: true });
  });
}
