import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// GET user by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    const user = dbData.users?.find(user => user.id === id);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User tidak ditemukan'
      }, { status: 404 });
    }
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      success: true,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}

// PUT update user
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { name, email, phone, address } = await request.json();
    
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    const userIndex = dbData.users?.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'User tidak ditemukan'
      }, { status: 404 });
    }
    
    // Update user data
    dbData.users[userIndex] = {
      ...dbData.users[userIndex],
      name: name || dbData.users[userIndex].name,
      email: email || dbData.users[userIndex].email,
      phone: phone || dbData.users[userIndex].phone,
      address: address || dbData.users[userIndex].address,
      updated_at: new Date().toISOString()
    };
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = dbData.users[userIndex];
    
    return NextResponse.json({
      success: true,
      message: 'Profile berhasil diperbarui',
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}
