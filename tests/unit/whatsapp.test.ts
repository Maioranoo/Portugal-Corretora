import { describe, expect, test } from 'vitest';
import { buildGenericMessage, buildLeadMessage, buildWhatsAppUrl } from '../../src/lib/whatsapp';

describe('buildLeadMessage', () => {
  test('com cidade e detalhes', () => {
    expect(
      buildLeadMessage({ nome: 'João', cidade: 'Santo André', productName: 'Seguro Auto', detalhes: ['Onix 2021'] }),
    ).toBe('Olá! Sou João, de Santo André. Vim pelo site e quero falar sobre Seguro Auto (Onix 2021).');
  });
  test('sem cidade, com dois detalhes', () => {
    expect(
      buildLeadMessage({ nome: 'Ana', productName: 'Seguro Residencial', detalhes: ['Apartamento', 'Alugado'] }),
    ).toBe('Olá! Sou Ana. Vim pelo site e quero falar sobre Seguro Residencial (Apartamento, Alugado).');
  });
  test('sem detalhes', () => {
    expect(buildLeadMessage({ nome: 'Ana', productName: 'Consórcio', detalhes: [] })).toBe(
      'Olá! Sou Ana. Vim pelo site e quero falar sobre Consórcio.',
    );
  });
});

describe('buildGenericMessage', () => {
  test('sem produto', () =>
    expect(buildGenericMessage()).toBe('Olá! Vim pelo site da Portugal Corretora e gostaria de atendimento.'));
  test('com produto', () =>
    expect(buildGenericMessage('Plano de Saúde')).toBe(
      'Olá! Vim pelo site da Portugal Corretora e quero falar sobre Plano de Saúde.',
    ));
});

describe('buildWhatsAppUrl', () => {
  test('codifica acentos, emoji, & e aspas sem perder nada', () => {
    const msg = 'Olá! Sou Zé & "Cia" 🚗 <b>, ação';
    const url = buildWhatsAppUrl('5511938052598', msg);
    expect(url.startsWith('https://wa.me/5511938052598?text=')).toBe(true);
    expect(new URL(url).searchParams.get('text')).toBe(msg);
  });
});
