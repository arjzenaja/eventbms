import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Simple email service simulation (in production, use real email service like SendGrid, Nodemailer, etc.)
const sendOTPEmail = async (email, name, otpCode) => {
  // In development, we'll just log the OTP
  console.log(`\n📧 EMAIL OTP SENT TO: ${email}`);
  console.log(`👤 NAME: ${name}`);
  console.log(`🔐 OTP CODE: ${otpCode}`);
  console.log(`⏰ EXPIRES IN: 10 minutes\n`);
  
  // In production, replace this with actual email service
  // Example with Nodemailer:
  /*
  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Kode OTP Verifikasi - Dolan Banyumas',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3B82F6;">Verifikasi Email Anda</h2>
        <p>Halo ${name},</p
        <p>Terima kasih telah mendaftar di Dolan Banyumas. Gunakan kode OTP berikut untuk verifikasi email Anda:</p>
        <div style="background: #F3F4F6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
          <h1 style="color: #1F2937; font-size: 32px; letter-spacing: 4px; margin: 0;">${otpCode}</h1>
        </div>
        <p style="color: #6B7280;">Kode ini berlaku selama 10 menit. Jangan bagikan kode ini kepada siapapun.</p>
        <p>Jika Anda tidak meminta kode ini, abaikan email ini.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #E5E7EB;">
        <p style="color: #9CA3AF; font-size: 14px;">© 2024 Dolan Banyumas. Semua hak dilindungi.</p>
      </div>
    `
  };
  
  return await transporter.sendMail(mailOptions);
  */
  
  return { success: true, message: 'OTP sent successfully' };
};

export async function POST(request) {
  try {
    const { email, name } = await request.json();
    
    // Validate required fields
    if (!email || !name) {
      return NextResponse.json({
        success: false,
        message: 'Email dan nama harus diisi'
      }, { status: 400 });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        message: 'Format email tidak valid'
      }, { status: 400 });
    }
    
    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiration time (10 minutes from now)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    
    // Read existing OTP data
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Initialize otp_verifications array if it doesn't exist
    if (!dbData.otp_verifications) {
      dbData.otp_verifications = [];
    }
    
    // Remove any existing OTP for this email
    dbData.otp_verifications = dbData.otp_verifications.filter(otp => otp.email !== email);
    
    // Create new OTP record
    const otpRecord = {
      id: crypto.randomUUID(),
      email,
      name,
      otp_code: otpCode,
      expires_at: expiresAt,
      created_at: new Date().toISOString(),
      attempts: 0,
      max_attempts: 3
    };
    
    // Add OTP record
    dbData.otp_verifications.push(otpRecord);
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    // Send OTP email
    try {
      await sendOTPEmail(email, name, otpCode);
    } catch (error) {
      console.error('Failed to send OTP email:', error);
      // Don't fail the request if email sending fails in development
    }
    
    return NextResponse.json({
      success: true,
      message: 'Kode OTP telah dikirim ke email Anda',
      data: {
        email,
        expires_in: 600, // 10 minutes in seconds
        otp_id: otpRecord.id
      }
    });
    
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}
