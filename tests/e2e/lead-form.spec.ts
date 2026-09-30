import { expect, test, type Page } from '@playwright/test';

async function stubOpen(page: Page, returnNull = false) {
  await page.addInitScript((nullWin) => {
    (window as any).__opened = [];
    window.open = ((url: string) => {
      (window as any).__opened.push(url);
      return nullWin ? null : ({ opener: {} } as Window);
    }) as typeof window.open;
  }, returnNull);
}

async function captureApi(page: Page) {
  const bodies: any[] = [];
  await page.route('**/api/lead', async (route) => {
    bodies.push(JSON.parse(route.request().postData() ?? '{}'));
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });
  return bodies;
}

const opened = (page: Page) => page.evaluate(() => (window as any).__opened as string[]);

test('página de produto: envia, abre WhatsApp com a mensagem e mostra confirmação', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-09-28T12:00:00-03:00'));
  await stubOpen(page);
  const bodies = await captureApi(page);
  await page.goto('/seguro-auto?utm_source=meta&utm_campaign=auto-set');

  const form = page.locator('[data-lead-form]');
  await form.getByLabel('Seu nome').fill('Zé & "Cia" 🚗');
  await form.getByLabel('WhatsApp', { exact: true }).pressSequentially('11987654321');
  await expect(form.getByLabel('WhatsApp', { exact: true })).toHaveValue('(11) 98765-4321');
  await form.getByLabel('Modelo e ano do carro').fill('Onix 2021');
  await form.getByRole('button', { name: 'Falar com um especialista' }).click();

  const urls = await opened(page);
  expect(urls).toHaveLength(1);
  expect(urls[0]).toMatch(/^https:\/\/wa\.me\/5511938052598\?text=/);
  expect(new URL(urls[0]).searchParams.get('text')).toBe(
    'Olá! Sou Zé & "Cia" 🚗. Vim pelo site e quero falar sobre Seguro Auto (Onix 2021).',
  );

  await expect.poll(() => bodies.length).toBe(1);
  expect(bodies[0]).toMatchObject({
    produto: 'seguro-auto',
    detalhes: { veiculo: 'Onix 2021' },
    pagina: '/seguro-auto',
    utm: { utm_source: 'meta', utm_campaign: 'auto-set' },
    website: '',
  });
  await expect(page.locator('[data-lead-success]')).toBeVisible();
  await expect(page.locator('[data-success-fallback]')).toHaveAttribute('href', urls[0]);
  await expect(page.locator('[data-success-hours]')).not.toContainText('próximo dia útil');
});

test('campos vazios mostram erros e não enviam', async ({ page }) => {
  await stubOpen(page);
  const bodies = await captureApi(page);
  await page.goto('/seguro-auto');
  await page.getByRole('button', { name: 'Falar com um especialista' }).click();
  await expect(page.locator('[data-error-for="nome"]')).toHaveText('Informe seu nome.');
  await expect(page.locator('[data-error-for="whatsapp"]')).toContainText('DDD');
  await expect(page.locator('[data-error-for="detalhes.veiculo"]')).not.toBeEmpty();
  await expect(page.getByLabel('Seu nome')).toBeFocused();
  await expect(page.getByLabel('Seu nome')).toHaveAttribute('aria-invalid', 'true');
  expect(await opened(page)).toHaveLength(0);
  expect(bodies).toHaveLength(0);
});

test('fora do horário mostra aviso de retorno no próximo dia útil', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-10-03T10:00:00-03:00')); // sábado
  await stubOpen(page);
  await captureApi(page);
  await page.goto('/seguro-de-vida');
  await page.getByLabel('Seu nome').fill('Ana');
  await page.getByLabel('WhatsApp', { exact: true }).fill('11987654321');
  await page.getByLabel('Modalidade').selectOption('Individual');
  await page.getByRole('button', { name: 'Falar com um especialista' }).click();
  await expect(page.locator('[data-success-hours]')).toHaveText(
    'Recebemos seu contato! Nosso atendimento funciona de segunda a sexta, das 8h às 20h. Retornamos no próximo dia útil.',
  );
});

test('navegador interno bloqueia window.open: navega para o WhatsApp na mesma aba', async ({ page }) => {
  await stubOpen(page, true);
  await captureApi(page);
  await page.route('https://wa.me/**', (route) => route.fulfill({ status: 200, body: 'wa' }));
  await page.goto('/seguro-de-vida');
  await page.getByLabel('Seu nome').fill('Ana');
  await page.getByLabel('WhatsApp', { exact: true }).fill('11987654321');
  await page.getByLabel('Modalidade').selectOption('Empresarial');
  await page.getByRole('button', { name: 'Falar com um especialista' }).click();
  await page.waitForURL(/wa\.me\/5511938052598/);
});

