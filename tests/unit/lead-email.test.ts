import { describe, expect, test } from 'vitest';
import { escapeHtml, renderLeadEmail } from '../../src/lib/lead-email';
import type { ValidLead } from '../../src/lib/lead';

const lead: ValidLead = {
  nome: 'Zé <b>& "Cia"</b>',
  whatsapp: '11987654321',
  produto: 'seguro-auto',
  produtoNome: 'Seguro Auto',
  detalhes: [{ label: 'Modelo e ano do carro', value: '<script>alert(1)</script>' }],
  cidade: 'Santo André',
  pagina: '/seguro-auto',
  utm: { utm_source: 'meta', utm_campaign: 'auto-set' },
};

describe('escapeHtml', () => {
  test('escapa os 5 caracteres especiais', () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe('&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;');
  });
});

describe('renderLeadEmail', () => {
  const msg = renderLeadEmail(lead, new Date('2026-09-29T15:30:00Z'));

  test('assunto com produto e nome, sem quebra de linha', () => {
    expect(msg.subject).toBe('Novo contato pelo site: Seguro Auto – Zé <b>& "Cia"</b>');
    expect(msg.subject).not.toMatch(/[\r\n]/);
  });
  test('HTML nunca contém a marcação digitada pelo usuário', () => {
    expect(msg.html).not.toContain('<script>');
    expect(msg.html).not.toContain('<b>&');
    expect(msg.html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
  });
  test('inclui telefone formatado, link do WhatsApp, página, UTMs e data em São Paulo', () => {
    for (const body of [msg.html, msg.text]) {
      expect(body).toContain('(11) 98765-4321');
      expect(body).toContain('https://wa.me/5511987654321');
      expect(body).toContain('/seguro-auto');
      expect(body).toContain('auto-set');
      expect(body).toContain('29/09/2026');
      expect(body).toContain('12:30');
      expect(body).toContain('Santo André');
    }
  });
  test('texto puro mantém os caracteres originais', () => {
    expect(msg.text).toContain('Zé <b>& "Cia"</b>');
  });
});
