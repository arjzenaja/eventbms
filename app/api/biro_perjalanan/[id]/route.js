import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    // Read db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find travel agency by ID
    const travelAgency = dbData.biro_perjalanan.find(item => item.id === id);
    
    if (!travelAgency) {
      return NextResponse.json({
        success: false,
        message: 'Biro perjalanan tidak ditemukan'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      biro_perjalanan: travelAgency
    });
  } catch (error) {
    console.error('Error reading travel agency:', error);
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

    const travelAgencyIndex = dbData.biro_perjalanan.findIndex(item => item.id === id);
    if (travelAgencyIndex === -1) {
      return NextResponse.json({ success: false, message: 'Biro perjalanan tidak ditemukan' }, { status: 404 });
    }

    const contentType = request.headers.get('content-type') || '';

    let updatedData = dbData.biro_perjalanan[travelAgencyIndex];

    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData();

      // Uploads dir
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

      // Single images
      const imgSm = form.get('img_sm');
      const imgLg = form.get('img_lg');
      if (imgSm && imgSm instanceof File) {
        const ext = path.extname(imgSm.name) || '.jpg';
        const filename = `agency_sm_${Date.now()}${ext}`;
        fs.writeFileSync(path.join(uploadsDir, filename), Buffer.from(await imgSm.arrayBuffer()));
        updatedData.img_sm = `/uploads/${filename}`;
      }
      if (imgLg && imgLg instanceof File) {
        const ext = path.extname(imgLg.name) || '.jpg';
        const filename = `agency_lg_${Date.now()}${ext}`;
        fs.writeFileSync(path.join(uploadsDir, filename), Buffer.from(await imgLg.arrayBuffer()));
        updatedData.img_lg = `/uploads/${filename}`;
      }

      // Gallery files
      const galleryFiles = form.getAll('gallery[]');
      if (galleryFiles && galleryFiles.length) {
        const galleryPaths = [];
        for (const file of galleryFiles) {
          if (file && file instanceof File) {
            const ext = path.extname(file.name) || '.jpg';
            const filename = `agency_gallery_${Date.now()}_${Math.random().toString(16).slice(2)}${ext}`;
            fs.writeFileSync(path.join(uploadsDir, filename), Buffer.from(await file.arrayBuffer()));
            galleryPaths.push(`/uploads/${filename}`);
          }
        }
        updatedData.gallery = [...(updatedData.gallery || []), ...galleryPaths];
      }

      // Plain fields
      const get = (k) => form.get(k);
      updatedData = {
        ...updatedData,
        title: get('title') ?? updatedData.title,
        type: get('type') ?? updatedData.type,
        location: get('location') ?? updatedData.location,
        category: get('category') ?? updatedData.category,
        short_description: get('short_description') ?? updatedData.short_description,
        description: get('description') ?? updatedData.description,
        contact: get('contact') ?? updatedData.contact,
        address: get('address') ?? updatedData.address,
        price_range: get('price_range') ?? updatedData.price_range,
        opening_hours: get('opening_hours') ?? updatedData.opening_hours,
        rating: get('rating') ?? updatedData.rating,
        coordinates: { lat: get('lat') ?? (updatedData.coordinates?.lat || ''), lng: get('lng') ?? (updatedData.coordinates?.lng || '') },
        services: get('services') ? JSON.parse(get('services')) : (updatedData.services || []),
        facilities: get('facilities') ? JSON.parse(get('facilities')) : (updatedData.facilities || []),
        features: get('features') ? JSON.parse(get('features')) : (updatedData.features || []),
        manager: get('manager') ? JSON.parse(get('manager')) : (updatedData.manager || {}),
        prices: get('prices') ? JSON.parse(get('prices')) : (updatedData.prices || []),
        updated_at: new Date().toISOString()
      };
    } else {
      const body = await request.json();
      updatedData = {
        ...updatedData,
        ...body,
        gallery: body.gallery || updatedData.gallery || [],
        coordinates: body.coordinates || updatedData.coordinates || { lat: '', lng: '' },
        price_range: body.price_range || updatedData.price_range || '',
        features: body.features || updatedData.features || [],
        facilities: body.facilities || updatedData.facilities || [],
        manager: body.manager || updatedData.manager || {},
        prices: body.prices || updatedData.prices || [],
        opening_hours: body.opening_hours || updatedData.opening_hours || '',
        rating: body.rating || updatedData.rating || '',
        updated_at: new Date().toISOString()
      };
    }

    dbData.biro_perjalanan[travelAgencyIndex] = updatedData;
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));

    return NextResponse.json({ success: true, biro_perjalanan: updatedData });
  } catch (error) {
    console.error('Error updating travel agency:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    // Read db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find travel agency by ID
    const travelAgencyIndex = dbData.biro_perjalanan.findIndex(item => item.id === id);
    
    if (travelAgencyIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Biro perjalanan tidak ditemukan'
      }, { status: 404 });
    }
    
    // Remove travel agency
    dbData.biro_perjalanan.splice(travelAgencyIndex, 1);
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Biro perjalanan berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting travel agency:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}
