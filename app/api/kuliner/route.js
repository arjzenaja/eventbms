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
    const features = formData.get('features');
    const recommended = formData.get('recommended') === 'true';
    
    // Field tambahan
    const manager = formData.get('manager') || '';
    const phone = formData.get('phone') || '';
    const whatsapp = formData.get('whatsapp') || '';
    const email = formData.get('email') || '';
    const website = formData.get('website') || '';
    const menu = formData.get('menu') || [];
    const category = formData.get('category') || 'Kuliner';
    const lat = formData.get('lat') || '';
    const lng = formData.get('lng') || '';
    
    // Field baru yang perlu ditambahkan
    const rating = formData.get('rating') || '';
    const instagram = formData.get('instagram') || '';
    const slug = formData.get('slug') || '';
    const halal_status = formData.get('halal_status') === 'true';
    const delivery_available = formData.get('delivery_available') === 'true';
    const reservation_available = formData.get('reservation_available') === 'true';
    
    // Handle image files
    const img_sm = formData.get('img_sm');
    const img_lg = formData.get('img_lg');
    const galleryFiles = formData.getAll('gallery[]');

    // Prepare uploads directory
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    let img_sm_path = '/upcoming/img/food/1-sm.png';
    let img_lg_path = '/upcoming/img/food/1-lg.png';
    const galleryPaths = [];

    // Save small image
    if (img_sm && img_sm instanceof File) {
      const ext = path.extname(img_sm.name) || '.jpg';
      const filename = `culinary_sm_${Date.now()}${ext}`;
      const full = path.join(uploadsDir, filename);
      const buffer = Buffer.from(await img_sm.arrayBuffer());
      fs.writeFileSync(full, buffer);
      img_sm_path = `/uploads/${filename}`;
    }

    // Save large image
    if (img_lg && img_lg instanceof File) {
      const ext = path.extname(img_lg.name) || '.jpg';
      const filename = `culinary_lg_${Date.now()}${ext}`;
      const full = path.join(uploadsDir, filename);
      const buffer = Buffer.from(await img_lg.arrayBuffer());
      fs.writeFileSync(full, buffer);
      img_lg_path = `/uploads/${filename}`;
    }

    // Save gallery images
    for (const file of galleryFiles) {
      if (file && file instanceof File) {
        const ext = path.extname(file.name) || '.jpg';
        const filename = `culinary_gallery_${Date.now()}_${Math.random().toString(16).slice(2)}${ext}`;
        const full = path.join(uploadsDir, filename);
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(full, buffer);
        galleryPaths.push(`/uploads/${filename}`);
      }
    }
    
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
      img_sm: img_sm_path,
      img_lg: img_lg_path,
      gallery: galleryPaths,
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
      features: features ? (Array.isArray(features) ? features : [features]) : ['Masakan Indonesia', 'Suasana Nyaman'],
      recommended: recommended,
      // Field tambahan
      manager: manager,
      phone: phone,
      whatsapp: whatsapp,
      email: email,
      website: website,
      menu: Array.isArray(menu) ? menu : [menu],
      category: category,
      // Field baru yang perlu ditambahkan
      rating: rating,
      instagram: instagram,
      slug: slug,
      coordinates: { lat: lat, lng: lng },
      halal_status: halal_status,
      delivery_available: delivery_available,
      reservation_available: reservation_available,
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
