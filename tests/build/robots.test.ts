import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

const txt = readFileSync('.vercel/output/static/robots.txt', 'utf-8');

// Grupos do robots.txt (RFC 9309): linhas User-agent seguidas compartilham as regras abaixo delas.
function groups(source: string) {
  const out: { agents: string[]; disallow: string[] }[] = [];
  let current: { agents: string[]; disallow: string[] } | null = null;
  let lastWasAgent = false;
  for (const raw of source.split('\n')) {
    const line = raw.replace(/#.*/, '').trim();
    if (!line) continue;
    const [key, ...rest] = line.split(':');
    const value = rest.join(':').trim();
    if (/^user-agent$/i.test(key)) {
      if (!lastWasAgent || !current) out.push((current = { agents: [], disallow: [] }));
      current.agents.push(value.toLowerCase());
      lastWasAgent = true;
    } else {
      if (/^disallow$/i.test(key) && current) current.disallow.push(value);
      lastWasAgent = false;
    }
  }
  return out;
}
const rulesFor = (agent: string) =>
  groups(txt).find((g) => g.agents.includes(agent.toLowerCase())) ?? groups(txt).find((g) => g.agents.includes('*'))!;

describe('robots.txt', () => {
  test.each(['GPTBot', 'ClaudeBot', 'Google-Extended', 'CCBot', 'Applebot-Extended', 'Meta-ExternalAgent', 'Bytespider'])(
    'robô de treinamento %s é bloqueado',
    (agent) => {
      expect(rulesFor(agent).disallow).toContain('/');
    },
  );
  test.each(['Googlebot', 'Bingbot', 'OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'PerplexityBot'])(
    'robô de busca %s continua liberado',
    (agent) => {
      expect(rulesFor(agent).disallow).not.toContain('/');
    },
  );
  test('aponta o sitemap', () => {
    expect(txt).toContain('Sitemap: https://www.portugalcorretora.com.br/sitemap.xml');
  });
});
