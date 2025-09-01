import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to db.json
const dbPath = path.join(process.cwd(), 'db.json');

export async function GET() {
  try {
    // Read the database file
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Get biro_perjalanan data from master data section
    const biroPerjalananItems = dbData.biro_perjalanan || [];
    
    return NextResponse.json({
      success: true,
      biro_perjalanan: biroPerjalananItems
    });
  } catch (error) {
    console.error('Error fetching biro_perjalanan data:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat mengambil data biro perjalanan'
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
    const type = formData.get('type') || 'biro';
    const category = formData.get('category') || 'Biro Perjalanan';
    const contact = formData.get('contact') || '';
    const address = formData.get('address') || location;
    const services = formData.get('services') || ['Paket Wisata', 'Transportasi'];
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
    const galleryFiles = formData.getAll('gallery[]');
    const latitude = formData.get('latitude') || '';
    const longitude = formData.get('longitude') || '';
    const opening_hours = formData.get('opening_hours') || '';
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    let img_sm_path = '/placeholder.jpg';
    let img_lg_path = '/placeholder.jpg';
    const galleryPaths = [];
    
    // Save small image
    if (img_sm && img_sm instanceof File) {
      const img_sm_ext = path.extname(img_sm.name);
      const img_sm_filename = `agency_sm_${Date.now()}${img_sm_ext}`;
      const img_sm_path_full = path.join(uploadsDir, img_sm_filename);
      
      const img_sm_buffer = Buffer.from(await img_sm.arrayBuffer());
      fs.writeFileSync(img_sm_path_full, img_sm_buffer);
      img_sm_path = `/uploads/${img_sm_filename}`;
    }
    
    // Save large image
    if (img_lg && img_lg instanceof File) {
      const img_lg_ext = path.extname(img_lg.name);
      const img_lg_filename = `agency_lg_${Date.now()}${img_lg_ext}`;
      const img_lg_path_full = path.join(uploadsDir, img_lg_filename);
      
      const img_lg_buffer = Buffer.from(await img_lg.arrayBuffer());
      fs.writeFileSync(img_lg_path_full, img_lg_buffer);
      img_lg_path = `/uploads/${img_lg_filename}`;
    }
    // Save gallery images
    for (const file of galleryFiles) {
      if (file && file instanceof File) {
        const ext = path.extname(file.name) || '.jpg';
        const filename = `agency_gallery_${Date.now()}_${Math.random().toString(16).slice(2)}${ext}`;
        const full = path.join(uploadsDir, filename);
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(full, buffer);
        galleryPaths.push(`/uploads/${filename}`);
      }
    }
    
    // Read the database file
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Initialize biro_perjalanan array if it doesn't exist
    if (!dbData.biro_perjalanan) {
      dbData.biro_perjalanan = [];
    }
    
    // Generate new ID
    const validIds = (dbData.biro_perjalanan || [])
      .map(item => {
        const parsed = parseInt(item.id);
        return isNaN(parsed) || !isFinite(parsed) ? 0 : parsed;
      })
      .filter(id => id > 0);
    
    const newId = validIds.length > 0 ? (Math.max(...validIds) + 1).toString() : "1";
    
    // Parse services if it's a JSON string
    let parsedServices = services;
    if (typeof services === 'string') {
      try {
        parsedServices = JSON.parse(services);
      } catch (e) {
        parsedServices = [services];
      }
    }
    
    // Create new biro_perjalanan item
    const newBiroPerjalananItem = {
      id: newId,
      img_sm: img_sm_path,
      img_lg: img_lg_path,
      title: title,
      location: location,
      short_description: short_description || description?.substring(0, 100) || description,
      description: description,
      type: type,
      category: category,
      latitude: latitude,
      longitude: longitude,
      opening_hours: opening_hours,
      contact: contact,
      address: address,
      services: Array.isArray(parsedServices) ? parsedServices : [parsedServices],
      gallery: galleryPaths,
      recommended: recommended,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add to biro_perjalanan array
    dbData.biro_perjalanan.push(newBiroPerjalananItem);
    
    // Write back to database
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Item biro perjalanan berhasil ditambahkan',
      biroPerjalananItem: newBiroPerjalananItem
    });
  } catch (error) {
    console.error('Error creating biro_perjalanan item:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat membuat item biro perjalanan: ' + error.message
      },
      { status: 500 }
    );
  }
}
