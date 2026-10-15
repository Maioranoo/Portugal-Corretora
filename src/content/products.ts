import type { InsurerId } from './insurers';
import { PRODUCT_FORMS, type ProductSlug } from './product-fields';

export interface Faq {
  q: string;
  a: string;
}
export interface Item {
  title: string;
  text: string;
}
export interface GuideSection {
  title: string;
  paragraphs: string[]; // a lista (se houver) aparece depois do primeiro parágrafo
  list?: string[];
}
export interface Guide {
  title: string;
  lead?: string;
  sections: GuideSection[];
  sources?: { label: string; href: string }[]; // só sites oficiais (SUSEP, Banco Central, Planalto, FGTS)
  reviewedAt: string; // ex.: "outubro de 2026"
}
export interface RelatedLink {
  href: string;
  label: string;
  text: string;
}
// Conteúdo de qualquer página no modelo de produto (produtos e subpáginas de consórcio)
export interface PageContent {
  slug: string;
  name: string;
  seo: { title: string; description: string }; // title ≤ 60; description 70–160
  hero: { title: string; subtitle: string };
  coveragesTitle: string;
  coverages: Item[]; // 4–6
  audiences: Item[]; // 2–4
  steps: [Item, Item, Item];
  faqs: Faq[]; // 4 ou mais
  insurers: InsurerId[];
  insurersTitle?: string; // padrão: "Seguradoras parceiras para <nome>"
  insurersLead?: string; // padrão: PRODUCT_PAGE.insurersLead
  badge?: string;
  guide?: Guide;
  related?: RelatedLink[];
}
export interface Product extends PageContent {
  slug: ProductSlug;
  shortName: string; // rótulo curto do trilho de produtos
  priority: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  featured: boolean;
  cardText: string; // até 90 caracteres
  // insurers: seguradoras exibidas na página; o cliente aprovou a divisão em 01/10/2026 (os corretores ajustam no atendimento)
}

