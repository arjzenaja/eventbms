import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // Read db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find accommodation by ID
    const accommodation = dbData.penginapan.find(item => item.id === id);
    
    if (!accommodation) {
      return NextResponse.json({
        success: false,
        message: 'Akomodasi tidak ditemukan'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      penginapan: accommodation
    });
  } catch (error) {
    console.error('Error reading accommodation:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Read db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find accommodation by ID
    const accommodationIndex = dbData.penginapan.findIndex(item => item.id === id);
    
    if (accommodationIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Akomodasi tidak ditemukan'
      }, { status: 404 });
    }
    
    // Update accommodation
    dbData.penginapan[accommodationIndex] = {
      ...dbData.penginapan[accommodationIndex],
      ...body,
      updated_at: new Date().toISOString()
    };
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      penginapan: dbData.penginapan[accommodationIndex]
    });
  } catch (error) {
    console.error('Error updating accommodation:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // Read db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find accommodation by ID
    const accommodationIndex = dbData.penginapan.findIndex(item => item.id === id);
    
    if (accommodationIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Akomodasi tidak ditemukan'
      }, { status: 404 });
    }
    
    // Remove accommodation
    dbData.penginapan.splice(accommodationIndex, 1);
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Akomodasi berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting accommodation:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}
