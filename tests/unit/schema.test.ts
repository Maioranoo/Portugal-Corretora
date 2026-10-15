import { describe, expect, test } from 'vitest';
import {
  ORG_ID,
  breadcrumbNode,
  buildGraph,
  faqNode,
  organizationNode,
  serializeJsonLd,
  serviceNode,
} from '../../src/lib/schema';

describe('organizationNode', () => {
  const org = organizationNode();
  test('dados oficiais e endereço com bairro', () => {
    expect(org['@type']).toBe('InsuranceAgency');
    expect(org['@id']).toBe(ORG_ID);
    expect(org.legalName).toBe('Portugal Administradora e Corretora de Seguros Limitada');
    expect(org.taxID).toBe('21.427.722/0001-05');
    expect(org.identifier).toEqual({ '@type': 'PropertyValue', propertyID: 'SUSEP', value: '2022910' });
    expect(org.telephone).toBe('+5511938052598');
    expect(org.address).toMatchObject({
      streetAddress: 'Av. Portugal, 1285, Jardim Bela Vista',
      addressLocality: 'Santo André',
      postalCode: '09040-011',
    });
  });
  test('atende as três cidades e não declara nota própria', () => {
    expect((org.areaServed as { name: string }[]).map((c) => c.name)).toEqual([
      'Santo André',
      'São Bernardo do Campo',
      'São Caetano do Sul',
    ]);
    expect(org.aggregateRating).toBeUndefined();
  });
});

describe('nós da página', () => {
  test('trilha com posições e URLs absolutas', () => {
    const node = breadcrumbNode([{ name: 'Início', path: '/' }, { name: 'Seguro Auto', path: '/seguro-auto' }], '/seguro-auto');
    expect(node.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://www.portugalcorretora.com.br/' },
      { '@type': 'ListItem', position: 2, name: 'Seguro Auto', item: 'https://www.portugalcorretora.com.br/seguro-auto' },
    ]);
  });
  test('serviço aponta para a corretora', () => {
    const node = serviceNode({ name: 'Seguro Auto', path: '/seguro-auto', description: 'x' });
    expect(node.provider).toEqual({ '@id': ORG_ID });
    expect(node.url).toBe('https://www.portugalcorretora.com.br/seguro-auto');
  });
  test('FAQ espelha perguntas e respostas', () => {
    const node = faqNode([{ q: 'P?', a: 'R.' }], '/x');
    expect(node.mainEntity).toEqual([{ '@type': 'Question', name: 'P?', acceptedAnswer: { '@type': 'Answer', text: 'R.' } }]);
  });
});

describe('buildGraph / serializeJsonLd', () => {
  test('grafo sempre começa com corretora e site', () => {
    const g = buildGraph([{ '@type': 'Thing' }]);
    expect(g['@context']).toBe('https://schema.org');
    expect(g['@graph'].map((n) => n['@type'])).toEqual(['InsuranceAgency', 'WebSite', 'Thing']);
  });
  test('"<" vira \u003c para não fechar a tag script', () => {
    const out = serializeJsonLd({ text: '</script><script>alert(1)</script>' });
    expect(out).not.toContain('<');
    expect(JSON.parse(out).text).toBe('</script><script>alert(1)</script>');
  });
});
