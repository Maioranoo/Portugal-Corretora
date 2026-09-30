import { describe, expect, test } from 'vitest';
import { INSURERS } from '../../src/content/insurers';
import { PRODUCT_FORMS, PRODUCT_SLUGS } from '../../src/content/product-fields';
import { PRODUCTS } from '../../src/content/products';
import * as site from '../../src/content/site';

function strings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(strings);
  return [];
}
const FORBIDDEN = [/os melhores preços/i, /menor preço/i, /garantid[oa]/i, /atendimento (24|vinte e quatro)/i];

describe('produtos', () => {
  test('6 produtos, na ordem de prioridade, com os slugs do formulário', () => {
    expect(PRODUCTS.map((p) => p.slug)).toEqual([...PRODUCT_SLUGS]);
    expect(PRODUCTS.map((p) => p.priority)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(PRODUCTS.filter((p) => p.featured).map((p) => p.priority)).toEqual([1, 2, 3, 4]);
  });
  test.each(PRODUCTS.map((p) => [p.slug, p] as const))('%s tem conteúdo completo', (_, p) => {
    expect(p.name).toBe(PRODUCT_FORMS[p.slug].name);
    expect(p.seo.title.length).toBeLessThanOrEqual(60);
    expect(p.seo.description.length).toBeGreaterThanOrEqual(70);
    expect(p.seo.description.length).toBeLessThanOrEqual(160);
    expect(p.cardText.length).toBeLessThanOrEqual(90);
    expect(p.hero.title).toBeTruthy();
    expect(p.coveragesTitle).toBeTruthy();
    expect(p.coverages.length).toBeGreaterThanOrEqual(4);
    expect(p.coverages.length).toBeLessThanOrEqual(6);
    expect(p.audiences.length).toBeGreaterThanOrEqual(2);
    expect(p.faqs.length).toBeGreaterThanOrEqual(4);
    expect(p.insurers.length).toBeGreaterThan(0);
    const ids = new Set(INSURERS.map((i) => i.id));
    for (const id of p.insurers) expect(ids.has(id)).toBe(true);
  });
});

describe('seguradoras', () => {
  test('12 seguradoras sem repetição', () => {
    expect(INSURERS).toHaveLength(12);
    expect(new Set(INSURERS.map((i) => i.id)).size).toBe(12);
  });
});

describe('corretora', () => {
  test('dados oficiais', () => {
    expect(site.COMPANY.cnpj).toBe('21.427.722/0001-05');
    expect(site.COMPANY.susep).toBe('2022910');
    expect(site.COMPANY.whatsapp).toBe('5511938052598');
    expect(site.COMPANY.email).toBe('atendimento@portugalcorretora.com.br');
    expect(site.COMPANY.hoursLabel).toBe('Segunda a sexta, das 8h às 20h');
  });
});

describe('regras de redação', () => {
  test('sem promessas absolutas em nenhum texto', () => {
    const all = [...strings(PRODUCTS), ...strings(site)];
    for (const text of all) for (const re of FORBIDDEN) expect(text, text).not.toMatch(re);
  });
});
