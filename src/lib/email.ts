import nodemailer from 'nodemailer';

// Basic transporter using environment variables; in production configure securely.
// Required envs: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM
export function createTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const service = process.env.SMTP_SERVICE;

  if (!host || !user || !pass || !service) {
    throw new Error('SMTP configuration incomplete');
  }

  return nodemailer.createTransport({
    host,
    port,
    service,
    secure: port === 465, // true for 465, false for other ports
    auth: { user, pass },
  });
}

interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail({ to, subject, text, html }: SendEmailOptions) {
  const from = process.env.MAIL_FROM || 'no-reply@mail.com';
  const transporter = createTransport();
  await transporter.sendMail({ from, to, subject, text, html: html || text });
}
