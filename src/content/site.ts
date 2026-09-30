import { WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from './contact';
import type { Faq, Item } from './products';

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
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Portugal+Corretora+de+Seguros+Av.+Portugal+1285+Santo+Andr%C3%A9',
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
  portoElite: { label: 'Prêmio Porto Elite, Consórcio', conferir: true }, // PENDENTE: ano e categoria
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
  { value: '12', label: 'seguradoras parceiras' },
] as const;

export const DIFFERENTIALS: readonly Item[] = [
  {
    title: 'Atendimento pelo WhatsApp',
    text: 'Das 8h às 20h, em dias úteis, com gente de verdade do outro lado.',
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
    title: 'Prêmio Porto Elite',
    text: 'Reconhecimento da Porto pelo nosso trabalho com consórcio.', // conferir: ano e categoria
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
