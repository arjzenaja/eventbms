import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // Read db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find village by ID
    const village = dbData.events.find(event => event.id === id && event.type === 'desa-wisata');
    
    if (!village) {
      return NextResponse.json({
        success: false,
        message: 'Desa wisata tidak ditemukan'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      village: village
    });
  } catch (error) {
    console.error('Error reading village:', error);
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
    
    // Find village by ID
    const villageIndex = dbData.events.findIndex(event => event.id === id && event.type === 'desa-wisata');
    
    if (villageIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Desa wisata tidak ditemukan'
      }, { status: 404 });
    }
    
    // Update village
    dbData.events[villageIndex] = {
      ...dbData.events[villageIndex],
      ...body,
      type: 'desa-wisata' // Ensure type remains the same
    };
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      village: dbData.events[villageIndex]
    });
  } catch (error) {
    console.error('Error updating village:', error);
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
    
    // Find village by ID
    const villageIndex = dbData.events.findIndex(event => event.id === id && event.type === 'desa-wisata');
    
    if (villageIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Desa wisata tidak ditemukan'
      }, { status: 404 });
    }
    
    // Remove village
    dbData.events.splice(villageIndex, 1);
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Desa wisata berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting village:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}
