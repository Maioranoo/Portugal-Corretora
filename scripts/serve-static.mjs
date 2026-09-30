// Serve o build final (.vercel/output/static) localmente, com os mesmos headers de segurança da produção.
// Uso: npm run build && npm run serve:static   (porta 4322; defina PORT para trocar)
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
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

createServer((req, res) => {
  const file = resolve(req.url ?? '/');
  const target = file ?? join(root, '404.html');
  res.writeHead(file ? 200 : 404, { ...SECURITY_HEADERS, 'content-type': types[extname(target)] ?? 'application/octet-stream' });
  createReadStream(target).pipe(res);
}).listen(port, () => console.log(`Servindo ${root} em http://localhost:${port}`));
