# Portugal Corretora de Seguros

Site institucional da **Portugal Corretora de Seguros**, corretora com mais de 12 anos de mercado em Santo André (SP),
registrada na SUSEP sob o nº 2022910.

**Site no ar:** [www.portugalcorretora.com.br](https://www.portugalcorretora.com.br)

---

## Finalidade

O site substitui a antiga página no Wix, que tinha visual desatualizado, funcionava mal no celular e não levava o
visitante a entrar em contato. O novo site foi pensado para ser o principal canal de captação da corretora:

- **Gerar contatos** pelo WhatsApp e pelo formulário "Falar com um especialista";
- **Receber o tráfego dos anúncios do Meta Ads** (Facebook e Instagram), com uma página de destino para cada produto;
- **Transmitir credibilidade** a quem ainda não conhece a corretora: SUSEP, tempo de mercado, avaliações do Google e
  seguradoras parceiras;
- **Atender quem já é cliente**, com os telefones de assistência 24h de cada seguradora.

## O que o site tem

- Página inicial e **8 páginas de produto**: Seguro Auto, Residencial, Plano de Saúde, Consórcio, Fiança Locatícia,
  Seguro de Vida, Seguro Viagem e Seguro Empresarial;
- **Formulário integrado ao WhatsApp e ao e-mail**: num único envio, abre o WhatsApp da corretora com a mensagem pronta
  e envia o pedido para o e-mail de atendimento;
- Página **"Já sou cliente"** com a assistência 24h das 14 seguradoras parceiras;
- **Aviso de cookies e política de privacidade** de acordo com a LGPD: o Pixel da Meta só é carregado depois que o
  visitante aceita;
- Redirecionamento dos endereços do site antigo e link curto para avaliar a corretora no Google (`/avaliar`).

## Tecnologias

| Área | Tecnologia |
|---|---|
| Framework | [Astro](https://astro.build) 7, com páginas geradas de forma estática |
| Linguagem | TypeScript, HTML e CSS escrito à mão (sem framework de CSS) |
| Hospedagem e DNS | [Vercel](https://vercel.com), com uma função serverless para o formulário |
| E-mail do formulário | [Resend](https://resend.com) |
| Medição | Vercel Web Analytics (sem cookies) e Pixel da Meta (com consentimento) |
| Testes | [Vitest](https://vitest.dev) (lógica e conteúdo) e [Playwright](https://playwright.dev) (navegador, desktop e celular) |

### Destaques técnicos

- **Desempenho:** nota de 99 a 100 no Lighthouse em celular, com o conteúdo principal aparecendo em menos de 2 segundos.
  A fonte foi recortada só com os caracteres usados (de 90 KB para 52 KB) e o CSS vai dentro do HTML.
- **Segurança:** headers de segurança (CSP sem scripts inline, HSTS, X-Frame-Options), HTTPS obrigatório, validação no
  servidor, proteção contra robôs (campo invisível, tempo mínimo, verificação de origem) e limite de envios por endereço,
  reforçado por uma regra no Firewall da Vercel. Nenhum dado pessoal fica guardado nem aparece nos logs.
- **Acessibilidade:** navegação por teclado, áreas de toque de pelo menos 44px no celular e animações que se desligam
  quando o sistema pede movimento reduzido.
- **SEO:** título e descrição próprios em cada página, sitemap, dados estruturados (corretora de seguros e perguntas
  frequentes) e prévia do link para WhatsApp e redes sociais.
- **Conteúdo fácil de editar:** todos os textos, números e dados ficam em `src/content/`, sem painel administrativo.

## Rodando localmente

Requisito: Node 22.12 ou mais novo.

```bash
npm install
npm run dev        # http://localhost:4321
npm test           # testes de lógica e conteúdo
npm run test:e2e   # testes no navegador
```

O passo a passo para editar o conteúdo, as variáveis de ambiente e os demais comandos estão no
[manual de manutenção](docs/manutencao.md).

## Autor

Desenvolvido por **João Pedro Maiorano**.

- GitHub: [github.com/Maioranoo](https://github.com/Maioranoo)
- LinkedIn: [João Pedro Maiorano](https://www.linkedin.com/in/jo%C3%A3o-pedro-maiorano-28a10a3b8/)
