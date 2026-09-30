// Limite simples de pedidos por endereço, guardado na memória da função.
// Cada instância da Vercel tem a sua própria contagem: é uma primeira barreira. A regra de limite no Firewall da
// Vercel (ver README) completa a proteção.

export interface RateLimitOptions {
  limit: number;
  windowMs: number;
  maxKeys?: number;
}

export function createRateLimiter({ limit, windowMs, maxKeys = 5000 }: RateLimitOptions) {
  const hits = new Map<string, number[]>();

  return function allow(key: string, nowMs: number): boolean {
    const recent = (hits.get(key) ?? []).filter((t) => nowMs - t < windowMs);
    if (recent.length >= limit) {
      hits.set(key, recent);
      return false;
    }
    recent.push(nowMs);
    hits.delete(key);
    hits.set(key, recent);
    // O Map mantém a ordem de inserção: o primeiro é o endereço visto há mais tempo
    while (hits.size > maxKeys) hits.delete(hits.keys().next().value as string);
    return true;
  };
}

export function clientKey(request: Request): string {
  const real = request.headers.get('x-real-ip')?.trim();
  if (real) return real;
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || 'desconhecido';
}
