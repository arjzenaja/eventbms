import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to db.json
const dbPath = path.join(process.cwd(), 'db.json');

export async function GET() {
  try {
    // Read the database file
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Get penginapan data from master data section
    const penginapanItems = dbData.penginapan || [];
    
    return NextResponse.json({
      success: true,
      penginapan: penginapanItems
    });
  } catch (error) {
    console.error('Error fetching penginapan data:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat mengambil data penginapan'
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
    const type = formData.get('type') || 'hotel';
    const price_range = formData.get('price_range') || '500.000 - 1.000.000';
    const rating = formData.get('rating') || '3';
    const contact = formData.get('contact') || '';
    const address = formData.get('address') || location;
    const amenities = formData.get('amenities') || ['WiFi', 'AC', 'Kamar Mandi Dalam'];
    const recommended = formData.get('recommended') === 'true';
    
    // Validate required fields
    if (!title || !location) {
      return NextResponse.json({
        success: false,
        message: 'Title dan location harus diisi'
      }, { status: 400 });
    }
    
    // Handle image files
    const img_sm = formData.get('img_sm');
    const img_lg = formData.get('img_lg');
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    let img_sm_path = '/placeholder.jpg';
    let img_lg_path = '/placeholder.jpg';
    
    // Save small image
    if (img_sm && img_sm instanceof File) {
      const img_sm_ext = path.extname(img_sm.name);
      const img_sm_filename = `accommodation_sm_${Date.now()}${img_sm_ext}`;
      const img_sm_path_full = path.join(uploadsDir, img_sm_filename);
      
      const img_sm_buffer = Buffer.from(await img_sm.arrayBuffer());
      fs.writeFileSync(img_sm_path_full, img_sm_buffer);
      img_sm_path = `/uploads/${img_sm_filename}`;
    }
    
    // Save large image
    if (img_lg && img_lg instanceof File) {
      const img_lg_ext = path.extname(img_lg.name);
      const img_lg_filename = `accommodation_lg_${Date.now()}${img_lg_ext}`;
      const img_lg_path_full = path.join(uploadsDir, img_lg_filename);
      
      const img_lg_buffer = Buffer.from(await img_lg.arrayBuffer());
      fs.writeFileSync(img_lg_path_full, img_lg_buffer);
      img_lg_path = `/uploads/${img_lg_filename}`;
    }
    
    // Read the database file
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Initialize penginapan array if it doesn't exist
    if (!dbData.penginapan) {
      dbData.penginapan = [];
    }
    
    // Generate new ID
    const validIds = (dbData.penginapan || [])
      .map(item => {
        const parsed = parseInt(item.id);
        return isNaN(parsed) || !isFinite(parsed) ? 0 : parsed;
      })
      .filter(id => id > 0);
    
    const newId = validIds.length > 0 ? (Math.max(...validIds) + 1).toString() : "1";
    
    // Parse amenities if it's a JSON string
    let parsedAmenities = amenities;
    if (typeof amenities === 'string') {
      try {
        parsedAmenities = JSON.parse(amenities);
      } catch (e) {
        parsedAmenities = [amenities];
      }
    }
    
    // Create new penginapan item
    const newPenginapanItem = {
      id: newId,
      img_sm: img_sm_path,
      img_lg: img_lg_path,
      title: title,
      location: location,
      short_description: short_description || description?.substring(0, 100) || description,
      description: description,
      type: type,
      price_range: price_range,
      rating: rating,
      contact: contact,
      address: address,
      amenities: Array.isArray(parsedAmenities) ? parsedAmenities : [parsedAmenities],
      recommended: recommended,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add to penginapan array
    dbData.penginapan.push(newPenginapanItem);
    
    // Write back to database
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Item penginapan berhasil ditambahkan',
      penginapanItem: newPenginapanItem
    });
  } catch (error) {
    console.error('Error creating penginapan item:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat membuat item penginapan: ' + error.message
      },
      { status: 500 }
    );
  }
}
