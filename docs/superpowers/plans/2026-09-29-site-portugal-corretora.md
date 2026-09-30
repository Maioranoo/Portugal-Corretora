# Site Portugal Corretora: plano de implementação

> **Para agentes:** SUB-SKILL OBRIGATÓRIA: use superpowers:executing-plans para implementar este plano tarefa por tarefa. Esse é o método definido no CLAUDE.md do projeto. Os passos usam caixas de seleção (`- [ ]`) para acompanhamento. **Ao fim de cada tarefa, relate ao cliente o que foi feito e aguarde antes de seguir.**

**Objetivo:** construir o site institucional da Portugal Corretora (home, 6 páginas de produto e páginas de apoio), rápido no celular, que converta visitantes vindos de anúncios em contatos pelo WhatsApp e por e-mail, e pronto para o Pixel da Meta e para a LGPD.

**Arquitetura:** Astro 7 gerando páginas estáticas, publicado na Vercel. Há uma única função serverless (`/api/lead`), que valida o pedido e envia o e-mail pelo Resend. A lógica de negócio fica em módulos TypeScript puros em `src/lib/`, testados com Vitest e compartilhados entre o navegador e o servidor. Todo o conteúdo editável fica em `src/content/`.

**Stack:**

| Componente | Versão |
|---|---|
| Node | 22.15 (mínimo 22.12) |
| astro | ^7.3.5 |
| @astrojs/vercel | ^11.0.11 |
| resend | ^6.31.0 |
| @vercel/analytics | ^2.0.1 |
| vitest | ^5.0.2 |
| @playwright/test | ^1.63.0 |
| CSS | escrito à mão |

**Spec:** `docs/superpowers/specs/2026-09-29-site-portugal-corretora-design.md`. Leia a spec junto com este plano.

## Restrições globais

### Idioma e textos
- Todo o texto visível ao usuário é em português do Brasil, com `<html lang="pt-BR">`.
- Identificadores de código em inglês. Slugs e nomes de campo do formulário em português.
- É proibido usar promessas absolutas nos textos: "os melhores preços", "menor preço", "garantido/garantida" e "atendimento 24h" (atendimento da corretora). Use "comparamos mais de 10 seguradoras para encontrar o melhor preço para você". Exceção: "assistência 24h" é permitido quando se refere ao serviço da seguradora.
- O texto do botão do formulário é sempre **"Falar com um especialista"**. Nunca use "cotação" num botão.

### Dados da corretora (valores exatos)
- WhatsApp: `5511938052598`, exibido como `(11) 93805-2598`
- E-mail de destino: `atendimento@portugalcorretora.com.br`
- SUSEP: `2022910`
- CNPJ: `21.427.722/0001-05`
- Endereço: `Av. Portugal, 1285 – Jardim Bela Vista, Santo André – SP, 09040-011`
- Horário: segunda a sexta, das 8h às 20h, fuso `America/Sao_Paulo`
- Google: 4,8 com 19 avaliações
- Números ainda desconhecidos usam o marcador literal `1000`
- Razão social desconhecida usa o marcador `[RAZÃO SOCIAL]`

### Cores
- Cor principal: `#003780`
- Verde do WhatsApp só em botões de WhatsApp

### Dependências e ferramentas
- **Dependências aprovadas:** `astro`, `@astrojs/vercel`, `resend`, `@vercel/analytics` e, só em desenvolvimento, `vitest` e `@playwright/test`.
- **Propostas neste plano, pendentes de aprovação do cliente:** `typescript` e `@astrojs/check` (desenvolvimento, para checar tipos). Qualquer outra dependência exige aviso e aprovação prévia.
- **Ferramentas fora do projeto que exigem aprovação antes do uso:** o navegador Chromium do Playwright (`npx playwright install chromium`), `pip install pymupdf` (para converter o logo `.ai` em SVG) e `npx lighthouse`.
- **Proibido:** Tailwind, biblioteca de componentes, biblioteca de ícones e Google Fonts via CDN.

### Astro 7
- O compilador Rust rejeita HTML inválido. Feche todas as tags não-vazias e não aninhe elementos inválidos, como `<div>` dentro de `<p>` ou `<a>` dentro de `<a>`.
- `compressHTML` passa a ser `'jsx'`: espaços entre elementos inline são removidos. Use `{" "}` onde o espaço for necessário.
- Variáveis de ambiente só via `astro:env`, nunca `import.meta.env` para segredos.

### Metas de desempenho e acessibilidade
- Lighthouse para celular ≥ 95
- LCP < 2,0 s
- CLS < 0,05
- JavaScript < 30 KB por página
- WCAG AA, áreas de toque de no mínimo 44px e `prefers-reduced-motion` respeitado

### Dados pessoais
- Nenhum dado pessoal é armazenado nem registrado em log (nome, telefone e detalhes nunca vão para o `console`).
- Segredos só em variáveis de ambiente.

### Skills da interface
- impeccable: base de design.
- design-taste-frontend: direção visual.
- emil-design-eng: animações.
- Proibidas: as skills listadas no CLAUDE.md.

### Verificação visual
Ao terminar cada página ou mudança visual relevante:
- tirar prints com o Playwright em 1440px e 390px;
- analisar os prints;
- corrigir o que estiver errado.

## Pontos de atenção na revisão

1. **Telefone digitado em formatos variados** (`+55 11 9…`, `011…`, com espaços ou traços, fixo com 10 dígitos, sem DDD). O esperado é normalizar para `DDD+número` ou mostrar um erro claro. Nunca aceitar um número inválido.
   - Testes: Tarefa 2 (`normalizeBrPhone`) e Tarefa 9 (máscara no e2e).
2. **Acentos, emoji, `&`, aspas e HTML** (`<b>`, `<script>`) no nome ou nos detalhes. O esperado é que a mensagem do WhatsApp chegue idêntica ao que foi digitado e que o e-mail nunca interprete HTML.
   - Testes: Tarefa 2 (codificação da URL) e Tarefa 4 (escape no e-mail).
3. **Navegador interno do Instagram ou Facebook bloqueando `window.open`.** O esperado é que o WhatsApp abra mesmo assim, com a navegação na mesma aba, e que o envio aconteça uma única vez, mesmo com toque duplo.
   - Teste: Tarefa 9 (e2e com `window.open` retornando `null` e clique duplo).
4. **`localStorage` e `sessionStorage` indisponíveis** (aba anônima do Safari, navegador interno de apps). O esperado é que nada quebre: o aviso de cookies funciona durante a visita, o formulário envia e o Pixel só carrega após o "Aceitar".
   - Testes: Tarefa 5 (armazenamento que lança erro) e Tarefa 12 (e2e com armazenamento bloqueado).
5. **Visitante que chega pelo anúncio (URL com UTM) e só envia o formulário depois de navegar para outra página.** O esperado é que os UTMs da chegada venham no e-mail.
   - Testes: Tarefa 3 (`captureUtm`) e Tarefa 9 (e2e navegando entre páginas).

---

## Resultados do teste prático (2026-09-29)

Os dois pontos que ficariam para o deploy foram testados num projeto descartável com as mesmas versões (Astro 7.3.5 e @astrojs/vercel 11.0.11), no build de produção, no `astro dev`, executando a função gerada e simulando o roteamento da Vercel:

- **Redirecionamentos do Astro** (`redirects` no config) viram rotas no `.vercel/output/config.json`:
  - com status 301 por padrão (ou o status informado, como `302`);
  - **preservando o fragmento** (`/servicos` → `/#produtos`);
  - aceitando **URL externa** com fragmento (Google `#lrd=…,3`).
- No `astro dev`, os redirecionamentos respondem 301 com o mesmo `location`. Com barra no final (`/servicos/`), o dev responde 404, mas em produção a regra 308 da Vercel remove a barra e o redirecionamento acontece normalmente.
- **O `vercel.json` não aparece na saída de build do adaptador** e não há garantia documentada de que a Vercel o aplique. Solução adotada: a integração local `integrations/security-headers.mjs` (sem dependência) insere a rota de headers no começo do `config.json` depois que o adaptador o escreve. Isso foi verificado no build e na simulação de roteamento; os headers valem para todas as páginas, a API e os redirecionamentos.
- **Origem na API:** executando a função gerada com requisições simuladas:
  - `request.url` usa o domínio público (www, sem www e `*.vercel.app`);
  - um `x-forwarded-host` forjado é ignorado;
  - a proteção embutida do Astro (`checkOrigin`) **só barra envios de formulário tradicionais, não JSON**. A verificação própria `isSameOrigin` da Tarefa 4 continua necessária.

## Estrutura de arquivos

```
astro.config.mjs            configuração do Astro, do adaptador Vercel, do astro:env e dos redirecionamentos
package.json                scripts e dependências
tsconfig.json               TypeScript estrito do Astro
vitest.config.ts            testes unitários (tests/unit)
playwright.config.ts        testes e2e (tests/e2e) contra `astro dev`
integrations/security-headers.mjs  escreve os headers de segurança no .vercel/output/config.json após o build
vitest.build.config.ts      testes da saída de build (tests/build)
.env.example                variáveis de ambiente documentadas (sem valores reais)
.gitignore
README.md                   como rodar, testar, editar o conteúdo e publicar
scripts/serve-static.mjs    servidor estático local para medir desempenho no build final
public/
  robots.txt  favicon.svg  favicon-32.png  apple-touch-icon.png  icon-512.png  og.jpg
  fonts/*.woff2
src/
  content/
    contact.ts              número do WhatsApp e dados mínimos (importável no navegador)
    product-fields.ts       slugs, nomes e campos de formulário dos 6 produtos (importável no navegador)
    insurers.ts             12 seguradoras: nome, logo e telefone de assistência
    products.ts             textos completos dos 6 produtos (só no build)
    site.ts                 corretora, números, diferenciais, perguntas gerais, depoimentos
  lib/
    phone.ts                normalizar, formatar e mascarar telefone brasileiro
    whatsapp.ts             mensagens e URLs do wa.me
    business-hours.ts       dentro ou fora do horário de atendimento
    utm.ts                  capturar e sanitizar UTMs
    lead.ts                 validar o pedido (navegador e servidor)
    lead-email.ts           escapar HTML e montar o e-mail do pedido
    lead-handler.ts         tratar a requisição de /api/lead (sem Astro, testável)
    consent.ts              ler e gravar o consentimento de cookies
    meta-pixel.ts           carregar o Pixel e disparar eventos
  scripts/
    lead-form.ts            comportamento do formulário no navegador
    cookie-consent.ts       aviso de cookies e ativação do Pixel
    tracking.ts             evento Contact nos botões de WhatsApp
    header.ts               menu no celular
  styles/
    tokens.css              variáveis de design
    global.css              reset, tipografia base e utilitários mínimos
  layouts/BaseLayout.astro
  components/
    Header.astro  Footer.astro  WhatsAppFloat.astro  CookieBanner.astro  LeadForm.astro
    Hero.astro  ProductGrid.astro  Steps.astro  Differentials.astro  Stats.astro
    InsurerLogos.astro  Reviews.astro  About.astro  ClientStrip.astro  Faq.astro  FinalCta.astro
    TrustBadges.astro  Icon.astro
  assets/
    brand/                  logo usado no site
    insurers/               logos das seguradoras
    photos/                 fotos, com CREDITOS.md
  pages/
    index.astro  [produto].astro  ja-sou-cliente.astro  privacidade.astro  404.astro
    sitemap.xml.ts
    api/lead.ts
tests/
  unit/*.test.ts
  build/*.test.ts           confere a saída de build da Vercel (headers e redirecionamentos)
  e2e/*.spec.ts
```

---

### Tarefa 1: Base do projeto

**Arquivos:**
- Criar:
  - `package.json`
  - `astro.config.mjs`
  - `tsconfig.json`
  - `vitest.config.ts`
  - `playwright.config.ts`
  - `.gitignore`
  - `.env.example`
  - `src/pages/index.astro` (provisório)
  - `tests/e2e/smoke.spec.ts`
  - `tests/unit/smoke.test.ts`
- Versionar: `CLAUDE.md` e `brand/`

**Interfaces:**
- Produz os scripts `npm run dev`, `build`, `test`, `test:e2e` e `check`.
- Produz no `astro:env`:
  - `RESEND_API_KEY` (servidor, secreto, opcional)
  - `LEAD_TO_EMAIL` (servidor, com valor padrão)
  - `LEAD_FROM_EMAIL` (servidor, com valor padrão)
  - `PUBLIC_META_PIXEL_ID` (cliente, público, opcional)

- [ ] **Passo 1: Pedir aprovação ao cliente** para as dependências de desenvolvimento `typescript` e `@astrojs/check` e para baixar o Chromium do Playwright (cerca de 150 MB). Se ele não aprovar a checagem de tipos, remova o script `check` e siga.

- [ ] **Passo 2: Criar o `package.json`**

```json
{
  "name": "portugal-corretora-site",
  "private": true,
  "type": "module",
  "engines": { "node": ">=22.12.0" },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "check": "astro check",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "serve:static": "node scripts/serve-static.mjs"
  }
}
```

- [ ] **Passo 3: Instalar as dependências**

```bash
npm install astro@^7.3.5 @astrojs/vercel@^11.0.11 resend@^6.31.0 @vercel/analytics@^2.0.1
npm install -D vitest@^5.0.2 @playwright/test@^1.63.0 typescript @astrojs/check
npx playwright install chromium
```

Esperado: a instalação termina sem erros de peer dependency.

- [ ] **Passo 4: Criar o `astro.config.mjs`**

```js
import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://www.portugalcorretora.com.br',
  output: 'static',
  adapter: vercel(),
  trailingSlash: 'never',
  vite: { build: { assetsInlineLimit: 0 } },
  env: {
    schema: {
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      LEAD_TO_EMAIL: envField.string({
        context: 'server',
        access: 'secret',
        default: 'atendimento@portugalcorretora.com.br',
      }),
      LEAD_FROM_EMAIL: envField.string({
        context: 'server',
        access: 'secret',
        default: 'Site Portugal Corretora <site@portugalcorretora.com.br>',
      }),
      PUBLIC_META_PIXEL_ID: envField.string({ context: 'client', access: 'public', optional: true }),
    },
  },
});
```

- [ ] **Passo 5: Criar o `tsconfig.json`, o `vitest.config.ts`, o `.gitignore` e o `.env.example`**

`tsconfig.json`:
```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist", ".vercel"]
}
```

`vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: { include: ['tests/unit/**/*.test.ts'], environment: 'node' },
});
```

`.gitignore`:
```
node_modules/
dist/
.vercel/
.astro/
.env
.env.*
!.env.example
test-results/
playwright-report/
.playwright-mcp/
```

`.env.example`:
```
# Chave da API do Resend (painel do Resend → API Keys). Sem ela, em desenvolvimento o e-mail é só exibido no terminal.
RESEND_API_KEY=
# Quem recebe os pedidos (padrão: atendimento@portugalcorretora.com.br)
LEAD_TO_EMAIL=
# Remetente; precisa ser de um domínio verificado no Resend
LEAD_FROM_EMAIL=
# ID do Pixel da Meta (Gerenciador de Eventos). Vazio = Pixel desligado.
PUBLIC_META_PIXEL_ID=
```

- [ ] **Passo 6: Criar o `playwright.config.ts`**

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  retries: 0,
  use: { baseURL: 'http://localhost:4321', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    {
      name: 'mobile',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 3,
      },
    },
  ],
  webServer: {
    command: 'npm run dev -- --port 4321',
    url: 'http://localhost:4321',
    reuseExistingServer: true,
    env: { PUBLIC_META_PIXEL_ID: '1234567890123456' },
  },
});
```

- [ ] **Passo 7: Criar a página provisória e os testes de fumaça**

`src/pages/index.astro`:
```astro
---
---
<html lang="pt-BR">
  <head><meta charset="utf-8" /><title>Portugal Corretora de Seguros</title></head>
  <body><h1>Portugal Corretora de Seguros</h1></body>
</html>
```

`tests/unit/smoke.test.ts`:
```ts
import { expect, test } from 'vitest';

test('vitest roda', () => {
  expect(1 + 1).toBe(2);
});
```

`tests/e2e/smoke.spec.ts`:
```ts
import { expect, test } from '@playwright/test';

test('home responde com um único h1', async ({ page }) => {
  const res = await page.goto('/');
  expect(res?.status()).toBe(200);
  await expect(page.locator('h1')).toHaveCount(1);
});
```

- [ ] **Passo 8: Rodar tudo**

Rode:
```bash
npm test
npm run test:e2e
npm run build
```

Esperado:
- `npm test`: 1 teste passou.
- `npm run test:e2e`: 2 testes passaram (desktop e mobile).
- `npm run build`: termina sem erro e cria `.vercel/output/static/index.html`.

Se o build falhar por causa do adaptador ou do `astro:env`, use a skill superpowers:systematic-debugging antes de mudar qualquer configuração.

- [ ] **Passo 9: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json vitest.config.ts playwright.config.ts .gitignore .env.example src tests CLAUDE.md brand
git commit -m "chore: base do projeto com Astro, Vercel, Vitest e Playwright"
```

- [ ] **Passo 10: Relatar ao cliente.** Conte o que foi instalado e por quê, e mostre as saídas do build e dos testes.

---

### Tarefa 2: Telefone, WhatsApp e horário de atendimento

**Arquivos:**
- Criar:
  - `src/content/contact.ts`
  - `src/lib/phone.ts`
  - `src/lib/whatsapp.ts`
  - `src/lib/business-hours.ts`
- Testes:
  - `tests/unit/phone.test.ts`
  - `tests/unit/whatsapp.test.ts`
  - `tests/unit/business-hours.test.ts`

**Interfaces (produz):**
```ts
// contact.ts
export const WHATSAPP_NUMBER = '5511938052598';
export const WHATSAPP_DISPLAY = '(11) 93805-2598';

// phone.ts
export function normalizeBrPhone(input: string): string | null; // 'DDD+número' com 10 ou 11 dígitos, ou null
export function formatBrPhone(digits: string): string;           // '(11) 98765-4321' | '(11) 3456-7890'
export function maskBrPhoneInput(raw: string): string;           // formatação parcial enquanto a pessoa digita

// whatsapp.ts
export function buildLeadMessage(args: { nome: string; cidade?: string; productName: string; detalhes: string[] }): string;
export function buildGenericMessage(productName?: string): string;
export function buildWhatsAppUrl(phone: string, message: string): string;

// business-hours.ts
export interface BusinessHours { timeZone: string; openHour: number; closeHour: number; days: readonly number[] }
export const DEFAULT_HOURS: BusinessHours;
export function isWithinBusinessHours(date: Date, hours?: BusinessHours): boolean;
```

- [ ] **Passo 1: Escrever os testes que devem falhar**

