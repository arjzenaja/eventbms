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
    // Check if database file exists
    if (!fs.existsSync(dbPath)) {
      console.error('Database file not found:', dbPath);
      return NextResponse.json({
        success: false,
        message: 'Database file not found',
        error: 'Database file does not exist'
      }, { status: 500 });
    }

    const formData = await request.formData();
    
    // Validate required fields
    const title = formData.get('title');
    const location = formData.get('location');
    
    if (!title || !location) {
      return NextResponse.json({
        success: false,
        message: 'Title dan location harus diisi',
        error: 'Missing required fields'
      }, { status: 400 });
    }
    
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    
    // Handle images
    const img_sm = formData.get('img_sm');
    const img_lg = formData.get('img_lg');
    const galleryFiles = formData.getAll('gallery[]');

    let img_sm_path = '/upcoming/img/art/1-sm.png';
    let img_lg_path = '/upcoming/img/art/1-lg.png';
    const galleryPaths = [];

    if (img_sm && img_sm instanceof File) {
      const ext = path.extname(img_sm.name) || '.jpg';
      const filename = `souvenir_sm_${Date.now()}${ext}`;
      fs.writeFileSync(path.join(uploadsDir, filename), Buffer.from(await img_sm.arrayBuffer()));
      img_sm_path = `/uploads/${filename}`;
    }
    if (img_lg && img_lg instanceof File) {
      const ext = path.extname(img_lg.name) || '.jpg';
      const filename = `souvenir_lg_${Date.now()}${ext}`;
      fs.writeFileSync(path.join(uploadsDir, filename), Buffer.from(await img_lg.arrayBuffer()));
      img_lg_path = `/uploads/${filename}`;
    }
    for (const file of galleryFiles) {
      if (file && file instanceof File) {
        const ext = path.extname(file.name) || '.jpg';
        const filename = `souvenir_gallery_${Date.now()}_${Math.random().toString(16).slice(2)}${ext}`;
        fs.writeFileSync(path.join(uploadsDir, filename), Buffer.from(await file.arrayBuffer()));
        galleryPaths.push(`/uploads/${filename}`);
      }
    }

    // Read existing data
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Initialize oleh_oleh array if it doesn't exist
    if (!dbData.oleh_oleh) {
      dbData.oleh_oleh = [];
    }

    // Create new oleh-oleh object
    const newOlehOleh = {
      id: Date.now().toString(),
      img_sm: img_sm_path,
      img_lg: img_lg_path,
      gallery: galleryPaths,
      title: title,
      location: location,
      short_description: formData.get('short_description') || '',
      description: formData.get('description') || '',
      type: formData.get('type') || 'pakaian',
      category: formData.get('category') || '',
      price_range: formData.get('price_range') || '',
      contact: formData.get('contact') || '',
      address: formData.get('address') || '',
      features: formData.get('features') ? formData.get('features').split(',') : [],
      recommended: formData.get('recommended') === 'true',
      // Field baru yang perlu ditambahkan
      manager: formData.get('manager') || '',
      phone: formData.get('phone') || '',
      whatsapp: formData.get('whatsapp') || '',
      email: formData.get('email') || '',
      website: formData.get('website') || '',
      instagram: formData.get('instagram') || '',
      coordinates: { 
        lat: formData.get('lat') || '', 
        lng: formData.get('lng') || '' 
      },
      slug: formData.get('slug') || '',
      rating: formData.get('rating') || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add to database
    dbData.oleh_oleh.push(newOlehOleh);
    
    // Write back to file
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    console.log('Created new oleh-oleh:', newOlehOleh.title);
    
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
