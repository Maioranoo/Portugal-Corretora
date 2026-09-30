# Site Portugal Corretora de Seguros: especificação de design

Data: 2026-09-29
Status: aguardando revisão do cliente

---

## 0. Pendências (o que falta o cliente enviar)

Legenda:
- **Bloqueia o lançamento:** o site não vai ao ar sem isso.
- **Não bloqueia:** o site é construído com um marcador provisório, e o cliente substitui depois.

| # | Item | Bloqueia? | Enquanto isso |
|---|------|-----------|---------------|
| 1 | **Onde o domínio portugalcorretora.com.br está registrado** (Registro.br direto ou dentro do Wix) | Bloqueia o lançamento | Desenvolvimento segue normalmente; publicação em endereço temporário da Vercel |
| 2 | **Quem fornece o e-mail atendimento@portugalcorretora.com.br** (Google Workspace, Microsoft 365, Wix ou outro). Necessário para preservar os registros MX ao trocar o DNS e para configurar SPF/DKIM do Resend | Bloqueia o lançamento | Formulário testado com e-mail de teste |
| 4 | Números da corretora: clientes atendidos, apólices ativas, sinistros resolvidos | Não bloqueia | Marcador `1000` |
| 5 | Fotos reais da equipe e/ou do escritório | Não bloqueia | Imagens de banco provisórias |
| 6 | Prêmio Porto Elite: ano(s) e nome exato da categoria | Não bloqueia | Selo com texto genérico "Prêmio Porto Elite – Consórcio" marcado para revisão |
| 7 | Quais seguradoras trabalham com cada produto | Não bloqueia | Divisão provável, marcada para revisão |
| 9 | Razão social da empresa (vai para o rodapé e a política de privacidade) | Não bloqueia | Marcador `[RAZÃO SOCIAL]` |
| 12 | 3 avaliações do Google escolhidas para exibir no site | Não bloqueia | Seção mostra só a nota 4,8 e o link |
| 13 | Código (ID) do Pixel da Meta | Não bloqueia | Nada é carregado enquanto não houver ID |
| 14 | Confirmação dos telefones de assistência 24h de cada seguradora (a pesquisa dos números públicos fica com o desenvolvimento) | Não bloqueia | Números públicos pesquisados, marcados para conferência |
| 16 | Revisão jurídica da política de privacidade | Recomendado antes do lançamento | Política-base escrita pelo desenvolvimento |
| 18 | Revisar as faixas de valor do formulário: Consórcio (até R$ 50 mil / R$ 50–150 mil / R$ 150–400 mil / acima de R$ 400 mil) e aluguel da Fiança (até R$ 1.500 / R$ 1.500–3.000 / R$ 3.000–6.000 / acima de R$ 6.000), em `src/content/product-fields.ts` | Não bloqueia | Faixas estimadas pelo desenvolvimento |
| 19 | Lista completa das operadoras de plano de saúde (hoje: SulAmérica Saúde, Bradesco Saúde e Porto Saúde) | Não bloqueia | As três operadoras confirmadas |
| 17 | Contas na **Vercel** e no **Resend** criadas pelo cliente (ou acesso concedido) | Bloqueia o lançamento | Desenvolvimento local |

