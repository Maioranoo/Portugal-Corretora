# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Principal:** pessoas que viram um anúncio da corretora no Facebook ou Instagram (Meta Ads), na maioria pelo celular, e ainda não conhecem a Portugal. Querem entender rápido se a corretora resolve o que procuram (seguro auto, residencial, plano de saúde, consórcio, fiança locatícia, seguro de vida, seguro viagem ou seguro empresarial) e falar com alguém sem burocracia.
- **Secundário:** quem já ouviu falar da corretora, por indicação, e visita o site para conferir se é confiável.
- **Terciário:** clientes atuais que precisam acionar o seguro, a assistência 24h da seguradora ou pedir segunda via.

## Product Purpose

Site institucional que é o principal meio de divulgação da corretora. Em poucos segundos precisa deixar claro o que a corretora faz e levar o visitante a chamar no WhatsApp ou enviar o formulário "Falar com um especialista". Sucesso é contato gerado: o visitante entende em até 3 segundos e chega ao WhatsApp em 1 toque ou por um formulário curto.

## Positioning

Corretora com atendimento humano e próximo, antes e depois da contratação: compara mais de 10 seguradoras para encontrar o melhor preço para o perfil do cliente, atende pelo WhatsApp em horário estendido e acompanha o cliente no sinistro. Tem escritório físico em Santo André (SP), mais de 12 anos de mercado e é Porto Elite desde 2021.

## Operating Context

- O tráfego vem de anúncios; cada produto tem uma página de destino própria, com um único objetivo.
- O atendimento acontece no WhatsApp Business da corretora: (11) 93805-2598, segunda a sexta, das 9h às 18h.
- Cada pedido do formulário abre o WhatsApp com a mensagem pronta e também chega por e-mail em atendimento@portugalcorretora.com.br, com a campanha de origem.
- O dono atualiza o conteúdo cerca de uma vez a cada 3 meses, editando arquivos de conteúdo, sem painel.

## Capabilities and Constraints

- Stack: Astro 7 estático na Vercel, CSS escrito à mão, sem Tailwind nem biblioteca de componentes; uma função serverless para o formulário.
- Metas: Lighthouse celular ≥ 95, LCP < 2,0 s, CLS < 0,05, JS < 30 KB por página.
- LGPD: aviso de cookies com "Aceitar" e "Recusar" de mesmo peso; Pixel da Meta só após consentimento; nenhum dado pessoal armazenado no site.
- O site nunca calcula nem mostra preço; o botão nunca diz "cotação" — é sempre "Falar com um especialista".
- Proibido prometer absolutos: "os melhores preços", "menor preço", "garantido", "atendimento 24h" (a assistência 24h é da seguradora, e pode ser citada assim).

## Brand Commitments

- Nome: Portugal Corretora de Seguros.
- Logo: wordmark "Portugal" com um globo no lugar do "o" e "CORRETORA DE SEGUROS" abaixo; azul `#003780`, com versão branca. Arquivos em `brand/Logos/`.
- Voz: próxima e direta, falando com "você", frases curtas, benefício antes de característica, sem jargão sem explicação. Seriedade de corretora, sem exageros.
- Direção pedida pelo cliente: próxima e acolhedora, com um toque de agilidade (aprovada na spec).

## Evidence on Hand

- SUSEP 2022910; CNPJ 21.427.722/0001-05; endereço Av. Portugal, 1285 – Jardim Bela Vista, Santo André – SP.
- Google: nota 4,8 com 19 avaliações.
- 14 seguradoras parceiras: Porto Seguro, Allianz, Tokio Marine, HDI, Suhai, Yelum, Bradesco Seguros, Pier, Azul, Itaú Seguros, Mitsui Sumitomo, SulAmérica Saúde, Zurich, Mapfre.
- Razão social: Portugal Administradora e Corretora de Seguros Limitada. Porto Elite desde 2021.
- Textos do site aprovados pelo cliente: `src/content/` (resumo em `docs/revisao-textos.md`).
- **Ausentes, não inventar:** números de clientes e apólices (marcador `1000`), depoimentos (o cliente escolherá 3 do Google), fotos reais da equipe e do escritório.

## Product Principles

1. Contato antes de tudo: cada tela leva ao WhatsApp ou ao formulário, sem caminhos que dispersem.
2. Confiança se prova: SUSEP, tempo de mercado, nota do Google e seguradoras parceiras aparecem perto de cada pedido de ação.
3. Celular primeiro e rápido: o visitante do anúncio decide em segundos, com internet de celular.
4. Clareza sem promessas: linguagem simples e verificável, nunca absoluta.

## Accessibility & Inclusion

WCAG AA: contraste ≥ 4,5:1, navegação por teclado com foco visível, áreas de toque ≥ 44px, `prefers-reduced-motion` respeitado, campos com fonte ≥ 16px no celular.
