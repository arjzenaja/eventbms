import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db.json');

export async function GET() {
  try {
    // Read the database file
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Get desa_wisata data
    const desaWisata = dbData.desa_wisata || [];
    
    return NextResponse.json({
      success: true,
      desa_wisata: desaWisata,
      message: 'Desa wisata data retrieved successfully'
    });
  } catch (error) {
    console.error('Error reading desa wisata data:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve desa wisata data',
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Read existing data
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Create new desa wisata object
    const newDesaWisata = {
      id: Date.now().toString(),
      img_sm: formData.get('img_sm') || '/upcoming/img/art/1-sm.png',
      img_lg: formData.get('img_lg') || '/upcoming/img/art/1-lg.png',
      title: formData.get('title') || '',
      location: formData.get('location') || '',
      short_description: formData.get('short_description') || '',
      description: formData.get('description') || '',
      type: formData.get('type') || 'desa wisata',
      category: formData.get('category') || '',
      entrance_fee: formData.get('entrance_fee') || '',
      contact: formData.get('contact') || '',
      address: formData.get('address') || '',
      price_range: formData.get('price_range') || 'Rp 0 - Rp 50.000',
      coordinates: {
        latitude: formData.get('latitude') || '',
        longitude: formData.get('longitude') || ''
      },
      operating_hours: {
        open: formData.get('operating_hours_open') || '08:00',
        close: formData.get('operating_hours_close') || '17:00',
        days: formData.get('operating_hours_days') || 'Senin - Minggu'
      },
      facilities: formData.get('facilities') ? formData.get('facilities').split(',') : [],
      gallery: formData.get('gallery') ? formData.get('gallery').split(',') : [],
      packages: formData.get('packages') ? formData.get('packages').split(',') : [],
      activities: formData.get('activities') ? formData.get('activities').split(',') : [],
      transportation: formData.get('transportation') || '',
      accommodation: formData.get('accommodation') || '',
      weather_info: formData.get('weather_info') === 'true',
      recommended: formData.get('recommended') === 'true',
      rating: 0,
      reviews: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add to database
    if (!dbData.desa_wisata) {
      dbData.desa_wisata = [];
    }
    dbData.desa_wisata.push(newDesaWisata);
    
    // Write back to file
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      desaWisata: newDesaWisata,
      message: 'Desa wisata created successfully'
    });
  } catch (error) {
    console.error('Error creating desa wisata:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create desa wisata',
      error: error.message
    }, { status: 500 });
  }
}
