import { captureArrival, safeSessionStorage } from '../lib/origin';
import { trackEvent } from '../lib/meta-pixel';

// Guarda de onde a pessoa chegou na primeira página da visita (vai junto com o pedido do formulário)
captureArrival(safeSessionStorage(), document.referrer, window.location.hostname, window.location.pathname);

document.addEventListener('click', (event) => {
  const link = (event.target as Element | null)?.closest<HTMLElement>('[data-wa-contact]');
  if (!link) return;
  trackEvent('Contact', { content_name: link.dataset.waContext || 'Geral' });
});
