export const PRODUCT_SLUGS = [
  'seguro-auto',
  'seguro-residencial',
  'plano-de-saude',
  'consorcio',
  'fianca-locaticia',
  'seguro-de-vida',
] as const;

export type ProductSlug = (typeof PRODUCT_SLUGS)[number];

export type ProductField =
  | { id: string; label: string; kind: 'select'; options: readonly string[] }
  | { id: string; label: string; kind: 'text'; placeholder: string; maxLength: number };

export interface ProductForm {
  slug: ProductSlug;
  name: string;
  fields: readonly ProductField[];
}

export const PRODUCT_FORMS: Record<ProductSlug, ProductForm> = {
  'seguro-auto': {
    slug: 'seguro-auto',
    name: 'Seguro Auto',
    fields: [{ id: 'veiculo', label: 'Modelo e ano do carro', kind: 'text', placeholder: 'Ex.: Onix 2021', maxLength: 60 }],
  },
  'seguro-residencial': {
    slug: 'seguro-residencial',
    name: 'Seguro Residencial',
    fields: [
      { id: 'imovel', label: 'Tipo de imóvel', kind: 'select', options: ['Casa', 'Apartamento'] },
      { id: 'situacao', label: 'O imóvel é', kind: 'select', options: ['Próprio', 'Alugado'] },
    ],
  },
  'plano-de-saude': {
    slug: 'plano-de-saude',
    name: 'Plano de Saúde',
    fields: [
      { id: 'para_quem', label: 'Para quem é o plano', kind: 'select', options: ['Só para mim', 'Minha família', 'Minha empresa'] },
      { id: 'pessoas', label: 'Quantas pessoas', kind: 'select', options: ['1', '2 a 3', '4 a 5', '6 a 29', '30 ou mais'] },
    ],
  },
  consorcio: {
    slug: 'consorcio',
    name: 'Consórcio',
    fields: [
      { id: 'tipo', label: 'Consórcio de', kind: 'select', options: ['Imóvel', 'Veículo', 'Outro'] },
      {
        id: 'valor',
        label: 'Valor aproximado da carta',
        kind: 'select',
        options: ['Até R$ 50 mil', 'R$ 50 mil a R$ 150 mil', 'R$ 150 mil a R$ 400 mil', 'Acima de R$ 400 mil'],
      },
    ],
  },
  'fianca-locaticia': {
    slug: 'fianca-locaticia',
    name: 'Fiança Locatícia',
    fields: [
      {
        id: 'aluguel',
        label: 'Valor do aluguel',
        kind: 'select',
        options: ['Até R$ 1.500', 'R$ 1.500 a R$ 3.000', 'R$ 3.000 a R$ 6.000', 'Acima de R$ 6.000'],
      },
    ],
  },
  'seguro-de-vida': {
    slug: 'seguro-de-vida',
    name: 'Seguro de Vida',
    fields: [{ id: 'modalidade', label: 'Modalidade', kind: 'select', options: ['Individual', 'Empresarial'] }],
  },
};

export function isProductSlug(v: unknown): v is ProductSlug {
  return typeof v === 'string' && (PRODUCT_SLUGS as readonly string[]).includes(v);
}
