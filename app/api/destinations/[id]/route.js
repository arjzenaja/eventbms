import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    // Read db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find destination by ID
    const destination = dbData.events.find(event => event.id === id && (event.type === 'wisata-alam' || event.type === 'objek-wisata' || event.type === 'desa-wisata'));
    
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

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    
    // Extract form data
    const title = formData.get('title');
    const location = formData.get('location');
    const type = formData.get('type');
    const short_description = formData.get('short_description');
    const description = formData.get('description');
    const price = formData.get('price');
    const manager = formData.get('manager'); // Pengelola Wisata
    const recommended = formData.get('recommended') === 'true';
    
    // Read db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find destination by ID
    const destinationIndex = dbData.events.findIndex(event => event.id === id && (event.type === 'wisata-alam' || event.type === 'objek-wisata' || event.type === 'desa-wisata'));
    
    if (destinationIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Destinasi tidak ditemukan'
      }, { status: 404 });
    }
    
    // Get current destination
    const currentDestination = dbData.events[destinationIndex];
    
    // Handle image uploads
    const img_sm = formData.get('img_sm');
    const img_lg = formData.get('img_lg');
    
    let img_sm_path = currentDestination.img_sm || '/placeholder.jpg';
    let img_lg_path = currentDestination.img_lg || '/placeholder.jpg';
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Save small image if new file is uploaded
    if (img_sm && img_sm instanceof File) {
      const img_sm_ext = path.extname(img_sm.name);
      const img_sm_filename = `dest_sm_${Date.now()}${img_sm_ext}`;
      const img_sm_path_full = path.join(uploadsDir, img_sm_filename);
      
      const img_sm_buffer = Buffer.from(await img_sm.arrayBuffer());
      fs.writeFileSync(img_sm_path_full, img_sm_buffer);
      img_sm_path = `/uploads/${img_sm_filename}`;
    }
    
    // Save large image if new file is uploaded
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
      ...currentDestination,
      title: title || currentDestination.title,
      location: location || currentDestination.location,
      type: type || currentDestination.type,
      short_description: short_description || currentDestination.short_description,
      description: description || currentDestination.description,
      manager: manager || currentDestination.manager || '', // Pengelola Wisata
      img_sm: img_sm_path,
      img_lg: img_lg_path,
      recommended: recommended,
      seats: [
        {
          seat: "Tiket Masuk",
          price: parseInt(price) || currentDestination.seats?.[0]?.price || 25000
        }
      ]
    };
    
    dbData.events[destinationIndex] = updatedDestination;
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      destination: updatedDestination
    });
  } catch (error) {
    console.error('Error updating destination:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    // Read db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find destination by ID
    const destinationIndex = dbData.events.findIndex(event => event.id === id && (event.type === 'wisata-alam' || event.type === 'objek-wisata' || event.type === 'desa-wisata'));
    
    if (destinationIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Destinasi tidak ditemukan'
      }, { status: 404 });
    }
    
    // Remove destination
    dbData.events.splice(destinationIndex, 1);
    
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
