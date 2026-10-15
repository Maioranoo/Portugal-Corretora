# Relatório de SEO e GEO do site da Portugal Corretora

Data: 15/10/2026. Branch: `seo-geo`. Feito para o dono da corretora e para quem cuidar do site.

Dois termos, explicados uma vez:

- **SEO** é o trabalho para o site aparecer melhor no Google e no Bing.
- **GEO** é o trabalho para o site ser entendido e citado por buscas com inteligência artificial (ChatGPT, Perplexity, Gemini, Copilot, respostas de IA do Google).

**Nenhum resultado é garantido.** Ninguém controla a posição no Google nem o que a IA responde. O que fizemos deixa o site mais claro, mais completo e mais fácil de encontrar. O resultado aparece em semanas ou meses.

---

## 1. Resumo

**O que foi auditado:** indexação, títulos, textos, dados estruturados (o código que explica o site para os buscadores), links internos, robôs, velocidade e medição de contatos.

**O que mudou no site:**

- Santo André, São Bernardo do Campo e São Caetano do Sul aparecem nos textos, nos títulos e nas perguntas frequentes.
- O seguro auto ganhou um guia e perguntas locais. O consórcio virou uma página central, com duas páginas novas: `/consorcio-auto` e `/consorcio-imobiliario`.
- Os dados estruturados foram refeitos em um bloco só por página, sem nota autodeclarada.
- As páginas têm trilha de navegação (migalhas) e links "Veja também".
- O `robots.txt` bloqueia robôs que treinam IA e libera os robôs de busca.
- O e-mail de cada pedido agora diz de onde veio a visita (Google, Bing, IA, redes sociais, direto).
- Textos de consórcio sem números prometidos e com as condições explicadas.

**O que depende de ações externas** (seção 5): Google Search Console, Bing Webmaster Tools, Perfil da Empresa no Google, diretórios locais e validações depois da publicação. O site sozinho não faz isso.

---

## 2. Problemas encontrados (auditoria de 14/10/2026)

| Gravidade | Problema |
|---|---|
| **Crítico** | Nenhum problema crítico encontrado: nada impedia a indexação do site. |
| **Alto** | Nenhum conteúdo para São Bernardo do Campo e São Caetano do Sul. |
| **Alto** | H1 e títulos sem as palavras que as pessoas buscam (o H1 do consórcio nem tinha "consórcio"). |
| **Alto** | Páginas comerciais rasas e todas no mesmo molde. |
| **Alto** | Afirmações arriscadas no consórcio: "sem juros" sem explicar os custos, FGTS sem condições, "todos são contemplados", administradoras chamadas de seguradoras. |
| **Alto** | Bairro divergente no briefing ("Centro" x "Jardim Bela Vista"). Confirmado: Jardim Bela Vista. |
| **Alto** | Sem Search Console, sem Bing e sem medição de contatos vindos de busca orgânica (sem anúncio). |
| **Médio** | Dados estruturados (JSON-LD) incompletos e com nota 4,8 fixa, autodeclarada. |
| **Médio** | Poucos links internos e sem trilha de navegação. |
| **Médio** | Coberturas apresentadas como sempre incluídas e "melhor preço" nas descrições. |
| **Médio** | `robots.txt` sem distinção entre robô de busca e robô de treinamento de IA. |
| **Médio** | Pouca presença em diretórios locais. |
| **Baixo** | FAQPage não gera resultado expandido no Google (desde 2023, só para governo e saúde). O FAQ continua útil para o leitor e para a IA. |
| **Baixo** | Sitemap sem `lastmod` (data da última mudança). |
| **Baixo** | Ordem dos títulos (headings) com saltos. Não alterado, ver seção 6. |
| **Baixo** | Canonical (endereço oficial da página) na página 404. Corrigido: a 404 não tem canonical. |
| **Baixo** | `http` sem `www` passa por 2 redirecionamentos. É configuração da Vercel. Não alterado. |

---

## 3. Alterações implementadas e arquivos modificados

Commits da branch `seo-geo` (do mais antigo ao mais novo):

