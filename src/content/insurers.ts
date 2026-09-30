export type InsurerId =
  | 'porto'
  | 'allianz'
  | 'tokio-marine'
  | 'hdi'
  | 'suhai'
  | 'yelum'
  | 'bradesco'
  | 'pier'
  | 'azul'
  | 'itau'
  | 'mitsui-sumitomo'
  | 'sulamerica-saude';

export interface AssistancePhone {
  number: string; // como publicado pela seguradora
  label: string;
}

export interface Insurer {
  id: InsurerId;
  name: string;
  assistance?: { phones: AssistancePhone[]; note?: string; conferir: boolean };
}

// Telefones de assistência: pesquisados nos sites oficiais em 30/09/2026; `conferir: true` até o cliente confirmar.
export const INSURERS: readonly Insurer[] = [
  {
    id: 'porto',
    name: 'Porto Seguro',
    assistance: {
      phones: [
        { number: '333 76786', label: 'Auto, Grande São Paulo' },
        { number: '0300 337 6786', label: 'Auto, demais localidades' },
        { number: '11 3366 3110', label: 'Residencial 24h, Grande São Paulo' },
        { number: '0800 727 8118', label: 'Residencial 24h, demais localidades' },
      ],
      conferir: true,
    },
  },
  {
    id: 'allianz',
    name: 'Allianz',
    assistance: {
      phones: [
        { number: '0800 013 0700', label: 'Assistência 24h Auto' },
        { number: '0800 017 7178', label: 'Assistência Residência e Empresa' },
      ],
      conferir: true,
    },
  },
  {
    id: 'tokio-marine',
    name: 'Tokio Marine',
    assistance: { phones: [{ number: '0800 318 6546', label: 'Assistência 24h e sinistros' }], conferir: true },
  },
  {
    id: 'hdi',
    name: 'HDI Seguros',
    assistance: {
      phones: [
        { number: '3003 5390', label: 'Assistência 24h, capitais e regiões metropolitanas' },
        { number: '0800 434 4340', label: 'Assistência 24h, demais localidades' },
      ],
      conferir: true,
    },
  },
  {
    id: 'suhai',
    name: 'Suhai Seguradora',
    assistance: {
      phones: [
        { number: '0800 327 8424', label: 'Assistência 24h (também WhatsApp)' },
        { number: '3003 0335', label: 'Aviso de roubo ou furto, SP e RJ' },
      ],
      conferir: true,
    },
  },
  {
    id: 'yelum',
    name: 'Yelum Seguros',
    assistance: {
      phones: [
        { number: '0800 701 4120', label: 'Assistência 24h Auto e Vida' },
        { number: '0800 702 5100', label: 'Assistência 24h Residência e Empresa' },
      ],
      conferir: true,
    },
  },
  {
    id: 'bradesco',
    name: 'Bradesco Seguros',
    assistance: {
      phones: [
        { number: '4004 2757', label: 'Assistência 24h, capitais e regiões metropolitanas' },
        { number: '0800 701 2757', label: 'Assistência 24h, demais regiões' },
      ],
      conferir: true,
    },
  },
  {
    id: 'pier',
    name: 'Pier',
    assistance: { phones: [], note: 'Atendimento e assistência pelo app da Pier.', conferir: true },
  },
  {
    id: 'azul',
    name: 'Azul Seguros',
    assistance: {
      phones: [
        { number: '4004 3700', label: 'Sinistros e assistência 24h, capitais e grandes centros' },
        { number: '0800 703 0203', label: 'Sinistros e assistência 24h, outras regiões' },
      ],
      conferir: true,
    },
  },
  {
    id: 'itau',
    name: 'Itaú Seguros',
    assistance: {
      phones: [
        { number: '3003 1010', label: 'Auto e residencial, capitais e regiões metropolitanas' },
        { number: '0800 720 1010', label: 'Auto, demais localidades' },
      ],
      conferir: true,
    },
  },
  {
    id: 'mitsui-sumitomo',
    name: 'Mitsui Sumitomo Seguros',
    assistance: {
      phones: [
        { number: '3004 6206', label: 'Auto, capitais e regiões metropolitanas' },
        { number: '0800 727 3101', label: 'Auto, demais localidades' },
        { number: '0800 707 7883', label: 'Assistência 24h, demais ramos' },
      ],
      conferir: true,
    },
  },
  {
    id: 'sulamerica-saude',
    name: 'SulAmérica Saúde',
    assistance: {
      phones: [
        { number: '4004 5900', label: 'Central Saúde, capitais e regiões metropolitanas' },
        { number: '0800 970 0500', label: 'Central Saúde, demais localidades' },
      ],
      conferir: true,
    },
  },
];

export function getInsurer(id: InsurerId): Insurer {
  const found = INSURERS.find((i) => i.id === id);
  if (!found) throw new Error(`Seguradora desconhecida: ${id}`);
  return found;
}
