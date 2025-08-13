import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Get penginapan data from master data section
    const penginapan = dbData.penginapan || [];
    
    console.log('Found penginapan:', penginapan); // Debug log
    
    return NextResponse.json({
      success: true,
      penginapan: penginapan
    });
  } catch (error) {
    console.error('Error reading penginapan:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // Handle FormData for file uploads
    const formData = await request.formData();
    
    // Extract form data
    const title = formData.get('title');
    const type = formData.get('type') || 'hotel';
    const location = formData.get('location');
    const description = formData.get('description');
    const short_description = formData.get('short_description');
    const price = formData.get('price');
    const amenities = formData.get('amenities');
    const contact = formData.get('contact') || '';
    const address = formData.get('address') || location;
    const star_rating = parseInt(formData.get('star_rating')) || 3;
    const recommended = formData.get('recommended') === 'true';
    
    // Handle image files
    const img_sm = formData.get('img_sm');
    const img_lg = formData.get('img_lg');
    
    // Read db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Initialize penginapan array if it doesn't exist
    if (!dbData.penginapan) {
      dbData.penginapan = [];
    }
    
    // Generate new ID
    let newId = "1";
    if (dbData.penginapan.length > 0) {
      const validIds = dbData.penginapan
        .map(item => parseInt(item.id))
        .filter(id => !isNaN(id) && isFinite(id));
      
      if (validIds.length > 0) {
        newId = (Math.max(...validIds) + 1).toString();
      }
    }
    
    // Parse amenities if it's a JSON string
    let parsedAmenities = [];
    try {
      if (amenities) {
        parsedAmenities = JSON.parse(amenities);
      }
    } catch (e) {
      console.log('Amenities parsing failed, using default amenities');
      parsedAmenities = ['WiFi', 'AC', 'Parking'];
    }
    
    // Calculate price range based on input price
    const priceNum = parseInt(price) || 500000;
    const price_range = `${priceNum.toLocaleString('id-ID')} - ${(priceNum * 2).toLocaleString('id-ID')}`;
    
    // Create new penginapan
    const newPenginapan = {
      id: newId,
      img_sm: img_sm ? `/uploads/accommodation_sm_${Date.now()}.jpg` : '/upcoming/img/food/1-sm.png',
      img_lg: img_lg ? `/uploads/accommodation_lg_${Date.now()}.jpg` : '/upcoming/img/food/1-lg.png',
      title: title,
      location: location,
      short_description: short_description || description?.substring(0, 100) || description,
      description: description,
      type: type,
      price_range: price_range,
      star_rating: star_rating,
      contact: contact,
      address: address,
      amenities: parsedAmenities,
      recommended: recommended,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add to penginapan array
    dbData.penginapan.push(newPenginapan);
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Penginapan berhasil ditambahkan',
      penginapan: newPenginapan
    });
  } catch (error) {
    console.error('Error creating penginapan:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server: ' + error.message
    }, { status: 500 });
  }
}
