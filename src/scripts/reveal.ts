// Surgimento suave das seções ao rolar, uma única vez.
// Só esconde o que ainda está abaixo da tela: o que o visitante já vê nunca some, e sem JavaScript nada fica oculto.
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const items = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];

if (!reduce && 'IntersectionObserver' in window && items.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.remove('reveal-pending');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  );

  for (const el of items) {
    if (el.getBoundingClientRect().top < window.innerHeight) continue;
    // Pequena cascata entre irmãos (no máximo 4 x 50ms)
    const siblings = el.parentElement ? [...el.parentElement.children].filter((c) => c.hasAttribute('data-reveal')) : [];
    el.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(el), 4) * 50}ms`);
    el.classList.add('reveal-pending');
    observer.observe(el);
  }
}
