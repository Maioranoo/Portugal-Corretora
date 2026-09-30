import type { APIRoute } from 'astro';
import { PRODUCTS } from '../content/products';

export const GET: APIRoute = ({ site }) => {
  const base = (site?.href ?? 'https://www.portugalcorretora.com.br/').replace(/\/$/, '');
  const paths = ['/', ...PRODUCTS.map((p) => `/${p.slug}`), '/ja-sou-cliente', '/privacidade'];
  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    paths.map((p) => `  <url><loc>${base}${p}</loc></url>`).join('\n') +
    '\n</urlset>\n';
  return new Response(body, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
};