`tests/unit/phone.test.ts`:
```ts
import { describe, expect, test } from 'vitest';
import { formatBrPhone, maskBrPhoneInput, normalizeBrPhone } from '../../src/lib/phone';

describe('normalizeBrPhone', () => {
  test.each([
    ['(11) 98765-4321', '11987654321'],
    ['11987654321', '11987654321'],
    ['+55 11 98765-4321', '11987654321'],
    ['5511987654321', '11987654321'],
    ['011987654321', '11987654321'],
    ['  11 9 8765 4321 ', '11987654321'],
    ['(11) 3456-7890', '1134567890'],
    ['551134567890', '1134567890'],
  ])('%s → %s', (input, expected) => {
    expect(normalizeBrPhone(input)).toBe(expected);
  });

  test.each([
    [''],
    ['abc'],
    ['987654321'],      // sem DDD
    ['00987654321'],    // DDD inválido
    ['10987654321'],    // DDD inválido (segundo dígito 0)
    ['11887654321'],    // 11 dígitos sem o 9 inicial
    ['119876543210'],   // dígitos demais
  ])('%s é inválido', (input) => {
    expect(normalizeBrPhone(input)).toBeNull();
  });
});

describe('formatBrPhone', () => {
  test('celular', () => expect(formatBrPhone('11987654321')).toBe('(11) 98765-4321'));
  test('fixo', () => expect(formatBrPhone('1134567890')).toBe('(11) 3456-7890'));
});

describe('maskBrPhoneInput', () => {
  test.each([
    ['', ''],
    ['1', '(1'],
    ['11', '(11'],
    ['119', '(11) 9'],
    ['1198765', '(11) 9876-5'],
    ['1134567890', '(11) 3456-7890'],
    ['11987654321', '(11) 98765-4321'],
    ['119876543219999', '(11) 98765-4321'],
    ['(11) 98765-4321', '(11) 98765-4321'],
  ])('%s → %s', (raw, expected) => {
    expect(maskBrPhoneInput(raw)).toBe(expected);
  });
});
```

`tests/unit/whatsapp.test.ts`:
```ts
import { describe, expect, test } from 'vitest';
import { buildGenericMessage, buildLeadMessage, buildWhatsAppUrl } from '../../src/lib/whatsapp';

describe('buildLeadMessage', () => {
  test('com cidade e detalhes', () => {
    expect(
      buildLeadMessage({ nome: 'João', cidade: 'Santo André', productName: 'Seguro Auto', detalhes: ['Onix 2021'] }),
    ).toBe('Olá! Sou João, de Santo André. Vim pelo site e quero falar sobre Seguro Auto (Onix 2021).');
  });
  test('sem cidade, com dois detalhes', () => {
    expect(
      buildLeadMessage({ nome: 'Ana', productName: 'Seguro Residencial', detalhes: ['Apartamento', 'Alugado'] }),
    ).toBe('Olá! Sou Ana. Vim pelo site e quero falar sobre Seguro Residencial (Apartamento, Alugado).');
  });
  test('sem detalhes', () => {
    expect(buildLeadMessage({ nome: 'Ana', productName: 'Consórcio', detalhes: [] })).toBe(
      'Olá! Sou Ana. Vim pelo site e quero falar sobre Consórcio.',
    );
  });
});

describe('buildGenericMessage', () => {
  test('sem produto', () =>
    expect(buildGenericMessage()).toBe('Olá! Vim pelo site da Portugal Corretora e gostaria de atendimento.'));
  test('com produto', () =>
    expect(buildGenericMessage('Plano de Saúde')).toBe(
      'Olá! Vim pelo site da Portugal Corretora e quero falar sobre Plano de Saúde.',
    ));
});

describe('buildWhatsAppUrl', () => {
  test('codifica acentos, emoji, & e aspas sem perder nada', () => {
    const msg = 'Olá! Sou Zé & "Cia" 🚗 <b>, ação';
    const url = buildWhatsAppUrl('5511938052598', msg);
    expect(url.startsWith('https://wa.me/5511938052598?text=')).toBe(true);
    expect(new URL(url).searchParams.get('text')).toBe(msg);
  });
});
```

`tests/unit/business-hours.test.ts`:
```ts
import { describe, expect, test } from 'vitest';
import { isWithinBusinessHours } from '../../src/lib/business-hours';

// 2026-09-28 é segunda-feira; 2026-10-02 é sexta; 2026-10-03 é sábado; 2026-10-04 é domingo.
describe('isWithinBusinessHours (America/Sao_Paulo, seg–sex 8h–20h)', () => {
  test.each([
    ['2026-09-28T12:00:00-03:00', true],
    ['2026-09-28T07:59:00-03:00', false],
    ['2026-09-28T08:00:00-03:00', true],
    ['2026-09-28T19:59:00-03:00', true],
    ['2026-09-28T20:00:00-03:00', false],
    ['2026-10-02T19:30:00-03:00', true],
    ['2026-10-02T20:30:00-03:00', false],
    ['2026-10-03T10:00:00-03:00', false],
    ['2026-10-04T10:00:00-03:00', false],
    ['2026-09-28T22:30:00Z', true],  // 19h30 em São Paulo
    ['2026-09-28T23:00:00Z', false], // 20h00 em São Paulo
    ['2026-09-29T02:00:00+09:00', true],  // visitante no Japão (terça 2h lá) = segunda 14h em SP: vale o fuso de SP
  ])('%s → %s', (iso, expected) => {
    expect(isWithinBusinessHours(new Date(iso))).toBe(expected);
  });
});
```

- [ ] **Passo 2: Rodar e confirmar que falham**

Rode: `npx vitest run tests/unit/phone.test.ts tests/unit/whatsapp.test.ts tests/unit/business-hours.test.ts`
Esperado: FALHA, com "Failed to resolve import".

- [ ] **Passo 3: Implementar**

`src/content/contact.ts`:
```ts
export const WHATSAPP_NUMBER = '5511938052598';
export const WHATSAPP_DISPLAY = '(11) 93805-2598';
```

