import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: 'Email dan password harus diisi'
      }, { status: 400 });
    }
    
    // Read db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find user with matching credentials
    const user = dbData.users?.find(
      user => user.email === email && user.password === password && user.is_active
    );
    
    if (user) {
      // Remove password from response for security
      const { password: _, ...userData } = user;
      
      if (userData.is_verified === false) {
        return NextResponse.json({
          success: false,
          requires_verification: true,
          message: 'Akun Anda belum terverifikasi. Silakan cek email untuk verifikasi.'
        }, { status: 403 });
      }

      return NextResponse.json({
        success: true,
        message: 'Login berhasil',
        user: userData
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Email atau password salah'
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}