| Commit | O que fez | Arquivos principais |
|---|---|---|
| `47c40fd` | `robots.txt` bloqueia treinamento de IA e mantém buscas liberadas | `public/robots.txt`, `tests/build/robots.test.ts` |
| `8c43d48` | JSON-LD em grafo único com corretora, serviço, trilha e FAQ | `src/lib/schema.ts`, `src/layouts/BaseLayout.astro`, `src/content/site.ts` |
| `d43984b` | Modelo de página com trilha, guia e links relacionados | `src/components/ProductPage.astro`, `Breadcrumbs.astro`, `Guide.astro`, `RelatedLinks.astro`, `src/pages/[produto].astro` |
| `ae83ea2` | Página de seguro auto com guia, FAQ local e links relacionados | `src/content/products.ts`, `src/content/site.ts` |
| `4eb196d` | Consórcio central e páginas de consórcio de carro e de imóvel | `src/content/products.ts`, `src/content/sub-pages.ts`, `src/pages/consorcio-auto.astro`, `src/pages/consorcio-imobiliario.astro`, `src/pages/sitemap.xml.ts`, `src/components/Footer.astro` |
| `6a8477a` | Home e títulos com foco em Santo André e no ABC | `src/content/products.ts`, `src/content/site.ts`, `tests/e2e/seo.spec.ts` |
| `c46b459` | E-mail do pedido informa de onde veio a visita | `src/lib/origin.ts`, `src/lib/lead.ts`, `src/lib/lead-email.ts`, `src/scripts/lead-form.ts`, `src/scripts/tracking.ts`, `src/pages/privacidade.astro` |
| `915eb29` | "Santo André" não quebra entre linhas nos títulos | `src/content/products.ts`, `src/content/site.ts`, `src/content/sub-pages.ts` |

Cada commit tem testes automáticos junto (pasta `tests/`).

---

## 4. Evidências de verificação (15/10/2026)

- `npx astro check` (checagem de tipos): 0 erros, 0 avisos, 0 dicas.
- `npm test` (Vitest): 14 arquivos, 177 testes passando.
- `npm run test:build`: 2 arquivos, 24 testes passando (`robots.txt` com grupos de treino bloqueados e busca liberada; redirecionamentos e headers de segurança na saída da Vercel).
- `npx playwright test` (desktop 1440 e celular 390): 160 passando, 6 pulados (testes só de celular ou só de desktop). Inclui `seo.spec` (13 rotas indexáveis: um H1, canonical, descrição e JSON-LD; a 404 com `noindex` e sem canonical), `lead-form` (origem no pedido) e prints de todas as rotas em `test-results/screens/`.
- JSON-LD do build (`/`, `/seguro-auto`, `/consorcio`, `/consorcio-auto`, `/consorcio-imobiliario`, `/ja-sou-cliente`, `/404`): 1 bloco por página, JSON válido, `@id` sem repetição, `provider` e `publisher` apontam para o nó da corretora. Páginas de produto com InsuranceAgency, WebSite, BreadcrumbList, Service e FAQPage. Sem `aggregateRating`.
- HTML bruto servido (build estático): title, description, canonical e H1 presentes sem JavaScript.
- JS por arquivo em `_astro`: LeadForm 8,2 KB, index 2,8 KB, CookieBanner 1,4 KB, BaseLayout 0,9 KB, origin 0,7 KB, meta-pixel 0,5 KB, Header 0,5 KB, Orbit 0,4 KB. Bem abaixo da meta de 30 KB por página.
- Velocidade no build local, celular 390px, 4G lento simulado (150 ms, 1,6 Mbps), CPU 4x, sem cache:
  - home: LCP 0,54 s, CLS 0,050
  - `/seguro-auto`: LCP 0,28 s, CLS 0,014
  - `/consorcio-auto`: LCP 0,31 s, CLS 0,014
  - auditoria antes (site no ar): home LCP 1,1 s, CLS 0,05

  (LCP é o tempo até o maior elemento aparecer. CLS mede quanto a página "pula" ao carregar.)
- Visual: prints em 1440 e 390 conferidos (home, seguro-auto, consórcio e subpáginas).
- Redirecionamentos (`/servicos` 301, barra final 308) são da configuração da Vercel e estão cobertos pelo teste de build. O servidor estático local não os aplica.
- **Pendente:** validação no Teste de pesquisa aprimorada do Google e no validator.schema.org. Precisa da URL pública (ação pós-publicação, seção 5).

---

## 5. Ações externas, em ordem

### 5.1 Google Search Console

1. Crie a propriedade do tipo **Domínio** para `portugalcorretora.com.br`.
2. Verifique pelo **registro TXT no DNS**, no lugar onde o domínio é administrado (Vercel, em Domains, ou o Registro.br).
3. Envie o sitemap: `https://www.portugalcorretora.com.br/sitemap.xml`.
4. Peça indexação de: `/`, `/seguro-auto`, `/consorcio`, `/consorcio-auto`, `/consorcio-imobiliario`.
5. Em "Páginas", procure URLs antigas do Wix que dão 404 e mande para o desenvolvedor criar o redirecionamento.

### 5.2 Bing Webmaster Tools

1. Entre com a conta Microsoft.
2. **Importe do Search Console** (evita refazer a verificação).
3. Confira se o sitemap foi lido.

### 5.3 Perfil da Empresa no Google (checklist)

- [ ] Nome exatamente: **Portugal Corretora de Seguros**
- [ ] Categoria principal: **Corretora de seguros**
- [ ] Endereço: Av. Portugal, 1285, Jardim Bela Vista, Santo André - SP, 09040-011
- [ ] Telefone: (11) 93805-2598
- [ ] Horário: segunda a sexta, das 9h às 18h
- [ ] Área de atendimento: Santo André, São Bernardo do Campo e São Caetano do Sul
- [ ] Site: `https://www.portugalcorretora.com.br/`
- [ ] Serviços cadastrados: Seguro auto, Consórcio de carro, Consórcio de imóvel e os demais
- [ ] Fotos reais da fachada e da equipe
- [ ] Pedir avaliações a clientes reais pelo link `/avaliar` (nunca comprar nem incentivar com brinde) e responder a todas

