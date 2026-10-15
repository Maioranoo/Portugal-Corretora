import type { ProductSlug } from './product-fields';
import { getProduct, type PageContent } from './products';
import type { Crumb } from '../lib/schema';

export type SubPageSlug = 'consorcio-auto' | 'consorcio-imobiliario';

// Páginas filhas de um produto: usam o formulário do produto pai, com uma opção já escolhida.
export interface SubPage extends PageContent {
  slug: SubPageSlug;
  parent: ProductSlug;
  form: { product: ProductSlug; preset: Readonly<Record<string, string>> };
}

const ADMINISTRADORAS = {
  insurers: ['porto', 'itau', 'bradesco'],
  insurersTitle: 'Administradoras parceiras',
  insurersLead: 'Comparamos os grupos dessas administradoras para encontrar o plano certo para o seu objetivo.',
} satisfies Pick<PageContent, 'insurers' | 'insurersTitle' | 'insurersLead'>;

const FONTE_BC = { label: 'Banco Central: consórcio', href: 'https://www.bcb.gov.br/estabilidadefinanceira/consorcio' };
const FONTE_LEI = { label: 'Lei nº 11.795/2008', href: 'https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2008/lei/l11795.htm' };
const FONTE_FGTS = { label: 'FGTS', href: 'https://www.fgts.gov.br/' };

const FAQ_ABC = {
  q: 'Vocês atendem São Bernardo do Campo e São Caetano do Sul?',
  a: 'Sim. Atendemos as duas cidades do mesmo jeito que Santo André, pelo WhatsApp ou pelo formulário, da simulação até a contemplação.',
};

