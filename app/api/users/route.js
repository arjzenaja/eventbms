import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// GET all users (for admin purposes)
export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    const users = dbData.users || [];
    
    // Remove passwords from response
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    return NextResponse.json({
      success: true,
      users: usersWithoutPasswords
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}

// POST new user (registration)
export async function POST(request) {
  try {
    const { name, email, password, phone, address } = await request.json();
    
    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json({
        success: false,
        message: 'Nama, email, dan password harus diisi'
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
    
    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json({
        success: false,
        message: 'Password minimal 6 karakter'
      }, { status: 400 });
    }
    
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Initialize users array if it doesn't exist
    if (!dbData.users) {
      dbData.users = [];
    }
    
    // Check if email already exists
    const existingUser = dbData.users.find(user => user.email === email);
    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: 'Email sudah terdaftar'
      }, { status: 409 });
    }
    
    // Generate new ID
    const validIds = dbData.users
      .map(user => {
        const parsed = parseInt(user.id);
        return isNaN(parsed) || !isFinite(parsed) ? 0 : parsed;
      })
      .filter(id => id > 0);
    
    const newId = validIds.length > 0 ? (Math.max(...validIds) + 1).toString() : "1";
    
    // Create new user
    const newUser = {
      id: newId,
      name,
      email,
      password, // In production, this should be hashed
      phone: phone || '',
      address: address || '',
      role: 'user',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add to users array
    dbData.users.push(newUser);
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;
    
    return NextResponse.json({
      success: true,
      message: 'Registrasi berhasil',
      user: userWithoutPassword
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}
