import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db.json');

export async function GET() {
  try {
    // Read the database file
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Get oleh_oleh data
    const olehOleh = dbData.oleh_oleh || [];
    
    return NextResponse.json({
      success: true,
      oleh_oleh: olehOleh,
      message: 'Oleh-oleh data retrieved successfully'
    });
  } catch (error) {
    console.error('Error reading oleh-oleh data:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve oleh-oleh data',
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Read existing data
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Create new oleh-oleh object
    const newOlehOleh = {
      id: Date.now().toString(),
      img_sm: formData.get('img_sm') || '/upcoming/img/art/1-sm.png',
      img_lg: formData.get('img_lg') || '/upcoming/img/art/1-lg.png',
      title: formData.get('title') || '',
      location: formData.get('location') || '',
      short_description: formData.get('short_description') || '',
      description: formData.get('description') || '',
      type: formData.get('type') || 'pakaian',
      category: formData.get('category') || '',
      price_range: formData.get('price_range') || '',
      contact: formData.get('contact') || '',
      address: formData.get('address') || '',
      features: formData.get('features') ? formData.get('features').split(',') : [],
      recommended: formData.get('recommended') === 'true',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add to database
    if (!dbData.oleh_oleh) {
      dbData.oleh_oleh = [];
    }
    dbData.oleh_oleh.push(newOlehOleh);
    
    // Write back to file
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      olehOleh: newOlehOleh,
      message: 'Oleh-oleh created successfully'
    });
  } catch (error) {
    console.error('Error creating oleh-oleh:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create oleh-oleh',
      error: error.message
    }, { status: 500 });
  }
}