### Pendências já resolvidas (2026-09-29)
- **Horário de atendimento:** 8h às 20h, de segunda a sexta (sem atendimento nos fins de semana).
- **Facebook:** https://www.facebook.com/portugalseguros
- **Instagram:** https://www.instagram.com/portugalcorretora/
- **Link de avaliação:** `/avaliar` redireciona para `https://www.google.com/search?q=portugal+corretora+de+seguros#lrd=0x94ce42600eb7bcaf:0x491b7e07925c034e,3`. Esse link abre a janela "escrever avaliação" no Google. Se ele falhar no celular durante os testes, trocamos pelo link oficial do Perfil da Empresa no Google.
- **Encarregado de dados (DPO):** atendimento@portugalcorretora.com.br
- **Logo:** arquivos em `brand/Logos/`.
  - Cor do logo medida no arquivo: `#003780`.
  - Versão colorida principal: `Logo Portugal.png` (1913×756, transparente).
  - Versão branca: `Logo Portugal Branco.png` (3669×1057, transparente).
  - Símbolo do globo sozinho: `Logo.gif`, que serve de base para o favicon.
  - Originais vetoriais: `Logo Portugal.ai` (compatível com PDF) e os arquivos `.cdr`. O ideal é gerar um SVG a partir do `.ai`, mas isso exige uma ferramenta de conversão que o ambiente ainda não tem; a decisão fica para o plano.
  - `LOGO PORTO NOVO BRANCO.png` é o logo da Porto Seguro, reaproveitável na seção de seguradoras.
  - `LOGO.png` (ícone de pessoa) não é da marca da corretora e não será usado.

---

## 1. Objetivo e público

- **Objetivo principal:** gerar contatos pelo WhatsApp e pelo formulário "Falar com um especialista".
- **Objetivo secundário:** transmitir credibilidade a quem não conhece a corretora.
- **Objetivo terciário:** atender quem já é cliente (sinistro e assistência).
- **Tráfego:** anúncios no Meta Ads (Facebook e Instagram), em sua maioria vindos de celular. Cada produto tem sua própria página de destino.
- **Problemas do site atual (Wix) que o novo resolve:** visual antigo, funcionamento ruim no celular, navegação confusa e ausência de chamada para ação.
- **Critério de sucesso:** o visitante entende em até 3 segundos o que a corretora faz e chega ao WhatsApp em no máximo 1 toque, pelo botão fixo, ou 1 formulário curto.

## 2. Dados da corretora

- Nome: Portugal Corretora de Seguros
- SUSEP: 2022910
- CNPJ: 21.427.722/0001-05
- Endereço: Av. Portugal, 1285 – Jardim Bela Vista, Santo André – SP, 09040-011
- WhatsApp Business: (11) 93805-2598 (`5511938052598`)
- E-mail que recebe os pedidos: atendimento@portugalcorretora.com.br
- Horário de atendimento: 8h às 20h, de segunda a sexta
- Redes sociais: Facebook (facebook.com/portugalseguros) e Instagram (@portugalcorretora)
- Encarregado de dados (DPO): atendimento@portugalcorretora.com.br
- Tempo de mercado: +12 anos
- Google: nota 4,8 com 19 avaliações
- Seguradoras parceiras (12): Porto Seguro, Allianz, Tokio Marine, HDI, Suhai, Yelum, Bradesco Seguros, Pier, Azul Seguros, Itaú Seguros, Mitsui Sumitomo e SulAmérica Saúde
- Diferenciais:
  - atendimento pelo WhatsApp das 8h às 20h, em dias úteis;
  - acompanhamento em caso de sinistro;
  - "comparamos mais de 10 seguradoras para encontrar o melhor preço para você";
  - Prêmio Porto Elite (consórcio).
- Redação: não usar promessas absolutas ("os melhores preços", "24 horas") por causa das políticas da Meta e do CDC.

## 3. Produtos

| Prioridade | Produto | Página | Campo específico do formulário |
|---|---|---|---|
| 1 | Seguro Auto | `/seguro-auto` | Modelo e ano do carro |
| 2 | Seguro Residencial | `/seguro-residencial` | Casa ou apartamento; próprio ou alugado |
| 3 | Plano de Saúde | `/plano-de-saude` | Para quem (só eu, família ou empresa) e nº de pessoas |
| 4 | Consórcio | `/consorcio` | Tipo (imóvel, veículo ou outro) e valor aproximado da carta |
| 5 | Fiança Locatícia | `/fianca-locaticia` | Valor do aluguel |
| 6 | Seguro de Vida (individual e empresarial) | `/seguro-de-vida` | Individual ou empresarial |

