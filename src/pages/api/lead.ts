import type { APIRoute } from 'astro';
import { LEAD_FROM_EMAIL, LEAD_TO_EMAIL, RESEND_API_KEY } from 'astro:env/server';
import { Resend } from 'resend';
import { handleLeadRequest } from '../../lib/lead-handler';

export const prerender = false;

export const POST: APIRoute = ({ request }) =>
  handleLeadRequest(request, {
    now: () => new Date(),
    log: (message, data) => console.error(message, data),
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
        from: LEAD_FROM_EMAIL,
        to: [LEAD_TO_EMAIL],
        subject: msg.subject,
        html: msg.html,
        text: msg.text,
      });
      if (error) throw new Error(`Resend: ${error.message}`);
    },
  });
