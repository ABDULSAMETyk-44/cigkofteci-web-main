import nodemailer, { type Transporter } from 'nodemailer';

// -----------------------------------------------------------------------------
// E-posta bildirim modülü.
//
// SMTP bilgileri .env dosyasından okunur (bkz. .env.example). Bilgiler
// tanımlanmamışsa e-posta gönderimi sessizce atlanır ve konsola uyarı
// yazılır — böylece site sahibi SMTP kurmadan önce de sistem çökmeden
// çalışmaya devam eder (bildirimler admin panelinde görünmeye devam eder).
// -----------------------------------------------------------------------------

let cachedTransporter: Transporter | null = null;
let cachedConfigKey = '';

function getTransporter(): Transporter | null {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  const configKey = `${host}:${port}:${user}`;
  if (cachedTransporter && cachedConfigKey === configKey) {
    return cachedTransporter;
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === 'true' || port === 465,
    auth: { user, pass },
  });
  cachedConfigKey = configKey;
  return cachedTransporter;
}

export interface SendResult {
  sent: boolean;
  reason?: string;
}

export async function sendNotificationEmail(subject: string, html: string): Promise<SendResult> {
  const to = process.env.NOTIFY_EMAIL;
  if (!to) {
    console.warn(
      '[mailer] NOTIFY_EMAIL tanımlı değil. Bildirim e-postası gönderilemedi. .env dosyanızı kontrol edin.'
    );
    return { sent: false, reason: 'NOTIFY_EMAIL tanımlı değil' };
  }

  const transporter = getTransporter();
  if (!transporter) {
    console.warn(
      '[mailer] SMTP ayarları eksik (SMTP_HOST/SMTP_USER/SMTP_PASS). Bildirim e-postası gönderilemedi.'
    );
    return { sent: false, reason: 'SMTP ayarları eksik' };
  }

  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
    });
    return { sent: true };
  } catch (err) {
    console.error('[mailer] E-posta gönderim hatası:', err);
    return { sent: false, reason: err instanceof Error ? err.message : 'Bilinmeyen hata' };
  }
}