## 4. Mapa do site

| Endereço | Página |
|---|---|
| `/` | Home |
| 6 páginas de produto | Ver seção 3 |
| `/ja-sou-cliente` | Abrir sinistro pelo WhatsApp e telefones de assistência 24h por seguradora |
| `/privacidade` | Política de privacidade e cookies |
| `/avaliar` | Redirecionamento para a avaliação no Google |
| 404 | Página não encontrada, com links para os produtos |

- **Sem página "Sobre" separada:** a história e as credenciais ficam numa seção da home e no rodapé.
- **Redirecionamentos 301 do site antigo:**
  - `/servicos` → `/#produtos`
  - `/contato` → `/#contato`
  - `/portugal` → `/#sobre`
  - demais endereços antigos conhecidos são mapeados na implementação.
- **Após o lançamento**, o cliente atualiza o link do site no Perfil da Empresa no Google.

## 5. Conteúdo

### 5.1 Home (em ordem)
1. **Topo:** título com a proposta de valor, frase "comparamos mais de 10 seguradoras…", botão "Falar com um especialista" e selos (SUSEP, +12 anos, Google 4,8). No celular em 390px, tudo aparece sem rolar.
2. **Produtos:** 4 cartões de destaque (Auto, Residencial, Saúde e Consórcio) e 2 cartões menores (Fiança e Vida).
3. **Como funciona**, em 3 passos.
4. **Diferenciais.**
5. **Números** (marcador `1000` enquanto faltar o dado).
6. **Logos das 12 seguradoras**, em escala de cinza e ganhando cor ao passar o mouse.
7. **Avaliações:** nota, link para o Google e até 3 depoimentos reais.
8. **Sobre a Portugal:** texto curto, foto e endereço.
9. **Faixa "Já sou cliente".**
10. **Perguntas frequentes gerais.**
11. **Chamada final e formulário.**
12. **Rodapé:** razão social, CNPJ, SUSEP, endereço, redes sociais, privacidade, "Preferências de cookies" e "Avalie-nos".

### 5.2 Modelo das páginas de produto (um modelo alimentado pelo arquivo de conteúdo)
1. **Topo:** título com o benefício principal e o formulário visível, com o produto já selecionado.
2. **O que cobre:** 4 a 6 itens.
3. **Para quem é.**
4. **Como funciona** (3 passos adaptados ao produto).
5. **Seguradoras** que trabalham com o produto.
6. **Avaliações e selos.**
7. **Perguntas frequentes** do produto.
8. **Chamada final.**

O cabeçalho das páginas de produto é enxuto: logo, WhatsApp e um menu discreto.

### 5.3 Elementos globais
- Botão fixo de WhatsApp em todas as páginas. No celular, vira uma barra fina na parte de baixo da tela.
- Todos os textos são escritos pelo desenvolvimento e revisados pelo cliente.

## 6. Formulário "Falar com um especialista"

### Campos
- Nome (obrigatório)
- WhatsApp (obrigatório, formatado como (11) 9XXXX-XXXX)
- Produto (obrigatório; vem preenchido nas páginas de produto)
- Campo específico do produto (obrigatório; ver seção 3)
- Cidade (opcional)
- Campo invisível contra robôs (honeypot)

### Aviso abaixo do botão (no lugar de uma caixa de consentimento)
> "Ao enviar, você concorda em ser contatado pela Portugal Corretora. Veja nossa Política de Privacidade."

Base legal: procedimentos preliminares a pedido do titular (LGPD, art. 7º, V).

