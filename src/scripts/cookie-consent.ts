import { PUBLIC_META_PIXEL_ID } from 'astro:env/client';
import { readConsent, safeLocalStorage, writeConsent, type ConsentStatus } from '../lib/consent';
import { loadPixel, trackEvent } from '../lib/meta-pixel';

const banner = document.querySelector<HTMLElement>('[data-cookie-banner]');
const storage = safeLocalStorage();
let sessionChoice: ConsentStatus | null = null; // usado quando o armazenamento está bloqueado

// Reserva espaço no fim da página para o aviso não cobrir o conteúdo (formulário, rodapé)
function setBannerSpace() {
  const h = banner && !banner.hidden ? banner.offsetHeight : 0;
  document.documentElement.style.setProperty('--cookie-h', `${h}px`);
}

function show() {
  if (!banner) return;
  banner.hidden = false;
  setBannerSpace();
}

function hide() {
  if (!banner) return;
  banner.hidden = true;
  setBannerSpace();
}

function activate() {
  if (!loadPixel(PUBLIC_META_PIXEL_ID)) return;
  const product = document.body.dataset.productName;
  if (product) trackEvent('ViewContent', { content_name: product });
}

function choose(status: ConsentStatus) {
  const hadPixel = 'fbq' in window;
  if (!writeConsent(storage, status, new Date())) sessionChoice = status;
  hide();
  if (status === 'granted') activate();
  else if (hadPixel) window.location.reload(); // descarrega o Pixel já carregado
}

const current = readConsent(storage, new Date()) ?? sessionChoice;
if (current === 'granted') activate();
else if (current === null) show();

banner?.querySelector('[data-consent="granted"]')?.addEventListener('click', () => choose('granted'));
banner?.querySelector('[data-consent="denied"]')?.addEventListener('click', () => choose('denied'));

document.querySelectorAll<HTMLElement>('[data-cookie-preferences]').forEach((el) =>
  el.addEventListener('click', (event) => {
    event.preventDefault();
    show();
    banner?.querySelector<HTMLButtonElement>('button')?.focus();
  }),
);