export const PRODUCTS: readonly Product[] = [
  {
    slug: 'seguro-auto',
    name: PRODUCT_FORMS['seguro-auto'].name,
    shortName: 'Auto',
    priority: 1,
    featured: true,
    cardText: 'Proteção contra batida, roubo e danos a terceiros, com assistência 24h.',
    seo: {
      title: 'Seguro Auto em Santo André e no ABC | Portugal Corretora',
      description:
        'Cote seguro auto em Santo André, São Bernardo e São Caetano. Comparamos mais de 10 seguradoras para o seu perfil e atendemos pelo WhatsApp.',
    },
    hero: {
      title: 'Seguro auto em Santo André e no ABC, com a cobertura certa para o seu perfil',
      subtitle:
        'Comparamos mais de 10 seguradoras para encontrar a proposta que combina com você e com o seu carro. Atendemos Santo André, São Bernardo do Campo e São Caetano do Sul, e acompanhamos você se precisar usar o seguro.',
    },
    coveragesTitle: 'Coberturas que você pode contratar',
    coverages: [
      { title: 'Colisão e perda total', text: 'Conserto após batidas ou indenização quando o reparo não compensa, nos limites da apólice.' },
      { title: 'Roubo e furto', text: 'Indenização se o carro for levado, conforme o valor e as condições contratadas.' },
      { title: 'Danos a terceiros', text: 'Danos materiais e corporais que você causar a outras pessoas, até o limite escolhido.' },
      { title: 'Assistência 24h da seguradora', text: 'Guincho, chaveiro, troca de pneu e pane, de acordo com o plano de assistência.' },
      { title: 'Carro reserva', text: 'Opcional para você não ficar a pé enquanto o carro está na oficina.' },
      { title: 'Vidros, faróis e retrovisores', text: 'Opcional para troca ou reparo, conforme as regras da seguradora.' },
    ],
    guide: {
      title: 'Guia do seguro auto: o que saber antes de cotar',
      lead: 'Respostas diretas para as dúvidas que mais ouvimos de motoristas de Santo André, São Bernardo do Campo e São Caetano do Sul.',
      sections: [
        {
          title: 'Como cotar seguro auto em Santo André e no ABC',
          paragraphs: [
            'Para cotar, precisamos de poucas informações sobre o carro, quem dirige e como ele é usado:',
            'Com esses dados, a Portugal Corretora consulta mais de 10 seguradoras e mostra as opções lado a lado, explicando o que muda entre elas. Você pode começar pelo formulário desta página ou pelo WhatsApp. O atendimento é o mesmo para Santo André, São Bernardo do Campo e São Caetano do Sul.',
          ],
          list: [
            'Modelo, versão e ano do carro',
            'CEP onde o carro passa a noite',
            'Idade e tempo de habilitação de quem dirige com mais frequência',
            'Uso do carro: particular, trabalho ou aplicativo',
            'Apólice atual, se você já tem seguro, para aproveitar a classe de bônus',
          ],
        },
        {
          title: 'O que influencia o valor do seguro de carro',
          paragraphs: [
            'Cada seguradora calcula o preço com base no risco. Os pontos que mais pesam costumam ser:',
            'Como cada seguradora avalia esses pontos de um jeito, o mesmo carro pode ter preços bem diferentes. Por isso comparar faz diferença.',
          ],
          list: [
            'O modelo do carro, o valor de mercado e o custo das peças',
            'O CEP de pernoite e de circulação, porque os índices de roubo e de batidas mudam de um bairro para outro',
            'O perfil de quem dirige, como idade e tempo de habilitação',
            'Onde o carro fica guardado, em casa e no trabalho',
            'O histórico de seguro e a classe de bônus',
            'As coberturas, os limites e a franquia escolhidos',
          ],
        },
        {
          title: 'Seguro compreensivo ou só contra terceiros?',
          paragraphs: [
            'O seguro compreensivo, também chamado de completo, protege o seu carro contra colisão, roubo, furto, incêndio e alguns fenômenos naturais, e normalmente inclui danos a terceiros e assistência.',
            'O seguro contra terceiros cobre só os danos que você causar a outras pessoas e aos bens delas. Custa menos, mas não paga o conserto nem a indenização do seu carro. Pode fazer sentido para carros de menor valor. Na cotação, mostramos as duas opções para você comparar.',
          ],
        },
        {
          title: 'Como escolher a cobertura certa',
          paragraphs: [
            'Comece pelo que você não conseguiria pagar sozinho: o valor do carro e os danos a terceiros. Para terceiros, vale considerar limites mais altos para danos materiais e corporais, porque um acidente envolvendo outro carro ou pessoas pode custar caro.',
            'Depois, veja os opcionais que fazem diferença na sua rotina, como carro reserva, vidros e guincho com distância maior. Contratar só o que faz sentido para você deixa o seguro mais equilibrado.',
          ],
        },
        {
          title: 'Como funciona a franquia',
          paragraphs: [
            'A franquia é a parte do conserto que fica com você quando usa o seguro em um dano parcial. Se o conserto custar menos que a franquia, normalmente não vale acionar o seguro.',
            'Em geral, a franquia não é cobrada em perda total, roubo ou furto, mas isso depende das condições de cada apólice. Franquia reduzida deixa o uso mais barato e o seguro mais caro; franquia maior faz o contrário. Simulamos as opções para você escolher.',
          ],
        },
        {
          title: 'Dá para fazer seguro de carro usado?',
          paragraphs: [
            'Sim. A maioria das seguradoras aceita carros usados, e a idade do carro muda principalmente o preço e as coberturas disponíveis. Em alguns casos, a seguradora pede vistoria antes de aceitar.',
            'A aceitação é sempre da seguradora, que analisa o carro e o perfil de quem dirige. Se uma não aceitar, procuramos outras opções para você.',
          ],
        },
        {
          title: 'Por que contratar com uma corretora',
          paragraphs: [
            'A corretora trabalha para você, não para uma seguradora específica. Na Portugal Corretora, registrada na SUSEP sob o nº 2022910, você compara várias seguradoras em um só atendimento e tem com quem contar na renovação, nas mudanças da apólice e no sinistro.',
            'A remuneração da corretora já vem incluída no valor do seguro, sem cobrança separada pelo atendimento.',
          ],
        },
      ],
      sources: [
        {
          label: 'SUSEP: seguro de automóveis',
          href: 'https://www.gov.br/susep/pt-br/assuntos/meu-futuro-seguro/seguros-previdencia-e-capitalizacao/seguros/seguro-de-automoveis',
        },
        { label: 'SUSEP: corretor de seguros', href: 'https://www.gov.br/susep/pt-br/assuntos/corretor-de-seguros' },
      ],
      reviewedAt: 'outubro de 2026',
    },
    audiences: [
      { title: 'Primeiro carro', text: 'Explicamos cada cobertura para você contratar só o que faz sentido.' },
      { title: 'Família', text: 'Proteção para o carro que leva todo mundo, com assistência para imprevistos.' },
      { title: 'Motorista de aplicativo', text: 'Opções de seguro que aceitam uso para trabalho com aplicativos.' },
    ],
    steps: [
      { title: 'Conte o que você precisa', text: 'Informe o modelo e o ano do carro pelo formulário ou pelo WhatsApp.' },
      { title: 'Comparamos as seguradoras', text: 'Buscamos as melhores condições para o seu perfil e o seu CEP.' },
      { title: 'Você escolhe e fica protegido', text: 'Explicamos as opções e acompanhamos você até o fim, inclusive no sinistro.' },
    ],
    faqs: [
      {
        q: 'Onde cotar seguro auto em Santo André?',
        a: 'Na Portugal Corretora de Seguros, na Av. Portugal, 1285, Jardim Bela Vista, em Santo André. A cotação é feita pelo WhatsApp ou pelo formulário desta página, sem precisar ir ao escritório, e comparamos mais de 10 seguradoras para o seu perfil.',
      },
      {
        q: 'Vocês atendem São Bernardo do Campo e São Caetano do Sul?',
        a: 'Sim. Atendemos as duas cidades do mesmo jeito que Santo André: cotação, contratação, renovação e acompanhamento no sinistro, pelo WhatsApp ou pelo formulário.',
      },
      {
        q: 'Por que o preço muda de uma pessoa para outra?',
        a: 'O valor depende do carro, do CEP onde ele fica, de quem dirige, do uso e do histórico de seguro. Por isso comparamos várias seguradoras: cada uma avalia esses pontos de um jeito.',
      },
      {
        q: 'Posso trocar de seguradora na renovação sem perder o bônus?',
        a: 'Em geral, sim. O bônus é do segurado e pode ser levado para outra seguradora, desde que a renovação seja feita no prazo e sem interrupção. Conferimos a sua classe de bônus antes da troca.',
      },
      {
        q: 'Motorista de aplicativo consegue fazer seguro?',
        a: 'Consegue. Algumas seguradoras têm opções para quem usa o carro com aplicativos de transporte. Basta nos contar como você usa o carro.',
      },
      {
        q: 'O que fazer em caso de batida?',
        a: 'Mantenha a calma, sinalize o local e, se houver feridos, chame o socorro. Depois fale com a gente pelo WhatsApp: orientamos o passo a passo e acionamos a seguradora com você.',
      },
    ],
    related: [
      { href: '/consorcio-auto', label: 'Consórcio de carro', text: 'Planeje a troca do carro sem os juros de um financiamento.' },
      { href: '/seguro-residencial', label: 'Seguro Residencial', text: 'Proteção para a casa ou o apartamento, próprio ou alugado.' },
      { href: '/ja-sou-cliente', label: 'Já sou cliente', text: 'Sinistro, assistência 24h da seguradora e segunda via.' },
    ],
    insurers: ['porto', 'allianz', 'tokio-marine', 'hdi', 'suhai', 'yelum', 'bradesco', 'pier', 'azul', 'itau', 'mitsui-sumitomo', 'zurich', 'mapfre'],
  },
  {
    slug: 'seguro-residencial',
    name: PRODUCT_FORMS['seguro-residencial'].name,
    shortName: 'Residencial',
    priority: 2,
    featured: true,
    cardText: 'Casa ou apartamento protegidos contra incêndio, roubo e danos elétricos.',
    seo: {
      title: 'Seguro Residencial | Portugal Corretora de Seguros',
      description:
        'Seguro residencial para casa ou apartamento, próprio ou alugado. Cobertura para incêndio, roubo e danos elétricos, com assistência para o dia a dia.',
    },
    hero: {
      title: 'Sua casa protegida, com ajuda para os imprevistos do dia a dia',
      subtitle:
        'Seguro para casa ou apartamento, próprio ou alugado. Comparamos as seguradoras e encontramos a opção que cabe no seu orçamento.',
    },
    coveragesTitle: 'O que o Seguro Residencial cobre',
    coverages: [
      { title: 'Incêndio, raio e explosão', text: 'A cobertura básica, que protege a estrutura do imóvel e os seus bens.' },
      { title: 'Roubo e furto qualificado', text: 'Indenização pelos bens levados em caso de arrombamento.' },
      { title: 'Danos elétricos', text: 'Aparelhos e instalações danificados por curto-circuito ou oscilação de energia.' },
      { title: 'Vendaval e granizo', text: 'Danos causados por ventos fortes, chuva de granizo e queda de árvores.' },
      { title: 'Responsabilidade civil familiar', text: 'Danos que você ou sua família causarem a vizinhos e outras pessoas.' },
      { title: 'Assistência residencial', text: 'Encanador, eletricista e chaveiro quando você precisar.' },
    ],
    audiences: [
      { title: 'Casa própria', text: 'Proteção para o seu patrimônio e para tudo o que tem dentro dele.' },
      { title: 'Quem mora de aluguel', text: 'Inquilino também pode contratar para proteger os próprios bens.' },
      { title: 'Apartamento', text: 'Complementa o seguro do condomínio, que não cobre o que é seu.' },
    ],
    steps: [
      { title: 'Conte o que você precisa', text: 'Diga se é casa ou apartamento, próprio ou alugado.' },
      { title: 'Comparamos as seguradoras', text: 'Buscamos as coberturas certas para o seu imóvel e o seu bairro.' },
      { title: 'Você escolhe e fica protegido', text: 'Contratação simples e acompanhamento sempre que precisar usar.' },
    ],
    faqs: [
      {
        q: 'Quem mora de aluguel pode contratar?',
        a: 'Pode. O inquilino contrata para proteger os próprios bens e se proteger de danos que causar ao imóvel ou aos vizinhos.',
      },
      {
        q: 'O seguro residencial é caro?',
        a: 'Costuma caber no orçamento, porque o valor mensal é baixo em relação ao que ele protege. O preço depende do imóvel, do endereço e das coberturas escolhidas.',
      },
      {
        q: 'Os móveis e eletrodomésticos estão cobertos?',
        a: 'Sim, os bens dentro de casa podem ser incluídos, de acordo com as coberturas e os valores contratados.',
      },
      {
        q: 'O condomínio já tem seguro. Preciso do meu?',
        a: 'O seguro do condomínio cobre a estrutura e as áreas comuns. O seu apartamento por dentro e os seus bens precisam de um seguro próprio.',
      },
    ],
    insurers: ['porto', 'allianz', 'tokio-marine', 'hdi', 'yelum', 'bradesco', 'pier', 'itau', 'mitsui-sumitomo', 'zurich', 'mapfre'],
  },
  {
    slug: 'plano-de-saude',
    name: PRODUCT_FORMS['plano-de-saude'].name,
    shortName: 'Saúde',
    priority: 3,
    featured: true,
    cardText: 'Planos para você, sua família ou sua empresa, a partir de 2 vidas.',
    seo: {
      title: 'Plano de Saúde Individual, Familiar e Empresarial',
      description:
        'Plano de saúde para você, sua família ou sua empresa, inclusive MEI a partir de 2 vidas. Comparamos opções de rede e preço com a Portugal Corretora.',
    },
    hero: {
      title: 'Plano de saúde com a rede que você precisa, no valor que cabe',
      subtitle:
        'Para você, sua família ou sua empresa. Comparamos as operadoras e explicamos carência, rede e coparticipação sem complicação.',
    },
    coveragesTitle: 'O que o plano oferece',
    coverages: [
      { title: 'Consultas e exames', text: 'Acesso a médicos e laboratórios da rede credenciada.' },
      { title: 'Internação e cirurgias', text: 'Cobertura hospitalar conforme o tipo de plano escolhido.' },
      { title: 'Rede na sua região', text: 'Buscamos planos com hospitais e clínicas perto de você.' },
      { title: 'Com ou sem coparticipação', text: 'Mensalidade menor com coparticipação, ou valor fixo sem surpresas.' },
      { title: 'Planos para empresas', text: 'Opções a partir de 2 vidas, inclusive para MEI.' },
      { title: 'Urgência e emergência', text: 'Atendimento de pronto-socorro na rede do plano.' },
    ],
    audiences: [
      { title: 'Individual', text: 'Um plano para cuidar da sua saúde com a rede que você escolher.' },
      { title: 'Família', text: 'Todos no mesmo plano, com as opções certas para cada idade.' },
      { title: 'Empresa', text: 'Benefício para sócios e funcionários, a partir de 2 vidas.' },
    ],
    steps: [
      { title: 'Conte o que você precisa', text: 'Diga para quem é o plano e quantas pessoas.' },
      { title: 'Comparamos as operadoras', text: 'Mostramos as opções de rede, carência e preço lado a lado.' },
      { title: 'Você escolhe e fica protegido', text: 'Cuidamos da contratação e seguimos com você depois.' },
    ],
    faqs: [
      {
        q: 'MEI pode contratar plano empresarial?',
        a: 'Pode. Com um CNPJ ativo, é possível contratar planos empresariais a partir de 2 vidas, que costumam ter condições melhores que os individuais.',
      },
      {
        q: 'O que é carência?',
        a: 'É o período entre a contratação e o uso de alguns serviços. Urgência e emergência têm prazos curtos; partos e cirurgias, prazos maiores. Explicamos os prazos de cada plano.',
      },
      {
        q: 'O que é coparticipação?',
        a: 'É um valor que você paga ao usar consultas e exames, em troca de uma mensalidade menor. Vale a pena para quem usa o plano com pouca frequência.',
      },
      {
        q: 'Consigo manter meu médico?',
        a: 'Se ele fizer parte da rede credenciada do plano, sim. Conferimos a rede antes de você contratar.',
      },
      {
        q: 'Com quais operadoras vocês trabalham?',
        a: 'Trabalhamos com SulAmérica Saúde, Bradesco Saúde, Porto Saúde, Seguros Unimed, Amil, NotreDame Intermédica, Omint, Prevent Senior e MedSênior. Indicamos a que faz mais sentido para o seu perfil.',
      },
    ],
    insurers: ['sulamerica-saude', 'bradesco', 'porto'],
  },
  {
    slug: 'consorcio',
    name: PRODUCT_FORMS.consorcio.name,
    shortName: 'Consórcio',
    priority: 4,
    featured: true,
    cardText: 'Imóvel ou veículo sem juros, com parcelas que cabem no seu planejamento.',
    seo: {
      title: 'Consórcio de Imóvel e Veículo | Portugal Corretora',
      description:
        'Consórcio de imóvel ou veículo sem juros, só com taxa de administração. Planejamento e acompanhamento das assembleias com a Portugal Corretora.',
    },
    hero: {
      title: 'Conquiste seu imóvel ou seu carro sem pagar juros',
      subtitle:
        'Consórcio é a forma planejada de comprar à vista. Ajudamos a escolher o plano certo e acompanhamos você até a contemplação.',
    },
    coveragesTitle: 'O que está incluído',
    coverages: [
      { title: 'Sem juros', text: 'Você paga apenas a taxa de administração, diluída nas parcelas.' },
      { title: 'Carta de crédito', text: 'Para imóvel, veículo ou outros bens, no valor que você escolher.' },
      { title: 'Sorteio ou lance', text: 'Todo mês há chances de contemplação por sorteio ou por lance.' },
      { title: 'Parcelas planejadas', text: 'Prazos e valores que cabem no seu orçamento.' },
      { title: 'Acompanhamento das assembleias', text: 'Avisamos sobre resultados e ajudamos na estratégia de lance.' },
      { title: 'Compra à vista', text: 'Com a carta em mãos, você negocia como comprador à vista.' },
    ],
    audiences: [
      { title: 'Comprar um imóvel', text: 'Casa, apartamento ou terreno, com planejamento e sem juros.' },
      { title: 'Trocar de carro', text: 'Carro novo ou seminovo, sem o custo de um financiamento.' },
      { title: 'Planejar um investimento', text: 'Uma forma disciplinada de construir patrimônio.' },
    ],
    steps: [
      { title: 'Conte o que você precisa', text: 'Diga o tipo de bem e o valor aproximado da carta.' },
      { title: 'Montamos o plano ideal', text: 'Comparamos grupos, prazos e parcelas para o seu objetivo.' },
      { title: 'Você é acompanhado até o fim', text: 'Seguimos com você nas assembleias e na contemplação.' },
    ],
    faqs: [
      {
        q: 'Como funciona o lance?',
        a: 'O lance é uma oferta para antecipar parcelas e ser contemplado antes do sorteio. Quem oferece o maior percentual na assembleia é contemplado. Ajudamos você a montar a estratégia.',
      },
      {
        q: 'Consórcio tem juros?',
        a: 'Não. O consórcio cobra uma taxa de administração, que costuma sair bem mais barata do que os juros de um financiamento.',
      },
      {
        q: 'Posso usar o FGTS?',
        a: 'No consórcio de imóvel, sim, conforme as regras do FGTS. Você pode usar o saldo para dar lance, amortizar ou quitar a carta.',
      },
      {
        q: 'E se eu não for sorteado?',
        a: 'Todos os participantes são contemplados até o fim do grupo, por sorteio ou por lance. O lance é a forma de antecipar essa conquista.',
      },
    ],
    insurers: ['porto', 'itau', 'bradesco'],
    badge: 'Porto Elite desde 2021',
  },
  {
    slug: 'fianca-locaticia',
    name: PRODUCT_FORMS['fianca-locaticia'].name,
    shortName: 'Fiança',
    priority: 5,
    featured: false,
    cardText: 'Alugue sem fiador e sem depósito caução.',
    seo: {
      title: 'Seguro Fiança Locatícia | Portugal Corretora',
      description:
        'Alugue sem fiador e sem depósito caução com a fiança locatícia. Cobertura de aluguel e encargos para inquilinos, proprietários e imobiliárias.',
    },
    hero: {
      title: 'Alugue sem fiador e sem depósito caução',
      subtitle:
        'A fiança locatícia substitui o fiador e deixa o aluguel mais rápido para você e mais seguro para o proprietário.',
    },
    coveragesTitle: 'O que a Fiança Locatícia cobre',
    coverages: [
      { title: 'Substitui o fiador', text: 'Você não precisa pedir a ninguém para ser seu fiador.' },
      { title: 'Sem depósito caução', text: 'Seu dinheiro fica com você, em vez de parado com o proprietário.' },
      { title: 'Aluguel e encargos', text: 'Cobre aluguel, condomínio, IPTU e contas em caso de inadimplência.' },
      { title: 'Danos ao imóvel e multa', text: 'Pode incluir danos ao imóvel e multa por rescisão, conforme o plano.' },
      { title: 'Análise ágil', text: 'Análise de cadastro rápida para você não perder o imóvel.' },
      { title: 'Aceita pelas imobiliárias', text: 'Garantia locatícia reconhecida pelas principais imobiliárias.' },
    ],
    audiences: [
      { title: 'Inquilino', text: 'Alugue com mais rapidez e sem depender de fiador.' },
      { title: 'Proprietário ou imobiliária', text: 'Receba o aluguel com a segurança de uma seguradora.' },
    ],
    steps: [
      { title: 'Conte o que você precisa', text: 'Informe o valor aproximado do aluguel.' },
      { title: 'Fazemos a análise', text: 'Enviamos o cadastro às seguradoras e buscamos a melhor condição.' },
      { title: 'Você aluga com tranquilidade', text: 'Com a aprovação, é só assinar o contrato.' },
    ],
    faqs: [
      {
        q: 'Quanto custa a fiança locatícia?',
        a: 'O valor depende do aluguel, dos encargos incluídos e da análise de cadastro. Pode ser pago à vista ou parcelado.',
      },
      {
        q: 'Quem paga, o inquilino ou o proprietário?',
        a: 'Normalmente o inquilino, mas isso pode ser combinado entre as partes no contrato de locação.',
      },
      {
        q: 'Preciso comprovar renda?',
        a: 'Sim. A seguradora faz uma análise de cadastro com base na renda e no histórico do inquilino.',
      },
      {
        q: 'Serve para imóvel comercial?',
        a: 'Serve. Existem opções de fiança locatícia para imóveis residenciais e comerciais.',
      },
    ],
    insurers: ['porto', 'tokio-marine'],
  },
  {
    slug: 'seguro-de-vida',
    name: PRODUCT_FORMS['seguro-de-vida'].name,
    shortName: 'Vida',
    priority: 6,
    featured: false,
    cardText: 'Proteção financeira para a sua família e benefício para a sua empresa.',
    seo: {
      title: 'Seguro de Vida Individual e Empresarial',
      description:
        'Seguro de vida individual ou em grupo para empresas. Proteção financeira para quem você ama, com coberturas para morte, invalidez e doenças graves.',
    },
    hero: {
      title: 'Proteção para quem você ama, em qualquer fase da vida',
      subtitle:
        'Seguro de vida individual ou em grupo para a sua empresa. Montamos a cobertura certa para o seu momento.',
    },
    coveragesTitle: 'O que o Seguro de Vida cobre',
    coverages: [
      { title: 'Morte natural ou acidental', text: 'Indenização aos beneficiários que você escolher.' },
      { title: 'Invalidez', text: 'Por acidente ou doença, para você manter o padrão de vida.' },
      { title: 'Doenças graves', text: 'Valor pago no diagnóstico, para focar no tratamento.' },
      { title: 'Assistência funeral', text: 'Apoio à família em um momento difícil.' },
      { title: 'Diária por incapacidade', text: 'Renda enquanto você se recupera e não pode trabalhar.' },
      { title: 'Vida em grupo', text: 'Seguro para sócios e funcionários da sua empresa.' },
    ],
    audiences: [
      { title: 'Você e sua família', text: 'Segurança financeira para quem depende de você.' },
      { title: 'Sua empresa', text: 'Benefício valorizado pelos funcionários e exigido por muitas convenções coletivas.' },
    ],
    steps: [
      { title: 'Conte o que você precisa', text: 'Diga se é um seguro individual ou empresarial.' },
      { title: 'Montamos a cobertura', text: 'Comparamos seguradoras e ajustamos valores ao seu momento.' },
      { title: 'Você escolhe e fica protegido', text: 'E sua família conta com a gente se precisar usar.' },
    ],
    faqs: [
      {
        q: 'Qual valor de cobertura devo escolher?',
        a: 'Uma referência é somar alguns anos das despesas da família e as dívidas em aberto. Ajudamos você a chegar a um valor que faça sentido.',
      },
      {
        q: 'Posso ter mais de um seguro de vida?',
        a: 'Pode. As coberturas de seguros diferentes podem ser somadas.',
      },
      {
        q: 'O seguro de vida entra em inventário?',
        a: 'Não. O valor é pago diretamente aos beneficiários indicados, sem passar pelo inventário.',
      },
      {
        q: 'A empresa é obrigada a ter seguro de vida?',
        a: 'Depende da convenção coletiva da categoria. Muitas exigem, e mesmo quando não exigem é um benefício valorizado pela equipe.',
      },
    ],
    insurers: ['porto', 'allianz', 'tokio-marine', 'hdi', 'yelum', 'bradesco', 'itau', 'mitsui-sumitomo', 'zurich', 'mapfre'],
  },
  {
    slug: 'seguro-viagem',
    name: PRODUCT_FORMS['seguro-viagem'].name,
    shortName: 'Viagem',
    priority: 7,
    featured: false,
    cardText: 'Despesas médicas, bagagem e imprevistos cobertos no Brasil e no exterior.',
    seo: {
      title: 'Seguro Viagem Nacional e Internacional',
      description:
        'Seguro viagem para o Brasil e o exterior, com despesas médicas, bagagem e assistência 24h. Compare as opções com a Portugal Corretora.',
    },
    hero: {
      title: 'Viaje tranquilo, com proteção do embarque à volta',
      subtitle:
        'Seguro viagem para o Brasil e o exterior. Comparamos as opções e indicamos a cobertura certa para o seu destino.',
    },
    coveragesTitle: 'O que o Seguro Viagem cobre',
    coverages: [
      { title: 'Despesas médicas e hospitalares', text: 'Atendimento em caso de doença ou acidente durante a viagem.' },
      { title: 'Assistência 24h', text: 'Central de atendimento da seguradora, em português, a qualquer hora.' },
      { title: 'Bagagem', text: 'Indenização por extravio ou dano à bagagem despachada.' },
      { title: 'Cancelamento da viagem', text: 'Reembolso de despesas quando você precisa cancelar por motivo coberto.' },
      { title: 'Atraso de voo', text: 'Ajuda com gastos extras quando o voo atrasa ou é cancelado.' },
      { title: 'Regresso antecipado', text: 'Volta para casa organizada em situações de emergência cobertas.' },
    ],
    audiences: [
      { title: 'Férias no exterior', text: 'Proteção com o valor de cobertura exigido pelo país de destino.' },
      { title: 'Viagem pelo Brasil', text: 'Segurança também em viagens nacionais, a lazer ou a trabalho.' },
      { title: 'Estudo ou intercâmbio', text: 'Coberturas para estadias longas fora do país.' },
    ],
    steps: [
      { title: 'Conte o que você precisa', text: 'Informe o destino e a duração da viagem.' },
      { title: 'Comparamos as seguradoras', text: 'Buscamos a cobertura certa para o seu roteiro.' },
      { title: 'Você viaja protegido', text: 'Enviamos a apólice e ficamos à disposição durante a viagem.' },
    ],
    faqs: [
      {
        q: 'Seguro viagem é obrigatório?',
        a: 'Para alguns destinos, sim. Os países do Espaço Schengen, na Europa, exigem seguro com cobertura médica mínima para a entrada. Confirmamos a exigência do seu destino.',
      },
      {
        q: 'O cartão de crédito já não cobre?',
        a: 'Alguns cartões oferecem seguro viagem, mas com coberturas e condições limitadas. Comparamos o que o seu cartão oferece com um seguro dedicado.',
      },
      {
        q: 'Com quanto tempo de antecedência devo contratar?',
        a: 'O ideal é contratar assim que a viagem for confirmada, porque algumas coberturas, como cancelamento, valem desde a contratação.',
      },
      {
        q: 'Cobre viagens pelo Brasil?',
        a: 'Sim. Existem planos para viagens nacionais, com assistência médica e cobertura de bagagem.',
      },
    ],
    insurers: ['porto', 'allianz', 'tokio-marine', 'zurich', 'mapfre'],
  },
  {
    slug: 'seguro-empresarial',
    name: PRODUCT_FORMS['seguro-empresarial'].name,
    shortName: 'Empresarial',
    priority: 8,
    featured: false,
    cardText: 'Imóvel comercial, estoque e equipamentos protegidos contra imprevistos.',
    seo: {
      title: 'Seguro Empresarial para o seu negócio',
      description:
        'Seguro empresarial para lojas, escritórios e pequenas empresas: imóvel, estoque e equipamentos protegidos. Compare com a Portugal Corretora.',
    },
    hero: {
      title: 'Seu negócio protegido para continuar funcionando',
      subtitle:
        'Seguro para o imóvel, o estoque e os equipamentos da sua empresa. Comparamos as seguradoras e montamos a proteção certa para o seu ramo.',
    },
    coveragesTitle: 'O que o Seguro Empresarial cobre',
    coverages: [
      { title: 'Incêndio, raio e explosão', text: 'Proteção para o imóvel comercial e tudo o que tem dentro dele.' },
      { title: 'Roubo e furto qualificado', text: 'Indenização por mercadorias, equipamentos e bens levados.' },
      { title: 'Danos elétricos', text: 'Máquinas e equipamentos danificados por oscilação ou curto-circuito.' },
      { title: 'Vendaval e alagamento', text: 'Danos causados por ventos fortes, granizo e chuvas intensas, conforme o plano.' },
      { title: 'Lucros cessantes', text: 'Ajuda com as despesas fixas se o negócio precisar parar por um sinistro coberto.' },
      { title: 'Assistência empresarial', text: 'Chaveiro, eletricista e encanador para resolver imprevistos rápido.' },
    ],
    audiences: [
      { title: 'Comércio e lojas', text: 'Proteção para o ponto, o estoque e o caixa.' },
      { title: 'Escritórios e consultórios', text: 'Equipamentos, móveis e documentos protegidos.' },
      { title: 'Pequenas indústrias e serviços', text: 'Máquinas e matéria-prima cobertas contra imprevistos.' },
    ],
    steps: [
      { title: 'Conte o que você precisa', text: 'Informe o ramo da empresa e se o imóvel é próprio ou alugado.' },
      { title: 'Comparamos as seguradoras', text: 'Montamos coberturas adequadas ao seu tipo de negócio.' },
      { title: 'Sua empresa fica protegida', text: 'E conta com a gente se precisar acionar o seguro.' },
    ],
    faqs: [
      {
        q: 'Empresa em imóvel alugado pode contratar?',
        a: 'Pode. O seguro protege os bens da empresa e pode incluir a responsabilidade pelos danos ao imóvel alugado.',
      },
      {
        q: 'MEI pode fazer seguro empresarial?',
        a: 'Pode. Existem opções para pequenos negócios e MEI, com coberturas ajustadas ao tamanho da operação.',
      },
      {
        q: 'O que são lucros cessantes?',
        a: 'É a cobertura que ajuda a pagar despesas fixas, como aluguel e salários, enquanto a empresa fica parada por causa de um sinistro coberto.',
      },
      {
        q: 'O estoque fica coberto?',
        a: 'Sim, mercadorias e matéria-prima podem ser incluídas, de acordo com o valor declarado na contratação.',
      },
    ],
    insurers: ['porto', 'allianz', 'tokio-marine', 'hdi', 'yelum', 'bradesco', 'itau', 'mitsui-sumitomo', 'zurich', 'mapfre'],
  },
];

export function getProduct(slug: ProductSlug): Product {
  const p = PRODUCTS.find((x) => x.slug === slug);
  if (!p) throw new Error(`Produto desconhecido: ${slug}`);
  return p;
}