test('clique duplo envia uma única vez', async ({ page }) => {
  await stubOpen(page);
  const bodies = await captureApi(page);
  await page.goto('/seguro-de-vida');
  await page.getByLabel('Seu nome').fill('Ana');
  await page.getByLabel('WhatsApp', { exact: true }).fill('11987654321');
  await page.getByLabel('Modalidade').selectOption('Individual');
  await page.getByRole('button', { name: 'Falar com um especialista' }).dblclick();
  await expect.poll(() => bodies.length).toBe(1);
  expect(await opened(page)).toHaveLength(1);
});

test('home: escolher o produto mostra os campos certos e o UTM da chegada é mantido', async ({ page }) => {
  await stubOpen(page);
  const bodies = await captureApi(page);
  await page.goto('/?utm_campaign=auto-set'); // chegada pelo anúncio
  await page.goto('/'); // nova navegação, sem UTM na URL
  const form = page.locator('#contato [data-lead-form]');
  await expect(form.locator('[data-product-fields="seguro-residencial"]')).toBeHidden();
  await form.locator('[data-product-select]').selectOption('seguro-residencial');
  await expect(form.locator('[data-product-fields="seguro-residencial"]')).toBeVisible();
  await expect(form.locator('[data-product-fields="seguro-auto"]')).toBeHidden();
  await form.getByLabel('Seu nome').fill('Ana');
  await form.getByLabel('WhatsApp', { exact: true }).fill('+55 11 98765-4321');
  await form.getByLabel('Tipo de imóvel').selectOption('Apartamento');
  await form.getByLabel('O imóvel é').selectOption('Alugado');
  await form.getByRole('button', { name: 'Falar com um especialista' }).click();
  await expect.poll(() => bodies.length).toBe(1);
  expect(bodies[0].utm).toEqual({ utm_campaign: 'auto-set' });
  expect(bodies[0].detalhes).toEqual({ imovel: 'Apartamento', situacao: 'Alugado' });
  expect(new URL((await opened(page))[0]).searchParams.get('text')).toContain('Seguro Residencial (Apartamento, Alugado)');
  await expect(page.locator('#contato [data-lead-success]')).toBeVisible();
  await expect(form).toBeHidden(); // o formulário some e fica só a confirmação
});

test('home: o erro de um campo some assim que a pessoa corrige', async ({ page }) => {
  await stubOpen(page);
  await captureApi(page);
  await page.goto('/');
  const form = page.locator('#contato [data-lead-form]');
  await form.getByRole('button', { name: 'Falar com um especialista' }).click();
  await expect(form.locator('[data-error-for="nome"]')).toHaveText('Informe seu nome.');
  await form.getByLabel('Seu nome').fill('Ana');
  await expect(form.locator('[data-error-for="nome"]')).toBeEmpty();
  await expect(form.getByLabel('Seu nome')).not.toHaveAttribute('aria-invalid', 'true');
  await expect(form.locator('[data-error-for="whatsapp"]')).not.toBeEmpty(); // os outros erros continuam
  await form.locator('[data-product-select]').selectOption('consorcio');
  await expect(form.locator('[data-error-for="produto"]')).toBeEmpty();
});

test('home: campo com o mesmo nome em dois produtos marca o erro no produto escolhido', async ({ page }) => {
  await stubOpen(page);
  await captureApi(page);
  await page.goto('/');
  const form = page.locator('#contato [data-lead-form]');
  await form.locator('[data-product-select]').selectOption('seguro-empresarial');
  await form.getByLabel('Seu nome').fill('Ana');
  await form.getByLabel('WhatsApp', { exact: true }).fill('11987654321');
  await form.getByLabel('Ramo da empresa').fill('Padaria');
  await form.getByRole('button', { name: 'Falar com um especialista' }).click();
  const empresarial = form.getByLabel('O imóvel da empresa é');
  await expect(empresarial).toHaveAttribute('aria-invalid', 'true');
  await expect(empresarial).toBeFocused();
  await expect(form.locator('[data-product-fields="seguro-empresarial"] [data-error-for="detalhes.imovel"]')).not.toBeEmpty();
  await empresarial.selectOption('Alugado');
  await expect(form.locator('[data-product-fields="seguro-empresarial"] [data-error-for="detalhes.imovel"]')).toBeEmpty();
});

test('sem internet mostra aviso e mantém os dados', async ({ page, context }) => {
  await stubOpen(page);
  await page.goto('/seguro-de-vida');
  await page.getByLabel('Seu nome').fill('Ana');
  await page.getByLabel('WhatsApp', { exact: true }).fill('11987654321');
  await page.getByLabel('Modalidade').selectOption('Individual');
  await context.setOffline(true);
  await page.getByRole('button', { name: 'Falar com um especialista' }).click();
  await expect(page.locator('[data-form-status]')).toContainText('sem internet');
  await expect(page.getByLabel('Seu nome')).toHaveValue('Ana');
  expect(await opened(page)).toHaveLength(0);
  await context.setOffline(false);
});
