import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // Read db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find souvenir by ID
    const souvenir = dbData.events.find(event => event.id === id && event.type === 'oleh-oleh');
    
    if (!souvenir) {
      return NextResponse.json({
        success: false,
        message: 'Oleh-oleh tidak ditemukan'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      souvenir: souvenir
    });
  } catch (error) {
    console.error('Error reading souvenir:', error);
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
    
    // Find souvenir by ID
    const souvenirIndex = dbData.events.findIndex(event => event.id === id && event.type === 'oleh-oleh');
    
    if (souvenirIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Oleh-oleh tidak ditemukan'
      }, { status: 404 });
    }
    
    // Update souvenir
    dbData.events[souvenirIndex] = {
      ...dbData.events[souvenirIndex],
      ...body,
      type: 'oleh-oleh' // Ensure type remains the same
    };
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      souvenir: dbData.events[souvenirIndex]
    });
  } catch (error) {
    console.error('Error updating souvenir:', error);
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
    
    // Find souvenir by ID
    const souvenirIndex = dbData.events.findIndex(event => event.id === id && event.type === 'oleh-oleh');
    
    if (souvenirIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Oleh-oleh tidak ditemukan'
      }, { status: 404 });
    }
    
    // Remove souvenir
    dbData.events.splice(souvenirIndex, 1);
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Oleh-oleh berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting souvenir:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}
