# Manual de manutenção do site

Site institucional de [portugalcorretora.com.br](https://www.portugalcorretora.com.br): home, 8 páginas de produto
(uma para cada anúncio), "Já sou cliente", política de privacidade e o formulário "Falar com um especialista", que
abre o WhatsApp e envia o pedido por e-mail.

Feito com [Astro](https://astro.build) e publicado na [Vercel](https://vercel.com).

---

## Como editar o conteúdo (o que você vai usar a cada 3 meses)

Todos os textos, números e dados ficam em **`src/content/`**. Você não precisa mexer em mais nada.

| O que você quer mudar | Arquivo |
|---|---|
| Dados da corretora (CNPJ, SUSEP, endereço, horário, redes sociais, nota do Google) | `src/content/site.ts`, bloco `COMPANY` |
| Números da seção "Sobre" (clientes, apólices, anos, seguradoras) | `src/content/site.ts`, bloco `STATS` |
| Título do topo da home, diferenciais, "como funciona", perguntas gerais, texto "Sobre" | `src/content/site.ts` |
| Depoimentos do Google | `src/content/site.ts`, bloco `TESTIMONIALS` |
| Textos de cada produto (título, coberturas, perguntas, seguradoras) | `src/content/products.ts` |
| Seguradoras parceiras e telefones de assistência 24h | `src/content/insurers.ts` |
| Número do WhatsApp | `src/content/contact.ts` |
| Perguntas do formulário por produto | `src/content/product-fields.ts` (ver o aviso abaixo) |

### Passo a passo de uma edição

1. Abra o arquivo no VS Code e altere **só o texto entre aspas**. Exemplo, para trocar um número:

   ```ts
   { value: '1000', label: 'clientes atendidos' },   // antes
   { value: '1.450', label: 'clientes atendidos' },  // depois
   ```

2. Rode os testes: `npm test`. Eles avisam se algo ficou errado, por exemplo um texto com promessa proibida
   ("os melhores preços", "garantido"), um travessão ou um campo obrigatório vazio.
3. Veja o resultado com `npm run dev` e abra http://localhost:4321.
4. Salve no git e envie (`git push`). A Vercel publica sozinha em cerca de 1 minuto.

### Avisos

- **Perguntas do formulário** (`product-fields.ts`): você pode mudar os rótulos e as opções das listas. Se criar ou
  remover um campo, rode `npm test`, porque a validação do formulário depende deles.
- **Logos das seguradoras** ficam em `src/assets/insurers/<nome>.svg` (ou `.png`), com a origem de cada um em
  `FONTES.md`. Para trocar um logo, salve o novo arquivo com um sufixo de versão (por exemplo `porto.v2.svg`) e
  apague o antigo; assim o navegador de quem já visitou o site não mostra a versão guardada.
- **Fotos reais**: quando tiver as fotos da equipe e do escritório, coloque em `src/assets/photos/` e peça para
  incluí-las no site.

---

## Configurações na Vercel (variáveis de ambiente)

Em **Vercel → projeto → Settings → Environment Variables**:

| Variável | Para quê | Obrigatória? |
|---|---|---|
| `RESEND_API_KEY` | Chave do Resend para enviar o e-mail do formulário | Sim, para receber os pedidos por e-mail |
| `LEAD_TO_EMAIL` | Quem recebe os pedidos | Não (padrão, mesmo se ficar vazia: atendimento@portugalcorretora.com.br) |
| `LEAD_FROM_EMAIL` | Remetente do e-mail (domínio verificado no Resend) | Não (padrão, mesmo se ficar vazia: site@portugalcorretora.com.br) |
| `PUBLIC_META_PIXEL_ID` | ID do Pixel da Meta | Não. Vazio = Pixel desligado |

### Limite de envios do formulário (Firewall da Vercel)

O próprio site já barra mais de 5 pedidos em 10 minutos vindos do mesmo endereço, mas cada cópia da função conta
separado. Para completar, em **Vercel → projeto → Firewall → Rules**, crie uma regra de **Rate Limit** para o caminho
`/api/lead`: 10 pedidos por minuto por IP, ação **Deny**.

### Ativar o Pixel da Meta

1. No Gerenciador de Eventos da Meta, copie o **ID do Pixel** (um número de 15 a 16 dígitos).
2. Cole em `PUBLIC_META_PIXEL_ID` na Vercel.
3. Refaça a publicação (Vercel → Deployments → Redeploy). O Pixel passa a carregar para quem clicar em "Aceitar"
   no aviso de cookies, com os eventos `PageView`, `ViewContent` (página de produto), `Lead` (formulário enviado) e
   `Contact` (clique no WhatsApp).

---

## Para desenvolvedores

Requisitos: Node 22.12 ou mais novo.

```bash
npm install          # instala as dependências
npm run dev          # servidor local em http://localhost:4321
npm test             # testes unitários (lógica, conteúdo, validação)
npm run check        # checagem de tipos
npm run test:build   # gera o site e confere headers e redirecionamentos da Vercel
npm run test:e2e     # testes no navegador (desktop e celular)
npm run build        # gera o site para produção em .vercel/output
npm run serve:static # serve o build localmente, comprimido e com os headers de produção (porta 4322)
```

**Testes no navegador:** o Astro 7 só permite um servidor de desenvolvimento por projeto, e o Playwright sobe o
servidor de teste dele na porta 4399. **Pare o `npm run dev` antes de rodar `npm run test:e2e`.**

**Prints de verificação:** `npx playwright test tests/e2e/screenshots.spec.ts` gera prints de página inteira de todas
as rotas em `test-results/screens/`.

**Medição de velocidade:** `npm run build`, `npm run serve:static` e, em outro terminal,
`npx lighthouse http://localhost:4322/ --view` (perfil de celular).

### Estrutura

```
src/content/      textos e dados editáveis
src/lib/          lógica testada: telefone, WhatsApp, horário, validação, e-mail, consentimento, Pixel
src/scripts/      comportamento no navegador: formulário, cookies, menu, rastreamento, surgimento ao rolar
src/components/   seções visuais
src/pages/        rotas (home, [produto], já sou cliente, privacidade, 404, sitemap, api/lead)
integrations/     headers de segurança escritos no config.json da Vercel
tests/unit        Vitest   ·   tests/e2e  Playwright   ·   tests/build  saída da Vercel
docs/superpowers/ especificação e plano de implementação
```

### Decisões importantes

- **Formulário:** abre o WhatsApp no mesmo clique e envia o pedido para `/api/lead` (função da Vercel), que valida,
  barra robôs (campo invisível, tempo mínimo, origem, limite por endereço) e envia o e-mail pelo Resend. Nenhum dado pessoal fica guardado
  nem vai para os logs.
- **LGPD:** o Pixel só carrega depois do "Aceitar"; "Recusar" tem o mesmo peso visual; a escolha vale 6 meses.
- **Segurança:** os headers (CSP, HSTS etc.) são escritos no `.vercel/output/config.json` por
  `integrations/security-headers.mjs`, porque o `vercel.json` não é aplicado na saída do adaptador do Astro.
- **Redirecionamentos** do site antigo (Wix) ficam em `astro.config.mjs`.
