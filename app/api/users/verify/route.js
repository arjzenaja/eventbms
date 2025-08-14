import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const { token } = await request.json();
    if (!token) {
      return NextResponse.json({ success: false, message: 'Token verifikasi tidak ditemukan' }, { status: 400 });
    }

    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    const users = dbData.users || [];
    const idx = users.findIndex(u => u.verify_token === token);
    if (idx === -1) {
      return NextResponse.json({ success: false, message: 'Token verifikasi tidak valid' }, { status: 400 });
    }

    const user = users[idx];
    users[idx] = {
      ...user,
      is_verified: true,
      verify_token: null,
      verified_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    dbData.users = users;
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));

    const { password: _, ...userWithoutPassword } = users[idx];
    return NextResponse.json({ success: true, message: 'Email berhasil diverifikasi', user: userWithoutPassword });
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

export async function GET(request) {
  // Optional: support GET /api/users/verify?token=...
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  if (!token) {
    return NextResponse.json({ success: false, message: 'Token verifikasi tidak ditemukan' }, { status: 400 });
  }
  return POST(new Request('', { method: 'POST', body: JSON.stringify({ token }) }));
}


