import { trackEvent } from '../lib/meta-pixel';

document.addEventListener('click', (event) => {
  const link = (event.target as Element | null)?.closest<HTMLElement>('[data-wa-contact]');
  if (!link) return;
  trackEvent('Contact', { content_name: link.dataset.waContext || 'Geral' });
});