export const SUB_PAGES: readonly SubPage[] = [
  {
    slug: 'consorcio-auto',
    parent: 'consorcio',
    form: { product: 'consorcio', preset: { tipo: 'Veículo' } },
    name: 'Consórcio de Carro',
    seo: {
      title: 'Consórcio de Carro em Santo André | Portugal Corretora',
      description:
        'Consórcio de carro novo ou usado, sem juros de financiamento. Atendemos Santo André, São Bernardo e São Caetano. Simule com a Portugal Corretora.',
    },
    hero: {
      title: 'Consórcio de carro em Santo André e no ABC, sem juros de financiamento',
      subtitle:
        'Carro novo ou usado, com parcelas planejadas. Comparamos os grupos das administradoras parceiras e acompanhamos você nas assembleias, em Santo André, São Bernardo do Campo e São Caetano do Sul.',
    },
    coveragesTitle: 'O que o consórcio de carro oferece',
    coverages: [
      { title: 'Carro novo ou usado', text: 'A carta pode ser usada em concessionária ou na compra de usado, conforme as regras da administradora.' },
      { title: 'Sem juros de financiamento', text: 'No lugar dos juros, há taxa de administração e, quando previstos no contrato, fundo de reserva e seguro.' },
      { title: 'Sorteio ou lance', text: 'Nas assembleias, a contemplação acontece por sorteio ou por lance, conforme as regras do grupo.' },
      { title: 'Lance com parte da carta', text: 'Quando o grupo permite, parte da própria carta pode ser usada para dar o lance.' },
      { title: 'Poder de compra à vista', text: 'Com a carta liberada, você negocia o carro como comprador à vista.' },
      { title: 'Acompanhamento até a compra', text: 'Ajudamos na contemplação, na análise de crédito e na liberação da carta.' },
    ],
    audiences: [
      { title: 'Trocar de carro', text: 'Planeje a troca com antecedência, sem o custo de um financiamento.' },
      { title: 'Primeiro carro', text: 'Uma forma organizada de chegar ao primeiro carro, com parcelas que cabem no orçamento.' },
      { title: 'Quem usa o carro para trabalhar', text: 'Planejamento para renovar o carro de trabalho no momento certo.' },
    ],
    steps: [
      { title: 'Conte o que você precisa', text: 'Diga o valor aproximado do carro que você quer.' },
      { title: 'Comparamos os grupos', text: 'Mostramos prazo, parcela e custos de cada opção antes de qualquer decisão.' },
      { title: 'Você é acompanhado até o fim', text: 'Seguimos com você nas assembleias, na contemplação e na compra.' },
    ],
    guide: {
      title: 'Consórcio de carro: o que saber antes de começar',
      sections: [
        {
          title: 'Como funciona o consórcio de carro',
          paragraphs: [
            'Você escolhe o valor da carta de crédito, entra em um grupo e paga parcelas mensais. Quando é contemplado, por sorteio ou lance, recebe a carta para comprar o carro, depois da análise de crédito da administradora.',
            'A carta pode ser usada em concessionárias ou na compra de usados, conforme as regras de cada administradora, inclusive sobre a idade máxima do carro.',
          ],
        },
        {
          title: 'Consórcio de carro ou financiamento?',
          paragraphs: [
            'O financiamento entrega o carro na hora, com juros. O consórcio não tem juros de financiamento, mas pede planejamento, porque a contemplação pode levar meses ou anos.',
            'Para quem pensa em trocar de carro mais adiante, o consórcio pode sair mais em conta no custo total, dependendo da taxa de administração e do prazo. Para quem precisa do carro agora, o financiamento resolve mais rápido. Comparamos as duas opções com você.',
          ],
        },
        {
          title: 'O que considerar ao escolher um consórcio de carro',
          paragraphs: ['Antes de entrar em um grupo, compare:'],
          list: [
            'O valor da carta, suficiente para o carro que você quer, considerando o reajuste',
            'O prazo e a parcela que cabem no seu orçamento',
            'A taxa de administração e os demais custos do contrato',
            'As regras de lance do grupo, inclusive se aceita lance com parte da carta',
            'A administradora: se é autorizada pelo Banco Central e como atende os consorciados',
          ],
        },
        {
          title: 'Depois da contemplação',
          paragraphs: [
            'Com a carta liberada, você escolhe o carro, a administradora analisa o crédito e faz o pagamento ao vendedor. O carro fica no seu nome, com alienação fiduciária à administradora como garantia até a última parcela.',
            'Com o carro escolhido, também cotamos o seguro auto para você sair da loja protegido.',
          ],
        },
      ],
      sources: [FONTE_BC, FONTE_LEI],
      reviewedAt: 'outubro de 2026',
    },
    ...ADMINISTRADORAS,
    faqs: [
      {
        q: 'Posso comprar carro usado com consórcio?',
        a: 'Pode, conforme as regras da administradora, que costumam definir uma idade máxima para o carro.',
      },
      {
        q: 'Consórcio de carro tem juros?',
        a: 'Não tem juros de financiamento. Os custos são a taxa de administração e, quando previstos no contrato, o fundo de reserva e o seguro.',
      },
      {
        q: 'Posso usar o FGTS no consórcio de carro?',
        a: 'Não. O FGTS só pode ser usado em consórcio de imóvel residencial, conforme as regras do FGTS.',
      },
      {
        q: 'O carro fica no meu nome?',
        a: 'Fica. Ele é registrado no seu nome, com alienação fiduciária à administradora como garantia até a quitação.',
      },
      FAQ_ABC,
    ],
    related: [
      { href: '/consorcio', label: 'Como funciona o consórcio', text: 'Custos, contemplação e diferença para o financiamento.' },
      { href: '/seguro-auto', label: 'Seguro Auto', text: 'Proteja o carro novo comparando mais de 10 seguradoras.' },
      { href: '/consorcio-imobiliario', label: 'Consórcio de imóvel', text: 'Casa, apartamento ou terreno, com uso do FGTS conforme as regras.' },
    ],
  },
  {
    slug: 'consorcio-imobiliario',
    parent: 'consorcio',
    form: { product: 'consorcio', preset: { tipo: 'Imóvel' } },
    name: 'Consórcio de Imóvel',
    seo: {
      title: 'Consórcio de Imóvel em Santo André | Portugal Corretora',
      description:
        'Consórcio de imóvel para casa, apartamento ou terreno, com uso do FGTS conforme as regras. Santo André, São Bernardo e São Caetano. Simule conosco.',
    },
    hero: {
      title: 'Consórcio de imóvel em Santo André e no ABC: um caminho planejado para a casa própria',
      subtitle:
        'Casa, apartamento ou terreno, sem juros de financiamento. Explicamos o uso do FGTS, comparamos as administradoras parceiras e acompanhamos você até a contemplação.',
    },
    coveragesTitle: 'O que o consórcio de imóvel oferece',
    coverages: [
      { title: 'Casa, apartamento ou terreno', text: 'Imóvel novo ou usado, residencial ou comercial, conforme as regras do grupo.' },
      { title: 'Sem juros de financiamento', text: 'No lugar dos juros, há taxa de administração e, quando previstos no contrato, fundo de reserva e seguro.' },
      { title: 'Uso do FGTS', text: 'Em imóvel residencial, para lance, complemento da carta ou amortização, conforme as regras do FGTS.' },
      { title: 'Sorteio ou lance', text: 'Nas assembleias, a contemplação acontece por sorteio ou por lance, conforme as regras do grupo.' },
      { title: 'Construção ou reforma', text: 'Em alguns grupos, a carta também pode ser usada para construir ou reformar.' },
      { title: 'Acompanhamento até a compra', text: 'Ajudamos na contemplação, na análise de crédito e na documentação.' },
    ],
    audiences: [
      { title: 'Casa própria', text: 'Saia do aluguel com planejamento e sem juros de financiamento.' },
      { title: 'Trocar de imóvel', text: 'Planeje a mudança para um imóvel maior ou mais bem localizado.' },
      { title: 'Imóvel para renda', text: 'Para quem planeja comprar um imóvel e alugar.' },
    ],
    steps: [
      { title: 'Conte o que você precisa', text: 'Diga o tipo de imóvel e o valor aproximado da carta.' },
      { title: 'Comparamos os grupos', text: 'Mostramos prazo, parcela e custos de cada opção antes de qualquer decisão.' },
      { title: 'Você é acompanhado até o fim', text: 'Seguimos com você nas assembleias, na contemplação e na compra.' },
    ],
    guide: {
      title: 'Consórcio de imóvel: o que saber antes de começar',
      sections: [
        {
          title: 'Como funciona o consórcio de imóvel',
          paragraphs: [
            'Você escolhe o valor da carta de crédito, entra em um grupo e paga parcelas mensais. Quando é contemplado, por sorteio ou lance, recebe a carta para comprar o imóvel, depois da análise de crédito e da avaliação do imóvel pela administradora.',
          ],
        },
        {
          title: 'Como usar o FGTS no consórcio de imóvel',
          paragraphs: [
            'O FGTS pode ser usado para dar lance, completar o valor da carta ou amortizar o saldo, desde que você e o imóvel cumpram as regras do FGTS. As principais são:',
            'As regras do FGTS podem mudar. Conferimos as condições atualizadas no momento da contratação.',
          ],
          list: [
            'O imóvel precisa ser residencial, urbano e para a sua moradia',
            'É preciso somar pelo menos 3 anos de trabalho com FGTS, contando todos os empregos',
            'Você não pode ter outro imóvel residencial na cidade onde mora ou trabalha, nem financiamento ativo pelo Sistema Financeiro da Habitação',
            'Terreno sem construção e imóvel comercial não permitem o uso do FGTS',
            'A liberação depende da análise da Caixa e da administradora',
          ],
        },
        {
          title: 'Consórcio de imóvel ou financiamento?',
          paragraphs: [
            'O financiamento imobiliário entrega o imóvel logo, com juros por muitos anos. O consórcio não tem juros de financiamento, mas a contemplação pode levar tempo, por isso funciona melhor para quem consegue planejar.',
            'Comparamos o custo total das duas opções com você, incluindo a taxa de administração, o fundo de reserva e o reajuste da carta.',
          ],
        },
        {
          title: 'O que considerar ao escolher um consórcio de imóvel',
          paragraphs: ['Antes de entrar em um grupo, compare:'],
          list: [
            'O valor da carta, suficiente para o imóvel que você quer, considerando o reajuste',
            'O prazo e a parcela que cabem no seu orçamento',
            'A taxa de administração e os demais custos do contrato',
            'As regras de lance e de uso da carta, como terreno, construção ou reforma',
            'A administradora: se é autorizada pelo Banco Central e como atende os consorciados',
          ],
        },
        {
          title: 'Depois da contemplação',
          paragraphs: [
            'Com a carta liberada, você escolhe o imóvel, a administradora avalia o imóvel e analisa o crédito, e o pagamento é feito ao vendedor. O imóvel fica em alienação fiduciária com a administradora, como garantia, até a quitação.',
          ],
        },
      ],
      sources: [FONTE_BC, FONTE_LEI, FONTE_FGTS],
      reviewedAt: 'outubro de 2026',
    },
    ...ADMINISTRADORAS,
    faqs: [
      {
        q: 'Posso usar o FGTS no consórcio de imóvel?',
        a: 'Pode, em imóvel residencial urbano para a sua moradia, para lance, complemento da carta ou amortização, desde que você cumpra as regras do FGTS.',
      },
      {
        q: 'Dá para comprar terreno com consórcio?',
        a: 'Em muitos grupos, sim. Nesse caso, o FGTS não pode ser usado para o terreno sem construção.',
      },
      {
        q: 'Consórcio de imóvel tem juros?',
        a: 'Não tem juros de financiamento. Os custos são a taxa de administração e, quando previstos no contrato, o fundo de reserva e o seguro.',
      },
      {
        q: 'Posso usar a carta para construir ou reformar?',
        a: 'Em alguns grupos, sim, conforme as regras da administradora. Indicamos os grupos que permitem esse uso.',
      },
      FAQ_ABC,
    ],
    related: [
      { href: '/consorcio', label: 'Como funciona o consórcio', text: 'Custos, contemplação e diferença para o financiamento.' },
      { href: '/seguro-residencial', label: 'Seguro Residencial', text: 'Proteja o imóvel novo contra incêndio, roubo e danos elétricos.' },
      { href: '/consorcio-auto', label: 'Consórcio de carro', text: 'Carro novo ou usado, com parcelas planejadas.' },
    ],
  },
];

export function getSubPage(slug: SubPageSlug): SubPage {
  const s = SUB_PAGES.find((x) => x.slug === slug);
  if (!s) throw new Error(`Subpágina desconhecida: ${slug}`);
  return s;
}

export function subPageCrumbs(sub: SubPage): Crumb[] {
  const parent = getProduct(sub.parent);
  return [
    { name: 'Início', path: '/' },
    { name: parent.name, path: `/${parent.slug}` },
    { name: sub.name, path: `/${sub.slug}` },
  ];
}
