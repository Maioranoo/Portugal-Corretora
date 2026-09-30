import type { APIRoute } from 'astro';
import { LEAD_FROM_EMAIL, LEAD_TO_EMAIL, RESEND_API_KEY } from 'astro:env/server';
import { Resend } from 'resend';
import { handleLeadRequest } from '../../lib/lead-handler';
import { clientKey, createRateLimiter } from '../../lib/rate-limit';

export const prerender = false;

// No máximo 5 pedidos a cada 10 minutos por endereço
const allow = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

// Variável criada vazia na Vercel não pode apagar o endereço padrão
const DEFAULT_TO = 'atendimento@portugalcorretora.com.br';
const DEFAULT_FROM = 'Site Portugal Corretora <site@portugalcorretora.com.br>';
const to = LEAD_TO_EMAIL?.trim() || DEFAULT_TO;
const from = LEAD_FROM_EMAIL?.trim() || DEFAULT_FROM;

export const POST: APIRoute = ({ request }) =>
  handleLeadRequest(request, {
    now: () => new Date(),
    log: (message, data) => console.error(message, data),
    allowRequest: (req) => allow(clientKey(req), Date.now()),
    sendEmail: async (msg) => {
      if (!RESEND_API_KEY) {
        if (import.meta.env.DEV) {
          console.info('[dev] e-mail não enviado (sem RESEND_API_KEY):', msg.subject);
          return;
        }
        throw new Error('RESEND_API_KEY ausente');
      }
      const resend = new Resend(RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from,
        to: [to],
        subject: msg.subject,
        html: msg.html,
        text: msg.text,
      });
      if (error) throw new Error(`Resend: ${error.message}`);
    },
  });