### Fluxo ao enviar
1. O formulário é validado no navegador, com mensagens de erro ao lado de cada campo.
2. No mesmo clique, o WhatsApp abre (`wa.me`) com a mensagem pronta, por exemplo: *"Olá! Sou o João, vim pelo site e quero falar sobre Seguro Auto (Onix 2021)."*
3. Em paralelo, os dados são enviados para `POST /api/lead` de forma que sobrevivam à troca de aba ou app (`fetch` com `keepalive`).
4. O servidor envia um e-mail pelo Resend para atendimento@ com nome, WhatsApp, produto, detalhe, cidade, página de origem, UTMs (source, medium, campaign, content, term), data e hora.
5. A página mostra a confirmação "Pronto! Abrimos o WhatsApp…", com um botão de reserva.
   - **Fora do horário de atendimento** (antes das 8h, depois das 20h, sábado ou domingo, no fuso America/Sao_Paulo), a confirmação diz: *"Recebemos seu contato! Nosso atendimento funciona de segunda a sexta, das 8h às 20h. Retornamos no próximo dia útil."*
   - Feriados não são considerados no lançamento.
6. Se o Pixel estiver consentido, dispara o evento `Lead` com o produto.

### UTMs
Os parâmetros UTM são capturados na chegada, guardados na sessão do navegador e anexados ao envio.

### Se algo falhar
| Situação | Comportamento |
|---|---|
| E-mail falha | Não aparece para o visitante; o erro fica registrado nos logs da Vercel |
| WhatsApp não abre | Abre o WhatsApp Web, e há o botão de reserva |
| Sem conexão | Mensagem pedindo para tentar de novo; os dados digitados são mantidos |

### Segurança
- Nenhum dado fica armazenado; não há banco de dados.
- Validação também no servidor: tipos, campos obrigatórios e tamanho máximo de cada campo.
- Todo texto é escapado antes de entrar no HTML do e-mail.
- Proteção contra spam:
  - honeypot;
  - tempo mínimo de preenchimento;
  - verificação da origem do envio (`Origin`/`Referer`);
  - rejeição de envios com formato inválido.
- A chave do Resend (`RESEND_API_KEY`) fica só em variável de ambiente.
- Headers de segurança: Content-Security-Policy compatível com o Pixel e o Analytics, HSTS, X-Content-Type-Options e Referrer-Policy.

## 7. Rastreamento e LGPD

### Aviso de cookies
- Barra inferior com os botões "Aceitar" e "Recusar", de mesmo peso visual, e link para a política.
- No celular, a barra não cobre o formulário nem o botão do WhatsApp.
- A escolha fica guardada por 6 meses.
- O link "Preferências de cookies" no rodapé reabre o aviso.

### Pixel da Meta
- O ID fica na variável de ambiente `PUBLIC_META_PIXEL_ID`.
- O Pixel só carrega após o "Aceitar". Sem ID ou sem consentimento, nada é carregado.
- Eventos:

| Evento | Quando dispara |
|---|---|
| `PageView` | Toda página |
| `ViewContent` | Página de produto, com `content_name` igual ao produto |
| `Lead` | Envio do formulário, com o produto |
| `Contact` | Clique em botão de WhatsApp fora do formulário |

- **Fora do escopo do lançamento:** API de Conversões da Meta. A estrutura fica preparada para receber essa melhoria depois.

### Medição sem cookies
Vercel Web Analytics (`@vercel/analytics`), que não usa cookies e não depende de consentimento.

### Política de privacidade
Escrita pelo desenvolvimento, com:
- identificação da corretora;
- dados coletados, finalidades e bases legais;
- compartilhamento com Vercel, Resend, Meta e seguradoras;
- prazo de retenção;
- direitos do titular;
- canal de contato e encarregado de dados;
- lista de cookies.

Recomenda-se revisão jurídica antes do lançamento.

## 8. Visual e interação

- **Estilo:** próximo e acolhedor, com um toque de agilidade.
- **Cores:**
  - azul do logo como cor principal (`#003780`, medido no arquivo original);
  - fundos claros e quentes;
  - âmbar ou dourado discreto como destaque;
  - verde do WhatsApp só nos botões de WhatsApp.
