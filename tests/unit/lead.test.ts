import { describe, expect, test } from 'vitest';
import { validateLead } from '../../src/lib/lead';

const base = {
  nome: 'João da Silva',
  whatsapp: '(11) 98765-4321',
  produto: 'seguro-auto',
  detalhes: { veiculo: 'Onix 2021' },
  cidade: 'Santo André',
  pagina: '/seguro-auto',
  utm: { utm_campaign: 'auto-set' },
};

describe('validateLead', () => {
  test('pedido válido é normalizado', () => {
    const r = validateLead(base);
    expect(r).toEqual({
      ok: true,
      lead: {
        nome: 'João da Silva',
        whatsapp: '11987654321',
        produto: 'seguro-auto',
        produtoNome: 'Seguro Auto',
        detalhes: [{ label: 'Modelo e ano do carro', value: 'Onix 2021' }],
        cidade: 'Santo André',
        pagina: '/seguro-auto',
        utm: { utm_campaign: 'auto-set' },
      },
    });
  });

  test('cidade vazia é omitida', () => {
    const r = validateLead({ ...base, cidade: '   ' });
    expect(r.ok && 'cidade' in r.lead).toBe(false);
  });

  test('espaços e caracteres de controle no nome são limpos', () => {
    const r = validateLead({ ...base, nome: '  Maria\r\n  Souza  ' });
    expect(r.ok && r.lead.nome).toBe('Maria Souza');
  });

  test('entrada que não é objeto gera erros nos campos obrigatórios', () => {
    const r = validateLead('lixo');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(['nome', 'produto', 'whatsapp']);
  });

  test.each([
    [{ nome: '' }, 'nome'],
    [{ nome: 'A' }, 'nome'],
    [{ nome: '12345' }, 'nome'],
    [{ nome: 'a'.repeat(81) }, 'nome'],
    [{ whatsapp: '98765-4321' }, 'whatsapp'],
    [{ whatsapp: 123 }, 'whatsapp'],
    [{ produto: 'seguro-barco' }, 'produto'],
    [{ detalhes: {} }, 'detalhes.veiculo'],
    [{ detalhes: { veiculo: 'x'.repeat(61) } }, 'detalhes.veiculo'],
    [{ cidade: 'x'.repeat(61) }, 'cidade'],
  ])('%j gera erro em %s', (patch, field) => {
    const r = validateLead({ ...base, ...patch });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors[field]).toBeTruthy();
  });

  test('select só aceita opções da lista', () => {
    const r = validateLead({
      ...base,
      produto: 'seguro-residencial',
      detalhes: { imovel: 'Castelo', situacao: 'Próprio' },
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors['detalhes.imovel']).toBe('Escolha uma opção em "Tipo de imóvel".');
  });

  test('campos desconhecidos em detalhes são ignorados', () => {
    const r = validateLead({ ...base, detalhes: { veiculo: 'Onix 2021', hack: '<script>' } });
    expect(r.ok && r.lead.detalhes).toEqual([{ label: 'Modelo e ano do carro', value: 'Onix 2021' }]);
  });

  test('página inválida vira "/" e UTM é sanitizado', () => {
    const r = validateLead({ ...base, pagina: 'https://mal.com', utm: { utm_source: 'meta', x: 'y' } });
    expect(r.ok && r.lead.pagina).toBe('/');
    expect(r.ok && r.lead.utm).toEqual({ utm_source: 'meta' });
  });

  test('mensagens de erro em português', () => {
    const r = validateLead({ ...base, nome: '', whatsapp: '', produto: '' });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors.nome).toBe('Informe seu nome.');
      expect(r.errors.whatsapp).toBe('Informe um WhatsApp com DDD. Ex.: (11) 98765-4321.');
      expect(r.errors.produto).toBe('Escolha o tipo de seguro.');
    }
  });
});