### 5.4 Diretórios e perfis

Use nome, endereço e telefone **idênticos** aos do Perfil do Google em todos:

- Bing Places (importa do Google)
- Apple Business Connect
- Facebook e Instagram (endereço e site no perfil)
- Telelistas
- Página Amarela (Apontador)
- Associações de corretores (Sincor-SP)

### 5.5 Depois da publicação

- Validar o JSON-LD no **Teste de pesquisa aprimorada** do Google e no **validator.schema.org**.
- Rodar o **PageSpeed Insights** nas páginas prioritárias.

---

## 6. Pendências

**Revisão do dono dos textos (decisões que ficaram para você):**

- [ ] Confirmar a frase "A remuneração da corretora já vem incluída no valor do seguro, sem cobrança separada pelo atendimento" (`/seguro-auto`).
- [ ] Revisar a lista de condições do FGTS em `/consorcio-imobiliario` (regras oficiais de moradia própria; podem mudar).
- [ ] Decidir se mantém "o grupo é planejado para que todos os participantes em dia sejam contemplados até o encerramento" (`/consorcio` e subpáginas).
- [ ] Alinhar a resposta do FAQ da home "Quanto custa o atendimento da corretora?" ("Nada para você. A corretora é remunerada pela seguradora") com o texto do guia de seguro auto ("a remuneração da corretora já vem incluída no valor do seguro"), depois de confirmar com o dono.
- [ ] Confirmar que "mais de 10 seguradoras" e "+12 anos" continuam corretos.
- [ ] O botão principal continua "Falar com um especialista" (regra do PRODUCT.md). Trocar para "Cotar seguro auto" ou "Simular consórcio" é decisão do dono.

**Outras pendências:**

- Revisão jurídica dos textos de consórcio e FGTS (as regras podem mudar).
- Revisar o campo `reviewedAt` dos guias a cada 6 meses.
- Se a corretora quiser medir também os cliques no botão do WhatsApp, existe a opção 2: eventos do Vercel Analytics (exige o plano Pro).

- Sitemap sem data de atualização (lastmod): não alterado; o Google ignora datas que não refletem mudanças reais.

**Não alterados por estarem fora do escopo:** os saltos na ordem dos títulos (o h3 de sucesso do formulário vem antes do primeiro h2, e o h2 "Cookies" aparece em todas as páginas) e o redirecionamento `http` sem `www` em 2 saltos (configuração da Vercel).

---

## 7. Plano de monitoramento

**Todo mês, no Search Console:**

- Cliques e impressões das buscas com "santo andré", "são bernardo", "são caetano" e "abc", combinadas com "seguro auto", "consórcio" e "corretora".
- Desempenho das 5 páginas prioritárias.
- Posição média e CTR (percentual de quem clica ao ver o resultado).
- Erros de indexação.

**Todo mês, no Bing Webmaster Tools:** os mesmos itens.

**Todo mês, nos e-mails de pedido:** conte por "Chegou ao site por" (Google, Bing, ChatGPT, Perplexity, Gemini, Copilot, Instagram, campanha, direto). Uma planilha simples resolve.

**Ao vivo:** busque no Google pelo celular, em Santo André: "seguro auto santo andré", "corretora de seguros santo andré" e "consórcio santo andré". Anote se a Portugal aparece no mapa e nos resultados.

---

## 8. Acompanhamento em buscas com IA (GEO)

A cada trimestre, faça as mesmas 10 perguntas no ChatGPT (com busca), Perplexity, Gemini, Copilot e Google (respostas de IA). Registre se a Portugal é citada ou mencionada e com qual link.

1. onde cotar seguro auto em Santo André
2. corretora de seguros no ABC Paulista
3. corretora de seguros em São Bernardo do Campo
4. seguro de carro em São Caetano do Sul
5. como funciona consórcio de carro
6. consórcio ou financiamento
7. consórcio de imóvel com FGTS
8. consórcio em Santo André
9. o que influencia o preço do seguro auto
10. como escolher um consórcio

**Limitações:** as respostas mudam por pessoa, local e dia. Não existe painel oficial de citações. O resultado mostra tendência, não garantia.

Robôs de treinamento estão bloqueados no `robots.txt`. Os robôs de busca estão liberados.

---

## 9. O que não fazer

- Páginas por cidade que só trocam o nome da cidade (o Google trata como páginas-porta e pode punir).
- Avaliações falsas.
- Números de consórcio (taxa, prazo, valor de carta) sem confirmação da administradora.
- Usar `llms.txt` como se fosse promessa de citação por IA.
