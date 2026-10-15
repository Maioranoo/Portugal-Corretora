import { describe, expect, test } from 'vitest';
import { INSURERS } from '../../src/content/insurers';
import { PRODUCT_FORMS, PRODUCT_SLUGS } from '../../src/content/product-fields';
import { PRODUCTS } from '../../src/content/products';
import { SUB_PAGES } from '../../src/content/sub-pages';
import * as site from '../../src/content/site';

function strings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(strings);
  return [];
}
const FORBIDDEN = [/os melhores preços/i, /menor preço/i, /melhor preço/i, /garantid[oa]/i, /atendimento (24|vinte e quatro)/i];

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
  test('seguro auto responde às dúvidas de quem vai cotar, com foco local', () => {
    const p = PRODUCTS.find((x) => x.slug === 'seguro-auto')!;
    expect(p.seo.title).toMatch(/Santo André/);
    expect(p.hero.title).toMatch(/seguro auto/i);
    expect(p.hero.title).toMatch(/Santo André/);
    const titles = p.guide!.sections.map((s) => s.title).join(' | ');
    for (const re of [/cotar/i, /valor/i, /terceiros/i, /franquia/i, /usado/i, /corretora/i]) expect(titles).toMatch(re);
    const faqText = p.faqs.map((f) => f.q).join(' ');
    expect(faqText).toMatch(/São Bernardo do Campo/);
    expect(p.related!.map((r) => r.href)).toContain('/consorcio-auto');
    for (const src of p.guide!.sources ?? []) expect(src.href).toMatch(/^https:\/\/www\.gov\.br\//);
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
    const all = [...strings(PRODUCTS), ...strings(SUB_PAGES), ...strings(site)];
    for (const text of all) expect(text, text).not.toMatch(/8h às 20h|20h/);
  });
  test('o prêmio aparece só como "Porto Elite"', () => {
    const all = [...strings(PRODUCTS), ...strings(SUB_PAGES), ...strings(site)];
    for (const text of all) expect(text, text).not.toMatch(/Prêmio Porto Elite/);
  });
  test('sem travessão (— ou –) em nenhum texto visível', () => {
    const all = [...strings(PRODUCTS), ...strings(SUB_PAGES), ...strings(site), ...strings(INSURERS)];
    for (const text of all) expect(text, text).not.toMatch(/[–—]/);
  });
  test('sem promessas absolutas em nenhum texto', () => {
    const all = [...strings(PRODUCTS), ...strings(SUB_PAGES), ...strings(site)];
    for (const text of all) for (const re of FORBIDDEN) expect(text, text).not.toMatch(re);
  });
});

const NUMBERS = [/%/, /R\$/, /\d+\s*meses/i];

describe('consórcio', () => {
  const hub = PRODUCTS.find((p) => p.slug === 'consorcio')!;
  const pages = [hub, ...SUB_PAGES];

  test('duas subpáginas de consórcio, com formulário de consórcio pré-preenchido', () => {
    expect(SUB_PAGES.map((s) => s.slug)).toEqual(['consorcio-auto', 'consorcio-imobiliario']);
    for (const s of SUB_PAGES) {
      expect(s.parent).toBe('consorcio');
      expect(s.form.product).toBe('consorcio');
      const field = PRODUCT_FORMS.consorcio.fields.find((f) => f.id === 'tipo')!;
      expect(field.kind === 'select' && field.options).toContain(s.form.preset.tipo);
    }
  });
  test.each(SUB_PAGES.map((s) => [s.slug, s] as const))('%s tem conteúdo completo', (_, s) => {
    expect(s.seo.title.length).toBeLessThanOrEqual(60);
    expect(s.seo.description.length).toBeGreaterThanOrEqual(70);
    expect(s.seo.description.length).toBeLessThanOrEqual(160);
    expect(s.coverages.length).toBeGreaterThanOrEqual(4);
    expect(s.coverages.length).toBeLessThanOrEqual(6);
    expect(s.faqs.length).toBeGreaterThanOrEqual(4);
    expect(s.guide!.sections.length).toBeGreaterThanOrEqual(4);
  });
  test('sem números comerciais (taxa, valor, prazo) no texto', () => {
    for (const text of strings(pages)) for (const re of NUMBERS) expect(text, text).not.toMatch(re);
  });
  test('administradoras rotuladas como administradoras; H1 central fala de consórcio', () => {
    for (const p of pages) expect(p.insurersTitle).toBe('Administradoras parceiras');
    expect(hub.hero.title).toMatch(/consórcio/i);
  });
  test('custos e FGTS explicados com condições', () => {
    const all = strings(pages).join(' ');
    expect(all).toMatch(/taxa de administração/);
    expect(all).toMatch(/fundo de reserva/);
    expect(all).toMatch(/regras do FGTS/);
  });
});
