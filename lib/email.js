import nodemailer from 'nodemailer';

function buildTransport() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    return null; // dev fallback
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for others
    auth: { user, pass },
  });
}

export async function sendVerificationEmail(toEmail, toName, verifyLink) {
  const transport = buildTransport();
  const from = process.env.EMAIL_FROM || 'no-reply@dolan-bms.local';

  const subject = 'Verifikasi Email Akun Dolan Banyumas';
  const text = `Halo ${toName},\n\nTerima kasih telah mendaftar di Dolan Banyumas.\nSilakan verifikasi email Anda dengan membuka tautan berikut:\n${verifyLink}\n\nJika Anda tidak merasa mendaftar, abaikan email ini.`;
  const html = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <h2 style="margin: 0 0 16px;">Verifikasi Email</h2>
      <p>Halo <strong>${toName}</strong>,</p>
      <p>Terima kasih telah mendaftar di <strong>Dolan Banyumas</strong>. Klik tombol di bawah untuk memverifikasi email Anda:</p>
      <p style="margin: 24px 0;">
        <a href="${verifyLink}" style="background: #2563eb; color: white; padding: 12px 20px; border-radius: 8px; text-decoration: none;">Verifikasi Email</a>
      </p>
      <p>Atau salin tautan berikut jika tombol tidak berfungsi:</p>
      <p><a href="${verifyLink}">${verifyLink}</a></p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p style="color: #6b7280; font-size: 12px;">Jika Anda tidak merasa mendaftar, abaikan email ini.</p>
    </div>
  `;

  if (!transport) {
    console.log('[DEV] sendVerificationEmail', { toEmail, toName, verifyLink, subject });
    return { sent: false, dev: true };
  }

  await transport.sendMail({ from, to: toEmail, subject, text, html });
  return { sent: true };
}


