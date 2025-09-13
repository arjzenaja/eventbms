import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const { email, otp_code, otp_id } = await request.json();
    
    // Validate required fields
    if (!email || !otp_code) {
      return NextResponse.json({
        success: false,
        message: 'Email dan kode OTP harus diisi'
      }, { status: 400 });
    }
    
    // Validate OTP format (6 digits)
    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(otp_code)) {
      return NextResponse.json({
        success: false,
        message: 'Kode OTP harus berupa 6 digit angka'
      }, { status: 400 });
    }
    
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find OTP record
    const otpRecord = dbData.otp_verifications?.find(otp => 
      otp.email === email && 
      (otp_id ? otp.id === otp_id : true) &&
      otp.otp_code === otp_code
    );
    
    if (!otpRecord) {
      return NextResponse.json({
        success: false,
        message: 'Kode OTP tidak valid'
      }, { status: 400 });
    }
    
    // Check if OTP is expired
    const now = new Date();
    const expiresAt = new Date(otpRecord.expires_at);
    
    if (now > expiresAt) {
      // Remove expired OTP
      dbData.otp_verifications = dbData.otp_verifications.filter(otp => otp.id !== otpRecord.id);
      fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
      
      return NextResponse.json({
        success: false,
        message: 'Kode OTP telah kedaluwarsa. Silakan minta kode baru'
      }, { status: 400 });
    }
    
    // Check attempt limit
    if (otpRecord.attempts >= otpRecord.max_attempts) {
      // Remove OTP after max attempts
      dbData.otp_verifications = dbData.otp_verifications.filter(otp => otp.id !== otpRecord.id);
      fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
      
      return NextResponse.json({
        success: false,
        message: 'Terlalu banyak percobaan. Silakan minta kode OTP baru'
      }, { status: 400 });
    }
    
    // Increment attempts
    otpRecord.attempts += 1;
    
    // If OTP is correct, remove it and verify user
    if (otpRecord.otp_code === otp_code) {
      // Remove used OTP
      dbData.otp_verifications = dbData.otp_verifications.filter(otp => otp.id !== otpRecord.id);
      
      // Find and verify user
      const user = dbData.users?.find(u => u.email === email);
      if (user) {
        user.is_verified = true;
        user.verified_at = new Date().toISOString();
        user.updated_at = new Date().toISOString();
      }
      
      // Write back to db.json
      fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
      
      return NextResponse.json({
        success: true,
        message: 'Email berhasil diverifikasi',
        data: {
          email: user?.email,
          name: user?.name,
          is_verified: true
        }
      });
    } else {
      // Update attempts
      const otpIndex = dbData.otp_verifications.findIndex(otp => otp.id === otpRecord.id);
      if (otpIndex !== -1) {
        dbData.otp_verifications[otpIndex] = otpRecord;
        fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
      }
      
      return NextResponse.json({
        success: false,
        message: 'Kode OTP salah. Sisa percobaan: ' + (otpRecord.max_attempts - otpRecord.attempts)
      }, { status: 400 });
    }
    
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}

// GET endpoint to check OTP status
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email harus diisi'
      }, { status: 400 });
    }
    
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find active OTP for this email
    const otpRecord = dbData.otp_verifications?.find(otp => 
      otp.email === email && 
      new Date(otp.expires_at) > new Date()
    );
    
    if (!otpRecord) {
      return NextResponse.json({
        success: false,
        message: 'Tidak ada kode OTP aktif untuk email ini'
      }, { status: 404 });
    }
    
    // Calculate remaining time
    const now = new Date();
    const expiresAt = new Date(otpRecord.expires_at);
    const remainingSeconds = Math.max(0, Math.floor((expiresAt - now) / 1000));
    
    return NextResponse.json({
      success: true,
      data: {
        email: otpRecord.email,
        expires_in: remainingSeconds,
        attempts: otpRecord.attempts,
        max_attempts: otpRecord.max_attempts,
        otp_id: otpRecord.id
      }
    });
    
  } catch (error) {
    console.error('Check OTP status error:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}
