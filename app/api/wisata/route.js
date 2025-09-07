import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// GET all wisata
export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Get wisata from the dedicated wisata array
    const wisata = dbData.wisata || [];
    
    return NextResponse.json({
      success: true,
      wisata: wisata
    });
  } catch (error) {
    console.error('Error reading wisata:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}

// POST new wisata
export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Extract form data
    const title = formData.get('title');
    const location = formData.get('location');
    const type = formData.get('type');
    const category = formData.get('category');
    const short_description = formData.get('short_description');
    const description = formData.get('description');
    const entrance_fee = formData.get('entrance_fee');
    const manager = formData.get('manager');
    const contact = formData.get('contact');
    const address = formData.get('address');
    const recommended = formData.get('recommended') === 'true';
    
    // Validate required fields
    if (!title || !location || !type) {
      return NextResponse.json({
        success: false,
        message: 'Title, location, dan type harus diisi'
      }, { status: 400 });
    }
    
    // Handle image uploads
    const img_sm = formData.get('img_sm');
    const img_lg = formData.get('img_lg');
    
    let img_sm_path = '/placeholder.jpg';
    let img_lg_path = '/placeholder.jpg';
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Save small image
    if (img_sm && img_sm instanceof File) {
      const img_sm_ext = path.extname(img_sm.name);
      const img_sm_filename = `dest_sm_${Date.now()}${img_sm_ext}`;
      const img_sm_path_full = path.join(uploadsDir, img_sm_filename);
      
      const img_sm_buffer = Buffer.from(await img_sm.arrayBuffer());
      fs.writeFileSync(img_sm_path_full, img_sm_buffer);
      img_sm_path = `/uploads/${img_sm_filename}`;
    }
    
    // Save large image
    if (img_lg && img_lg instanceof File) {
      const img_lg_ext = path.extname(img_lg.name);
      const img_lg_filename = `dest_lg_${Date.now()}${img_lg_ext}`;
      const img_lg_path_full = path.join(uploadsDir, img_lg_filename);
      
      const img_lg_buffer = Buffer.from(await img_lg.arrayBuffer());
      fs.writeFileSync(img_lg_path_full, img_lg_buffer);
      img_lg_path = `/uploads/${img_lg_filename}`;
    }
    
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Generate new ID for wisata
    const validIds = (dbData.wisata || [])
      .map(d => {
        const parsed = parseInt(d.id);
        return isNaN(parsed) || !isFinite(parsed) ? 0 : parsed;
      })
      .filter(id => id > 0);
    
    const newId = validIds.length > 0 ? (Math.max(...validIds) + 1).toString() : "1";
    
    // Create new wisata with new structure
    const newWisata = {
      id: newId,
      img_sm: img_sm_path,
      img_lg: img_lg_path,
      title: title,
      location: location,
      short_description: short_description || '',
      description: description || '',
      type: type,
      category: category || 'Wisata',
      entrance_fee: entrance_fee || 'Gratis',
      manager: manager || '',
      contact: contact || '',
      address: address || '',
      features: ['Fasilitas Dasar'],
      recommended: recommended,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add to wisata array
    if (!dbData.wisata) {
      dbData.wisata = [];
    }
    dbData.wisata.push(newWisata);
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      wisata: newWisata,
      message: 'Wisata berhasil ditambahkan'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating wisata:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}
