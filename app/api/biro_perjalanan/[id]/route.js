import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    // Read db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find travel agency by ID
    const travelAgency = dbData.biro_perjalanan.find(item => item.id === id);
    
    if (!travelAgency) {
      return NextResponse.json({
        success: false,
        message: 'Biro perjalanan tidak ditemukan'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      biro_perjalanan: travelAgency
    });
  } catch (error) {
    console.error('Error reading travel agency:', error);
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
    
    // Find travel agency by ID
    const travelAgencyIndex = dbData.biro_perjalanan.findIndex(item => item.id === id);
    
    if (travelAgencyIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Biro perjalanan tidak ditemukan'
      }, { status: 404 });
    }
    
    // Prepare the updated data with all possible fields
    const updatedData = {
      ...dbData.biro_perjalanan[travelAgencyIndex],
      ...body,
      // Ensure all new fields are included
      gallery: body.gallery || dbData.biro_perjalanan[travelAgencyIndex].gallery || [],
      coordinates: body.coordinates || dbData.biro_perjalanan[travelAgencyIndex].coordinates || { lat: '', lng: '' },
      price_range: body.price_range || dbData.biro_perjalanan[travelAgencyIndex].price_range || '',
      features: body.features || dbData.biro_perjalanan[travelAgencyIndex].features || [],
      facilities: body.facilities || dbData.biro_perjalanan[travelAgencyIndex].facilities || [],
      manager: body.manager || dbData.biro_perjalanan[travelAgencyIndex].manager || {
        name: '',
        phone: '',
        email: '',
        whatsapp: '',
        instagram: '',
        website: '',
        position: '',
        experience: '',
        rating: '',
        availability: ''
      },
      prices: body.prices || dbData.biro_perjalanan[travelAgencyIndex].prices || [],
      opening_hours: body.opening_hours || dbData.biro_perjalanan[travelAgencyIndex].opening_hours || '',
      rating: body.rating || dbData.biro_perjalanan[travelAgencyIndex].rating || '',
      updated_at: new Date().toISOString()
    };
    
    // Update travel agency
    dbData.biro_perjalanan[travelAgencyIndex] = updatedData;
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      biro_perjalanan: updatedData
    });
  } catch (error) {
    console.error('Error updating travel agency:', error);
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
    
    // Find travel agency by ID
    const travelAgencyIndex = dbData.biro_perjalanan.findIndex(item => item.id === id);
    
    if (travelAgencyIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Biro perjalanan tidak ditemukan'
      }, { status: 404 });
    }
    
    // Remove travel agency
    dbData.biro_perjalanan.splice(travelAgencyIndex, 1);
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Biro perjalanan berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting travel agency:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}
