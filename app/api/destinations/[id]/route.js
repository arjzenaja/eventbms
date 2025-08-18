import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// GET destination by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Get wisata from the dedicated wisata array
    const wisata = dbData.wisata || [];
    
    // Find destination by ID
    const destination = wisata.find(dest => dest.id === id);
    
    if (!destination) {
      return NextResponse.json({
        success: false,
        message: 'Destinasi tidak ditemukan'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      destination: destination
    });
  } catch (error) {
    console.error('Error reading destination:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}

// PUT update destination
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find destination by ID
    const destinationIndex = dbData.wisata.findIndex(dest => dest.id === id);
    
    if (destinationIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Destinasi tidak ditemukan'
      }, { status: 404 });
    }
    
    // Extract form data
    const title = formData.get('title');
    const location = formData.get('location');
    const type = formData.get('type');
    const category = formData.get('category');
    const short_description = formData.get('short_description');
    const description = formData.get('description');
    const entrance_fee = formData.get('entrance_fee');
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
    
    let img_sm_path = dbData.wisata[destinationIndex].img_sm;
    let img_lg_path = dbData.wisata[destinationIndex].img_lg;
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Save small image if new one is provided
    if (img_sm && img_sm instanceof File) {
      const img_sm_ext = path.extname(img_sm.name);
      const img_sm_filename = `dest_sm_${Date.now()}${img_sm_ext}`;
      const img_sm_path_full = path.join(uploadsDir, img_sm_filename);
      
      const img_sm_buffer = Buffer.from(await img_sm.arrayBuffer());
      fs.writeFileSync(img_sm_path_full, img_sm_buffer);
      img_sm_path = `/uploads/${img_sm_filename}`;
    }
    
    // Save large image if new one is provided
    if (img_lg && img_lg instanceof File) {
      const img_lg_ext = path.extname(img_lg.name);
      const img_lg_filename = `dest_lg_${Date.now()}${img_lg_ext}`;
      const img_lg_path_full = path.join(uploadsDir, img_lg_filename);
      
      const img_lg_buffer = Buffer.from(await img_lg.arrayBuffer());
      fs.writeFileSync(img_lg_path_full, img_lg_buffer);
      img_lg_path = `/uploads/${img_lg_filename}`;
    }
    
    // Update destination
    const updatedDestination = {
      ...dbData.wisata[destinationIndex],
      img_sm: img_sm_path,
      img_lg: img_lg_path,
      title: title,
      location: location,
      short_description: short_description || '',
      description: description || '',
      type: type,
      category: category || 'Wisata',
      entrance_fee: entrance_fee || 'Gratis',
      contact: contact || '',
      address: address || '',
      recommended: recommended,
      updated_at: new Date().toISOString()
    };
    
    dbData.wisata[destinationIndex] = updatedDestination;
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      destination: updatedDestination,
      message: 'Destinasi berhasil diperbarui'
    });
    
  } catch (error) {
    console.error('Error updating destination:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}

// DELETE destination
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find destination by ID
    const destinationIndex = dbData.wisata.findIndex(dest => dest.id === id);
    
    if (destinationIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Destinasi tidak ditemukan'
      }, { status: 404 });
    }
    
    // Remove destination
    dbData.wisata.splice(destinationIndex, 1);
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Destinasi berhasil dihapus'
    });
    
  } catch (error) {
    console.error('Error deleting destination:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}
