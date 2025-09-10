import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    // Read db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find souvenir by ID
    const souvenir = dbData.oleh_oleh.find(item => item.id === id);
    
    if (!souvenir) {
      return NextResponse.json({
        success: false,
        message: 'Oleh-oleh tidak ditemukan'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      oleh_oleh: souvenir
    });
  } catch (error) {
    console.error('Error reading souvenir:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    const souvenirIndex = dbData.oleh_oleh.findIndex(item => item.id === id);
    if (souvenirIndex === -1) {
      return NextResponse.json({ success: false, message: 'Oleh-oleh tidak ditemukan' }, { status: 404 });
    }

    const contentType = request.headers.get('content-type') || '';

    // Support both JSON and multipart/form-data updates
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();

      // Prepare uploads dir
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

      // Existing record
      const current = dbData.oleh_oleh[souvenirIndex];

      // Optional single images
      let img_sm_path = current.img_sm;
      let img_lg_path = current.img_lg;

      const img_sm = formData.get('img_sm');
      const img_lg = formData.get('img_lg');

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

      // Optional gallery additions
      const galleryFiles = formData.getAll('gallery[]');
      const galleryPaths = [];
      for (const file of galleryFiles) {
        if (file && file instanceof File) {
          const ext = path.extname(file.name) || '.jpg';
          const filename = `souvenir_gallery_${Date.now()}_${Math.random().toString(16).slice(2)}${ext}`;
          fs.writeFileSync(path.join(uploadsDir, filename), Buffer.from(await file.arrayBuffer()));
          galleryPaths.push(`/uploads/${filename}`);
        }
      }

      // Build update payload from fields
      const toBool = (v) => (typeof v === 'string' ? v === 'true' : Boolean(v));

      const updated = {
        ...current,
        title: formData.get('title') ?? current.title,
        location: formData.get('location') ?? current.location,
        short_description: formData.get('short_description') ?? current.short_description,
        description: formData.get('description') ?? current.description,
        type: formData.get('type') ?? current.type,
        category: formData.get('category') ?? current.category,
        price_range: formData.get('price_range') ?? current.price_range,
        contact: formData.get('contact') ?? current.contact,
        address: formData.get('address') ?? current.address,
        features: formData.get('features') ? String(formData.get('features')).split(',') : (current.features || []),
        recommended: formData.has('recommended') ? toBool(formData.get('recommended')) : current.recommended,
        manager: formData.get('manager') ?? current.manager,
        phone: formData.get('phone') ?? current.phone,
        whatsapp: formData.get('whatsapp') ?? current.whatsapp,
        email: formData.get('email') ?? current.email,
        website: formData.get('website') ?? current.website,
        instagram: formData.get('instagram') ?? current.instagram,
        coordinates: {
          lat: formData.get('lat') ?? (current.coordinates?.lat || ''),
          lng: formData.get('lng') ?? (current.coordinates?.lng || '')
        },
        slug: formData.get('slug') ?? current.slug,
        rating: formData.get('rating') ?? current.rating,
        img_sm: img_sm_path,
        img_lg: img_lg_path,
        gallery: galleryPaths.length > 0 ? [...(current.gallery || []), ...galleryPaths] : (current.gallery || []),
        updated_at: new Date().toISOString()
      };

      dbData.oleh_oleh[souvenirIndex] = updated;
      fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
      return NextResponse.json({ success: true, oleh_oleh: updated });
    } else {
      // JSON body fallback
      const body = await request.json();
      dbData.oleh_oleh[souvenirIndex] = {
        ...dbData.oleh_oleh[souvenirIndex],
        ...body,
        updated_at: new Date().toISOString()
      };
      fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
      return NextResponse.json({ success: true, oleh_oleh: dbData.oleh_oleh[souvenirIndex] });
    }
  } catch (error) {
    console.error('Error updating souvenir:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    // Read db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find souvenir by ID
    const souvenirIndex = dbData.oleh_oleh.findIndex(item => item.id === id);
    
    if (souvenirIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Oleh-oleh tidak ditemukan'
      }, { status: 404 });
    }
    
    // Remove souvenir
    dbData.oleh_oleh.splice(souvenirIndex, 1);
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Oleh-oleh berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting souvenir:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}
