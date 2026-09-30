import { beforeEach, describe, expect, test, vi, type Mock } from 'vitest';
import { handleLeadRequest, isSameOrigin, type LeadDeps } from '../../src/lib/lead-handler';

const URL_API = 'https://www.portugalcorretora.com.br/api/lead';
const ORIGIN = 'https://www.portugalcorretora.com.br';
const valid = {
  nome: 'João',
  whatsapp: '11987654321',
  produto: 'seguro-auto',
  detalhes: { veiculo: 'Onix 2021' },
  cidade: '',
  pagina: '/seguro-auto',
  utm: {},
  elapsedMs: 8000,
  website: '',
};

function req(body: unknown, init: { origin?: string | null; referer?: string; type?: string; method?: string } = {}) {
  const headers = new Headers({ 'content-type': init.type ?? 'application/json' });
  if (init.origin !== null) headers.set('origin', init.origin ?? ORIGIN);
  if (init.referer) headers.set('referer', init.referer);
  return new Request(URL_API, {
    method: init.method ?? 'POST',
    headers,
    body: init.method === 'GET' ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  });
}

let deps: {
  sendEmail: Mock<LeadDeps['sendEmail']>;
  now: LeadDeps['now'];
  log: Mock<LeadDeps['log']>;
};
beforeEach(() => {
  deps = {
    sendEmail: vi.fn<LeadDeps['sendEmail']>().mockResolvedValue(undefined),
    now: () => new Date('2026-09-29T15:30:00Z'),
    log: vi.fn<LeadDeps['log']>(),
  };
});

describe('isSameOrigin', () => {
  test('aceita origin igual', () => expect(isSameOrigin(req(valid))).toBe(true));
  test('rejeita outra origem', () => expect(isSameOrigin(req(valid, { origin: 'https://mal.com' }))).toBe(false));
  test('usa referer quando não há origin', () =>
    expect(isSameOrigin(req(valid, { origin: null, referer: `${ORIGIN}/seguro-auto` }))).toBe(true));
  test('rejeita quando não há origin nem referer', () => expect(isSameOrigin(req(valid, { origin: null }))).toBe(false));
});

describe('handleLeadRequest', () => {
  test('pedido válido envia e-mail e responde 200', async () => {
    const res = await handleLeadRequest(req(valid), deps);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(deps.sendEmail).toHaveBeenCalledOnce();
    expect(deps.sendEmail.mock.calls[0][0].subject).toContain('Seguro Auto');
    expect(res.headers.get('cache-control')).toBe('no-store');
  });

  test('método diferente de POST responde 405', async () => {
    expect((await handleLeadRequest(req(null, { method: 'GET' }), deps)).status).toBe(405);
  });
  test('outra origem responde 403 sem enviar', async () => {
    expect((await handleLeadRequest(req(valid, { origin: 'https://mal.com' }), deps)).status).toBe(403);
    expect(deps.sendEmail).not.toHaveBeenCalled();
  });
  test('content-type errado responde 415', async () => {
    expect((await handleLeadRequest(req('nome=x', { type: 'application/x-www-form-urlencoded' }), deps)).status).toBe(415);
  });
  test('corpo grande demais responde 413', async () => {
    expect((await handleLeadRequest(req({ ...valid, nome: 'a'.repeat(9000) }), deps)).status).toBe(413);
  });
  test('JSON inválido responde 400', async () => {
    expect((await handleLeadRequest(req('{quebrado'), deps)).status).toBe(400);
  });
  test('honeypot preenchido finge sucesso e não envia', async () => {
    const res = await handleLeadRequest(req({ ...valid, website: 'http://spam' }), deps);
    expect(res.status).toBe(200);
    expect(deps.sendEmail).not.toHaveBeenCalled();
  });
  test('envio rápido demais finge sucesso e não envia', async () => {
    const res = await handleLeadRequest(req({ ...valid, elapsedMs: 500 }), deps);
    expect(res.status).toBe(200);
    expect(deps.sendEmail).not.toHaveBeenCalled();
  });
  test('pessoa rápida (1,6s) é aceita', async () => {
    await handleLeadRequest(req({ ...valid, elapsedMs: 1600 }), deps);
    expect(deps.sendEmail).toHaveBeenCalledOnce();
  });
  test('excesso de pedidos do mesmo endereço responde 429 sem enviar', async () => {
    const limited = { ...deps, allowRequest: () => false };
    const res = await handleLeadRequest(req(valid), limited);
    expect(res.status).toBe(429);
    expect(deps.sendEmail).not.toHaveBeenCalled();
  });
  test('pedido de outra origem não consome o limite', async () => {
    const allowRequest = vi.fn(() => true);
    await handleLeadRequest(req(valid, { origin: 'https://mal.com' }), { ...deps, allowRequest });
    expect(allowRequest).not.toHaveBeenCalled();
  });
  test('elapsedMs ausente é tratado como robô', async () => {
    const { elapsedMs, ...semTempo } = valid;
    await handleLeadRequest(req(semTempo), deps);
    expect(deps.sendEmail).not.toHaveBeenCalled();
  });
  test('dados inválidos respondem 400 com erros', async () => {
    const res = await handleLeadRequest(req({ ...valid, whatsapp: '123' }), deps);
    expect(res.status).toBe(400);
    expect((await res.json()).errors.whatsapp).toBeTruthy();
  });
  test('falha no e-mail responde 502 e registra log sem dados pessoais', async () => {
    deps.sendEmail.mockRejectedValue(new Error('resend fora do ar'));
    const res = await handleLeadRequest(req(valid), deps);
    expect(res.status).toBe(502);
    expect(deps.log).toHaveBeenCalledOnce();
    const logged = JSON.stringify(deps.log.mock.calls[0]);
    expect(logged).not.toContain('João');
    expect(logged).not.toContain('987654321');
  });
});
