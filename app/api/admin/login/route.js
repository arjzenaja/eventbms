import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    // Read db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find admin with matching credentials
    const admin = dbData.admins.find(
      admin => admin.email === email && admin.password === password
    );
    
    if (admin) {
      // Remove password from response for security
      const { password: _, ...adminData } = admin;
      
      return NextResponse.json({
        success: true,
        message: 'Login berhasil',
        admin: adminData
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
