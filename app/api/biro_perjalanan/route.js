import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db.json');

export async function GET() {
  try {
    // Read the database file
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Get biro perjalanan data
    const biroPerjalanan = dbData.biro_perjalanan || [];
    
    return NextResponse.json({
      success: true,
      biro_perjalanan: biroPerjalanan,
      message: 'Biro perjalanan data retrieved successfully'
    });
  } catch (error) {
    console.error('Error reading biro perjalanan data:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve biro perjalanan data',
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Read existing data
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Create new biro perjalanan object
    const newBiroPerjalanan = {
      id: Date.now().toString(),
      img_sm: formData.get('img_sm') || '/organizers/organizer-avt-1.png',
      img_lg: formData.get('img_lg') || '/organizers/organizer-avt-1.png',
      title: formData.get('title') || '',
      location: formData.get('location') || '',
      short_description: formData.get('short_description') || '',
      description: formData.get('description') || '',
      type: formData.get('type') || 'biro perjalanan',
      category: formData.get('category') || '',
      contact: formData.get('contact') || '',
      address: formData.get('address') || '',
      services: formData.get('services') ? formData.get('services').split(',') : [],
      recommended: formData.get('recommended') === 'true',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add to database
    if (!dbData.biro_perjalanan) {
      dbData.biro_perjalanan = [];
    }
    dbData.biro_perjalanan.push(newBiroPerjalanan);
    
    // Write back to file
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      biroPerjalanan: newBiroPerjalanan,
      message: 'Biro perjalanan created successfully'
    });
  } catch (error) {
    console.error('Error creating biro perjalanan:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create biro perjalanan',
      error: error.message
    }, { status: 500 });
  }
}
