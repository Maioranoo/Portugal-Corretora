import { PRODUCT_FORMS, isProductSlug, type ProductSlug } from '../content/product-fields';
import { normalizeBrPhone } from './phone';
import { sanitizeUtm, type Utm } from './utm';

export const LIMITS = { nome: 80, cidade: 60, pagina: 200 } as const;

export interface ValidLead {
  nome: string;
  whatsapp: string;
  produto: ProductSlug;
  produtoNome: string;
  detalhes: { label: string; value: string }[];
  cidade?: string;
  pagina: string;
  utm: Utm;
}
export type LeadErrors = Record<string, string>;
export type LeadValidation = { ok: true; lead: ValidLead } | { ok: false; errors: LeadErrors };

const CONTROL = /[\u0000-\u001F\u007F]/g;

function clean(v: unknown): string {
  return typeof v === 'string' ? v.replace(CONTROL, ' ').replace(/\s+/g, ' ').trim() : '';
}

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === 'object' ? (v as Record<string, unknown>) : {};
}

export function validateLead(raw: unknown): LeadValidation {
  const r = asRecord(raw);
  const errors: LeadErrors = {};

  const nome = clean(r.nome);
  if (nome.length < 2 || !/\p{L}/u.test(nome)) errors.nome = 'Informe seu nome.';
  else if (nome.length > LIMITS.nome) errors.nome = `Use no máximo ${LIMITS.nome} caracteres.`;

  const whatsapp = typeof r.whatsapp === 'string' ? normalizeBrPhone(r.whatsapp) : null;
  if (!whatsapp) errors.whatsapp = 'Informe um WhatsApp com DDD. Ex.: (11) 98765-4321.';

  const produto = isProductSlug(r.produto) ? r.produto : null;
  if (!produto) errors.produto = 'Escolha o tipo de seguro.';

  const detalhes: ValidLead['detalhes'] = [];
  if (produto) {
    const given = asRecord(r.detalhes);
    for (const field of PRODUCT_FORMS[produto].fields) {
      const key = `detalhes.${field.id}`;
      const value = clean(given[field.id]);
      if (field.kind === 'select') {
        if (!field.options.includes(value)) errors[key] = `Escolha uma opção em "${field.label}".`;
        else detalhes.push({ label: field.label, value });
      } else if (!value) {
        errors[key] = `Preencha "${field.label}".`;
      } else if (value.length > field.maxLength) {
        errors[key] = `Use no máximo ${field.maxLength} caracteres.`;
      } else {
        detalhes.push({ label: field.label, value });
      }
    }
  }

  const cidade = clean(r.cidade);
  if (cidade.length > LIMITS.cidade) errors.cidade = `Use no máximo ${LIMITS.cidade} caracteres.`;

  const paginaRaw = clean(r.pagina);
  const pagina =
    paginaRaw.startsWith('/') && !paginaRaw.startsWith('//') && paginaRaw.length <= LIMITS.pagina ? paginaRaw : '/';

  if (Object.keys(errors).length > 0 || !produto || !whatsapp) return { ok: false, errors };

  return {
    ok: true,
    lead: {
      nome,
      whatsapp,
      produto,
      produtoNome: PRODUCT_FORMS[produto].name,
      detalhes,
      ...(cidade ? { cidade } : {}),
      pagina,
      utm: sanitizeUtm(r.utm),
    },
  };
}
