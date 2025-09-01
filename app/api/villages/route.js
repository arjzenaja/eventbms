import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to db.json
const dbPath = path.join(process.cwd(), 'db.json');

export async function GET() {
  try {
    // Read the database file
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Get desa_wisata data from master data section
    const desaWisataItems = dbData.desa_wisata || [];
    
    return NextResponse.json({
      success: true,
      desa_wisata: desaWisataItems
    });
  } catch (error) {
    console.error('Error fetching desa_wisata data:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat mengambil data desa wisata'
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
    const type = formData.get('type') || 'desa';
    const category = formData.get('category') || 'Desa Wisata';
    const contact = formData.get('contact') || '';
    const address = formData.get('address') || location;
    const features = formData.get('features') || ['Budaya Lokal', 'Akomodasi Homestay'];
    const packages = formData.get('packages') || '';
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
      const img_sm_filename = `village_sm_${Date.now()}${img_sm_ext}`;
      const img_sm_path_full = path.join(uploadsDir, img_sm_filename);
      
      const img_sm_buffer = Buffer.from(await img_sm.arrayBuffer());
      fs.writeFileSync(img_sm_path_full, img_sm_buffer);
      img_sm_path = `/uploads/${img_sm_filename}`;
    }
    
    // Save large image
    if (img_lg && img_lg instanceof File) {
      const img_lg_ext = path.extname(img_lg.name);
      const img_lg_filename = `village_lg_${Date.now()}${img_lg_ext}`;
      const img_lg_path_full = path.join(uploadsDir, img_lg_filename);
      
      const img_lg_buffer = Buffer.from(await img_lg.arrayBuffer());
      fs.writeFileSync(img_lg_path_full, img_lg_buffer);
      img_lg_path = `/uploads/${img_lg_filename}`;
    }
    // Save gallery images
    for (const file of galleryFiles) {
      if (file && file instanceof File) {
        const ext = path.extname(file.name) || '.jpg';
        const filename = `village_gallery_${Date.now()}_${Math.random().toString(16).slice(2)}${ext}`;
        const full = path.join(uploadsDir, filename);
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(full, buffer);
        galleryPaths.push(`/uploads/${filename}`);
      }
    }
    
    // Read the database file
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Initialize desa_wisata array if it doesn't exist
    if (!dbData.desa_wisata) {
      dbData.desa_wisata = [];
    }
    
    // Generate new ID
    const validIds = (dbData.desa_wisata || [])
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

    // Normalize packages: accept JSON array of objects or multiline string
    let parsedPackages = [];
    if (Array.isArray(packages)) {
      parsedPackages = packages.filter(Boolean);
    } else if (typeof packages === 'string') {
      const trimmed = packages.trim();
      if (trimmed.startsWith('[')) {
        try {
          const json = JSON.parse(trimmed);
          if (Array.isArray(json)) parsedPackages = json;
        } catch {}
      }
      if (parsedPackages.length === 0) {
        parsedPackages = trimmed
          .split(/\r?\n/)
          .map(s => s.trim())
          .filter(Boolean);
      }
    }
    
    // Create new desa_wisata item
    const newDesaWisataItem = {
      id: newId,
      img_sm: img_sm_path,
      img_lg: img_lg_path,
      gallery: galleryPaths,
      title: title,
      location: location,
      short_description: short_description || description?.substring(0, 100) || description,
      description: description,
      type: type,
      category: category,
      contact: contact,
      address: address,
      features: Array.isArray(parsedFeatures) ? parsedFeatures : [parsedFeatures],
      packages: parsedPackages,
      recommended: recommended,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add to desa_wisata array
    dbData.desa_wisata.push(newDesaWisataItem);
    
    // Write back to database
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Item desa wisata berhasil ditambahkan',
      desaWisataItem: newDesaWisataItem
    });
  } catch (error) {
    console.error('Error creating desa_wisata item:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat membuat item desa wisata: ' + error.message
      },
      { status: 500 }
    );
  }
}
