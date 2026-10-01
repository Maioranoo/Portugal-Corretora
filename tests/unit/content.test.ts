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
  test('8 produtos, na ordem de prioridade, com os slugs do formulário', () => {
    expect(PRODUCTS).toHaveLength(8);
    expect(PRODUCTS.map((p) => p.slug)).toEqual([...PRODUCT_SLUGS]);
    expect(PRODUCTS.map((p) => p.priority)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
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
    expect(p.shortName.length).toBeGreaterThan(0);
    expect(p.shortName.length).toBeLessThanOrEqual(12);
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
  test('14 seguradoras sem repetição', () => {
    expect(INSURERS).toHaveLength(14);
    expect(new Set(INSURERS.map((i) => i.id)).size).toBe(14);
  });
});

describe('corretora', () => {
  test('dados oficiais', () => {
    expect(site.COMPANY.cnpj).toBe('21.427.722/0001-05');
    expect(site.COMPANY.susep).toBe('2022910');
    expect(site.COMPANY.whatsapp).toBe('5511938052598');
    expect(site.COMPANY.email).toBe('atendimento@portugalcorretora.com.br');
    expect(site.COMPANY.hoursLabel).toBe('Segunda a sexta, das 9h às 18h');
    expect(site.COMPANY.legalName).toBe('Portugal Administradora e Corretora de Seguros Limitada');
    expect(site.COMPANY.portoElite.label).toBe('Porto Elite');
  });
});

describe('avaliações', () => {
  test('3 avaliações com nome abreviado e nota', () => {
    expect(site.TESTIMONIALS).toHaveLength(3);
    for (const t of site.TESTIMONIALS) {
      expect(t.name).toMatch(/^\S+ [A-Z]\.$/);
      expect(t.text.length).toBeGreaterThan(20);
      expect([4, 5]).toContain(t.rating);
    }
  });
});

describe('regras de redação', () => {
  test('nenhum texto cita o horário antigo (8h às 20h)', () => {
    const all = [...strings(PRODUCTS), ...strings(site)];
    for (const text of all) expect(text, text).not.toMatch(/8h às 20h|20h/);
  });
  test('o prêmio aparece só como "Porto Elite"', () => {
    const all = [...strings(PRODUCTS), ...strings(site)];
    for (const text of all) expect(text, text).not.toMatch(/Prêmio Porto Elite/);
  });
  test('sem travessão (— ou –) em nenhum texto visível', () => {
    const all = [...strings(PRODUCTS), ...strings(site), ...strings(INSURERS)];
    for (const text of all) expect(text, text).not.toMatch(/[–—]/);
  });
  test('sem promessas absolutas em nenhum texto', () => {
    const all = [...strings(PRODUCTS), ...strings(site)];
    for (const text of all) for (const re of FORBIDDEN) expect(text, text).not.toMatch(re);
  });
});
