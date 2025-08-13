import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    // Read db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find souvenir by ID
    const souvenir = dbData.oleh_oleh.find(item => item.id === id);
    
    if (!souvenir) {
      return NextResponse.json({
        success: false,
        message: 'Oleh-oleh tidak ditemukan'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      oleh_oleh: souvenir
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
    const { id } = await params;
    const body = await request.json();
    
    // Read db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find souvenir by ID
    const souvenirIndex = dbData.oleh_oleh.findIndex(item => item.id === id);
    
    if (souvenirIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Oleh-oleh tidak ditemukan'
      }, { status: 404 });
    }
    
    // Update souvenir
    dbData.oleh_oleh[souvenirIndex] = {
      ...dbData.oleh_oleh[souvenirIndex],
      ...body,
      updated_at: new Date().toISOString()
    };
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      oleh_oleh: dbData.oleh_oleh[souvenirIndex]
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
    const { id } = await params;
    
    // Read db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find souvenir by ID
    const souvenirIndex = dbData.oleh_oleh.findIndex(item => item.id === id);
    
    if (souvenirIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Oleh-oleh tidak ditemukan'
      }, { status: 404 });
    }
    
    // Remove souvenir
    dbData.oleh_oleh.splice(souvenirIndex, 1);
    
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