`src/lib/phone.ts`:
```ts
const onlyDigits = (s: string) => s.replace(/\D/g, '');

function stripPrefixes(digits: string): string {
  let d = digits;
  if ((d.length === 12 || d.length === 13) && d.startsWith('55')) d = d.slice(2);
  if ((d.length === 11 || d.length === 12) && d.startsWith('0')) d = d.slice(1);
  return d;
}

export function normalizeBrPhone(input: string): string | null {
  const d = stripPrefixes(onlyDigits(input));
  if (d.length !== 10 && d.length !== 11) return null;
  if (!/^[1-9][1-9]/.test(d)) return null;
  if (d.length === 11 && d[2] !== '9') return null;
  return d;
}

export function formatBrPhone(digits: string): string {
  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);
  const split = rest.length === 9 ? 5 : 4;
  return `(${ddd}) ${rest.slice(0, split)}-${rest.slice(split)}`;
}

export function maskBrPhoneInput(raw: string): string {
  const d = onlyDigits(raw).slice(0, 11);
  if (d.length === 0) return '';
  if (d.length <= 2) return `(${d}`;
  const ddd = d.slice(0, 2);
  const rest = d.slice(2);
  const split = rest.length > 8 ? 5 : 4;
  if (rest.length <= split) return `(${ddd}) ${rest}`;
  return `(${ddd}) ${rest.slice(0, split)}-${rest.slice(split)}`;
}
```

Confira a máscara contra os casos do teste:
- `1198765` gera rest `98765` com 5 dígitos. Como `5 > 8` é falso, split é 4 e o resultado é `(11) 9876-5`, como o teste espera.
- `11987654321` gera rest com 9 dígitos, split 5 e resultado `(11) 98765-4321`, como o teste espera.

`src/lib/whatsapp.ts`:
```ts
export function buildLeadMessage(args: {
  nome: string;
  cidade?: string;
  productName: string;
  detalhes: string[];
}): string {
  const origem = args.cidade ? `, de ${args.cidade}` : '';
  const extra = args.detalhes.length ? ` (${args.detalhes.join(', ')})` : '';
  return `Olá! Sou ${args.nome}${origem}. Vim pelo site e quero falar sobre ${args.productName}${extra}.`;
}

export function buildGenericMessage(productName?: string): string {
  return productName
    ? `Olá! Vim pelo site da Portugal Corretora e quero falar sobre ${productName}.`
    : 'Olá! Vim pelo site da Portugal Corretora e gostaria de atendimento.';
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
```

`src/lib/business-hours.ts`:
```ts
export interface BusinessHours {
  timeZone: string;
  openHour: number;
  closeHour: number;
  days: readonly number[]; // 0 = domingo … 6 = sábado
}

export const DEFAULT_HOURS: BusinessHours = {
  timeZone: 'America/Sao_Paulo',
  openHour: 8,
  closeHour: 20,
  days: [1, 2, 3, 4, 5],
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function isWithinBusinessHours(date: Date, hours: BusinessHours = DEFAULT_HOURS): boolean {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: hours.timeZone,
    weekday: 'short',
    hour: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const day = WEEKDAYS.indexOf(parts.find((p) => p.type === 'weekday')?.value ?? '');
  const hour = Number(parts.find((p) => p.type === 'hour')?.value);
  return hours.days.includes(day) && hour >= hours.openHour && hour < hours.closeHour;
}
```

- [ ] **Passo 4: Rodar e confirmar que passam**

Rode: `npx vitest run tests/unit/phone.test.ts tests/unit/whatsapp.test.ts tests/unit/business-hours.test.ts`
Esperado: todos os testes passam.

- [ ] **Passo 5: Commit**

```bash
git add src/content/contact.ts src/lib/phone.ts src/lib/whatsapp.ts src/lib/business-hours.ts tests/unit
git commit -m "feat: telefone, mensagens do WhatsApp e horário de atendimento"
```

- [ ] **Passo 6: Relatar ao cliente.** Mostre exemplos de mensagens geradas e o resultado dos testes.

---

### Tarefa 3: Campos dos produtos, validação do pedido e UTM

**Arquivos:**
- Criar:
  - `src/content/product-fields.ts`
  - `src/lib/utm.ts`
  - `src/lib/lead.ts`
- Testes:
  - `tests/unit/utm.test.ts`
  - `tests/unit/lead.test.ts`

**Interfaces:**
- Consome: `normalizeBrPhone` (Tarefa 2).
- Produz:
```ts
// product-fields.ts
export const PRODUCT_SLUGS: readonly ['seguro-auto','seguro-residencial','plano-de-saude','consorcio','fianca-locaticia','seguro-de-vida'];
export type ProductSlug = (typeof PRODUCT_SLUGS)[number];
export type ProductField =
  | { id: string; label: string; kind: 'select'; options: readonly string[] }
  | { id: string; label: string; kind: 'text'; placeholder: string; maxLength: number };
export interface ProductForm { slug: ProductSlug; name: string; fields: readonly ProductField[] }
export const PRODUCT_FORMS: Record<ProductSlug, ProductForm>;
export function isProductSlug(v: unknown): v is ProductSlug;

// utm.ts
export const UTM_KEYS: readonly ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
export type UtmKey = (typeof UTM_KEYS)[number];
export type Utm = Partial<Record<UtmKey, string>>;
export const UTM_STORAGE_KEY = 'pc-utm';
export function sanitizeUtm(raw: unknown): Utm;
export function parseUtm(search: string): Utm;
export function captureUtm(storage: Pick<Storage, 'getItem' | 'setItem'> | null, search: string): Utm;

// lead.ts
export const LIMITS: { nome: 80; cidade: 60; pagina: 200 };
export interface ValidLead {
  nome: string; whatsapp: string; produto: ProductSlug; produtoNome: string;
  detalhes: { label: string; value: string }[]; cidade?: string; pagina: string; utm: Utm;
}
export type LeadErrors = Record<string, string>; // chaves: nome | whatsapp | produto | cidade | detalhes.<id>
export type LeadValidation = { ok: true; lead: ValidLead } | { ok: false; errors: LeadErrors };
export function validateLead(raw: unknown): LeadValidation;
```

- [ ] **Passo 1: Criar `src/content/product-fields.ts`** (é conteúdo; fica pronto antes dos testes que o usam)

```ts
export const PRODUCT_SLUGS = [
  'seguro-auto',
  'seguro-residencial',
  'plano-de-saude',
  'consorcio',
  'fianca-locaticia',
  'seguro-de-vida',
] as const;

export type ProductSlug = (typeof PRODUCT_SLUGS)[number];

export type ProductField =
  | { id: string; label: string; kind: 'select'; options: readonly string[] }
  | { id: string; label: string; kind: 'text'; placeholder: string; maxLength: number };

export interface ProductForm {
  slug: ProductSlug;
  name: string;
  fields: readonly ProductField[];
}

export const PRODUCT_FORMS: Record<ProductSlug, ProductForm> = {
  'seguro-auto': {
    slug: 'seguro-auto',
    name: 'Seguro Auto',
    fields: [{ id: 'veiculo', label: 'Modelo e ano do carro', kind: 'text', placeholder: 'Ex.: Onix 2021', maxLength: 60 }],
  },
  'seguro-residencial': {
    slug: 'seguro-residencial',
    name: 'Seguro Residencial',
    fields: [
      { id: 'imovel', label: 'Tipo de imóvel', kind: 'select', options: ['Casa', 'Apartamento'] },
      { id: 'situacao', label: 'O imóvel é', kind: 'select', options: ['Próprio', 'Alugado'] },
    ],
  },
  'plano-de-saude': {
    slug: 'plano-de-saude',
    name: 'Plano de Saúde',
    fields: [
      { id: 'para_quem', label: 'Para quem é o plano', kind: 'select', options: ['Só para mim', 'Minha família', 'Minha empresa'] },
      { id: 'pessoas', label: 'Quantas pessoas', kind: 'select', options: ['1', '2 a 3', '4 a 5', '6 a 29', '30 ou mais'] },
    ],
  },
  consorcio: {
    slug: 'consorcio',
    name: 'Consórcio',
    fields: [
      { id: 'tipo', label: 'Consórcio de', kind: 'select', options: ['Imóvel', 'Veículo', 'Outro'] },
      {
        id: 'valor',
        label: 'Valor aproximado da carta',
        kind: 'select',
        options: ['Até R$ 50 mil', 'R$ 50 mil a R$ 150 mil', 'R$ 150 mil a R$ 400 mil', 'Acima de R$ 400 mil'],
      },
    ],
  },
  'fianca-locaticia': {
    slug: 'fianca-locaticia',
    name: 'Fiança Locatícia',
    fields: [
      {
        id: 'aluguel',
        label: 'Valor do aluguel',
        kind: 'select',
        options: ['Até R$ 1.500', 'R$ 1.500 a R$ 3.000', 'R$ 3.000 a R$ 6.000', 'Acima de R$ 6.000'],
      },
    ],
  },
  'seguro-de-vida': {
    slug: 'seguro-de-vida',
    name: 'Seguro de Vida',
    fields: [{ id: 'modalidade', label: 'Modalidade', kind: 'select', options: ['Individual', 'Empresarial'] }],
  },
};

export function isProductSlug(v: unknown): v is ProductSlug {
  return typeof v === 'string' && (PRODUCT_SLUGS as readonly string[]).includes(v);
}
```

- [ ] **Passo 2: Escrever os testes que devem falhar**

`tests/unit/utm.test.ts`:
```ts
import { describe, expect, test } from 'vitest';
import { UTM_STORAGE_KEY, captureUtm, parseUtm, sanitizeUtm } from '../../src/lib/utm';

function memoryStorage(initial: Record<string, string> = {}) {
  const data = { ...initial };
  return {
    data,
    getItem: (k: string) => data[k] ?? null,
    setItem: (k: string, v: string) => { data[k] = v; },
  };
}
const throwingStorage = {
  getItem: () => { throw new Error('bloqueado'); },
  setItem: () => { throw new Error('bloqueado'); },
};

describe('parseUtm / sanitizeUtm', () => {
  test('lê só as chaves utm conhecidas', () => {
    expect(parseUtm('?utm_source=meta&utm_campaign=auto-set&fbclid=x&foo=1')).toEqual({
      utm_source: 'meta',
      utm_campaign: 'auto-set',
    });
  });
  test('corta em 100 caracteres, remove controles e ignora vazios', () => {
    const r = sanitizeUtm({ utm_source: 'a'.repeat(150), utm_medium: ' \u0000pago\n ', utm_term: '  ' });
    expect(r.utm_source).toHaveLength(100);
    expect(r.utm_medium).toBe('pago');
    expect(r.utm_term).toBeUndefined();
  });
  test('entrada inválida vira objeto vazio', () => {
    expect(sanitizeUtm(null)).toEqual({});
    expect(sanitizeUtm('x')).toEqual({});
    expect(sanitizeUtm({ utm_source: 5 })).toEqual({});
  });
});

describe('captureUtm', () => {
  test('UTM na URL é gravado e retornado', () => {
    const s = memoryStorage();
    expect(captureUtm(s, '?utm_campaign=auto-set')).toEqual({ utm_campaign: 'auto-set' });
    expect(JSON.parse(s.data[UTM_STORAGE_KEY])).toEqual({ utm_campaign: 'auto-set' });
  });
  test('sem UTM na URL, retorna o gravado na sessão', () => {
    const s = memoryStorage({ [UTM_STORAGE_KEY]: JSON.stringify({ utm_campaign: 'auto-set' }) });
    expect(captureUtm(s, '')).toEqual({ utm_campaign: 'auto-set' });
  });
  test('nova campanha substitui a anterior', () => {
    const s = memoryStorage({ [UTM_STORAGE_KEY]: JSON.stringify({ utm_campaign: 'velha', utm_source: 'meta' }) });
    expect(captureUtm(s, '?utm_campaign=nova')).toEqual({ utm_campaign: 'nova' });
  });
  test('armazenamento bloqueado não quebra', () => {
    expect(captureUtm(throwingStorage, '?utm_source=meta')).toEqual({ utm_source: 'meta' });
    expect(captureUtm(null, '')).toEqual({});
  });
  test('JSON corrompido na sessão é ignorado', () => {
    expect(captureUtm(memoryStorage({ [UTM_STORAGE_KEY]: '{quebrado' }), '')).toEqual({});
  });
});
```

`tests/unit/lead.test.ts`:
```ts
import { describe, expect, test } from 'vitest';
import { validateLead } from '../../src/lib/lead';

const base = {
  nome: 'João da Silva',
  whatsapp: '(11) 98765-4321',
  produto: 'seguro-auto',
  detalhes: { veiculo: 'Onix 2021' },
  cidade: 'Santo André',
  pagina: '/seguro-auto',
  utm: { utm_campaign: 'auto-set' },
};

describe('validateLead', () => {
  test('pedido válido é normalizado', () => {
    const r = validateLead(base);
    expect(r).toEqual({
      ok: true,
      lead: {
        nome: 'João da Silva',
        whatsapp: '11987654321',
        produto: 'seguro-auto',
        produtoNome: 'Seguro Auto',
        detalhes: [{ label: 'Modelo e ano do carro', value: 'Onix 2021' }],
        cidade: 'Santo André',
        pagina: '/seguro-auto',
        utm: { utm_campaign: 'auto-set' },
      },
    });
  });

  test('cidade vazia é omitida', () => {
    const r = validateLead({ ...base, cidade: '   ' });
    expect(r.ok && 'cidade' in r.lead).toBe(false);
  });

  test('espaços e caracteres de controle no nome são limpos', () => {
    const r = validateLead({ ...base, nome: '  Maria\r\n  Souza  ' });
    expect(r.ok && r.lead.nome).toBe('Maria Souza');
  });

  test('entrada que não é objeto gera erros nos campos obrigatórios', () => {
    const r = validateLead('lixo');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(['nome', 'produto', 'whatsapp']);
  });

  test.each([
    [{ nome: '' }, 'nome'],
    [{ nome: 'A' }, 'nome'],
    [{ nome: '12345' }, 'nome'],
    [{ nome: 'a'.repeat(81) }, 'nome'],
    [{ whatsapp: '98765-4321' }, 'whatsapp'],
    [{ whatsapp: 123 }, 'whatsapp'],
    [{ produto: 'seguro-barco' }, 'produto'],
    [{ detalhes: {} }, 'detalhes.veiculo'],
    [{ detalhes: { veiculo: 'x'.repeat(61) } }, 'detalhes.veiculo'],
    [{ cidade: 'x'.repeat(61) }, 'cidade'],
  ])('%j gera erro em %s', (patch, field) => {
    const r = validateLead({ ...base, ...patch });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors[field]).toBeTruthy();
  });

  test('select só aceita opções da lista', () => {
    const r = validateLead({
      ...base,
      produto: 'seguro-residencial',
      detalhes: { imovel: 'Castelo', situacao: 'Próprio' },
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors['detalhes.imovel']).toBe('Escolha uma opção em "Tipo de imóvel".');
  });

  test('campos desconhecidos em detalhes são ignorados', () => {
    const r = validateLead({ ...base, detalhes: { veiculo: 'Onix 2021', hack: '<script>' } });
    expect(r.ok && r.lead.detalhes).toEqual([{ label: 'Modelo e ano do carro', value: 'Onix 2021' }]);
  });

  test('página inválida vira "/" e UTM é sanitizado', () => {
    const r = validateLead({ ...base, pagina: 'https://mal.com', utm: { utm_source: 'meta', x: 'y' } });
    expect(r.ok && r.lead.pagina).toBe('/');
    expect(r.ok && r.lead.utm).toEqual({ utm_source: 'meta' });
  });

  test('mensagens de erro em português', () => {
    const r = validateLead({ ...base, nome: '', whatsapp: '', produto: '' });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors.nome).toBe('Informe seu nome.');
      expect(r.errors.whatsapp).toBe('Informe um WhatsApp com DDD. Ex.: (11) 98765-4321.');
      expect(r.errors.produto).toBe('Escolha o tipo de seguro.');
    }
  });
});
```

- [ ] **Passo 3: Rodar e confirmar que falham**

Rode: `npx vitest run tests/unit/utm.test.ts tests/unit/lead.test.ts`
Esperado: FALHA, com "Failed to resolve import".

- [ ] **Passo 4: Implementar**

`src/lib/utm.ts`:
```ts
export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
export type UtmKey = (typeof UTM_KEYS)[number];
export type Utm = Partial<Record<UtmKey, string>>;
export const UTM_STORAGE_KEY = 'pc-utm';

const MAX = 100;
const CONTROL = /[\u0000-\u001F\u007F]/g;

export function sanitizeUtm(raw: unknown): Utm {
  if (!raw || typeof raw !== 'object') return {};
  const src = raw as Record<string, unknown>;
  const out: Utm = {};
  for (const key of UTM_KEYS) {
    const v = src[key];
    if (typeof v !== 'string') continue;
    const clean = v.replace(CONTROL, '').trim().slice(0, MAX);
    if (clean) out[key] = clean;
  }
  return out;
}

export function parseUtm(search: string): Utm {
  const params = new URLSearchParams(search);
  const found: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const v = params.get(key);
    if (v) found[key] = v;
  }
  return sanitizeUtm(found);
}

export function captureUtm(storage: Pick<Storage, 'getItem' | 'setItem'> | null, search: string): Utm {
  const incoming = parseUtm(search);
  if (Object.keys(incoming).length > 0) {
    try {
      storage?.setItem(UTM_STORAGE_KEY, JSON.stringify(incoming));
    } catch {
      /* armazenamento indisponível: segue só com a URL */
    }
    return incoming;
  }
  try {
    return sanitizeUtm(JSON.parse(storage?.getItem(UTM_STORAGE_KEY) ?? 'null'));
  } catch {
    return {};
  }
}
```

`src/lib/lead.ts`:
```ts
import { PRODUCT_FORMS, isProductSlug, type ProductSlug } from '../content/product-fields';
import { normalizeBrPhone } from './phone';
import { sanitizeUtm, type Utm } from './utm';

export const LIMITS = { nome: 80, cidade: 60, pagina: 200 } as const;

export interface ValidLead {
  nome: string;
  whatsapp: string;
  produto: ProductSlug;
  produtoNome: string;
  detalhes: { label: string; value: string }[];
  cidade?: string;
  pagina: string;
  utm: Utm;
}
export type LeadErrors = Record<string, string>;
export type LeadValidation = { ok: true; lead: ValidLead } | { ok: false; errors: LeadErrors };

const CONTROL = /[\u0000-\u001F\u007F]/g;

function clean(v: unknown): string {
  return typeof v === 'string' ? v.replace(CONTROL, ' ').replace(/\s+/g, ' ').trim() : '';
}

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === 'object' ? (v as Record<string, unknown>) : {};
}

export function validateLead(raw: unknown): LeadValidation {
  const r = asRecord(raw);
  const errors: LeadErrors = {};

  const nome = clean(r.nome);
  if (nome.length < 2 || !/\p{L}/u.test(nome)) errors.nome = 'Informe seu nome.';
  else if (nome.length > LIMITS.nome) errors.nome = `Use no máximo ${LIMITS.nome} caracteres.`;

  const whatsapp = typeof r.whatsapp === 'string' ? normalizeBrPhone(r.whatsapp) : null;
  if (!whatsapp) errors.whatsapp = 'Informe um WhatsApp com DDD. Ex.: (11) 98765-4321.';

  const produto = isProductSlug(r.produto) ? r.produto : null;
  if (!produto) errors.produto = 'Escolha o tipo de seguro.';

  const detalhes: ValidLead['detalhes'] = [];
  if (produto) {
    const given = asRecord(r.detalhes);
    for (const field of PRODUCT_FORMS[produto].fields) {
      const key = `detalhes.${field.id}`;
      const value = clean(given[field.id]);
      if (field.kind === 'select') {
        if (!field.options.includes(value)) errors[key] = `Escolha uma opção em "${field.label}".`;
        else detalhes.push({ label: field.label, value });
      } else if (!value) {
        errors[key] = `Preencha "${field.label}".`;
      } else if (value.length > field.maxLength) {
        errors[key] = `Use no máximo ${field.maxLength} caracteres.`;
      } else {
        detalhes.push({ label: field.label, value });
      }
    }
  }

  const cidade = clean(r.cidade);
  if (cidade.length > LIMITS.cidade) errors.cidade = `Use no máximo ${LIMITS.cidade} caracteres.`;

  const paginaRaw = clean(r.pagina);
  const pagina = paginaRaw.startsWith('/') && !paginaRaw.startsWith('//') && paginaRaw.length <= LIMITS.pagina ? paginaRaw : '/';

  if (Object.keys(errors).length > 0 || !produto || !whatsapp) return { ok: false, errors };

  return {
    ok: true,
    lead: {
      nome,
      whatsapp,
      produto,
      produtoNome: PRODUCT_FORMS[produto].name,
      detalhes,
      ...(cidade ? { cidade } : {}),
      pagina,
      utm: sanitizeUtm(r.utm),
    },
  };
}
```

- [ ] **Passo 5: Rodar e confirmar que passam**

Rode: `npm test`
Esperado: todos os testes passam.

- [ ] **Passo 6: Commit**

```bash
git add src/content/product-fields.ts src/lib/utm.ts src/lib/lead.ts tests/unit
git commit -m "feat: campos dos produtos, validação do pedido e captura de UTM"
```

- [ ] **Passo 7: Relatar ao cliente.** Mostre a lista de campos por produto e as mensagens de erro.

---

### Tarefa 4: E-mail do pedido e API `/api/lead`

**Arquivos:**
- Criar:
  - `src/lib/lead-email.ts`
  - `src/lib/lead-handler.ts`
  - `src/pages/api/lead.ts`
- Testes:
  - `tests/unit/lead-email.test.ts`
  - `tests/unit/lead-handler.test.ts`

**Interfaces:**
- Consome: `validateLead` e `ValidLead` (Tarefa 3), `formatBrPhone` (Tarefa 2), `UTM_KEYS` (Tarefa 3).
- Produz:
```ts
// lead-email.ts
export interface EmailMessage { subject: string; html: string; text: string }
export function escapeHtml(s: string): string;
export function renderLeadEmail(lead: ValidLead, receivedAt: Date): EmailMessage;

// lead-handler.ts
export const MAX_BODY_BYTES = 8192;
export const MIN_ELAPSED_MS = 3000;
export interface LeadDeps {
  sendEmail: (msg: EmailMessage) => Promise<void>;
  now: () => Date;
  log: (message: string, data?: Record<string, unknown>) => void;
}
export function isSameOrigin(request: Request): boolean;
export function handleLeadRequest(request: Request, deps: LeadDeps): Promise<Response>;
// Respostas: 200 {ok:true} | 400 {ok:false, errors?} | 403 | 405 | 413 | 415 | 502 {ok:false}
```
- Contrato do corpo do POST (enviado pelo navegador na Tarefa 9): `{ nome, whatsapp, produto, detalhes: Record<string,string>, cidade, pagina, utm, elapsedMs: number, website: string }`.

- [ ] **Passo 1: Escrever os testes que devem falhar**

`tests/unit/lead-email.test.ts`:
```ts
import { describe, expect, test } from 'vitest';
import { escapeHtml, renderLeadEmail } from '../../src/lib/lead-email';
import type { ValidLead } from '../../src/lib/lead';

const lead: ValidLead = {
  nome: 'Zé <b>& "Cia"</b>',
  whatsapp: '11987654321',
  produto: 'seguro-auto',
  produtoNome: 'Seguro Auto',
  detalhes: [{ label: 'Modelo e ano do carro', value: '<script>alert(1)</script>' }],
  cidade: 'Santo André',
  pagina: '/seguro-auto',
  utm: { utm_source: 'meta', utm_campaign: 'auto-set' },
};

describe('escapeHtml', () => {
  test('escapa os 5 caracteres especiais', () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe('&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;');
  });
});

describe('renderLeadEmail', () => {
  const msg = renderLeadEmail(lead, new Date('2026-09-29T15:30:00Z'));

  test('assunto com produto e nome, sem quebra de linha', () => {
    expect(msg.subject).toBe('Novo contato pelo site: Seguro Auto – Zé <b>& "Cia"</b>');
    expect(msg.subject).not.toMatch(/[\r\n]/);
  });
  test('HTML nunca contém a marcação digitada pelo usuário', () => {
    expect(msg.html).not.toContain('<script>');
    expect(msg.html).not.toContain('<b>&');
    expect(msg.html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
  });
  test('inclui telefone formatado, link do WhatsApp, página, UTMs e data em São Paulo', () => {
    for (const body of [msg.html, msg.text]) {
      expect(body).toContain('(11) 98765-4321');
      expect(body).toContain('https://wa.me/5511987654321');
      expect(body).toContain('/seguro-auto');
      expect(body).toContain('auto-set');
      expect(body).toContain('29/09/2026');
      expect(body).toContain('12:30');
      expect(body).toContain('Santo André');
    }
  });
  test('texto puro mantém os caracteres originais', () => {
    expect(msg.text).toContain('Zé <b>& "Cia"</b>');
  });
});
```

`tests/unit/lead-handler.test.ts`:
```ts
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { handleLeadRequest, isSameOrigin, type LeadDeps } from '../../src/lib/lead-handler';

const URL_API = 'https://www.portugalcorretora.com.br/api/lead';
const ORIGIN = 'https://www.portugalcorretora.com.br';
const valid = {
  nome: 'João',
  whatsapp: '11987654321',
  produto: 'seguro-auto',
  detalhes: { veiculo: 'Onix 2021' },
  cidade: '',
  pagina: '/seguro-auto',
  utm: {},
  elapsedMs: 8000,
  website: '',
};

function req(body: unknown, init: { origin?: string | null; referer?: string; type?: string; method?: string } = {}) {
  const headers = new Headers({ 'content-type': init.type ?? 'application/json' });
  if (init.origin !== null) headers.set('origin', init.origin ?? ORIGIN);
  if (init.referer) headers.set('referer', init.referer);
  return new Request(URL_API, {
    method: init.method ?? 'POST',
    headers,
    body: init.method === 'GET' ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  });
}

let deps: LeadDeps & { sendEmail: ReturnType<typeof vi.fn>; log: ReturnType<typeof vi.fn> };
beforeEach(() => {
  deps = {
    sendEmail: vi.fn().mockResolvedValue(undefined),
    now: () => new Date('2026-09-29T15:30:00Z'),
    log: vi.fn(),
  };
});

describe('isSameOrigin', () => {
  test('aceita origin igual', () => expect(isSameOrigin(req(valid))).toBe(true));
  test('rejeita outra origem', () => expect(isSameOrigin(req(valid, { origin: 'https://mal.com' }))).toBe(false));
  test('usa referer quando não há origin', () =>
    expect(isSameOrigin(req(valid, { origin: null, referer: `${ORIGIN}/seguro-auto` }))).toBe(true));
  test('rejeita quando não há origin nem referer', () => expect(isSameOrigin(req(valid, { origin: null }))).toBe(false));
});

describe('handleLeadRequest', () => {
  test('pedido válido envia e-mail e responde 200', async () => {
    const res = await handleLeadRequest(req(valid), deps);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(deps.sendEmail).toHaveBeenCalledOnce();
    expect(deps.sendEmail.mock.calls[0][0].subject).toContain('Seguro Auto');
    expect(res.headers.get('cache-control')).toBe('no-store');
  });

  test('método diferente de POST responde 405', async () => {
    expect((await handleLeadRequest(req(null, { method: 'GET' }), deps)).status).toBe(405);
  });
  test('outra origem responde 403 sem enviar', async () => {
    expect((await handleLeadRequest(req(valid, { origin: 'https://mal.com' }), deps)).status).toBe(403);
    expect(deps.sendEmail).not.toHaveBeenCalled();
  });
  test('content-type errado responde 415', async () => {
    expect((await handleLeadRequest(req('nome=x', { type: 'application/x-www-form-urlencoded' }), deps)).status).toBe(415);
  });
  test('corpo grande demais responde 413', async () => {
    expect((await handleLeadRequest(req({ ...valid, nome: 'a'.repeat(9000) }), deps)).status).toBe(413);
  });
  test('JSON inválido responde 400', async () => {
    expect((await handleLeadRequest(req('{quebrado'), deps)).status).toBe(400);
  });
  test('honeypot preenchido finge sucesso e não envia', async () => {
    const res = await handleLeadRequest(req({ ...valid, website: 'http://spam' }), deps);
    expect(res.status).toBe(200);
    expect(deps.sendEmail).not.toHaveBeenCalled();
  });
  test('envio rápido demais finge sucesso e não envia', async () => {
    const res = await handleLeadRequest(req({ ...valid, elapsedMs: 500 }), deps);
    expect(res.status).toBe(200);
    expect(deps.sendEmail).not.toHaveBeenCalled();
  });
  test('elapsedMs ausente é tratado como robô', async () => {
    const { elapsedMs, ...semTempo } = valid;
    await handleLeadRequest(req(semTempo), deps);
    expect(deps.sendEmail).not.toHaveBeenCalled();
  });
  test('dados inválidos respondem 400 com erros', async () => {
    const res = await handleLeadRequest(req({ ...valid, whatsapp: '123' }), deps);
    expect(res.status).toBe(400);
    expect((await res.json()).errors.whatsapp).toBeTruthy();
  });
  test('falha no e-mail responde 502 e registra log sem dados pessoais', async () => {
    deps.sendEmail.mockRejectedValue(new Error('resend fora do ar'));
    const res = await handleLeadRequest(req(valid), deps);
    expect(res.status).toBe(502);
    expect(deps.log).toHaveBeenCalledOnce();
    const logged = JSON.stringify(deps.log.mock.calls[0]);
    expect(logged).not.toContain('João');
    expect(logged).not.toContain('987654321');
  });
});
```

- [ ] **Passo 2: Rodar e confirmar que falham**

Rode: `npx vitest run tests/unit/lead-email.test.ts tests/unit/lead-handler.test.ts`
Esperado: FALHA, com "Failed to resolve import".

- [ ] **Passo 3: Implementar `src/lib/lead-email.ts`**

```ts
import type { ValidLead } from './lead';
import { formatBrPhone } from './phone';
import { UTM_KEYS } from './utm';

export interface EmailMessage {
  subject: string;
  html: string;
  text: string;
}

const HTML_ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);
}

export function renderLeadEmail(lead: ValidLead, receivedAt: Date): EmailMessage {
  const when = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(receivedAt);
  const waLink = `https://wa.me/55${lead.whatsapp}`;

  const rows: [string, string][] = [
    ['Nome', lead.nome],
    ['WhatsApp', formatBrPhone(lead.whatsapp)],
    ['Produto', lead.produtoNome],
    ...lead.detalhes.map((d): [string, string] => [d.label, d.value]),
    ...(lead.cidade ? [['Cidade', lead.cidade] as [string, string]] : []),
    ['Página de origem', lead.pagina],
    ...UTM_KEYS.filter((k) => lead.utm[k]).map((k): [string, string] => [k, lead.utm[k] as string]),
    ['Recebido em', `${when} (horário de Brasília)`],
  ];

  const subject = `Novo contato pelo site: ${lead.produtoNome} – ${lead.nome}`;

  const html = `<!doctype html><html lang="pt-BR"><body style="font-family:Arial,sans-serif;color:#1a1a1a">
<h2 style="color:#003780;margin:0 0 12px">Novo contato pelo site</h2>
<p style="margin:0 0 16px"><a href="${escapeHtml(waLink)}" style="background:#25D366;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;font-weight:bold">Responder no WhatsApp</a></p>
<table cellpadding="6" style="border-collapse:collapse">
${rows.map(([k, v]) => `<tr><td style="color:#555;vertical-align:top"><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v)}</td></tr>`).join('\n')}
</table>
<p style="color:#777;font-size:12px;margin-top:16px">WhatsApp: ${escapeHtml(waLink)}</p>
</body></html>`;

  const text = [
    'Novo contato pelo site',
    '',
    ...rows.map(([k, v]) => `${k}: ${v}`),
    '',
    `Responder no WhatsApp: ${waLink}`,
  ].join('\n');

  return { subject, html, text };
}
```

- [ ] **Passo 4: Implementar `src/lib/lead-handler.ts`**

```ts
import { validateLead } from './lead';
import { renderLeadEmail, type EmailMessage } from './lead-email';

export const MAX_BODY_BYTES = 8192;
export const MIN_ELAPSED_MS = 3000;

export interface LeadDeps {
  sendEmail: (msg: EmailMessage) => Promise<void>;
  now: () => Date;
  log: (message: string, data?: Record<string, unknown>) => void;
}

function json(status: number, data: unknown): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

export function isSameOrigin(request: Request): boolean {
  const expected = new URL(request.url).origin;
  const origin = request.headers.get('origin');
  if (origin) return origin === expected;
  const referer = request.headers.get('referer');
  if (!referer) return false;
  try {
    return new URL(referer).origin === expected;
  } catch {
    return false;
  }
}

