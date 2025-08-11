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
    const accommodation = dbData.events.find(event => event.id === id && event.type === 'akomodasi');
    
    if (!accommodation) {
      return NextResponse.json({
        success: false,
        message: 'Akomodasi tidak ditemukan'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      accommodation: accommodation
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
    const accommodationIndex = dbData.events.findIndex(event => event.id === id && event.type === 'akomodasi');
    
    if (accommodationIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Akomodasi tidak ditemukan'
      }, { status: 404 });
    }
    
    // Update accommodation
    dbData.events[accommodationIndex] = {
      ...dbData.events[accommodationIndex],
      ...body,
      type: 'akomodasi' // Ensure type remains the same
    };
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      accommodation: dbData.events[accommodationIndex]
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
    const accommodationIndex = dbData.events.findIndex(event => event.id === id && event.type === 'akomodasi');
    
    if (accommodationIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Akomodasi tidak ditemukan'
      }, { status: 404 });
    }
    
    // Remove accommodation
    dbData.events.splice(accommodationIndex, 1);
    
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
