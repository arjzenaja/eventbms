import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ success: false, message: 'Email wajib diisi' }, { status: 400 });
    }

    const dbPath = path.join(process.cwd(), 'db.json');
    const dbRaw = fs.readFileSync(dbPath, 'utf8');
    const db = JSON.parse(dbRaw);

    const user = (db.users || []).find((u) => u.email === email);
    if (!user) {
      // Respond success to avoid user enumeration
      return NextResponse.json({ success: true, message: 'Jika email terdaftar, OTP telah dikirim.' });
    }

    const otp = generateOtp();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    user.reset_otp = otp;
    user.reset_otp_expires = expiresAt;

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');

    // Print OTP to server console (terminal)
    console.log(`Password reset OTP for ${email}: ${otp} (valid 5m)`);

    return NextResponse.json({ 
      success: true, 
      message: 'OTP dikirim. Cek terminal server.',
      data: {
        expires_in: 300,
        cooldown_seconds: 30
      }
    });
  } catch (error) {
    console.error('Forgot password OTP error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan server' }, { status: 500 });
  }
}