export async function handleLeadRequest(request: Request, deps: LeadDeps): Promise<Response> {
  if (request.method !== 'POST') return json(405, { ok: false });
  if (!isSameOrigin(request)) return json(403, { ok: false });
  if (!(request.headers.get('content-type') ?? '').toLowerCase().startsWith('application/json')) {
    return json(415, { ok: false });
  }
  const declared = Number(request.headers.get('content-length') ?? '0');
  if (declared > MAX_BODY_BYTES) return json(413, { ok: false });

  const text = await request.text();
  if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) return json(413, { ok: false });

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return json(400, { ok: false });
  }

  const b = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;
  const honeypot = typeof b.website === 'string' && b.website.trim() !== '';
  const tooFast = typeof b.elapsedMs !== 'number' || b.elapsedMs < MIN_ELAPSED_MS;
  if (honeypot || tooFast) return json(200, { ok: true });

  const result = validateLead(body);
  if (!result.ok) return json(400, { ok: false, errors: result.errors });

  try {
    await deps.sendEmail(renderLeadEmail(result.lead, deps.now()));
  } catch (err) {
    deps.log('lead: falha ao enviar e-mail', {
      produto: result.lead.produto,
      erro: err instanceof Error ? err.message : String(err),
    });
    return json(502, { ok: false });
  }
  return json(200, { ok: true });
}
```

- [ ] **Passo 5: Rodar os testes unitários**

Rode: `npm test`
Esperado: todos os testes passam.

Não desative o `security.checkOrigin` do Astro. Ele complementa a nossa verificação, barrando envios de formulário tradicionais vindos de outros sites, mas não cobre JSON (ver "Resultados do teste prático").

- [ ] **Passo 6: Criar o endpoint `src/pages/api/lead.ts`**

```ts
import type { APIRoute } from 'astro';
import { LEAD_FROM_EMAIL, LEAD_TO_EMAIL, RESEND_API_KEY } from 'astro:env/server';
import { Resend } from 'resend';
import { handleLeadRequest } from '../../lib/lead-handler';

export const prerender = false;

export const POST: APIRoute = ({ request }) =>
  handleLeadRequest(request, {
    now: () => new Date(),
    log: (message, data) => console.error(message, data),
    sendEmail: async (msg) => {
      if (!RESEND_API_KEY) {
        if (import.meta.env.DEV) {
          console.info('[dev] e-mail não enviado (sem RESEND_API_KEY):', msg.subject);
          return;
        }
        throw new Error('RESEND_API_KEY ausente');
      }
      const resend = new Resend(RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from: LEAD_FROM_EMAIL,
        to: [LEAD_TO_EMAIL],
        subject: msg.subject,
        html: msg.html,
        text: msg.text,
      });
      if (error) throw new Error(`Resend: ${error.message}`);
    },
  });
```

O log de desenvolvimento mostra só o assunto, que contém o nome. Isso é aceitável porque acontece apenas na máquina local, com `import.meta.env.DEV`.

- [ ] **Passo 7: Testar o endpoint de verdade em desenvolvimento**

Rode `npm run dev` numa aba e, em outra:
```bash
curl -s -o - -w "\n%{http_code}\n" -X POST http://localhost:4321/api/lead \
  -H "content-type: application/json" -H "origin: http://localhost:4321" \
  -d '{"nome":"Teste","whatsapp":"11987654321","produto":"seguro-auto","detalhes":{"veiculo":"Onix 2021"},"pagina":"/","utm":{},"elapsedMs":5000,"website":""}'
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:4321/api/lead \
  -H "content-type: application/json" -H "origin: https://mal.com" -d '{}'
```

Esperado:
- Primeira chamada: `{"ok":true}` e `200`, e o terminal do dev mostra "[dev] e-mail não enviado…".
- Segunda chamada: `403`.

Depois rode `npm run build` e confirme que existe a função em `.vercel/output/functions/`.

- [ ] **Passo 8: Commit**

```bash
git add src/lib/lead-email.ts src/lib/lead-handler.ts src/pages/api/lead.ts tests/unit
git commit -m "feat: API de pedidos com validação, antispam e e-mail via Resend"
```

- [ ] **Passo 9: Relatar ao cliente.** Explique as proteções contra spam e mostre o resultado dos testes e do curl.

---

### Tarefa 5: Consentimento de cookies e Pixel da Meta (lógica)

**Arquivos:**
- Criar:
  - `src/lib/consent.ts`
  - `src/lib/meta-pixel.ts`
- Testes:
  - `tests/unit/consent.test.ts`
  - `tests/unit/meta-pixel.test.ts`

**Interfaces (produz):**
```ts
// consent.ts
export type ConsentStatus = 'granted' | 'denied';
export type KeyValueStorage = Pick<Storage, 'getItem' | 'setItem'>;
export const CONSENT_KEY = 'pc-consent';
export const CONSENT_MAX_AGE_DAYS = 180;
export function readConsent(storage: KeyValueStorage | null, now: Date): ConsentStatus | null;
export function writeConsent(storage: KeyValueStorage | null, status: ConsentStatus, now: Date): boolean; // false se não conseguiu gravar
export function safeLocalStorage(): KeyValueStorage | null;

// meta-pixel.ts
export type PixelEvent = 'Lead' | 'Contact' | 'ViewContent';
export function isValidPixelId(id: string | undefined): id is string; // /^\d{10,20}$/
export function loadPixel(pixelId: string | undefined, win?: PixelWindow, doc?: Document): boolean; // true se carregou agora
export function trackEvent(name: PixelEvent, params?: Record<string, string>, win?: PixelWindow): void; // no-op sem fbq
export interface PixelWindow { fbq?: FbqFn; _fbq?: FbqFn }
```

- [ ] **Passo 1: Escrever os testes que devem falhar**

`tests/unit/consent.test.ts`:
```ts
import { describe, expect, test } from 'vitest';
import { CONSENT_KEY, readConsent, writeConsent } from '../../src/lib/consent';

function memory(initial: Record<string, string> = {}) {
  const data = { ...initial };
  return { data, getItem: (k: string) => data[k] ?? null, setItem: (k: string, v: string) => void (data[k] = v) };
}
const broken = {
  getItem: () => { throw new Error('x'); },
  setItem: () => { throw new Error('x'); },
};
const now = new Date('2026-09-29T12:00:00Z');

describe('consent', () => {
  test('sem registro retorna null', () => expect(readConsent(memory(), now)).toBeNull());
  test('grava e lê granted', () => {
    const s = memory();
    expect(writeConsent(s, 'granted', now)).toBe(true);
    expect(readConsent(s, now)).toBe('granted');
    expect(JSON.parse(s.data[CONSENT_KEY])).toEqual({ status: 'granted', at: '2026-09-29T12:00:00.000Z' });
  });
  test('lê denied', () => {
    const s = memory();
    writeConsent(s, 'denied', now);
    expect(readConsent(s, now)).toBe('denied');
  });
  test('expira depois de 180 dias', () => {
    const s = memory();
    writeConsent(s, 'granted', new Date('2026-01-01T00:00:00Z'));
    expect(readConsent(s, new Date('2026-06-29T00:00:00Z'))).toBe('granted'); // 179 dias
    expect(readConsent(s, new Date('2026-07-01T00:00:00Z'))).toBeNull();      // 181 dias
  });
  test.each(['{quebrado', '{"status":"talvez","at":"2026-09-29T12:00:00Z"}', '{"status":"granted"}', '{"status":"granted","at":"ontem"}'])(
    'registro inválido %s retorna null',
    (raw) => expect(readConsent(memory({ [CONSENT_KEY]: raw }), now)).toBeNull(),
  );
  test('armazenamento bloqueado não lança erro', () => {
    expect(readConsent(broken, now)).toBeNull();
    expect(writeConsent(broken, 'granted', now)).toBe(false);
    expect(readConsent(null, now)).toBeNull();
    expect(writeConsent(null, 'granted', now)).toBe(false);
  });
});
```

Confira as datas: de 2026-01-01 a 2026-06-29 são 179 dias (31+28+31+30+31+28); até 2026-07-01 são 181 dias.

`tests/unit/meta-pixel.test.ts`:
```ts
import { describe, expect, test } from 'vitest';
import { isValidPixelId, loadPixel, trackEvent, type PixelWindow } from '../../src/lib/meta-pixel';

function fakeDoc() {
  const appended: { src: string; async: boolean }[] = [];
  const doc = {
    createElement: () => ({ src: '', async: false }),
    head: { appendChild: (el: { src: string; async: boolean }) => appended.push(el) },
  } as unknown as Document;
  return { doc, appended };
}

describe('isValidPixelId', () => {
  test.each([['1234567890123456', true], ['', false], [undefined, false], ['abc123', false], ['123', false]])(
    '%s → %s',
    (id, ok) => expect(isValidPixelId(id as string | undefined)).toBe(ok),
  );
});

describe('loadPixel', () => {
  test('injeta o script oficial e enfileira init + PageView', () => {
    const win: PixelWindow = {};
    const { doc, appended } = fakeDoc();
    expect(loadPixel('1234567890123456', win, doc)).toBe(true);
    expect(appended).toHaveLength(1);
    expect(appended[0].src).toBe('https://connect.facebook.net/en_US/fbevents.js');
    expect(appended[0].async).toBe(true);
    expect(win.fbq?.queue).toEqual([
      ['init', '1234567890123456'],
      ['track', 'PageView'],
    ]);
  });
  test('não carrega duas vezes', () => {
    const win: PixelWindow = {};
    const { doc, appended } = fakeDoc();
    loadPixel('1234567890123456', win, doc);
    expect(loadPixel('1234567890123456', win, doc)).toBe(false);
    expect(appended).toHaveLength(1);
  });
  test('ID inválido não carrega nada', () => {
    const win: PixelWindow = {};
    const { doc, appended } = fakeDoc();
    expect(loadPixel(undefined, win, doc)).toBe(false);
    expect(appended).toHaveLength(0);
    expect(win.fbq).toBeUndefined();
  });
});

describe('trackEvent', () => {
  test('sem Pixel não faz nada', () => {
    expect(() => trackEvent('Lead', { content_name: 'Seguro Auto' }, {})).not.toThrow();
  });
  test('com Pixel enfileira o evento', () => {
    const win: PixelWindow = {};
    loadPixel('1234567890123456', win, fakeDoc().doc);
    trackEvent('Lead', { content_name: 'Seguro Auto' }, win);
    expect(win.fbq?.queue.at(-1)).toEqual(['track', 'Lead', { content_name: 'Seguro Auto' }]);
  });
});
```

- [ ] **Passo 2: Rodar e confirmar que falham**

Rode: `npx vitest run tests/unit/consent.test.ts tests/unit/meta-pixel.test.ts`
Esperado: FALHA, com "Failed to resolve import".

- [ ] **Passo 3: Implementar**

`src/lib/consent.ts`:
```ts
export type ConsentStatus = 'granted' | 'denied';
export type KeyValueStorage = Pick<Storage, 'getItem' | 'setItem'>;
export const CONSENT_KEY = 'pc-consent';
export const CONSENT_MAX_AGE_DAYS = 180;
const DAY_MS = 24 * 60 * 60 * 1000;

export function readConsent(storage: KeyValueStorage | null, now: Date): ConsentStatus | null {
  try {
    const raw = storage?.getItem(CONSENT_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as { status?: unknown; at?: unknown };
    if ((v.status !== 'granted' && v.status !== 'denied') || typeof v.at !== 'string') return null;
    const at = Date.parse(v.at);
    if (Number.isNaN(at)) return null;
    if (now.getTime() - at > CONSENT_MAX_AGE_DAYS * DAY_MS) return null;
    return v.status;
  } catch {
    return null;
  }
}

export function writeConsent(storage: KeyValueStorage | null, status: ConsentStatus, now: Date): boolean {
  if (!storage) return false;
  try {
    storage.setItem(CONSENT_KEY, JSON.stringify({ status, at: now.toISOString() }));
    return true;
  } catch {
    return false;
  }
}

export function safeLocalStorage(): KeyValueStorage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
```

`src/lib/meta-pixel.ts`:
```ts
export type PixelEvent = 'Lead' | 'Contact' | 'ViewContent';

type FbqArgs = unknown[];
export interface FbqFn {
  (...args: FbqArgs): void;
  callMethod?: (...args: FbqArgs) => void;
  queue: FbqArgs[];
  push: FbqFn;
  loaded: boolean;
  version: string;
}
export interface PixelWindow {
  fbq?: FbqFn;
  _fbq?: FbqFn;
}

const PIXEL_SRC = 'https://connect.facebook.net/en_US/fbevents.js';

export function isValidPixelId(id: string | undefined): id is string {
  return typeof id === 'string' && /^\d{10,20}$/.test(id);
}

export function loadPixel(
  pixelId: string | undefined,
  win: PixelWindow = window as unknown as PixelWindow,
  doc: Document = document,
): boolean {
  if (!isValidPixelId(pixelId) || win.fbq) return false;

  const fbq = function (...args: FbqArgs) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  } as FbqFn;
  fbq.queue = [];
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  win.fbq = fbq;
  if (!win._fbq) win._fbq = fbq;

  const script = doc.createElement('script');
  script.async = true;
  script.src = PIXEL_SRC;
  doc.head.appendChild(script);

  fbq('init', pixelId);
  fbq('track', 'PageView');
  return true;
}

export function trackEvent(
  name: PixelEvent,
  params?: Record<string, string>,
  win: PixelWindow = (typeof window === 'undefined' ? {} : window) as unknown as PixelWindow,
): void {
  if (!win.fbq) return;
  if (params) win.fbq('track', name, params);
  else win.fbq('track', name);
}
```

- [ ] **Passo 4: Rodar e confirmar que passam**

Rode: `npm test`
Esperado: todos os testes passam.

- [ ] **Passo 5: Commit**

```bash
git add src/lib/consent.ts src/lib/meta-pixel.ts tests/unit
git commit -m "feat: consentimento de cookies e carregador do Pixel da Meta"
```

- [ ] **Passo 6: Relatar ao cliente.** Explique que o Pixel só carrega após o "Aceitar" e que nada quebra se o navegador bloquear o armazenamento.

---

### Tarefa 6: Conteúdo do site (textos, produtos e seguradoras)

**Arquivos:**
- Criar:
  - `src/content/insurers.ts`
  - `src/content/products.ts`
  - `src/content/site.ts`
- Teste: `tests/unit/content.test.ts`

**Interfaces:**
- Consome: `PRODUCT_SLUGS`, `PRODUCT_FORMS` e `ProductSlug` (Tarefa 3); `WHATSAPP_NUMBER` e `WHATSAPP_DISPLAY` (Tarefa 2).
- Produz:
```ts
// insurers.ts
export type InsurerId = 'porto'|'allianz'|'tokio-marine'|'hdi'|'suhai'|'yelum'|'bradesco'|'pier'|'azul'|'itau'|'mitsui-sumitomo'|'sulamerica-saude';
export interface Insurer { id: InsurerId; name: string; assistance?: { phone: string; label: string; conferir: boolean } }
export const INSURERS: readonly Insurer[]; // na ordem de exibição
export function getInsurer(id: InsurerId): Insurer;

// products.ts
export interface Faq { q: string; a: string }
export interface Item { title: string; text: string }
export interface Product {
  slug: ProductSlug; name: string; priority: 1|2|3|4|5|6; featured: boolean;
  cardText: string;                      // até 90 caracteres
  seo: { title: string; description: string }; // title ≤ 60; description 70–160
  hero: { title: string; subtitle: string };
  coveragesTitle: string;                // ex.: "O que o Seguro Auto cobre", "O que está incluído" (Consórcio), "O que o plano oferece" (Saúde)
  coverages: Item[];                     // 4–6
  audiences: Item[];                     // 2–4
  steps: [Item, Item, Item];
  faqs: Faq[];                           // 4–6
  insurers: InsurerId[];                 // divisão provável; conferir com o cliente
  badge?: string;                        // ex.: Prêmio Porto Elite no Consórcio
}
export const PRODUCTS: readonly Product[]; // ordenado por prioridade
export function getProduct(slug: ProductSlug): Product;

// site.ts
export const COMPANY: {
  name: string; legalName: string; cnpj: string; susep: string;
  address: { street: string; district: string; city: string; state: string; zip: string; mapsUrl: string };
  whatsapp: string; whatsappDisplay: string; email: string; dpoEmail: string;
  hoursLabel: string; yearsLabel: string;
  google: { rating: number; ratingLabel: string; count: number; reviewsUrl: string; writeReviewUrl: string };
  social: { facebook: string; instagram: string };
  portoElite: { label: string; conferir: boolean };
};
export const HOME: { hero: { title: string; subtitle: string }; seo: { title: string; description: string } };
export const STATS: readonly { value: string; label: string }[];
export const DIFFERENTIALS: readonly Item[];
export const HOME_STEPS: readonly [Item, Item, Item];
export const GENERAL_FAQS: readonly Faq[];
export const TESTIMONIALS: readonly { name: string; text: string; rating: 5 | 4 }[]; // vazio até o cliente escolher
export const ABOUT: { title: string; paragraphs: string[] };
```

- [ ] **Passo 1: Escrever o teste de integridade do conteúdo (deve falhar)**

`tests/unit/content.test.ts`:
```ts
import { describe, expect, test } from 'vitest';
import { INSURERS } from '../../src/content/insurers';
import { PRODUCT_FORMS, PRODUCT_SLUGS } from '../../src/content/product-fields';
import { PRODUCTS } from '../../src/content/products';
import * as site from '../../src/content/site';

function strings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(strings);
  return [];
}
const FORBIDDEN = [/os melhores preços/i, /menor preço/i, /garantid[oa]/i, /atendimento (24|vinte e quatro)/i];

