---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/pages/[produto].astro"]
---

# Home e páginas de produto (Persuade)

Escopo: home (`src/pages/index.astro`) e o modelo das páginas de produto (`src/pages/[produto].astro`), que herdam o mesmo mundo.
Modo: Persuade. Visitante vindo de anúncio Meta, maioria no celular; ação: "Falar com um especialista" (formulário que abre o WhatsApp) ou WhatsApp direto.
Prova disponível: SUSEP 2022910, +12 anos, Google 4,8 (19), 12 seguradoras parceiras, Prêmio Porto Elite (consórcio). Selos com o mesmo peso (decisão do cliente).
Evitar (cliente): parecer banco, fintech/app, template ou popular/barato. Imagens: ilustrações e elementos gráficos, sem fotos de banco.

## Direction contract

THESIS: O globo do logo é o sistema. Arcos de meridiano ligam o visitante ao produto e à seguradora certa; o site mostra o caminho em vez de prometer. Recusa o padrão da categoria: faixa azul com foto de família, ícones de escudo e grade de cartões idênticos.

OWN-WORLD: Chão de cal claro e quente (#F6F3EE). Azul Portugal #003780 reservado ao botão principal, aos traços do globo e ao rodapé (campo inteiro); o resto é claro (ajuste pedido pelo cliente: menos cor, menos poluição). Globo no traço do logo: disco azul muito claro (#E8EEF7) com anel afunilado, eixo inclinado e latitudes em lâmina em #003780. Arcos em traço fino a ~22% do azul, pontos de chegada; âmbar #E8A33D só no ponto ativo. Verde do WhatsApp sólido apenas no botão flutuante; demais botões de WhatsApp contornados (no claro) ou sólidos claros (sobre o azul), com ícone verde escuro #128C4A. Tipografia Archivo variável: display semi-condensado e pesado; texto em largura normal; números tabulares. Raio de 10px, sombras suaves e raras, sem gradientes.

STORY: Em segundos o visitante entende: corretora de Santo André que compara mais de 10 seguradoras e atende pelo WhatsApp. Acredita pelos três selos de mesmo peso e pelos logos das seguradoras ligados por arcos. Age tocando "Falar com um especialista" ou o WhatsApp, a um toque em qualquer ponto.

FIRST VIEWPORT: Desktop 1440: cabeçalho de 72px (logo à esquerda, trilho dos 6 produtos, WhatsApp à direita). Colunas 1–6: título em até 3 linhas (~64px), subtítulo (~20px), botão principal azul "Falar com um especialista" e botão verde de WhatsApp, e abaixo os três selos em linha. Colunas 7–12: globo azul de ~560px sangrando pela borda direita, com seis arcos que saem dele e terminam nos rótulos dos 6 produtos (links). Celular 390: título, subtítulo, botão principal de largura total e selos visíveis sem rolar; um quarto do globo surge pela borda direita no fim do topo e seus arcos descem até o trilho de produtos logo abaixo; barra fina de WhatsApp fixa embaixo.

FORM: Meridianos (o globo do logo como sistema), posição 7 da minha lista ordenada, seed ba7556d9. Assinatura: ao passar o mouse ou focar um produto, o arco dele se acende do globo até o rótulo (desenho do traço num único gesto); no formulário, escolher o produto abre os campos certos ao longo do arco. Raises: faixa de meridiano contínua entre páginas (livery); formulário que se transforma num gesto (cape); trilho único dos 6 produtos (manual); grade rígida de 12 colunas (teletext); "Como funciona" em sequência de um só movimento (automata); animação como gesto único (ebru).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
