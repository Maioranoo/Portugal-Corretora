import { WHATSAPP_NUMBER } from '../content/contact';
import { isWithinBusinessHours } from '../lib/business-hours';
import { validateLead, type LeadErrors } from '../lib/lead';
import { trackEvent } from '../lib/meta-pixel';
import { maskBrPhoneInput } from '../lib/phone';
import { captureUtm } from '../lib/utm';
import { buildLeadMessage, buildWhatsAppUrl } from '../lib/whatsapp';

const OFFLINE_MSG = 'Parece que você está sem internet. Verifique a conexão e tente de novo. Seus dados continuam aqui.';
const IN_HOURS_MSG = 'Nossa equipe continua a conversa com você por lá.';
const OFF_HOURS_MSG =
  'Recebemos seu contato! Nosso atendimento funciona de segunda a sexta, das 9h às 18h. Retornamos no próximo dia útil.';

function sessionStore(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function showErrors(form: HTMLFormElement, errors: LeadErrors) {
  let first: HTMLElement | null = null;
  form.querySelectorAll<HTMLElement>('[data-error-for]').forEach((slot) => {
    const key = slot.dataset.errorFor as string;
    // Dois produtos podem ter campos com o mesmo nome: o erro só vale para o produto escolhido.
    const inactive = !!slot.closest('fieldset[disabled]');
    const message = inactive ? '' : (errors[key] ?? '');
    slot.textContent = message;
    const control = slot.closest('.field')?.querySelector<HTMLElement>('input, select, textarea');
    if (!control) return;
    if (message) {
      control.setAttribute('aria-invalid', 'true');
      if (!first) first = control;
    } else {
      control.removeAttribute('aria-invalid');
    }
  });
  (first as HTMLElement | null)?.focus();
}

function initLeadForm(root: HTMLElement) {
  const form = root.querySelector<HTMLFormElement>('[data-lead-form]');
  const success = root.querySelector<HTMLElement>('[data-lead-success]');
  if (!form || !success) return;
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const startedAt = performance.now();
  const utm = captureUtm(sessionStore(), window.location.search);
  let sent = false;

  const select = form.querySelector<HTMLSelectElement>('[data-product-select]');
  const syncFieldsets = () => {
    form.querySelectorAll<HTMLFieldSetElement>('[data-product-fields]').forEach((fs) => {
      const active = !select || fs.dataset.productFields === select.value;
      fs.hidden = !active;
      fs.disabled = !active;
      if (!active) {
        fs.querySelectorAll('[data-error-for]').forEach((slot) => (slot.textContent = ''));
        fs.querySelectorAll('[aria-invalid]').forEach((c) => c.removeAttribute('aria-invalid'));
      }
    });
  };
  if (select) {
    select.addEventListener('change', syncFieldsets);
    syncFieldsets();
  }

  // Quando a pessoa mexe num campo com erro, o erro dele some (os demais continuam até o próximo envio).
  const clearError = (event: Event) => {
    const control = event.target as HTMLElement | null;
    if (!control || control.getAttribute('aria-invalid') !== 'true') return;
    control.removeAttribute('aria-invalid');
    const slot = control.closest('.field')?.querySelector<HTMLElement>('[data-error-for]');
    if (slot) slot.textContent = '';
  };
  form.addEventListener('input', clearError);
  form.addEventListener('change', clearError);

  const phone = form.querySelector<HTMLInputElement>('[name="whatsapp"]');
  phone?.addEventListener('input', () => {
    phone.value = maskBrPhoneInput(phone.value);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (sent) return;

    const data = new FormData(form);
    const detalhes: Record<string, string> = {};
    for (const [key, value] of data) {
      if (key.startsWith('detalhes.') && typeof value === 'string') detalhes[key.slice('detalhes.'.length)] = value;
    }
    const payload = {
      nome: String(data.get('nome') ?? ''),
      whatsapp: String(data.get('whatsapp') ?? ''),
      produto: String(data.get('produto') ?? ''),
      detalhes,
      cidade: String(data.get('cidade') ?? ''),
      pagina: window.location.pathname,
      utm,
      elapsedMs: Math.round(performance.now() - startedAt),
      website: String(data.get('website') ?? ''),
    };

    const result = validateLead(payload);
    showErrors(form, result.ok ? {} : result.errors);
    if (!result.ok) return;

    if (!navigator.onLine) {
      if (status) status.textContent = OFFLINE_MSG;
      return;
    }
    if (status) status.textContent = '';
    sent = true;

    const { lead } = result;
    const url = buildWhatsAppUrl(
      WHATSAPP_NUMBER,
      buildLeadMessage({
        nome: lead.nome,
        cidade: lead.cidade,
        productName: lead.produtoNome,
        detalhes: lead.detalhes.map((d) => d.value),
      }),
    );

    fetch('/api/lead', {
      method: 'POST',
      keepalive: true,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {
      /* o WhatsApp já abriu; a falha do e-mail fica no log do servidor */
    });
    trackEvent('Lead', { content_name: lead.produtoNome });

    const hours = success.querySelector<HTMLElement>('[data-success-hours]');
    if (hours) hours.textContent = isWithinBusinessHours(new Date()) ? IN_HOURS_MSG : OFF_HOURS_MSG;
    success.querySelector<HTMLAnchorElement>('[data-success-fallback]')?.setAttribute('href', url);
    form.hidden = true;
    success.hidden = false;
    success.focus();

    const win = window.open(url, '_blank');
    if (win) win.opener = null;
    else window.location.href = url;
  });
}

document.querySelectorAll<HTMLElement>('[data-lead-root]').forEach(initLeadForm);
