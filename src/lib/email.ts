import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return null;
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
  return transporter;
}

export type EmailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail(input: EmailInput) {
  const t = getTransporter();
  if (!t) {
    console.warn('[email] Gmail not configured — skipping send');
    return { skipped: true };
  }
  const from = `"${process.env.GMAIL_FROM_NAME || 'Venture Builders'}" <${process.env.GMAIL_USER}>`;
  const info = await t.sendMail({
    from,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
  });
  return { messageId: info.messageId };
}

export function emailTemplate(opts: { title: string; body: string; ctaUrl?: string; ctaLabel?: string }) {
  return `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:560px;margin:40px auto;background:linear-gradient(135deg,#1a1625 0%,#0f0a1a 100%);border:1px solid rgba(168,85,247,0.2);border-radius:16px;overflow:hidden;">
  <div style="padding:32px 32px 16px;background:linear-gradient(135deg,#7c3aed 0%,#ec4899 100%);">
    <h1 style="color:#fff;margin:0;font-size:24px;font-weight:700;">Venture Builders</h1>
  </div>
  <div style="padding:32px;color:#e2e8f0;">
    <h2 style="color:#fff;margin:0 0 16px;font-size:20px;">${opts.title}</h2>
    <div style="line-height:1.6;color:#94a3b8;">${opts.body}</div>
    ${opts.ctaUrl ? `<div style="margin-top:24px;"><a href="${opts.ctaUrl}" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#7c3aed 0%,#ec4899 100%);color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">${opts.ctaLabel || 'Open'}</a></div>` : ''}
  </div>
  <div style="padding:16px 32px;background:rgba(255,255,255,0.02);color:#64748b;font-size:12px;text-align:center;">
    © Venture Builders · AI-powered startup OS
  </div>
</div></body></html>`;
}
