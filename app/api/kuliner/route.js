import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to db.json
const dbPath = path.join(process.cwd(), 'db.json');

export async function GET() {
  try {
    // Read the database file
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Get kuliner data from master data section
    const kulinerItems = dbData.kuliner || [];
    
    return NextResponse.json({
      success: true,
      kuliner: kulinerItems
    });
  } catch (error) {
    console.error('Error fetching kuliner data:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat mengambil data kuliner'
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Handle FormData for file uploads
    const formData = await request.formData();
    
    // Extract form data
    const title = formData.get('title');
    const location = formData.get('location');
    const description = formData.get('description');
    const short_description = formData.get('short_description');
    const type = formData.get('type') || 'cafe';
    const price_range = formData.get('price_range') || '25.000 - 50.000';
    const cuisine = formData.get('cuisine') || 'Indonesia';
    const opening_hours = formData.get('opening_hours') || '10:00 - 22:00';
    const contact = formData.get('contact') || '';
    const address = formData.get('address') || location;
    const features = formData.get('features') || ['Masakan Indonesia', 'Suasana Nyaman'];
    const recommended = formData.get('recommended') === 'true';
    
    // Handle image files
    const img_sm = formData.get('img_sm');
    const img_lg = formData.get('img_lg');
    
    // Read the database file
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Initialize kuliner array if it doesn't exist
    if (!dbData.kuliner) {
      dbData.kuliner = [];
    }
    
    // Generate new ID - Fixed syntax
    let newId = "1";
    if (dbData.kuliner.length > 0) {
      const validIds = dbData.kuliner
        .map(item => parseInt(item.id))
        .filter(id => !isNaN(id) && isFinite(id));
      
      if (validIds.length > 0) {
        newId = (Math.max(...validIds) + 1).toString();
      }
    }
    
    // Create new kuliner item
    const newKulinerItem = {
      id: newId,
      img_sm: img_sm ? `/uploads/culinary_sm_${Date.now()}.jpg` : '/upcoming/img/food/1-sm.png',
      img_lg: img_lg ? `/uploads/culinary_lg_${Date.now()}.jpg` : '/upcoming/img/food/1-lg.png',
      title: title,
      location: location,
      short_description: short_description || description?.substring(0, 100) || description,
      description: description,
      type: type,
      price_range: price_range,
      cuisine: cuisine,
      opening_hours: opening_hours,
      contact: contact,
      address: address,
      features: Array.isArray(features) ? features : [features],
      recommended: recommended,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add to kuliner array
    dbData.kuliner.push(newKulinerItem);
    
    // Write back to database
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Item kuliner berhasil ditambahkan',
      kulinerItem: newKulinerItem
    });
  } catch (error) {
    console.error('Error creating kuliner item:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat membuat item kuliner: ' + error.message
      },
      { status: 500 }
    );
  }
}
