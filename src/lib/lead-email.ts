import type { ValidLead } from './lead';
import { formatBrPhone } from './phone';
import { UTM_KEYS } from './utm';

export interface EmailMessage {
  subject: string;
  html: string;
  text: string;
}

const HTML_ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);
}

export function renderLeadEmail(lead: ValidLead, receivedAt: Date): EmailMessage {
  const when = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(receivedAt);
  const waLink = `https://wa.me/55${lead.whatsapp}`;

  const rows: [string, string][] = [
    ['Nome', lead.nome],
    ['WhatsApp', formatBrPhone(lead.whatsapp)],
    ['Produto', lead.produtoNome],
    ...lead.detalhes.map((d): [string, string] => [d.label, d.value]),
    ...(lead.cidade ? [['Cidade', lead.cidade] as [string, string]] : []),
    ['Página de origem', lead.pagina],
    ...UTM_KEYS.filter((k) => lead.utm[k]).map((k): [string, string] => [k, lead.utm[k] as string]),
    ['Recebido em', `${when} (horário de Brasília)`],
  ];

  const subject = `Novo contato pelo site: ${lead.produtoNome} – ${lead.nome}`;

  const html = `<!doctype html><html lang="pt-BR"><body style="font-family:Arial,sans-serif;color:#1a1a1a">
<h2 style="color:#003780;margin:0 0 12px">Novo contato pelo site</h2>
<p style="margin:0 0 16px"><a href="${escapeHtml(waLink)}" style="background:#25D366;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;font-weight:bold">Responder no WhatsApp</a></p>
<table cellpadding="6" style="border-collapse:collapse">
${rows.map(([k, v]) => `<tr><td style="color:#555;vertical-align:top"><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v)}</td></tr>`).join('\n')}
</table>
<p style="color:#777;font-size:12px;margin-top:16px">WhatsApp: ${escapeHtml(waLink)}</p>
</body></html>`;

  const text = [
    'Novo contato pelo site',
    '',
    ...rows.map(([k, v]) => `${k}: ${v}`),
    '',
    `Responder no WhatsApp: ${waLink}`,
  ].join('\n');

  return { subject, html, text };
}
