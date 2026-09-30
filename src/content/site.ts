import { WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from './contact';
import type { Faq, Item } from './products';

export const COMPANY = {
  name: 'Portugal Corretora de Seguros',
  legalName: 'Portugal Administradora e Corretora de Seguros Limitada',
  cnpj: '21.427.722/0001-05',
  susep: '2022910',
  address: {
    street: 'Av. Portugal, 1285',
    district: 'Jardim Bela Vista',
    city: 'Santo André',
    state: 'SP',
    zip: '09040-011',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Portugal+Corretora+de+Seguros+Av.+Portugal+1285+Santo+Andr%C3%A9',
  },
  whatsapp: WHATSAPP_NUMBER,
  whatsappDisplay: WHATSAPP_DISPLAY,
  email: 'atendimento@portugalcorretora.com.br',
  dpoEmail: 'atendimento@portugalcorretora.com.br',
  hoursLabel: 'Segunda a sexta, das 9h às 18h',
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
  portoElite: { label: 'Porto Elite', since: 2021 },
} as const;

export const HOME = {
  seo: {
    title: 'Portugal Corretora de Seguros | Santo André, SP',
    description:
      'Seguro auto, residencial, plano de saúde e consórcio. Comparamos mais de 10 seguradoras para encontrar o melhor preço para você. Fale pelo WhatsApp.',
  },
  hero: {
    title: 'Seguro com atendimento de verdade, do orçamento ao sinistro',
    subtitle:
      'Comparamos mais de 10 seguradoras para encontrar o melhor preço para você. Fale com um especialista pelo WhatsApp.',
  },
} as const;

export const STATS = [
  { value: '1000', label: 'clientes atendidos' }, // PENDENTE: número real
  { value: '1000', label: 'apólices ativas' }, // PENDENTE: número real
  { value: '+12', label: 'anos de mercado' },
  { value: '14', label: 'seguradoras parceiras' },
] as const;

export const DIFFERENTIALS: readonly Item[] = [
  {
    title: 'Atendimento pelo WhatsApp',
    text: 'De segunda a sexta, das 9h às 18h, com gente de verdade do outro lado.',
  },
  {
    title: 'Acompanhamento no sinistro',
    text: 'Se precisar usar o seguro, a gente cuida do processo com você até o fim.',
  },
  {
    title: 'Mais de 10 seguradoras',
    text: 'Comparamos as opções para encontrar o melhor preço e a cobertura certa.',
  },
  {
    title: 'Porto Elite',
    text: 'Corretora Porto Elite desde 2021, reconhecida pela Porto pelo nosso trabalho.',
  },
];

export const HOME_STEPS: readonly [Item, Item, Item] = [
  { title: 'Conte o que você precisa', text: 'Pelo formulário ou pelo WhatsApp, em poucos minutos.' },
  { title: 'Comparamos as seguradoras', text: 'Buscamos as melhores condições para o seu perfil.' },
  { title: 'Você escolhe e fica protegido', text: 'E conta com a gente sempre que precisar usar.' },
];

export const GENERAL_FAQS: readonly Faq[] = [
  {
    q: 'A Portugal é uma corretora registrada?',
    a: 'Sim. Somos corretora registrada na SUSEP, sob o nº 2022910, e atuamos há mais de 12 anos.',
  },
  {
    q: 'Quanto custa o atendimento da corretora?',
    a: 'Nada para você. A corretora é remunerada pela seguradora, e você ainda ganha a comparação entre várias opções em um só atendimento.',
  },
  {
    q: 'Vocês atendem fora de Santo André?',
    a: 'Sim. Nosso escritório fica em Santo André, mas o atendimento pelo WhatsApp funciona para todo o Brasil.',
  },
  {
    q: 'Como aciono meu seguro?',
    a: 'Fale com a gente pelo WhatsApp. Orientamos o que fazer e acionamos a seguradora com você. A assistência 24h da seguradora também pode ser chamada direto pelo telefone dela.',
  },
  {
    q: 'Em quanto tempo recebo uma proposta?',
    a: 'Depende do tipo de seguro. Para a maioria, enviamos as opções no mesmo dia útil, depois de conversar com você.',
  },
];

export const TESTIMONIALS: readonly { name: string; text: string; rating: 5 | 4 }[] = []; // PENDENTE: cliente escolhe 3 do Google

export const ABOUT = {
  title: 'Há mais de 12 anos cuidando do que é importante para você',
  paragraphs: [
    'A Portugal Corretora de Seguros nasceu em Santo André com uma ideia simples: seguro precisa de atendimento próximo, antes e depois da contratação. Comparamos as seguradoras, explicamos cada detalhe e ficamos ao seu lado quando você precisa usar.',
    'Nossa equipe tem especialistas em diferentes ramos e se mantém atualizada com cursos oferecidos pelas próprias seguradoras. Assim, você recebe uma orientação clara em todo o processo de cotação, contratação e pós-venda.',
  ],
} as const;

// Títulos e textos de apoio das seções da home
export const SECTIONS = {
  products: { title: 'Qual seguro você procura?' },
  steps: { title: 'Como funciona' },
  differentials: {
    title: 'Gente de verdade cuidando do seu seguro',
    lead: 'Atendimento próximo antes, durante e depois da contratação.',
  },
  insurers: {
    title: 'Comparamos mais de 10 seguradoras para você',
    lead: 'Trabalhamos com as principais seguradoras do país para encontrar a proposta certa para o seu perfil.',
  },
  reviews: { title: 'Quem já é cliente recomenda' },
  client: {
    title: 'Já é cliente e precisa acionar o seguro?',
    text: 'Sinistro, assistência 24h da seguradora ou segunda via: veja como falar com a gente.',
  },
  faq: { title: 'Perguntas frequentes' },
  contact: {
    title: 'Fale com um especialista',
    lead: 'Conte o que você precisa. A gente compara as seguradoras e responde pelo WhatsApp, de segunda a sexta, das 9h às 18h.',
  },
} as const;

// Títulos das seções das páginas de produto
export const PRODUCT_PAGE = {
  audiencesTitle: 'Para quem é',
  stepsTitle: 'Como funciona',
  insurersTitle: 'Seguradoras parceiras para',
  insurersLead: 'Comparamos as opções dessas seguradoras para encontrar a proposta certa para você.',
  faqTitle: 'Dúvidas sobre',
  closeTitle: 'Pronto para ficar protegido?',
  closeLead: 'Fale com um especialista e receba as opções das seguradoras para o seu perfil.',
} as const;

// Página "Já sou cliente"
export const CLIENT_PAGE = {
  seo: {
    title: 'Já sou cliente | Portugal Corretora de Seguros',
    description:
      'Precisa acionar o seguro, a assistência 24h ou pedir segunda via? Fale com a Portugal pelo WhatsApp ou ligue direto para a sua seguradora.',
  },
  title: 'Já é cliente? Estamos com você',
  lead: 'Fale com a gente pelo WhatsApp para qualquer necessidade do seu seguro. Em uma emergência, a assistência 24h da seguradora atende direto pelo telefone.',
  whatsappMessage: 'Olá! Já sou cliente da Portugal Corretora e preciso de ajuda com meu seguro.',
  topics: [
    { title: 'Acionar sinistro', text: 'Batida, roubo, incêndio ou outro imprevisto: orientamos o passo a passo e acionamos a seguradora com você.' },
    { title: 'Assistência 24h', text: 'Guincho, chaveiro, encanador e outros serviços: ligue para a sua seguradora (telefones abaixo) ou fale com a gente.' },
    { title: 'Segunda via', text: 'Boleto, apólice ou carteirinha: pedimos para você e enviamos pelo WhatsApp.' },
    { title: 'Alterar o seguro', text: 'Troca de carro, mudança de endereço ou inclusão de pessoas: ajustamos a sua apólice.' },
  ],
  phonesTitle: 'Telefones de assistência das seguradoras',
  phonesNote: 'Números informados pelas seguradoras em seus sites oficiais. Em caso de dúvida, fale com a gente.',
} as const;

// Aviso de cookies
export const COOKIE_BANNER = {
  title: 'Cookies',
  text: 'Usamos cookies de marketing da Meta para medir nossos anúncios, apenas se você aceitar.',
  link: 'Saiba mais',
} as const;