describe('produtos', () => {
  test('6 produtos, na ordem de prioridade, com os slugs do formulário', () => {
    expect(PRODUCTS.map((p) => p.slug)).toEqual([...PRODUCT_SLUGS]);
    expect(PRODUCTS.map((p) => p.priority)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(PRODUCTS.filter((p) => p.featured).map((p) => p.priority)).toEqual([1, 2, 3, 4]);
  });
  test.each(PRODUCTS.map((p) => [p.slug, p] as const))('%s tem conteúdo completo', (_, p) => {
    expect(p.name).toBe(PRODUCT_FORMS[p.slug].name);
    expect(p.seo.title.length).toBeLessThanOrEqual(60);
    expect(p.seo.description.length).toBeGreaterThanOrEqual(70);
    expect(p.seo.description.length).toBeLessThanOrEqual(160);
    expect(p.cardText.length).toBeLessThanOrEqual(90);
    expect(p.hero.title).toBeTruthy();
    expect(p.coveragesTitle).toBeTruthy();
    expect(p.coverages.length).toBeGreaterThanOrEqual(4);
    expect(p.coverages.length).toBeLessThanOrEqual(6);
    expect(p.audiences.length).toBeGreaterThanOrEqual(2);
    expect(p.faqs.length).toBeGreaterThanOrEqual(4);
    expect(p.insurers.length).toBeGreaterThan(0);
    const ids = new Set(INSURERS.map((i) => i.id));
    for (const id of p.insurers) expect(ids.has(id)).toBe(true);
  });
});

describe('seguradoras', () => {
  test('12 seguradoras sem repetição', () => {
    expect(INSURERS).toHaveLength(12);
    expect(new Set(INSURERS.map((i) => i.id)).size).toBe(12);
  });
});

describe('corretora', () => {
  test('dados oficiais', () => {
    expect(site.COMPANY.cnpj).toBe('21.427.722/0001-05');
    expect(site.COMPANY.susep).toBe('2022910');
    expect(site.COMPANY.whatsapp).toBe('5511938052598');
    expect(site.COMPANY.email).toBe('atendimento@portugalcorretora.com.br');
    expect(site.COMPANY.hoursLabel).toBe('Segunda a sexta, das 8h às 20h');
  });
});

describe('regras de redação', () => {
  test('sem promessas absolutas em nenhum texto', () => {
    const all = [...strings(PRODUCTS), ...strings(site)];
    for (const text of all) for (const re of FORBIDDEN) expect(text, text).not.toMatch(re);
  });
});
```

- [ ] **Passo 2: Rodar e confirmar que falha**

Rode: `npx vitest run tests/unit/content.test.ts`
Esperado: FALHA, com "Failed to resolve import".

- [ ] **Passo 3: Pesquisar os telefones de assistência 24h.** Use WebSearch nos sites oficiais de cada seguradora. Registre cada número com `conferir: true`. Quando o site da seguradora tiver telefones diferentes para capitais e demais localidades, use o de "capitais e regiões metropolitanas" e diga isso no `label`. Se não encontrar o número numa fonte oficial, omita o campo `assistance`. Não invente números.

- [ ] **Passo 4: Criar `src/content/insurers.ts`**

```ts
export type InsurerId =
  | 'porto' | 'allianz' | 'tokio-marine' | 'hdi' | 'suhai' | 'yelum'
  | 'bradesco' | 'pier' | 'azul' | 'itau' | 'mitsui-sumitomo' | 'sulamerica-saude';

export interface Insurer {
  id: InsurerId;
  name: string;
  assistance?: { phone: string; label: string; conferir: boolean };
}

// Telefones: preencher no Passo 3 a partir dos sites oficiais; `conferir: true` até o cliente confirmar.
export const INSURERS: readonly Insurer[] = [
  { id: 'porto', name: 'Porto Seguro' },
  { id: 'allianz', name: 'Allianz' },
  { id: 'tokio-marine', name: 'Tokio Marine' },
  { id: 'hdi', name: 'HDI Seguros' },
  { id: 'suhai', name: 'Suhai Seguradora' },
  { id: 'yelum', name: 'Yelum Seguros' },
  { id: 'bradesco', name: 'Bradesco Seguros' },
  { id: 'pier', name: 'Pier' },
  { id: 'azul', name: 'Azul Seguros' },
  { id: 'itau', name: 'Itaú Seguros' },
  { id: 'mitsui-sumitomo', name: 'Mitsui Sumitomo Seguros' },
  { id: 'sulamerica-saude', name: 'SulAmérica Saúde' },
];

export function getInsurer(id: InsurerId): Insurer {
  const found = INSURERS.find((i) => i.id === id);
  if (!found) throw new Error(`Seguradora desconhecida: ${id}`);
  return found;
}
```

- [ ] **Passo 5: Criar `src/content/products.ts`** com a interface da seção "Interfaces" e os 6 produtos. O texto final é escrito neste passo, seguindo as orientações abaixo, e revisado pelo cliente no Passo 8.

**Tom:**
- Próximo e direto, falando com "você".
- Frases curtas.
- Benefício antes de característica.
- Sem jargão sem explicação: "franquia", por exemplo, é explicada na pergunta frequente.

**Orientação por produto.** Cada produto tem título do topo, subtítulo, coberturas (4 a 6), perfis de público, 3 passos, perguntas frequentes (4 a 6) e seguradoras.

**Auto** (prioridade 1, em destaque)
- Coberturas:
  - colisão e perda total;
  - roubo e furto;
  - danos a terceiros (materiais e corporais);
  - assistência 24h da seguradora (guincho, chaveiro, pane seca e elétrica);
  - carro reserva;
  - vidros, faróis e retrovisores.
- Público: primeiro carro, família, motorista de aplicativo.
- Perguntas:
  - O que é franquia?
  - O preço muda por CEP e perfil?
  - Posso trocar de seguradora na renovação sem perder o bônus?
  - Motorista de aplicativo tem seguro?
  - O que fazer em caso de batida?
- Seguradoras: porto, allianz, tokio-marine, hdi, suhai, yelum, bradesco, pier, azul, itau, mitsui-sumitomo.

**Residencial** (2, em destaque)
- Coberturas:
  - incêndio, raio e explosão;
  - roubo e furto qualificado;
  - danos elétricos;
  - vendaval e granizo;
  - responsabilidade civil familiar;
  - assistência residencial (encanador, eletricista, chaveiro).
- Público: casa própria, quem mora de aluguel, apartamento.
- Perguntas:
  - Inquilino pode contratar?
  - Quanto custa, em média, comparado ao valor do imóvel? (resposta sem número absoluto; diga que costuma caber no orçamento e depende do imóvel)
  - Cobre bens dentro de casa?
  - Condomínio já tem seguro, preciso do meu?
- Seguradoras: porto, allianz, tokio-marine, hdi, yelum, bradesco, pier, itau, mitsui-sumitomo.

**Plano de Saúde** (3, em destaque)
- Itens:
  - consultas e exames;
  - internação e cirurgias;
  - rede credenciada na sua região;
  - opções com e sem coparticipação;
  - planos para empresas a partir de 2 vidas (MEI e CNPJ);
  - atendimento de urgência e emergência.
- Público: individual, família, empresa.
- Perguntas:
  - MEI pode contratar plano empresarial?
  - O que é carência?
  - O que é coparticipação?
  - Posso manter meu médico?
  - Quais operadoras vocês trabalham?
- Seguradoras: sulamerica-saude, bradesco, porto.

**Consórcio** (4, em destaque)
- Itens:
  - sem juros, apenas taxa de administração;
  - carta de crédito para imóvel ou veículo;
  - contemplação por sorteio ou lance;
  - parcelas que cabem no planejamento;
  - acompanhamento das assembleias;
  - use a carta para comprar à vista.
- Público: comprar imóvel, trocar de carro, planejar um investimento.
- Perguntas:
  - Como funciona o lance?
  - Consórcio tem juros?
  - Posso usar o FGTS? (imóvel: sim, conforme regras)
  - O que acontece se eu não for sorteado?
- Selo: `badge: 'Prêmio Porto Elite'`.
- Seguradoras: porto, itau, bradesco.

**Fiança Locatícia** (5)
- Itens:
  - substitui o fiador;
  - dispensa depósito caução;
  - cobre aluguel e encargos (condomínio, IPTU, contas);
  - pode cobrir danos ao imóvel e multa por rescisão;
  - análise de cadastro ágil;
  - aceito pelas principais imobiliárias.
- Público: inquilino, proprietário ou imobiliária.
- Perguntas:
  - Quanto custa a fiança?
  - Quem paga, inquilino ou proprietário?
  - Preciso ter renda comprovada?
  - Posso usar para imóvel comercial?
- Seguradoras: porto, tokio-marine.

**Seguro de Vida** (6)
- Coberturas:
  - morte natural ou acidental;
  - invalidez por acidente ou doença;
  - diagnóstico de doenças graves;
  - assistência funeral;
  - diária por incapacidade temporária;
  - seguro de vida em grupo para empresas.
- Público: individual e família, empresa (benefício aos funcionários e cumprimento de convenção coletiva).
- Perguntas:
  - Qual valor de cobertura escolher?
  - Posso ter mais de um seguro de vida?
  - O seguro de vida entra em inventário? (não entra; o valor é pago aos beneficiários)
  - Empresa é obrigada a ter?
- Seguradoras: porto, allianz, tokio-marine, hdi, yelum, bradesco, itau, mitsui-sumitomo.

**Passos padrão** (adapte o texto por produto):
1. "Conte o que você precisa", pelo formulário ou pelo WhatsApp.
2. "Comparamos as seguradoras", buscando as melhores condições para o seu perfil.
3. "Você escolhe e fica protegido", com acompanhamento até o fim.

No arquivo, inclua o comentário `// DIVISÃO DE SEGURADORAS PROVÁVEL – conferir com o cliente` acima de cada lista `insurers`.

Inclua também:
```ts
export function getProduct(slug: ProductSlug): Product {
  const p = PRODUCTS.find((x) => x.slug === slug);
  if (!p) throw new Error(`Produto desconhecido: ${slug}`);
  return p;
}
```
Os campos `name` vêm de `PRODUCT_FORMS[slug].name`, para não duplicar.

- [ ] **Passo 6: Criar `src/content/site.ts`**

```ts
import { WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from './contact';

export const COMPANY = {
  name: 'Portugal Corretora de Seguros',
  legalName: '[RAZÃO SOCIAL]', // PENDENTE: cliente envia
  cnpj: '21.427.722/0001-05',
  susep: '2022910',
  address: {
    street: 'Av. Portugal, 1285',
    district: 'Jardim Bela Vista',
    city: 'Santo André',
    state: 'SP',
    zip: '09040-011',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Portugal+Corretora+de+Seguros+Av.+Portugal+1285+Santo+Andr%C3%A9',
  },
  whatsapp: WHATSAPP_NUMBER,
  whatsappDisplay: WHATSAPP_DISPLAY,
  email: 'atendimento@portugalcorretora.com.br',
  dpoEmail: 'atendimento@portugalcorretora.com.br',
  hoursLabel: 'Segunda a sexta, das 8h às 20h',
  yearsLabel: '+12 anos',
  google: {
    rating: 4.8,
    ratingLabel: '4,8',
    count: 19,
    reviewsUrl:
      'https://www.google.com/search?q=portugal+corretora+de+seguros#lrd=0x94ce42600eb7bcaf:0x491b7e07925c034e,1',
    writeReviewUrl:
      'https://www.google.com/search?q=portugal+corretora+de+seguros#lrd=0x94ce42600eb7bcaf:0x491b7e07925c034e,3',
  },
  social: {
    facebook: 'https://www.facebook.com/portugalseguros',
    instagram: 'https://www.instagram.com/portugalcorretora/',
  },
  portoElite: { label: 'Prêmio Porto Elite – Consórcio', conferir: true }, // PENDENTE: ano e categoria
} as const;

export const STATS = [
  { value: '1000', label: 'clientes atendidos' }, // PENDENTE: número real
  { value: '1000', label: 'apólices ativas' }, // PENDENTE: número real
  { value: '+12', label: 'anos de mercado' },
  { value: '12', label: 'seguradoras parceiras' },
] as const;

export const TESTIMONIALS: readonly { name: string; text: string; rating: 5 | 4 }[] = []; // PENDENTE: cliente escolhe 3 do Google
```

Também escreva no arquivo:
- `HOME`: o título do topo. Direção: "Seguro com atendimento de verdade, do orçamento ao sinistro". Subtítulo: "Comparamos mais de 10 seguradoras para encontrar o melhor preço para você. Fale com um especialista pelo WhatsApp." SEO: título ≤ 60 caracteres e descrição de 70 a 160.
- `DIFFERENTIALS`, com 4 itens:
  - atendimento pelo WhatsApp das 8h às 20h, em dias úteis;
  - acompanhamento em caso de sinistro;
  - comparação entre mais de 10 seguradoras;
  - Prêmio Porto Elite.
- `HOME_STEPS` (3 passos).
- `GENERAL_FAQS`, com 5 ou 6 perguntas:
  - Vocês são uma corretora registrada? (SUSEP 2022910)
  - Quanto custa o atendimento da corretora? (não cobramos do cliente; a corretora é remunerada pela seguradora)
  - Atendem fora de Santo André? (atendimento online para todo o Brasil; confirmar com o cliente)
  - Como aciono meu seguro?
  - Em quanto tempo recebo uma proposta?
- `ABOUT`: 2 parágrafos sobre +12 anos, a equipe atualizada com cursos das seguradoras (texto do site atual) e o atendimento próximo.

Antes de publicar, pergunte ao cliente se a corretora atende todo o Brasil. Até a confirmação, a resposta de "Atendem fora de Santo André?" fica marcada com `// conferir`.

- [ ] **Passo 7: Rodar e confirmar que passa**

Rode: `npm test`
Esperado: todos os testes passam. Se o teste de redação falhar, corrija o texto, nunca o teste.

- [ ] **Passo 8: Revisão do cliente.** Monte, a partir dos arquivos de conteúdo, um resumo em Markdown com os títulos, as coberturas e as perguntas de cada produto, além dos textos da home. Envie ao cliente os títulos, as coberturas e as perguntas frequentes de cada produto, e peça que ele marque o que quer mudar. Aplique as mudanças antes do commit.

- [ ] **Passo 9: Commit**

```bash
git add src/content tests/unit/content.test.ts
git commit -m "feat: conteúdo do site, produtos e seguradoras"
```

- [ ] **Passo 10: Relatar ao cliente.** Liste o que ficou marcado como "conferir" ou "pendente".

---

### Tarefa 7: Identidade visual e estrutura base (com aprovação visual)

**Arquivos:**
- Criar:
  - `src/styles/tokens.css`
  - `src/styles/global.css`
  - `src/layouts/BaseLayout.astro`
  - `src/components/Header.astro`
  - `src/components/Footer.astro`
  - `src/components/WhatsAppFloat.astro`
  - `src/components/Icon.astro`
  - `src/components/TrustBadges.astro`
  - `src/components/Hero.astro`
  - `src/scripts/header.ts`
  - `src/scripts/tracking.ts`
  - `src/assets/brand/*`
  - `public/favicon.svg`
  - `public/favicon-32.png`
  - `public/apple-touch-icon.png`
  - `public/icon-512.png`
  - `public/og.jpg`
  - `public/fonts/*.woff2`
  - `public/robots.txt`
- Modificar: `src/pages/index.astro` (usa o BaseLayout e o Hero)
- Teste: `tests/e2e/layout.spec.ts`

**Interfaces:**
- Consome:
  - `COMPANY`, `HOME` e `PRODUCTS` (Tarefa 6);
  - `buildWhatsAppUrl` e `buildGenericMessage` (Tarefa 2);
  - `trackEvent` (Tarefa 5).
- Produz:
```ts
// BaseLayout.astro Props
interface Props {
  title: string; description: string; path: string;       // path: '/', '/seguro-auto'...
  productName?: string;      // vira <body data-product-name> (ViewContent) e contexto do WhatsApp
  simpleHeader?: boolean;    // cabeçalho enxuto nas páginas de produto
  jsonLd?: Record<string, unknown>;
  noindex?: boolean;
}
// Header.astro Props: { simple?: boolean }
// WhatsAppFloat.astro Props: { context?: string }
// Icon.astro Props: { name: 'whatsapp'|'check'|'shield'|'star'|'phone'|'map'|'clock'|'chevron'|'menu'|'close'|'instagram'|'facebook'|'car'|'home'|'health'|'coin'|'key'|'heart'; size?: number }
// Qualquer link de WhatsApp fora do formulário: <a data-wa-contact data-wa-context="…" href="https://wa.me/…" target="_blank" rel="noopener">
// Âncoras da home: #produtos, #como-funciona, #sobre, #contato
```

- [ ] **Passo 1: Carregar as skills de design.** Invoque `impeccable:impeccable` e depois `design-taste-frontend`, e siga os processos delas para definir a direção visual dentro dos limites da spec (seção 8):
  - estilo "próximo e acolhedor, com um toque de agilidade";
  - cor principal `#003780`;
  - fundos claros e quentes;
  - âmbar discreto como destaque;
  - verde do WhatsApp só no WhatsApp.

  O resultado deste passo é uma nota curta de direção com a fonte escolhida, a paleta exata (com tons de texto e superfície), a escala tipográfica, o raio das bordas e as sombras. Apresente a nota ao cliente em português.

- [ ] **Passo 2: Preparar o logo**
  - Peça ao cliente aprovação para `pip install pymupdf` e converta `brand/Logos/Logo Portugal.ai`, que é compatível com PDF, para SVG:
    ```bash
    python -c "import fitz; d=fitz.open('brand/Logos/Logo Portugal.ai'); open('src/assets/brand/logo.svg','w',encoding='utf-8').write(d[0].get_svg_image(text_as_path=True))"
    ```
    Abra o SVG no navegador pelo Playwright e compare com o `Logo Portugal.png`. Se o SVG estiver com problemas (fundo branco, recorte errado, peso acima de 30 KB), use o PNG.
  - **Alternativa, se não houver aprovação:** copie `Logo Portugal.png` e `Logo Portugal Branco.png` para `src/assets/brand/` e use `<Image>` de `astro:assets` com `width` igual ao dobro do tamanho exibido e `format="webp"`.
  - Gere os favicons a partir do globo (`brand/Logos/Logo.gif`) com Pillow, que já está instalado: globo branco sobre `#003780`, em 32×32, 180×180 (`apple-touch-icon.png`) e 512×512. Gere `favicon.svg` só se a conversão para SVG funcionar.
  - Gere `public/og.jpg` em 1200×630: fundo `#003780`, logo branco centralizado e a frase "Seguros com atendimento de verdade".

- [ ] **Passo 3: Fonte hospedada no site.** Baixe o woff2 variável (subconjunto latin) da fonte escolhida a partir do repositório oficial dela ou do Google Fonts (licença OFL) e salve em `public/fonts/`. Declare o `@font-face` em `global.css` com `font-display: swap` e faça o preload no BaseLayout.

- [ ] **Passo 4: Criar `tokens.css` e `global.css`** a partir da nota de direção. O `tokens.css` precisa ter pelo menos:
  - `--color-brand` (`#003780`), `--color-brand-ink`, `--color-accent`, `--color-whatsapp` (`#25D366`) e `--color-whatsapp-ink`;
  - `--color-bg`, `--color-surface`, `--color-text`, `--color-text-muted`, `--color-border`, `--color-error` e `--color-success`;
  - `--font-sans`, a escala `--step--1` até `--step-5` e a escala de espaçamento `--space-*`;
  - `--radius-*`, `--shadow-*`, `--ease-out` e `--duration-*`;
  - `--container: 72rem`.

  O `global.css` precisa ter:
  - o reset;
  - `body` com `background: var(--color-bg)`;
  - `:focus-visible` com contorno visível;
  - `.skip-link`, `.container` e `.visually-hidden`;
  - `@media (prefers-reduced-motion: reduce)` zerando animações.

  Confira o contraste de cada par texto e fundo (≥ 4,5:1) e registre os valores num comentário no `tokens.css`.

- [ ] **Passo 5: Criar o `BaseLayout.astro`**

```astro
---
import Analytics from '@vercel/analytics/astro';
import Footer from '../components/Footer.astro';
import Header from '../components/Header.astro';
import WhatsAppFloat from '../components/WhatsAppFloat.astro';
import '../styles/tokens.css';
import '../styles/global.css';

interface Props {
  title: string;
  description: string;
  path: string;
  productName?: string;
  simpleHeader?: boolean;
  jsonLd?: Record<string, unknown>;
  noindex?: boolean;
}
const { title, description, path, productName, simpleHeader = false, jsonLd, noindex = false } = Astro.props;
const canonical = new URL(path, Astro.site).href;
const ogImage = new URL('/og.jpg', Astro.site).href;
const ld = jsonLd ? JSON.stringify(jsonLd).replace(/</g, '\\u003c') : null;
---
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    {noindex && <meta name="robots" content="noindex" />}
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:site_name" content="Portugal Corretora de Seguros" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:image" content={ogImage} />
    <meta name="theme-color" content="#003780" />
    <link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <!-- preload da fonte escolhida no Passo 3 -->
    {ld && <script type="application/ld+json" set:html={ld} />}
  </head>
  <body data-product-name={productName}>
    <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <Header simple={simpleHeader} />
    <main id="conteudo"><slot /></main>
    <Footer />
    <WhatsAppFloat context={productName} />
    <Analytics />
    <script>
      import '../scripts/tracking';
    </script>
  </body>
</html>
```

Troque o comentário do preload pela tag `<link rel="preload" href="/fonts/<arquivo>.woff2" as="font" type="font/woff2" crossorigin />` com o arquivo real do Passo 3. Se `favicon.svg` existir, adicione `<link rel="icon" href="/favicon.svg" type="image/svg+xml" />`. O `CookieBanner` entra neste layout na Tarefa 12.

- [ ] **Passo 6: Criar `src/scripts/tracking.ts` e `src/scripts/header.ts`**

`src/scripts/tracking.ts`:
```ts
import { trackEvent } from '../lib/meta-pixel';

document.addEventListener('click', (event) => {
  const link = (event.target as Element | null)?.closest<HTMLElement>('[data-wa-contact]');
  if (!link) return;
  trackEvent('Contact', { content_name: link.dataset.waContext || 'Geral' });
});
```

`src/scripts/header.ts`:
```ts
const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const menu = document.querySelector<HTMLElement>('[data-menu]');

if (toggle && menu) {
  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    menu.dataset.open = String(open);
    document.documentElement.classList.toggle('menu-open', open);
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => {
    if ((e.target as Element).closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
}
```

- [ ] **Passo 7: Criar o Header, o Footer, o WhatsAppFloat, o Icon, o TrustBadges e o Hero.** Os contratos de conteúdo são obrigatórios; o visual segue a nota de direção.
  - **Header completo:**
    - logo (link para `/`, `alt="Portugal Corretora de Seguros"`);
    - navegação com Seguros (`/#produtos`), Como funciona (`/#como-funciona`), Sobre (`/#sobre`) e Já sou cliente (`/ja-sou-cliente`);
    - botão "Falar no WhatsApp" (`data-wa-contact data-wa-context="Cabeçalho"`).
    - No celular, um botão com `data-menu-toggle`, `aria-controls` e `aria-expanded="false"` abre o menu (`data-menu`). Importa `../scripts/header`.
  - **Header `simple`:** logo, link discreto "Outros seguros" (`/#produtos`) e o botão de WhatsApp, sem menu.
  - **Footer:**
    - logo branco, `COMPANY.legalName`, CNPJ, "Corretora registrada na SUSEP nº 2022910", endereço com link para o mapa, horário, WhatsApp e e-mail;
    - ícones de Facebook e Instagram (`rel="noopener"`, com `aria-label`);
    - links para Privacidade (`/privacidade`), "Preferências de cookies" (`<button type="button" data-cookie-preferences>`) e "Avalie-nos no Google" (`/avaliar`);
    - lista dos 6 produtos.
  - **WhatsAppFloat:**
    - `<a class="wa-float" data-wa-contact data-wa-context={context ?? 'Botão flutuante'} href={buildWhatsAppUrl(COMPANY.whatsapp, buildGenericMessage(context))} target="_blank" rel="noopener" aria-label="Falar pelo WhatsApp">`;
    - no desktop, botão redondo no canto inferior direito;
    - em até 640px, barra fina fixa na parte de baixo com o texto "Falar no WhatsApp" e `padding-bottom: env(safe-area-inset-bottom)`;
    - reserve espaço no fim do `body` para a barra não cobrir o rodapé.
  - **Icon:** SVGs inline desenhados à mão ou copiados de fontes de licença livre (registre a origem num comentário), com `aria-hidden="true"`, `fill="currentColor"` e `stroke="currentColor"`.
  - **TrustBadges:** "SUSEP 2022910", "+12 anos de mercado" e "4,8 no Google (19 avaliações)", com link para `COMPANY.google.reviewsUrl`.
  - **Hero (home):**
    - `<h1>` com `HOME.hero.title` e subtítulo;
    - botão principal "Falar com um especialista", que leva ao formulário (`href="#contato"`);
    - botão secundário de WhatsApp;
    - TrustBadges;
    - imagem de apoio: provisória de banco (Unsplash ou Pexels, licença livre), otimizada com `<Image>` ou `<Picture>` com `loading="eager"` e `fetchpriority="high"` só na imagem do topo. Registre em `src/assets/photos/CREDITOS.md`.

    Em 390×844, título, subtítulo, botão principal e selos ficam visíveis sem rolar.

- [ ] **Passo 8: Atualizar `src/pages/index.astro`** para usar o BaseLayout com `title`, `description` e `path="/"` vindos de `HOME.seo`, e o Hero. O restante da home entra na Tarefa 8.

- [ ] **Passo 9: Criar `public/robots.txt`**

```
User-agent: *
Allow: /
Sitemap: https://www.portugalcorretora.com.br/sitemap.xml
```

- [ ] **Passo 10: Escrever o teste `tests/e2e/layout.spec.ts`**

```ts
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
```

- [ ] **Passo 11: Rodar**

Rode: `npm run test:e2e`
Esperado: todos os testes passam nos projetos desktop e mobile.

- [ ] **Passo 12: Prints e análise.** Com o Playwright MCP, abra `http://localhost:4321/` e tire prints em 1440px e 390px (tela inicial e página inteira). Analise hierarquia, contraste, alinhamento, respiro e a aparência de template genérico, seguindo os critérios da impeccable e da design-taste-frontend. Corrija e tire os prints de novo.

- [ ] **Passo 13: Aprovação visual do cliente (obrigatória).** Envie os prints finais em desktop e celular e a nota de direção. **Não siga para a Tarefa 8 sem a aprovação.** Aplique os ajustes pedidos e repita o Passo 12.

- [ ] **Passo 14: Commit**

```bash
git add src public tests/e2e/layout.spec.ts
git commit -m "feat: identidade visual, layout base, cabeçalho, rodapé e topo da home"
```

- [ ] **Passo 15: Relatar ao cliente.**

---

### Tarefa 8: Home completa

**Arquivos:**
- Criar:
  - `src/components/ProductGrid.astro`
  - `src/components/Steps.astro`
  - `src/components/Differentials.astro`
  - `src/components/Stats.astro`
  - `src/components/InsurerLogos.astro`
  - `src/components/Reviews.astro`
  - `src/components/About.astro`
  - `src/components/ClientStrip.astro`
  - `src/components/Faq.astro`
  - `src/components/FinalCta.astro`
  - `src/assets/insurers/*`
  - `src/assets/photos/*`
- Modificar: `src/pages/index.astro`
- Teste: `tests/e2e/home.spec.ts`

**Interfaces:**
- Consome: o conteúdo da Tarefa 6 e o layout da Tarefa 7.
- Produz:
```ts
// ProductGrid.astro Props: { products: readonly Product[] }  → cartões link para `/${slug}`, 4 destacados + 2 menores
// Steps.astro Props: { steps: readonly Item[]; id?: string; title: string }
// Differentials.astro Props: { items: readonly Item[] }
// Stats.astro Props: { stats: readonly { value: string; label: string }[] }
// InsurerLogos.astro Props: { ids?: readonly InsurerId[]; title?: string } → sem ids = todas
// Reviews.astro Props: {} (lê COMPANY.google e TESTIMONIALS; sem depoimentos mostra só nota + link)
// About.astro Props: {} (id="sobre")
// ClientStrip.astro Props: {} → "Precisa acionar o seguro?" + link /ja-sou-cliente
// Faq.astro Props: { faqs: readonly Faq[]; title?: string } → <details>/<summary> nativos
// FinalCta.astro Props: { product?: ProductSlug } → seção id="contato" que recebe o <LeadForm> na Tarefa 9
```

- [ ] **Passo 1: Logos das seguradoras.** Baixe os logos oficiais, de preferência SVG, dos sites ou kits de imprensa de cada seguradora, ou do Wikimedia Commons quando o arquivo vier de fonte oficial. Salve como `src/assets/insurers/<id>.svg` (ou `.png`, no máximo 20 KB, com altura de 80px). Reaproveite `brand/Logos/LOGO PORTO NOVO BRANCO.png` para a Porto, se ajudar. Se não encontrar o logo de alguma seguradora, mostre o nome em texto com o mesmo peso visual e liste a seguradora como pendência. No CSS: `filter: grayscale(1); opacity:.7`, e cor ao passar o mouse ou focar (só com `@media (hover:hover)`).

- [ ] **Passo 2: Fotos provisórias.** Escolha até 4 imagens de banco (Unsplash ou Pexels) de situações reais brasileiras, sem aperto de mão: família em casa, pessoa com o carro, atendimento ao telefone ou WhatsApp. Salve em `src/assets/photos/` e registre autor, link e licença em `CREDITOS.md`. Use sempre `<Image>` ou `<Picture>` com `widths` e `sizes` responsivos e `loading="lazy"` fora do topo.

- [ ] **Passo 3: Implementar os componentes** na ordem da spec (5.1), com os ids de âncora `produtos`, `como-funciona`, `sobre` e `contato`. Cada seção tem um `<h2>` e um `aria-labelledby` apontando para o id do título. As perguntas frequentes usam `<details name="faq-home">` (acordeão nativo). O `FinalCta` por enquanto mostra o título, o texto e o botão de WhatsApp; o formulário entra na Tarefa 9.

- [ ] **Passo 4: Montar o `index.astro`** com as seções, na ordem: Hero, ProductGrid, Steps (`id="como-funciona"`), Differentials, Stats, InsurerLogos, Reviews, About, ClientStrip, Faq (`GENERAL_FAQS`) e FinalCta.

Passe o `jsonLd` para o BaseLayout:
```ts
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'InsuranceAgency',
  name: COMPANY.name,
  url: 'https://www.portugalcorretora.com.br/',
  telephone: '+55-11-93805-2598',
  email: COMPANY.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: COMPANY.address.street,
    addressLocality: COMPANY.address.city,
    addressRegion: COMPANY.address.state,
    postalCode: COMPANY.address.zip,
    addressCountry: 'BR',
  },
  openingHoursSpecification: [{
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '08:00',
    closes: '20:00',
  }],
  aggregateRating: { '@type': 'AggregateRating', ratingValue: COMPANY.google.rating, reviewCount: COMPANY.google.count },
  sameAs: [COMPANY.social.facebook, COMPANY.social.instagram],
};
```

- [ ] **Passo 5: Escrever o teste `tests/e2e/home.spec.ts`**

```ts
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
  await expect(page.locator('a[href="/ja-sou-cliente"]').first()).toBeVisible();
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
```

- [ ] **Passo 6: Rodar**

Rode: `npm run test:e2e`
Esperado: todos os testes passam.

- [ ] **Passo 7: Prints e análise.** Tire prints da página inteira em 1440px e 390px com o Playwright MCP, analise e corrija, pela skill impeccable (hierarquia, ritmo entre seções, repetição de padrões de cartão).

- [ ] **Passo 8: Commit**

```bash
git add src tests/e2e/home.spec.ts
git commit -m "feat: seções completas da home"
```

- [ ] **Passo 9: Relatar ao cliente,** com os prints. Liste as seguradoras sem logo, se houver.

---

### Tarefa 9: Formulário "Falar com um especialista"

**Arquivos:**
- Criar:
  - `src/components/LeadForm.astro`
  - `src/scripts/lead-form.ts`
- Modificar: `src/components/FinalCta.astro` (inclui o `<LeadForm>`)
- Teste: `tests/e2e/lead-form.spec.ts`

**Interfaces:**
- Consome:
  - `validateLead` (Tarefa 3);
  - `maskBrPhoneInput`, `buildLeadMessage`, `buildWhatsAppUrl`, `buildGenericMessage`, `isWithinBusinessHours` e `WHATSAPP_NUMBER` (Tarefa 2);
  - `captureUtm` (Tarefa 3);
  - `trackEvent` (Tarefa 5);
  - `PRODUCT_FORMS` e `PRODUCT_SLUGS` (Tarefa 3);
  - contrato do POST (Tarefa 4).
- Produz: `LeadForm.astro` Props `{ product?: ProductSlug }`, com uma única instância por página, dentro de `#contato`. Hooks de teste:
  - `[data-lead-form]` e `[data-lead-success]`;
  - `[data-error-for="<campo>"]`;
  - `[data-form-status]` e `[data-success-hours]`;
  - `[data-success-fallback]` e `[data-product-select]`;
  - `[data-product-fields="<slug>"]`.

- [ ] **Passo 1: Escrever o teste e2e (deve falhar)**

`tests/e2e/lead-form.spec.ts`:
```ts
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
  await page.goto('/');                        // nova navegação, sem UTM na URL
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
```

Observações:
- As páginas de produto só existem depois da Tarefa 10. Nesta tarefa, rode apenas o teste da home (`-g "home"`). Os demais passam a rodar no Passo 4 da Tarefa 10.
- Para testar a variante com produto fixo antes disso, use no máximo uma página provisória `src/pages/teste-form.astro` com `<LeadForm product="seguro-auto" />` e apague-a antes do commit.

- [ ] **Passo 2: Criar o `LeadForm.astro`**

```astro
---
import { PRODUCT_FORMS, PRODUCT_SLUGS, type ProductSlug } from '../content/product-fields';
import { WHATSAPP_NUMBER } from '../content/contact';
import { buildGenericMessage, buildWhatsAppUrl } from '../lib/whatsapp';

interface Props {
  product?: ProductSlug;
}
const { product } = Astro.props;
const slugs = product ? [product] : [...PRODUCT_SLUGS];
const fallbackUrl = buildWhatsAppUrl(WHATSAPP_NUMBER, buildGenericMessage(product ? PRODUCT_FORMS[product].name : undefined));
---
<div class="lead" data-lead-root>
  <form class="lead__form" data-lead-form novalidate>
    <div class="field">
      <label for="lead-nome">Seu nome</label>
      <input id="lead-nome" name="nome" type="text" autocomplete="name" maxlength="80" required aria-describedby="lead-nome-erro" />
      <p class="field__error" id="lead-nome-erro" data-error-for="nome"></p>
    </div>
    <div class="field">
      <label for="lead-whatsapp">WhatsApp</label>
      <input id="lead-whatsapp" name="whatsapp" type="tel" inputmode="numeric" autocomplete="tel-national" placeholder="(11) 98765-4321" maxlength="16" required aria-describedby="lead-whatsapp-erro" />
      <p class="field__error" id="lead-whatsapp-erro" data-error-for="whatsapp"></p>
    </div>

    {product ? (
      <input type="hidden" name="produto" value={product} />
    ) : (
      <div class="field">
        <label for="lead-produto">Tipo de seguro</label>
        <select id="lead-produto" name="produto" data-product-select required aria-describedby="lead-produto-erro">
          <option value="">Escolha uma opção</option>
          {PRODUCT_SLUGS.map((s) => <option value={s}>{PRODUCT_FORMS[s].name}</option>)}
        </select>
        <p class="field__error" id="lead-produto-erro" data-error-for="produto"></p>
      </div>
    )}

    {slugs.map((slug) => (
      <fieldset class="lead__product" data-product-fields={slug} hidden={!product} disabled={!product}>
        <legend class="visually-hidden">Detalhes de {PRODUCT_FORMS[slug].name}</legend>
        {PRODUCT_FORMS[slug].fields.map((field) => {
          const id = `lead-${slug}-${field.id}`;
          const name = `detalhes.${field.id}`;
          return (
            <div class="field">
              <label for={id}>{field.label}</label>
              {field.kind === 'select' ? (
                <select id={id} name={name} required aria-describedby={`${id}-erro`}>
                  <option value="">Escolha uma opção</option>
                  {field.options.map((o) => <option value={o}>{o}</option>)}
                </select>
              ) : (
                <input id={id} name={name} type="text" placeholder={field.placeholder} maxlength={field.maxLength} required aria-describedby={`${id}-erro`} />
              )}
              <p class="field__error" id={`${id}-erro`} data-error-for={name}></p>
            </div>
          );
        })}
      </fieldset>
    ))}

    <div class="field">
      <label for="lead-cidade">Cidade <span class="field__optional">(opcional)</span></label>
      <input id="lead-cidade" name="cidade" type="text" autocomplete="address-level2" maxlength="60" aria-describedby="lead-cidade-erro" />
      <p class="field__error" id="lead-cidade-erro" data-error-for="cidade"></p>
    </div>

    <div class="lead__hp" aria-hidden="true">
      <label for="lead-website">Não preencha este campo</label>
      <input id="lead-website" name="website" type="text" tabindex="-1" autocomplete="off" />
    </div>

    <p class="lead__status" data-form-status role="alert"></p>
    <button class="button button--primary" type="submit">Falar com um especialista</button>
    <p class="lead__notice">
      Ao enviar, você concorda em ser contatado pela Portugal Corretora. Veja nossa{' '}
      <a href="/privacidade">Política de Privacidade</a>.
    </p>
  </form>

  <div class="lead__success" data-lead-success hidden tabindex="-1">
    <h3>Pronto! Abrimos o WhatsApp para você.</h3>
    <p data-success-hours></p>
    <a class="button button--whatsapp" data-success-fallback href={fallbackUrl} target="_blank" rel="noopener">Não abriu? Toque aqui</a>
  </div>

  <noscript>
    <p><a href={fallbackUrl} target="_blank" rel="noopener">Falar pelo WhatsApp</a></p>
  </noscript>
</div>

<script>
  import '../scripts/lead-form';
</script>
```

Estilize o formulário seguindo a direção visual:
- `.lead__hp` com `position:absolute; left:-9999px`, nunca `display:none`, porque alguns robôs ignoram campos ocultos;
- campos com altura ≥ 48px e `font-size` ≥ 16px, para o iOS não dar zoom;
- erros em `--color-error`;
- estado `aria-invalid="true"` com borda de erro.

- [ ] **Passo 3: Criar `src/scripts/lead-form.ts`**

```ts
import { WHATSAPP_NUMBER } from '../content/contact';
import { isWithinBusinessHours } from '../lib/business-hours';
import { validateLead, type LeadErrors } from '../lib/lead';
import { trackEvent } from '../lib/meta-pixel';
import { maskBrPhoneInput } from '../lib/phone';
import { captureUtm } from '../lib/utm';
import { buildLeadMessage, buildWhatsAppUrl } from '../lib/whatsapp';

const OFFLINE_MSG = 'Parece que você está sem internet. Verifique a conexão e tente de novo. Seus dados continuam aqui.';
const IN_HOURS_MSG = 'Nossa equipe continua a conversa com você por lá.';
const OFF_HOURS_MSG =
  'Recebemos seu contato! Nosso atendimento funciona de segunda a sexta, das 8h às 20h. Retornamos no próximo dia útil.';

function sessionStore(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function showErrors(form: HTMLFormElement, errors: LeadErrors) {
  let first: HTMLElement | null = null;
  form.querySelectorAll<HTMLElement>('[data-error-for]').forEach((slot) => {
    const key = slot.dataset.errorFor as string;
    const message = errors[key] ?? '';
    slot.textContent = message;
    const control = form.querySelector<HTMLElement>(`[name="${key}"]:not([type="hidden"])`);
    if (!control) return;
    if (message) {
      control.setAttribute('aria-invalid', 'true');
      if (!first && !control.closest('fieldset[disabled]')) first = control;
    } else {
      control.removeAttribute('aria-invalid');
    }
  });
  (first as HTMLElement | null)?.focus();
}

function initLeadForm(root: HTMLElement) {
  const form = root.querySelector<HTMLFormElement>('[data-lead-form]');
  const success = root.querySelector<HTMLElement>('[data-lead-success]');
  if (!form || !success) return;
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const startedAt = performance.now();
  const utm = captureUtm(sessionStore(), window.location.search);
  let sent = false;

  const select = form.querySelector<HTMLSelectElement>('[data-product-select]');
  const syncFieldsets = () => {
    form.querySelectorAll<HTMLFieldSetElement>('[data-product-fields]').forEach((fs) => {
      const active = !select || fs.dataset.productFields === select.value;
      fs.hidden = !active;
      fs.disabled = !active;
    });
  };
  if (select) {
    select.addEventListener('change', syncFieldsets);
    syncFieldsets();
  }

  const phone = form.querySelector<HTMLInputElement>('[name="whatsapp"]');
  phone?.addEventListener('input', () => {
    phone.value = maskBrPhoneInput(phone.value);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (sent) return;

    const data = new FormData(form);
    const detalhes: Record<string, string> = {};
    for (const [key, value] of data) {
      if (key.startsWith('detalhes.') && typeof value === 'string') detalhes[key.slice('detalhes.'.length)] = value;
    }
    const payload = {
      nome: String(data.get('nome') ?? ''),
      whatsapp: String(data.get('whatsapp') ?? ''),
      produto: String(data.get('produto') ?? ''),
      detalhes,
      cidade: String(data.get('cidade') ?? ''),
      pagina: window.location.pathname,
      utm,
      elapsedMs: Math.round(performance.now() - startedAt),
      website: String(data.get('website') ?? ''),
    };

    const result = validateLead(payload);
    showErrors(form, result.ok ? {} : result.errors);
    if (!result.ok) return;

    if (!navigator.onLine) {
      if (status) status.textContent = OFFLINE_MSG;
      return;
    }
    if (status) status.textContent = '';
    sent = true;

    const { lead } = result;
    const url = buildWhatsAppUrl(
      WHATSAPP_NUMBER,
      buildLeadMessage({
        nome: lead.nome,
        cidade: lead.cidade,
        productName: lead.produtoNome,
        detalhes: lead.detalhes.map((d) => d.value),
      }),
    );

    fetch('/api/lead', {
      method: 'POST',
      keepalive: true,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {
      /* o WhatsApp já abriu; a falha do e-mail fica no log do servidor */
    });
    trackEvent('Lead', { content_name: lead.produtoNome });

    const hours = success.querySelector<HTMLElement>('[data-success-hours]');
    if (hours) hours.textContent = isWithinBusinessHours(new Date()) ? IN_HOURS_MSG : OFF_HOURS_MSG;
    success.querySelector<HTMLAnchorElement>('[data-success-fallback]')?.setAttribute('href', url);
    form.hidden = true;
    success.hidden = false;
    success.focus();

    const win = window.open(url, '_blank');
    if (win) win.opener = null;
    else window.location.href = url;
  });
}

document.querySelectorAll<HTMLElement>('[data-lead-root]').forEach(initLeadForm);
```

Observações sobre o script:
- Na página de produto não existe `select`, e `syncFieldsets` não roda. O fieldset já vem habilitado pelo servidor.
- A mensagem de sucesso aparece antes do `window.open`, para que, se a navegação acontecer na mesma aba, o estado fique salvo quando a pessoa voltar pelo botão "voltar" (bfcache).

- [ ] **Passo 4: Incluir o `<LeadForm product={product} />` no `FinalCta.astro`**, dentro da seção `id="contato"`.

- [ ] **Passo 5: Rodar**

Rode: `npx playwright test tests/e2e/lead-form.spec.ts -g "home"`
Esperado: o teste da home passa nos dois projetos.

Confira também o peso do script:
```bash
npm run build
ls -la .vercel/output/static/_astro/*.js
```
Esperado: a soma dos JS usados pela home fica abaixo de 30 KB. Se passar, investigue o que entrou no pacote.

- [ ] **Passo 6: Testar com o Playwright MCP em 390px.** Preencha o formulário real no navegador, confira o teclado numérico do campo WhatsApp (`inputmode`), a máscara, as mensagens de erro e a tela de sucesso. Tire prints dos estados vazio, com erro e de sucesso.

- [ ] **Passo 7: Commit**

```bash
git add src/components/LeadForm.astro src/scripts/lead-form.ts src/components/FinalCta.astro tests/e2e/lead-form.spec.ts
git commit -m "feat: formulário Falar com um especialista integrado ao WhatsApp e à API"
```

- [ ] **Passo 8: Relatar ao cliente,** com os prints dos três estados.

---

### Tarefa 10: Páginas de produto

**Arquivos:**
- Criar: `src/pages/[produto].astro`
- Teste: `tests/e2e/products.spec.ts`

**Interfaces:**
- Consome:
  - `PRODUCTS` e `getProduct` (Tarefa 6);
  - BaseLayout com `simpleHeader` e `productName` (Tarefa 7);
  - LeadForm (Tarefa 9);
  - Steps, InsurerLogos, Reviews, Faq, TrustBadges e FinalCta (Tarefas 7 e 8).
- Produz: as 6 rotas estáticas `/<slug>` e o `<body data-product-name="<Nome>">`, usado pelo `ViewContent` na Tarefa 12.

- [ ] **Passo 1: Escrever o teste (deve falhar)**

`tests/e2e/products.spec.ts`:
```ts
import { expect, test } from '@playwright/test';

const PRODUCTS = [
  ['seguro-auto', 'Seguro Auto'],
  ['seguro-residencial', 'Seguro Residencial'],
  ['plano-de-saude', 'Plano de Saúde'],
  ['consorcio', 'Consórcio'],
  ['fianca-locaticia', 'Fiança Locatícia'],
  ['seguro-de-vida', 'Seguro de Vida'],
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
```

- [ ] **Passo 2: Rodar e confirmar que falha**

Rode: `npx playwright test tests/e2e/products.spec.ts`
Esperado: FALHA, com status 404.

- [ ] **Passo 3: Criar `src/pages/[produto].astro`**

```astro
---
import type { GetStaticPaths } from 'astro';
import BaseLayout from '../layouts/BaseLayout.astro';
import Faq from '../components/Faq.astro';
import InsurerLogos from '../components/InsurerLogos.astro';
import LeadForm from '../components/LeadForm.astro';
import Reviews from '../components/Reviews.astro';
import Steps from '../components/Steps.astro';
import TrustBadges from '../components/TrustBadges.astro';
import { PRODUCTS, type Product } from '../content/products';

export const getStaticPaths = (() =>
  PRODUCTS.map((product) => ({ params: { produto: product.slug }, props: { product } }))) satisfies GetStaticPaths;

interface Props {
  product: Product;
}
const { product } = Astro.props;
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: product.faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};
---
<BaseLayout
  title={product.seo.title}
  description={product.seo.description}
  path={`/${product.slug}`}
  productName={product.name}
  simpleHeader
  jsonLd={jsonLd}
>
  <section class="product-hero" aria-labelledby="produto-titulo">
    <div class="container product-hero__grid">
      <div>
        {product.badge && <p class="badge">{product.badge}</p>}
        <h1 id="produto-titulo">{product.hero.title}</h1>
        <p class="product-hero__subtitle">{product.hero.subtitle}</p>
        <TrustBadges />
      </div>
      <div id="contato" class="product-hero__form">
        <LeadForm product={product.slug} />
      </div>
    </div>
  </section>

  <section aria-labelledby="coberturas-titulo">
    <div class="container">
      <h2 id="coberturas-titulo">{product.coveragesTitle}</h2>
      <ul class="coverages">
        {product.coverages.map((c) => (
          <li><h3>{c.title}</h3><p>{c.text}</p></li>
        ))}
      </ul>
    </div>
  </section>

  <section aria-labelledby="publico-titulo">
    <div class="container">
      <h2 id="publico-titulo">Para quem é</h2>
      <ul class="audiences">
        {product.audiences.map((a) => (
          <li><h3>{a.title}</h3><p>{a.text}</p></li>
        ))}
      </ul>
    </div>
  </section>

  <Steps steps={product.steps} title="Como funciona" id="como-funciona" />
  <InsurerLogos ids={product.insurers} title={`Seguradoras parceiras para ${product.name}`} />
  <Reviews />
  <Faq faqs={product.faqs} title={`Dúvidas sobre ${product.name}`} />

  <section class="final-cta" aria-labelledby="cta-final-titulo">
    <div class="container">
      <h2 id="cta-final-titulo">Pronto para ficar protegido?</h2>
      <a class="button button--primary" href="#contato">Falar com um especialista</a>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Passo 4: Rodar**

Rode:
```bash
npx playwright test tests/e2e/products.spec.ts
npx playwright test tests/e2e/lead-form.spec.ts
npm test
```
Esperado: todos os testes passam, agora incluindo os testes do formulário nas páginas de produto.

- [ ] **Passo 5: Prints e análise.** Tire prints das 6 páginas em 1440px e 390px com o Playwright MCP, analise e corrija. Atenção a produtos com textos mais longos, que podem quebrar o topo no celular.

- [ ] **Passo 6: Commit**

```bash
git add src tests/e2e/products.spec.ts
git commit -m "feat: páginas de destino dos 6 produtos"
```

- [ ] **Passo 7: Relatar ao cliente,** com os prints, e lembre as pendências de seguradoras por produto.

---

### Tarefa 11: Páginas de apoio, redirecionamentos e SEO técnico

**Arquivos:**
- Criar:
  - `src/pages/ja-sou-cliente.astro`
  - `src/pages/privacidade.astro`
  - `src/pages/404.astro`
  - `src/pages/sitemap.xml.ts`
  - `vitest.build.config.ts`
- Modificar: `astro.config.mjs` (redirecionamentos, inclusive `/avaliar`) e `package.json` (script `test:build`)
- Testes: `tests/e2e/support-pages.spec.ts` e `tests/build/vercel-output.test.ts`

**Interfaces:**
- Consome: `COMPANY` e `INSURERS` (Tarefa 6); BaseLayout (Tarefa 7).

- [ ] **Passo 1: Mapear os endereços do site antigo.** Com o Playwright MCP, abra `https://www.portugalcorretora.com.br`, expanda os menus "Mais páginas" e liste todos os `href` internos. Monte a tabela de destino:
  - produtos → `/<slug>` correspondente;
  - `/servicos` → `/#produtos`;
  - `/portugal` e subpáginas → `/#sobre`;
  - `/contato` → `/#contato`;
  - o que não tiver correspondência → `/`.

- [ ] **Passo 2: Escrever o teste (deve falhar)**

`tests/e2e/support-pages.spec.ts`:
```ts
import { expect, test } from '@playwright/test';

test('já sou cliente: WhatsApp de sinistro e telefones de assistência', async ({ page }) => {
  const res = await page.goto('/ja-sou-cliente');
  expect(res?.status()).toBe(200);
  const wa = page.locator('a[data-wa-context="Já sou cliente"]').first();
  expect(new URL((await wa.getAttribute('href'))!).searchParams.get('text')).toBe(
    'Olá! Já sou cliente da Portugal Corretora e preciso de ajuda com meu seguro.',
  );
  await expect(page.locator('a[href^="tel:"]').first()).toBeAttached();
});

test('privacidade: dados da corretora, encarregado e cookies', async ({ page }) => {
  await page.goto('/privacidade');
  const main = page.locator('main');
  for (const t of ['21.427.722/0001-05', 'atendimento@portugalcorretora.com.br', 'Resend', 'Vercel', 'Meta', 'pc-consent']) {
    await expect(main).toContainText(t);
  }
});

test('avaliar: redireciona (302) para a avaliação no Google', async ({ page }) => {
  await page.route('https://www.google.com/**', (r) => r.fulfill({ status: 200, body: 'google' }));
  await page.goto('/avaliar');
  await page.waitForURL(/google\.com\/search.*#lrd=0x94ce42600eb7bcaf:0x491b7e07925c034e,3/);
});

test('404 personalizado com links para os produtos', async ({ page }) => {
  const res = await page.goto('/pagina-que-nao-existe');
  expect(res?.status()).toBe(404);
  await expect(page.locator('a[href="/seguro-auto"]')).toBeAttached();
});

test('redirecionamentos do site antigo', async ({ request }) => {
  for (const [from, to] of [['/servicos', '/#produtos'], ['/contato', '/#contato'], ['/portugal', '/#sobre']]) {
    const res = await request.get(from, { maxRedirects: 0 });
    expect(res.status()).toBe(301);
    expect(res.headers()['location']).toBe(to);
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
```

`tests/build/vercel-output.test.ts`, que confere a saída real que vai para a Vercel:
```ts
import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

const config = JSON.parse(readFileSync('.vercel/output/config.json', 'utf-8')) as {
  routes: { src?: string; status?: number; headers?: Record<string, string>; continue?: boolean }[];
};
const route = (src: string) => config.routes.find((r) => r.src === src);

describe('redirecionamentos na saída da Vercel', () => {
  test.each([
    ['^/servicos$', 301, '/#produtos'],
    ['^/contato$', 301, '/#contato'],
    ['^/portugal$', 301, '/#sobre'],
    ['^/avaliar$', 302, 'https://www.google.com/search?q=portugal+corretora+de+seguros#lrd=0x94ce42600eb7bcaf:0x491b7e07925c034e,3'],
  ])('%s → %i %s', (src, status, location) => {
    expect(route(src)?.status).toBe(status);
    expect(route(src)?.headers?.Location).toBe(location);
  });
  test('barra final é removida antes dos redirecionamentos (308)', () => {
    const i = config.routes.findIndex((r) => r.src === '^/(.*)/$' && r.status === 308);
    expect(i).toBeGreaterThanOrEqual(0);
    expect(i).toBeLessThan(config.routes.findIndex((r) => r.src === '^/servicos$'));
  });
});
```

`vitest.build.config.ts`:
```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({ test: { include: ['tests/build/**/*.test.ts'], environment: 'node' } });
```

Em `package.json`, adicione o script `"test:build": "astro build && vitest run --config vitest.build.config.ts"`.

- [ ] **Passo 3: Rodar e confirmar que falha**

Rode: `npx playwright test tests/e2e/support-pages.spec.ts`
Esperado: FALHA.

- [ ] **Passo 4: Implementar**

Em `astro.config.mjs`, adicione (com as linhas extras mapeadas no Passo 1). O `/avaliar` usa **302 (temporário)** para o navegador não guardar o destino para sempre, caso o link do Google mude:
```js
redirects: {
  '/servicos': '/#produtos',
  '/contato': '/#contato',
  '/portugal': '/#sobre',
  '/avaliar': {
    status: 302,
    destination: 'https://www.google.com/search?q=portugal+corretora+de+seguros#lrd=0x94ce42600eb7bcaf:0x491b7e07925c034e,3',
  },
},
```
Mantenha esse destino igual a `COMPANY.google.writeReviewUrl` (Tarefa 6). O `astro.config.mjs` não importa arquivos `.ts`, por isso o valor é repetido. O teste de build confere o valor.

`src/pages/sitemap.xml.ts`:
```ts
import type { APIRoute } from 'astro';
import { PRODUCTS } from '../content/products';

export const GET: APIRoute = ({ site }) => {
  const base = (site?.href ?? 'https://www.portugalcorretora.com.br/').replace(/\/$/, '');
  const paths = ['/', ...PRODUCTS.map((p) => `/${p.slug}`), '/ja-sou-cliente', '/privacidade'];
  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    paths.map((p) => `  <url><loc>${base}${p}</loc></url>`).join('\n') +
    '\n</urlset>\n';
  return new Response(body, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
};
```

**`ja-sou-cliente.astro`** (BaseLayout, `path="/ja-sou-cliente"`):
- `<h1>` "Já é cliente? Estamos com você";
- botão principal de WhatsApp com `data-wa-contact data-wa-context="Já sou cliente"` e a mensagem exata "Olá! Já sou cliente da Portugal Corretora e preciso de ajuda com meu seguro.", montada com `buildWhatsAppUrl(COMPANY.whatsapp, …)`;
- blocos "Acionar sinistro", "Assistência 24h da seguradora", "Segunda via de boleto ou apólice" e "Alterar meu seguro", cada um com um texto curto e o mesmo WhatsApp;
- lista das seguradoras que têm `assistance`, com `<a href="tel:+55…">`, `label` e a nota "Números informados pelas seguradoras. Em caso de dúvida, fale com a gente.";
- horário (`COMPANY.hoursLabel`), com a ressalva de que a assistência das seguradoras funciona 24h pelo telefone delas.

**`privacidade.astro`** (BaseLayout, `path="/privacidade"`). Seções:
1. Quem somos: `COMPANY.name`, `legalName`, CNPJ, endereço e SUSEP.
2. Quais dados coletamos:
   - formulário: nome, WhatsApp, produto, detalhes, cidade opcional, página e campanha de origem;
   - navegação com consentimento: cookies da Meta;
   - navegação sem cookies: estatísticas anônimas da Vercel.
3. Para que usamos: contato e proposta; medir e melhorar os anúncios, apenas com consentimento.
4. Bases legais: procedimentos preliminares a contrato a pedido do titular (LGPD, art. 7º, V) para o formulário; consentimento (art. 7º, I) para os cookies de marketing.
5. Com quem compartilhamos:
   - Vercel (hospedagem);
   - Resend (envio do e-mail);
   - Meta (só com consentimento);
   - seguradoras parceiras, para elaborar a proposta, quando você seguir com o atendimento.
6. Por quanto tempo guardamos: o site não armazena os dados. O e-mail de atendimento e o WhatsApp da corretora guardam as conversas pelo tempo necessário ao atendimento e às obrigações legais.
7. Seus direitos (art. 18): confirmação, acesso, correção, eliminação, portabilidade, revogação do consentimento etc. Como exercer: pelo encarregado de dados, em `COMPANY.dpoEmail`.
8. Cookies: tabela com `pc-consent` (localStorage, guarda a sua escolha, 6 meses), `pc-utm` (sessionStorage, campanha de origem, até fechar a aba) e `_fbp`/`fr` (Meta, só após "Aceitar"). Inclua o botão `data-cookie-preferences` "Alterar minhas preferências".
9. Atualizações desta política, com a data da última atualização.

Coloque no topo do arquivo o comentário `<!-- Recomenda-se revisão jurídica antes da publicação -->`.

**`404.astro`**: BaseLayout com `noindex` e `path="/404"`, a mensagem "Não encontramos esta página", o ProductGrid (os 6 produtos) e o botão de WhatsApp.

- [ ] **Passo 5: Rodar**

Rode: `npx playwright test tests/e2e/support-pages.spec.ts`
Esperado: todos os testes passam.

Depois rode `npm run test:build`.
Esperado: todos os testes de build passam.

- [ ] **Passo 6: Prints das 3 páginas em 1440px e 390px,** com análise e correções.

- [ ] **Passo 7: Commit**

```bash
git add src astro.config.mjs package.json vitest.build.config.ts tests/e2e/support-pages.spec.ts tests/build
git commit -m "feat: já sou cliente, privacidade, avaliar, 404, sitemap e redirecionamentos"
```

- [ ] **Passo 8: Relatar ao cliente.** Envie o texto da política de privacidade para leitura e recomende a revisão jurídica.

---

### Tarefa 12: Aviso de cookies, Pixel no site, Analytics e headers de segurança

**Arquivos:**
- Criar:
  - `src/components/CookieBanner.astro`
  - `src/scripts/cookie-consent.ts`
  - `integrations/security-headers.mjs`
- Modificar:
  - `src/layouts/BaseLayout.astro` (inclui o `<CookieBanner />` antes de `<Analytics />`)
  - `astro.config.mjs` (registra a integração)
  - `tests/build/vercel-output.test.ts` (confere os headers)
- Teste: `tests/e2e/consent.spec.ts`

**Interfaces:**
- Consome: `readConsent`, `writeConsent`, `safeLocalStorage`, `loadPixel` e `trackEvent` (Tarefa 5); `PUBLIC_META_PIXEL_ID` (`astro:env/client`, Tarefa 1); `[data-cookie-preferences]` (Footer, Tarefa 7, e Privacidade, Tarefa 11); `body[data-product-name]` (Tarefa 10).

- [ ] **Passo 1: Escrever o teste (deve falhar)**

`tests/e2e/consent.spec.ts`:
```ts
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
```

- [ ] **Passo 2: Rodar e confirmar que falha**

Rode: `npx playwright test tests/e2e/consent.spec.ts`
Esperado: FALHA, porque `[data-cookie-banner]` não existe.

- [ ] **Passo 3: Criar o `CookieBanner.astro`**

```astro
<section class="cookie-banner" data-cookie-banner hidden aria-labelledby="cookie-titulo" aria-describedby="cookie-texto">
  <h2 id="cookie-titulo" class="visually-hidden">Aviso de cookies</h2>
  <p id="cookie-texto">
    Usamos cookies de marketing (Meta) para medir nossos anúncios, apenas se você aceitar.{' '}
    <a href="/privacidade#cookies">Saiba mais</a>.
  </p>
  <div class="cookie-banner__actions">
    <button type="button" class="button button--secondary" data-consent="denied">Recusar</button>
    <button type="button" class="button button--primary" data-consent="granted">Aceitar</button>
  </div>
</section>

<script>
  import '../scripts/cookie-consent';
</script>
```

Estilo:
- barra fixa na parte de baixo, com os dois botões do **mesmo tamanho e peso visual**;
- em até 640px, fica acima da barra do WhatsApp: `body:has([data-cookie-banner]:not([hidden])) .wa-float { … }`, ou calcule o `bottom` do aviso com a altura da barra;
- não pode cobrir o botão do formulário: com o aviso aberto, adicione `padding-bottom` ao `body` igual à altura do aviso.

Na página de privacidade, a seção de cookies precisa ter `id="cookies"`.

- [ ] **Passo 4: Criar `src/scripts/cookie-consent.ts`**

```ts
import { PUBLIC_META_PIXEL_ID } from 'astro:env/client';
import { readConsent, safeLocalStorage, writeConsent, type ConsentStatus } from '../lib/consent';
import { loadPixel, trackEvent } from '../lib/meta-pixel';

const banner = document.querySelector<HTMLElement>('[data-cookie-banner]');
const storage = safeLocalStorage();
let sessionChoice: ConsentStatus | null = null; // usado quando o armazenamento está bloqueado

function activate() {
  if (!loadPixel(PUBLIC_META_PIXEL_ID)) return;
  const product = document.body.dataset.productName;
  if (product) trackEvent('ViewContent', { content_name: product });
}

function choose(status: ConsentStatus) {
  const hadPixel = 'fbq' in window;
  if (!writeConsent(storage, status, new Date())) sessionChoice = status;
  if (banner) banner.hidden = true;
  if (status === 'granted') activate();
  else if (hadPixel) window.location.reload(); // descarrega o Pixel já carregado
}

const current = readConsent(storage, new Date()) ?? sessionChoice;
if (current === 'granted') activate();
else if (current === null && banner) banner.hidden = false;

banner?.querySelector('[data-consent="granted"]')?.addEventListener('click', () => choose('granted'));
banner?.querySelector('[data-consent="denied"]')?.addEventListener('click', () => choose('denied'));

document.querySelectorAll<HTMLElement>('[data-cookie-preferences]').forEach((el) =>
  el.addEventListener('click', (event) => {
    event.preventDefault();
    if (!banner) return;
    banner.hidden = false;
    banner.querySelector<HTMLButtonElement>('button')?.focus();
  }),
);
```

- [ ] **Passo 5: Incluir o `<CookieBanner />` no BaseLayout,** antes de `<Analytics />`.

- [ ] **Passo 6: Headers de segurança pela integração local** (validada no teste prático; o `vercel.json` não é usado)

`integrations/security-headers.mjs`:
```js
import { readFile, writeFile } from 'node:fs/promises';

export const SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=31536000',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' https://connect.facebook.net",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://www.facebook.com",
    "font-src 'self'",
    "connect-src 'self' https://www.facebook.com https://connect.facebook.net",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    'upgrade-insecure-requests',
  ].join('; '),
};

/** Insere os headers no começo das rotas da Vercel, depois que o adaptador escreve o config.json. */
export default function securityHeaders(headers = SECURITY_HEADERS) {
  return {
    name: 'security-headers',
    hooks: {
      'astro:build:done': async ({ logger }) => {
        const file = new URL('../.vercel/output/config.json', import.meta.url);
        const config = JSON.parse(await readFile(file, 'utf-8'));
        config.routes.unshift({ src: '^/(.*)$', headers, continue: true });
        await writeFile(file, JSON.stringify(config, null, 2));
        logger.info('headers de segurança adicionados ao config.json da Vercel');
      },
    },
  };
}
```

Em `astro.config.mjs`: `import securityHeaders from './integrations/security-headers.mjs';` e `integrations: [securityHeaders()]`.

Acrescente a `tests/build/vercel-output.test.ts`:
```ts
import { SECURITY_HEADERS } from '../../integrations/security-headers.mjs';

describe('headers de segurança na saída da Vercel', () => {
  test('primeira rota aplica os headers a tudo e continua', () => {
    expect(config.routes[0]).toEqual({ src: '^/(.*)$', headers: SECURITY_HEADERS, continue: true });
  });
  test('aparecem uma única vez', () => {
    expect(config.routes.filter((r) => r.headers?.['Content-Security-Policy'])).toHaveLength(1);
  });
});
```

Rode `npm run test:build`.
Esperado: todos os testes de build passam.

- [ ] **Passo 7: Conferir scripts inline, que a CSP acima bloquearia**

Rode:
```bash
npm run build
grep -rhoE '<script(\s[^>]*)?>' .vercel/output/static --include=*.html | sort | uniq -c
```

Esperado: só aparecem `<script type="module" src="/_astro/…">` e `<script type="application/ld+json">`. Scripts `application/ld+json` não são executados e a CSP não os bloqueia.

Se aparecer algum `<script>` executável inline, por exemplo da `<Analytics />` ou de algum script que o Astro embutiu:
- verifique se a opção `security.csp` do Astro 7 gera hashes automaticamente (consulte docs.astro.build);
- se não gerar, acrescente `'unsafe-inline'` ao `script-src`, registre o motivo num comentário do README e sinalize para a security-review.

Confira também de onde a `<Analytics />` carrega o script em produção (`/_vercel/insights/script.js`, mesma origem) e ajuste o `script-src` e o `connect-src`, se necessário.

- [ ] **Passo 8: Rodar tudo**

Rode:
```bash
npx playwright test tests/e2e/consent.spec.ts
npm run test:e2e
npm test
```
Esperado: todos os testes passam.

- [ ] **Passo 9: Prints do aviso** em 1440px e 390px, na home e numa página de produto, conferindo que ele não cobre o formulário nem o WhatsApp.

- [ ] **Passo 10: Commit**

```bash
git add src integrations astro.config.mjs tests/build tests/e2e/consent.spec.ts
git commit -m "feat: aviso de cookies, Pixel condicionado ao consentimento, Analytics e headers de segurança"
```

- [ ] **Passo 11: Relatar ao cliente.** Explique que a verificação real dos headers acontece no primeiro deploy (Tarefa 15).

---

### Tarefa 13: Animações e polimento

**Arquivos:**
- Modificar: componentes e CSS existentes; opcionalmente criar `src/scripts/reveal.ts`.
- Teste: `tests/e2e/a11y-motion.spec.ts`

- [ ] **Passo 1: Invocar a skill `emil-design-eng`** e aplicar só animações sutis e funcionais:
  - entrada suave das seções ao rolar (opacidade e translação de até 12px, entre 200 e 300ms, com `--ease-out`), feita com um `IntersectionObserver` único em `src/scripts/reveal.ts` que adiciona a classe `is-visible`. O conteúdo precisa ser visível sem JS: a classe inicial só é aplicada via `html.js`, definida no próprio script;
  - resposta ao toque e ao passar o mouse nos botões e cartões (`transform: translateY(-1px)` ou `scale(.98)` no `:active`, com transições de até 150ms);
  - abertura das perguntas frequentes (`details`) com transição de altura via `interpolate-size` ou `::details-content`, quando o navegador suportar. Nos outros, abre sem animação;
  - nada de animação contínua ou em loop, parallax ou contagem animada de números.

  Tudo desliga com `prefers-reduced-motion: reduce`. A imagem principal do topo nunca é animada, para não piorar o LCP.

- [ ] **Passo 2: Invocar a skill `impeccable:impeccable`** no modo de crítica e polimento, cobrindo:
  - espaçamentos;
  - alinhamentos;
  - estados de foco;
  - microtextos;
  - estados vazios (avaliações sem depoimentos, seguradora sem logo);
  - consistência entre as páginas.

  Aplique as correções materiais.

- [ ] **Passo 3: Escrever `tests/e2e/a11y-motion.spec.ts`**

```ts
import { expect, test } from '@playwright/test';

test('com reduzir movimento, nenhuma transição ou animação longa', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const long = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('body *')].filter((el) => {
      const s = getComputedStyle(el);
      const secs = (v: string) => Math.max(...v.split(',').map((x) => parseFloat(x) || 0));
      return secs(s.transitionDuration) > 0.01 || secs(s.animationDuration) > 0.01;
    }).length,
  );
  expect(long).toBe(0);
});

test('conteúdo visível sem JavaScript', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4321/');
  await expect(page.locator('#produtos')).toBeVisible();
  const hidden = await page.evaluate(() => getComputedStyle(document.querySelector('#produtos')!).opacity);
  expect(hidden).toBe('1');
  await ctx.close();
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
    [...document.querySelectorAll<HTMLElement>('a.button, button, .wa-float, [data-menu-toggle]')]
      .filter((el) => el.offsetParent !== null)
      .map((el) => el.getBoundingClientRect())
      .filter((r) => r.height < 44 || r.width < 44).length,
  );
  expect(small).toBe(0);
});
```

- [ ] **Passo 4: Rodar**

Rode: `npm run test:e2e`
Esperado: todos os testes passam.

- [ ] **Passo 5: Prints finais de todas as páginas** em 1440px e 390px, com análise e correções.

- [ ] **Passo 6: Commit**

```bash
git add src tests/e2e/a11y-motion.spec.ts
git commit -m "feat: animações sutis, polimento visual e acessibilidade"
```

- [ ] **Passo 7: Relatar ao cliente,** com os prints. Lembre que a skill **review-animations** será chamada manualmente pelo cliente no fim. Ela não está instalada; peça que ele instale antes da Tarefa 15.

---

### Tarefa 14: Desempenho, verificação completa e manual de manutenção

**Arquivos:**
- Criar:
  - `scripts/serve-static.mjs`
  - `tests/e2e/screenshots.spec.ts`
- Modificar: `README.md`

- [ ] **Passo 1: Criar `scripts/serve-static.mjs`**, que serve o build final sem dependências novas:

```js
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const root = join(process.cwd(), '.vercel/output/static');
const port = Number(process.env.PORT ?? 4322);
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2',
  '.xml': 'application/xml', '.txt': 'text/plain', '.ico': 'image/x-icon',
};

function resolve(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  for (const candidate of [clean, `${clean}.html`, join(clean, 'index.html')]) {
    const file = join(root, candidate);
    if (file.startsWith(root) && existsSync(file) && statSync(file).isFile()) return file;
  }
  return null;
}

createServer((req, res) => {
  const file = resolve(req.url ?? '/');
  const target = file ?? join(root, '404.html');
  res.writeHead(file ? 200 : 404, { 'content-type': types[extname(target)] ?? 'application/octet-stream' });
  createReadStream(target).pipe(res);
}).listen(port, () => console.log(`Servindo ${root} em http://localhost:${port}`));
```

- [ ] **Passo 2: Medir o desempenho.** Peça aprovação ao cliente para rodar `npx lighthouse`, que baixa a ferramenta temporariamente e não entra no projeto. Rode:

```bash
npm run build
npm run serve:static    # em outra aba
CHROME_PATH="$(node -e "console.log(require('playwright').chromium.executablePath())")" \
  npx --yes lighthouse@12 http://localhost:4322/ --only-categories=performance,accessibility,best-practices,seo \
  --output=json --output=html --output-path=./test-results/lighthouse-home --chrome-flags="--headless=new"
```

Repita para `/seguro-auto`, `/plano-de-saude` e `/ja-sou-cliente`. O perfil padrão do Lighthouse já é celular com 4G simulado.

Esperado:
- Performance ≥ 95 e LCP < 2,0 s;
- CLS < 0,05;
- Acessibilidade ≥ 95.

Se não atingir as metas, investigue com a skill systematic-debugging. Suspeitos comuns: imagem do topo sem `fetchpriority` ou grande demais, fonte sem preload, JS além do esperado. Corrija e meça de novo. Registre os números finais.

- [ ] **Passo 3: Escrever `tests/e2e/screenshots.spec.ts`**, que gera prints de todas as páginas em 1440px e 390px:

```ts
import { test } from '@playwright/test';

const PAGES = ['/', '/seguro-auto', '/seguro-residencial', '/plano-de-saude', '/consorcio', '/fianca-locaticia', '/seguro-de-vida', '/ja-sou-cliente', '/privacidade', '/pagina-inexistente'];

for (const path of PAGES) {
  test(`print ${path}`, async ({ page }, info) => {
    await page.goto(path);
    await page.evaluate(() => document.querySelector('[data-cookie-banner]')?.setAttribute('hidden', ''));
    const name = path === '/' ? 'home' : path.slice(1);
    await page.screenshot({ path: `test-results/screens/${name}-${info.project.name}.png`, fullPage: true });
  });
}
```

Rode `npx playwright test tests/e2e/screenshots.spec.ts` e revise cada print.

- [ ] **Passo 4: Rodar a verificação completa**

Rode:
```bash
npm test
npm run check
npm run test:e2e
npm run build
```
Esperado: tudo passa e o build termina sem avisos. Guarde as saídas para o relatório.

- [ ] **Passo 5: Reescrever o `README.md`** com:
  - Como rodar (`npm install`, `npm run dev`).
  - Como testar (`npm test`, `npm run test:e2e`).
  - **Como editar o conteúdo**, a manutenção trimestral:
    - textos e números em `src/content/site.ts`;
    - produtos em `src/content/products.ts`;
    - seguradoras e telefones em `src/content/insurers.ts`;
    - campos do formulário em `src/content/product-fields.ts`, com o aviso de que mudar um campo exige mudar a validação e os testes;
    - como trocar os marcadores `1000` e `[RAZÃO SOCIAL]`;
    - como rodar `npm test` depois de editar.
  - Variáveis de ambiente (tabela do `.env.example`) e onde configurá-las na Vercel.
  - Como ativar o Pixel: colar o ID em `PUBLIC_META_PIXEL_ID` na Vercel e fazer um novo deploy.
  - Como publicar: um push na `main` gera o deploy na Vercel.

- [ ] **Passo 6: Commit**

```bash
git add scripts tests/e2e/screenshots.spec.ts README.md src
git commit -m "chore: medição de desempenho, prints de verificação e manual de manutenção"
```

- [ ] **Passo 7: Relatar ao cliente** com evidências: notas do Lighthouse, resultado dos testes e prints. Use a skill superpowers:verification-before-completion antes de afirmar que qualquer meta foi atingida.

---

### Tarefa 15: Revisão final e preparação para publicar

- [ ] **Passo 1: Invocar a skill `code-review`** sobre o branch inteiro. Avalie cada achado com superpowers:receiving-code-review e corrija o que for procedente, rodando os testes a cada correção.

- [ ] **Passo 2: Invocar a skill `security-review`** (obrigatória). Pontos de atenção:
  - `/api/lead`: validação, limite de tamanho, origem e escape;
  - ausência de dados pessoais em logs;
  - CSP (`integrations/security-headers.mjs`), e se `'unsafe-inline'` precisou ser usado;
  - segredos fora do repositório (`git log -p | grep -i "re_"` para chaves do Resend);
  - `rel="noopener"` em todos os `target="_blank"`;
  - Pixel condicionado ao consentimento.

  Corrija tudo o que for procedente.

- [ ] **Passo 3: Pedir ao cliente que rode a `review-animations`** manualmente, conforme o CLAUDE.md, e aplicar o resultado.

- [ ] **Passo 4: Checklist de publicação.** Entregue ao cliente e execute junto com ele o que depender de acesso:
  1. Criar o projeto na Vercel a partir do repositório no GitHub.
  2. Configurar as variáveis `RESEND_API_KEY`, `LEAD_TO_EMAIL` e `LEAD_FROM_EMAIL` (e `PUBLIC_META_PIXEL_ID` quando houver).
  3. **Antes de mexer no DNS:** descobrir o provedor do e-mail (pendência 2) e anotar os registros MX, SPF e DKIM atuais.
  4. No Resend, verificar o domínio adicionando os registros SPF e DKIM **sem remover** os registros do provedor de e-mail atual. Pode haver só um registro SPF por domínio: junte os `include:` num único registro.
  5. Primeiro deploy num endereço `*.vercel.app` e testes reais:
     - `curl -sI https://<projeto>.vercel.app/ | grep -iE "content-security|strict-transport|x-frame"`: confirmação final dos headers já validados localmente (teste de build e simulação de roteamento).
     - Envio real do formulário: o e-mail chega em atendimento@? Olhe também a caixa de spam.
     - `curl -s -X POST https://<projeto>.vercel.app/api/lead -H "content-type: application/json" -H "origin: https://mal.com" -d '{}' -w "%{http_code}"` deve responder `403`.
     - Envio legítimo pelo navegador responde 200: confirma no ambiente real o que a simulação da função já mostrou.
     - `/avaliar` no celular abre a janela de avaliação do Google? Se não abrir, peça ao cliente o link oficial do Perfil da Empresa.
     - `/servicos` e `/servicos/` redirecionam para `/#produtos`?
  6. Apontar o domínio `www.portugalcorretora.com.br` (e o domínio sem `www`, redirecionando para `www`) para a Vercel, **preservando os registros MX**.
  7. Depois da propagação, enviar um e-mail de teste para atendimento@ e confirmar que chega.
  8. Atualizar o site no Perfil da Empresa no Google.
  9. Cancelar o Wix **só depois** de confirmar o site novo e o e-mail funcionando.

- [ ] **Passo 5: Verificação final** com superpowers:verification-before-completion: rode de novo a suíte completa e os prints finais, e só então relate o resultado ao cliente.

- [ ] **Passo 6: Finalizar o branch** com superpowers:finishing-a-development-branch.
