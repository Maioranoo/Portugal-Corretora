// Serve o build final (.vercel/output/static) localmente, com os mesmos headers de segurança da produção.
// Uso: npm run build && npm run serve:static   (porta 4322; defina PORT para trocar)
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { createBrotliCompress, createGzip } from 'node:zlib';
import { SECURITY_HEADERS } from '../integrations/security-headers.mjs';

const root = join(process.cwd(), '.vercel/output/static');
const port = Number(process.env.PORT ?? 4322);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.ico': 'image/x-icon',
};

function resolve(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  for (const candidate of [clean, `${clean}.html`, join(clean, 'index.html')]) {
    const file = join(root, candidate);
    if (file.startsWith(root) && existsSync(file) && statSync(file).isFile()) return file;
  }
  return null;
}

// Comprime texto como a Vercel faz (brotli ou gzip), para a medição local ser fiel à produção
const compressible = new Set(['.html', '.js', '.css', '.svg', '.xml', '.txt']);

createServer((req, res) => {
  const file = resolve(req.url ?? '/');
  const target = file ?? join(root, '404.html');
  const ext = extname(target);
  const headers = { ...SECURITY_HEADERS, 'content-type': types[ext] ?? 'application/octet-stream' };
  if (req.url?.startsWith('/_astro/') || req.url?.startsWith('/fonts/')) headers['cache-control'] = 'public, max-age=31536000, immutable';
  const accept = String(req.headers['accept-encoding'] ?? '');
  let stream = createReadStream(target);
  if (compressible.has(ext) && /\bbr\b/.test(accept)) {
    headers['content-encoding'] = 'br';
    stream = stream.pipe(createBrotliCompress());
  } else if (compressible.has(ext) && /gzip/.test(accept)) {
    headers['content-encoding'] = 'gzip';
    stream = stream.pipe(createGzip());
  }
  res.writeHead(file ? 200 : 404, headers);
  stream.pipe(res);
}).listen(port, () => console.log(`Servindo ${root} em http://localhost:${port}`));