- **Tipografia:** uma fonte sem serifa humanista, hospedada no próprio site, com o conjunto de caracteres reduzido ao necessário. A escolha final acontece na fase de construção.
- **Imagens:** pessoas e situações reais do dia a dia brasileiro. Imagens de banco provisórias, convertidas para AVIF/WebP com tamanhos responsivos.
- **Ícones:** SVG inline, sem biblioteca de ícones.
- **Animações:** sutis e funcionais (entrada de elementos, resposta nos botões, abertura das perguntas frequentes), desativadas com `prefers-reduced-motion`.
- **Skills da fase de construção:**
  - impeccable (base de design e polimento);
  - design-taste-frontend (direção visual);
  - emil-design-eng (animações).

  A direção visual é aprovada pelo cliente com prints em desktop e celular antes de ser replicada.
- **Acessibilidade:** contraste WCAG AA, navegação por teclado, foco visível e áreas de toque de no mínimo 44px.

## 9. Arquitetura técnica

- **Framework:** Astro, gerando páginas estáticas, com uma função serverless na Vercel para `/api/lead`.
- **Hospedagem:** Vercel, com o DNS do domínio apontado para lá. Os registros MX do e-mail precisam ser preservados na troca.
- **Conteúdo:** um único arquivo de conteúdo organizado com textos, números, produtos, seguradoras, perguntas e depoimentos. O cliente edita esse arquivo cerca de uma vez a cada 3 meses, sem painel administrativo.
- **CSS:** escrito à mão, com variáveis de design (cores, espaçamentos e tipografia) centralizadas. Sem Tailwind e sem biblioteca de componentes.
- **JavaScript no navegador**, só para:
  - o formulário;
  - o aviso de cookies e o Pixel;
  - o menu no celular;
  - as perguntas frequentes (com `<details>` nativo, sempre que possível).
- **Unidades principais:**

| Unidade | Função |
|---|---|
| `content` | Dados e textos |
| `whatsapp` | Monta o link e a mensagem |
| `lead-form` | Interface, validação e envio |
| `api/lead` | Validação no servidor, proteção contra spam e e-mail |
| `consent` | Armazena o consentimento e carrega o Pixel |
| `tracking` | Eventos da Meta |
| `layout` e componentes | Seções visuais |

- **Dependências aprovadas:**
  - `astro`
  - `@astrojs/vercel`
  - `resend`
  - `@vercel/analytics`
  - `vitest` (desenvolvimento)
  - `@playwright/test` (desenvolvimento)

## 10. Metas de desempenho

| Métrica (celular em 4G) | Meta |
|---|---|
| Lighthouse para celular | ≥ 95 |
| LCP | < 2,0 s |
| CLS | < 0,05 |
| JavaScript por página | < 30 KB |

## 11. Verificação

- **Testes unitários (Vitest):**
  - montagem da mensagem do WhatsApp para cada produto;
  - regra de horário de atendimento (dentro e fora do horário, fins de semana e fuso);
  - validação do formulário;
  - validação e proteções de `/api/lead` (honeypot, tempo mínimo, origem, tamanhos, escape de HTML).
- **Playwright:**
  - prints de todas as páginas em 1440px e 390px;
  - botão de WhatsApp (link e mensagem corretos);
  - envio do formulário (com o e-mail simulado);
  - o Pixel não carrega antes do "Aceitar" e carrega depois;
  - redirecionamentos antigos e `/avaliar`;
  - página 404.
- **Lighthouse** para celular nas páginas principais, conferindo as metas da seção 10.
- **Revisão final:** code-review e security-review (obrigatória).

## 12. Fora do escopo do lançamento

- Painel administrativo ou CMS
- Blog
- API de Conversões da Meta
- Cálculo automático de preço ou cotação
- Área logada do cliente
- Banco de dados de contatos ou CRM
