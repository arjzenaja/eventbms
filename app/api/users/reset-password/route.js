import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const { email, newPassword, otp } = await request.json();

    if (!email || !newPassword || !otp) {
      return NextResponse.json({ success: false, message: 'Email, OTP, dan password baru wajib diisi' }, { status: 400 });
    }

    const dbPath = path.join(process.cwd(), 'db.json');
    const dbRaw = fs.readFileSync(dbPath, 'utf8');
    const db = JSON.parse(dbRaw);

    if (!Array.isArray(db.users)) {
      return NextResponse.json({ success: false, message: 'Data pengguna tidak tersedia' }, { status: 500 });
    }

    const idx = db.users.findIndex((u) => u.email === email);
    if (idx === -1) {
      return NextResponse.json({ success: false, message: 'Email tidak terdaftar' }, { status: 404 });
    }
    const user = db.users[idx];
    if (!user.reset_otp || !user.reset_otp_expires) {
      return NextResponse.json({ success: false, message: 'OTP tidak ditemukan. Minta OTP ulang.' }, { status: 400 });
    }
    const now = Date.now();
    if (now > user.reset_otp_expires) {
      return NextResponse.json({ success: false, message: 'OTP kedaluwarsa. Minta OTP ulang.' }, { status: 400 });
    }
    if (String(otp) !== String(user.reset_otp)) {
      return NextResponse.json({ success: false, message: 'OTP tidak valid' }, { status: 400 });
    }

    db.users[idx].password = newPassword;
    db.users[idx].updated_at = new Date().toISOString();
    delete db.users[idx].reset_otp;
    delete db.users[idx].reset_otp_expires;

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');

    return NextResponse.json({ success: true, message: 'Password berhasil diperbarui' });
  } catch (error) {
    console.error('Reset password API error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan server' }, { status: 500 });
  }
}


