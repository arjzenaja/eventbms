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
    
    let img_sm_path = '/upcoming/img/food/1-sm.png';
    let img_lg_path = '/upcoming/img/food/1-lg.png';
    
    // Save small image
    if (img_sm && img_sm instanceof File) {
      const img_sm_ext = path.extname(img_sm.name);
      const img_sm_filename = `culinary_sm_${Date.now()}${img_sm_ext}`;
      const img_sm_path_full = path.join(uploadsDir, img_sm_filename);
      
      const img_sm_buffer = Buffer.from(await img_sm.arrayBuffer());
      fs.writeFileSync(img_sm_path_full, img_sm_buffer);
      img_sm_path = `/uploads/${img_sm_filename}`;
    }
    
    // Save large image
    if (img_lg && img_lg instanceof File) {
      const img_lg_ext = path.extname(img_lg.name);
      const img_lg_filename = `culinary_lg_${Date.now()}${img_lg_ext}`;
      const img_lg_path_full = path.join(uploadsDir, img_lg_filename);
      
      const img_lg_buffer = Buffer.from(await img_lg.arrayBuffer());
      fs.writeFileSync(img_lg_path_full, img_lg_buffer);
      img_lg_path = `/uploads/${img_lg_filename}`;
    }
    
    // Read the database file
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Initialize kuliner array if it doesn't exist
    if (!dbData.kuliner) {
      dbData.kuliner = [];
    }
    
    // Generate new ID
    const validIds = (dbData.kuliner || [])
      .map(item => {
        const parsed = parseInt(item.id);
        return isNaN(parsed) || !isFinite(parsed) ? 0 : parsed;
      })
      .filter(id => id > 0);
    
    const newId = validIds.length > 0 ? (Math.max(...validIds) + 1).toString() : "1";
    
    // Parse features if it's a JSON string
    let parsedFeatures = features;
    if (typeof features === 'string') {
      try {
        parsedFeatures = JSON.parse(features);
      } catch (e) {
        parsedFeatures = [features];
      }
    }
    
    // Create new kuliner item
    const newKulinerItem = {
      id: newId,
      img_sm: img_sm_path,
      img_lg: img_lg_path,
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
      features: Array.isArray(parsedFeatures) ? parsedFeatures : [parsedFeatures],
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
