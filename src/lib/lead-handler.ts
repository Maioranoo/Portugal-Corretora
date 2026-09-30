import { validateLead } from './lead';
import { renderLeadEmail, type EmailMessage } from './lead-email';

export const MAX_BODY_BYTES = 8192;
// Tempo mínimo entre abrir a página e enviar: abaixo disso é robô (uma pessoa leva bem mais para preencher)
export const MIN_ELAPSED_MS = 1500;

export interface LeadDeps {
  sendEmail: (msg: EmailMessage) => Promise<void>;
  now: () => Date;
  log: (message: string, data?: Record<string, unknown>) => void;
  /** Limite de pedidos por endereço; sem ele, não há limite (testes). */
  allowRequest?: (request: Request) => boolean;
}

function json(status: number, data: unknown): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

export function isSameOrigin(request: Request): boolean {
  const expected = new URL(request.url).origin;
  const origin = request.headers.get('origin');
  if (origin) return origin === expected;
  const referer = request.headers.get('referer');
  if (!referer) return false;
  try {
    return new URL(referer).origin === expected;
  } catch {
    return false;
  }
}

export async function handleLeadRequest(request: Request, deps: LeadDeps): Promise<Response> {
  if (request.method !== 'POST') return json(405, { ok: false });
  if (!isSameOrigin(request)) return json(403, { ok: false });
  if (deps.allowRequest && !deps.allowRequest(request)) return json(429, { ok: false });
  if (!(request.headers.get('content-type') ?? '').toLowerCase().startsWith('application/json')) {
    return json(415, { ok: false });
  }
  const declared = Number(request.headers.get('content-length') ?? '0');
  if (declared > MAX_BODY_BYTES) return json(413, { ok: false });

  const text = await request.text();
  if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) return json(413, { ok: false });

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return json(400, { ok: false });
  }

  const b = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;
  const honeypot = typeof b.website === 'string' && b.website.trim() !== '';
  const tooFast = typeof b.elapsedMs !== 'number' || b.elapsedMs < MIN_ELAPSED_MS;
  if (honeypot || tooFast) return json(200, { ok: true });

  const result = validateLead(body);
  if (!result.ok) return json(400, { ok: false, errors: result.errors });

  try {
    await deps.sendEmail(renderLeadEmail(result.lead, deps.now()));
  } catch (err) {
    deps.log('lead: falha ao enviar e-mail', {
      produto: result.lead.produto,
      erro: err instanceof Error ? err.message : String(err),
    });
    return json(502, { ok: false });
  }
  return json(200, { ok: true });
}
