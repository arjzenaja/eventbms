import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// GET all destinations
export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Filter events to only show destinations
    const destinations = dbData.events.filter(event => 
      event.type === 'wisata-alam' || 
      event.type === 'wisata-taman' || 
      event.type === 'wisata-budaya' || 
      event.type === 'wisata-sejarah' || 
      event.type === 'wisata-buatan' || 
      event.type === 'wisata-minat-khusus' || 
      event.type === 'wisata-religi'
    );
    
    return NextResponse.json({
      success: true,
      destinations: destinations
    });
  } catch (error) {
    console.error('Error reading destinations:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}

// POST new destination
export async function POST(request) {
  try {
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
    
    // Generate new ID
    const newId = (Math.max(...dbData.events.map(e => parseInt(e.id))) + 1).toString();
    
    // Create new destination
    const newDestination = {
      id: newId,
      type: type,
      img_sm: img_sm_path,
      img_lg: img_lg_path,
      title: title,
      location: location,
      short_description: short_description || '',
      description: description || '',
      manager: manager || '', // Pengelola Wisata
      seats: [
        {
          seat: "Tiket Masuk",
          price: parseInt(price) || 25000
        }
      ],
      organizers: [
        {
          img_avatar: "/organizers/organizer-avt-1.png",
          name: "Admin",
          job: "Event Manager"
        }
      ],
      recommended: recommended,
      packages: []
    };
    
    // Add to events array
    dbData.events.push(newDestination);
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      destination: newDestination,
      message: 'Destinasi berhasil ditambahkan'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating destination:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}
