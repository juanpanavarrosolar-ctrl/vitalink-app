import { Resend } from 'resend';
import { formatCLP } from '@/lib/utils';

function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM = 'VitaLink <noreply@vitalink.cl>';
const DISCLAIMER = `<p style="font-size:11px;color:#6b7280;margin-top:24px;padding-top:16px;border-top:1px solid #e5e7eb">Este email es informativo. Los suplementos alimentarios no son medicamentos y no reemplazan un diagnóstico o prescripción médica. VitaLink opera bajo la normativa DS 977 del Ministerio de Salud de Chile.</p>`;

export async function sendProtocolLink({ to, patientName, professionalName, protocolName, link }: {
  to: string; patientName: string; professionalName: string; protocolName: string; link: string;
}) {
  const resend = getResend();
  if (!resend) return;
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Tu protocolo de suplementación está listo — ${protocolName}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111827">
        <div style="background:#0891b2;padding:20px 24px;border-radius:12px 12px 0 0">
          <span style="color:#fff;font-size:20px;font-weight:800">VitaLink</span>
        </div>
        <div style="padding:24px;background:#fff;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
          <p>Hola, <strong>${patientName}</strong> 👋</p>
          <p>Tu profesional de salud <strong>${professionalName}</strong> ha preparado un protocolo de suplementación especialmente para ti:</p>
          <p style="font-size:18px;font-weight:700;margin:16px 0">${protocolName}</p>
          <a href="${link}" style="display:inline-block;padding:12px 24px;background:#0891b2;color:#fff;font-weight:700;text-decoration:none;border-radius:8px;margin:8px 0">
            Ver mi protocolo →
          </a>
          <p style="font-size:13px;color:#6b7280;margin-top:16px">
            O copia este link en tu navegador:<br>
            <a href="${link}" style="color:#0891b2">${link}</a>
          </p>
          ${DISCLAIMER}
        </div>
      </div>
    `,
  });
}

export async function sendOrderConfirmation({ to, patientName, orderTotal, orderId }: {
  to: string; patientName: string; orderTotal: number; orderId: string;
}) {
  const resend = getResend();
  if (!resend) return;
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Confirmación de compra — Pedido #${orderId.slice(0, 8).toUpperCase()}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111827">
        <div style="background:#059669;padding:20px 24px;border-radius:12px 12px 0 0">
          <span style="color:#fff;font-size:20px;font-weight:800">VitaLink</span>
        </div>
        <div style="padding:24px;background:#fff;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
          <p>¡Hola, <strong>${patientName}</strong>! ✅</p>
          <p>Hemos recibido tu pago correctamente.</p>
          <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:16px;margin:16px 0">
            <div style="font-weight:700;margin-bottom:8px">Resumen de tu pedido</div>
            <div style="display:flex;justify-content:space-between;font-size:14px"><span>Nº pedido</span><strong>#${orderId.slice(0, 8).toUpperCase()}</strong></div>
            <div style="display:flex;justify-content:space-between;font-size:14px;margin-top:4px"><span>Total</span><strong>${formatCLP(orderTotal)}</strong></div>
          </div>
          <p style="font-size:14px;color:#6b7280">Recibirás un email de tu profesional de salud con el seguimiento. El despacho se realizará en los próximos días hábiles.</p>
          ${DISCLAIMER}
        </div>
      </div>
    `,
  });
}

export async function sendRenewalReminder({ to, patientName, protocolName, link, renewalDate }: {
  to: string; patientName: string; protocolName: string; link: string; renewalDate: string;
}) {
  const resend = getResend();
  if (!resend) return;
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Recordatorio: renueva tu protocolo de suplementación`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111827">
        <div style="background:#7c3aed;padding:20px 24px;border-radius:12px 12px 0 0">
          <span style="color:#fff;font-size:20px;font-weight:800">VitaLink</span>
        </div>
        <div style="padding:24px;background:#fff;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
          <p>Hola, <strong>${patientName}</strong> 🔄</p>
          <p>Tu protocolo <strong>${protocolName}</strong> vence el <strong>${renewalDate}</strong>.</p>
          <p>Para mantener la continuidad de tu plan, renueva ahora con un clic:</p>
          <a href="${link}" style="display:inline-block;padding:12px 24px;background:#7c3aed;color:#fff;font-weight:700;text-decoration:none;border-radius:8px;margin:8px 0">
            Renovar mi protocolo →
          </a>
          ${DISCLAIMER}
        </div>
      </div>
    `,
  });
}
