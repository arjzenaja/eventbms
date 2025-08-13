import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    // Read db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find desa wisata by ID
    const desaWisata = dbData.desa_wisata.find(item => item.id === id);
    
    if (!desaWisata) {
      return NextResponse.json({
        success: false,
        message: 'Desa wisata tidak ditemukan'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      desa_wisata: desaWisata
    });
  } catch (error) {
    console.error('Error reading desa wisata:', error);
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
    
    // Find desa wisata by ID
    const desaWisataIndex = dbData.desa_wisata.findIndex(item => item.id === id);
    
    if (desaWisataIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Desa wisata tidak ditemukan'
      }, { status: 404 });
    }
    
    // Update desa wisata
    dbData.desa_wisata[desaWisataIndex] = {
      ...dbData.desa_wisata[desaWisataIndex],
      ...body,
      updated_at: new Date().toISOString()
    };
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      desa_wisata: dbData.desa_wisata[desaWisataIndex]
    });
  } catch (error) {
    console.error('Error updating desa wisata:', error);
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
    
    // Find desa wisata by ID
    const desaWisataIndex = dbData.desa_wisata.findIndex(item => item.id === id);
    
    if (desaWisataIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Desa wisata tidak ditemukan'
      }, { status: 404 });
    }
    
    // Remove desa wisata
    dbData.desa_wisata.splice(desaWisataIndex, 1);
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Desa wisata berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting desa wisata:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}
