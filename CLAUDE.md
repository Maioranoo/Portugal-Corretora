# Regras de skills e ferramentas deste projeto

Projeto: novo site da Portugal Corretora de Seguros (portugalcorretora.com.br).
Objetivo: site institucional que passe confiança, rápido, responsivo (mobile first)
e com integração com WhatsApp.

## Fluxo obrigatório (nesta ordem)
1. **brainstorming**: antes de escrever qualquer código, levante comigo os requisitos,
   as páginas, o público e o estilo. Faça perguntas, uma de cada vez. Não codifique
   até eu aprovar.
2. **writing-plans**: depois que eu aprovar os requisitos, escreva o plano de
   implementação em etapas e espere minha aprovação.
3. **executing-plans**: execute o plano etapa por etapa. Ao fim de cada etapa,
   me diga o que foi feito antes de seguir.
4. **verification-before-completion**: nunca diga que algo está pronto sem evidência
   (build rodando, prints do Playwright, testes passando).

## Skills de design e animação (usar durante a construção da interface)
- **impeccable**: base de todo o design, crítica e polimento da interface.
- **design-taste-frontend** (v2): direção visual. Evite visual de template genérico.
- **emil-design-eng**: animações sutis e funcionais (hover, transições, entrada de
  elementos). Nada exagerado: é uma corretora, precisa passar seriedade.

## Skills de uso pontual (só quando a situação pedir)
- **systematic-debugging**: sempre que aparecer um bug ou erro. Investigue a causa
  antes de propor correção.
- **redesign-existing-projects**: só na fase de brainstorming, se for útil analisar
  o site atual.
- **figma-design-to-code**: só se eu mandar um link do Figma.
- **review-animations**: vou chamar manualmente no final.
- **code-review** e **security-review**: na revisão final, antes de publicar. A
  security-review é obrigatória por causa dos formulários com dados de clientes.

## Skills que NÃO devem ser usadas neste projeto
design-taste-frontend-v1, gpt-taste, stitch-design-taste, high-end-visual-design,
frontend-design, minimalist-ui, industrial-brutalist-ui, apple-design, mobile-native,
imagegen-frontend-mobile, animate, animate-expo, improve-animations, figma-swiftui,
write-swift.
Motivo: sobrepõem as skills escolhidas acima ou são para app mobile/iOS.

## MCPs
- **Playwright**: usar sempre que terminar uma página ou mudança visual relevante.
  Abra o site local, tire prints em desktop (1440px) e mobile (390px), analise o
  layout e corrija o que estiver errado. Teste também o botão do WhatsApp e os
  formulários. Use também na verificação final.
- **Figma**: só quando eu mandar um link do Figma. Não use por conta própria.

## Regras gerais
- Se houver dúvida sobre qual skill usar, pergunte antes.
- Não instale dependências novas sem me avisar e explicar o motivo.
- Explique as decisões importantes em português.