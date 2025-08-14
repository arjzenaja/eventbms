import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ success: false, message: 'Email diperlukan' }, { status: 400 });
    }

    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const users = dbData.users || [];
    const idx = users.findIndex(u => u.email === email);
    if (idx === -1) {
      return NextResponse.json({ success: false, message: 'User tidak ditemukan' }, { status: 404 });
    }

    const user = users[idx];
    if (user.is_verified) {
      return NextResponse.json({ success: false, message: 'Akun sudah terverifikasi' }, { status: 400 });
    }

    const newToken = crypto.randomBytes(24).toString('hex');
    users[idx] = {
      ...user,
      verify_token: newToken,
      verify_sent_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    dbData.users = users;
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));

    const origin = new URL(request.url).origin;
    const verifyLink = `${origin}/verify-email?token=${newToken}`;
    let emailSent = false;
    try {
      const res = await sendVerificationEmail(user.email, user.name || 'Pengguna', verifyLink);
      emailSent = !!res?.sent || !!res?.dev;
    } catch (e) {
      console.error('Resend email failed:', e);
    }

    return NextResponse.json({ success: true, message: 'Email verifikasi dikirim ulang', meta: { verify_url: verifyLink, email_sent: emailSent } });
  } catch (error) {
    console.error('Resend verify error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan server' }, { status: 500 });
  }
}


