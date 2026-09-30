import { expect, test } from '@playwright/test';

test('home: estrutura, WhatsApp e sem rolagem horizontal', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Falar com um especialista' }).first()).toHaveAttribute('href', '#contato');

  const float = page.locator('.wa-float');
  await expect(float).toBeVisible();
  const href = await float.getAttribute('href');
  expect(href).toMatch(/^https:\/\/wa\.me\/5511938052598\?text=/);
  expect(await float.getAttribute('target')).toBe('_blank');

  await expect(page.locator('footer')).toContainText('2022910');
  await expect(page.locator('footer')).toContainText('21.427.722/0001-05');

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test('mobile: botão principal visível sem rolar', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'só no celular');
  await page.goto('/');
  const cta = page.getByRole('link', { name: 'Falar com um especialista' }).first();
  await expect(cta).toBeInViewport();
});

test('mobile: menu abre e fecha', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'só no celular');
  await page.goto('/');
  const toggle = page.locator('[data-menu-toggle]');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});
