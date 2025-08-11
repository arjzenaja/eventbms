import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Filter events by type 'biro-perjalanan'
    const travelAgencies = dbData.events.filter(event => event.type === 'biro-perjalanan');
    
    return NextResponse.json({
      success: true,
      travelAgencies: travelAgencies
    });
  } catch (error) {
    console.error('Error reading travel agencies:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Extract form data
    const title = formData.get('title');
    const short_description = formData.get('short_description');
    const description = formData.get('description');
    const location = formData.get('location');
    const type = formData.get('type');
    const office_address = formData.get('office_address');
    const pricing = formData.get('pricing');
    const gallery_link = formData.get('gallery_link');
    const additional_info = formData.get('additional_info');
    const recommended = formData.get('recommended') === 'true';
    
    // Parse JSON fields
    const services = JSON.parse(formData.get('services') || '[]');
    const facilities = JSON.parse(formData.get('facilities') || '[]');
    const contact = JSON.parse(formData.get('contact') || '{}');
    
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
      const img_sm_filename = `travel_sm_${Date.now()}${img_sm_ext}`;
      const img_sm_path_full = path.join(uploadsDir, img_sm_filename);
      
      const img_sm_buffer = Buffer.from(await img_sm.arrayBuffer());
      fs.writeFileSync(img_sm_path_full, img_sm_buffer);
      img_sm_path = `/uploads/${img_sm_filename}`;
    }
    
    // Save large image
    if (img_lg && img_lg instanceof File) {
      const img_lg_ext = path.extname(img_lg.name);
      const img_lg_filename = `travel_lg_${Date.now()}${img_lg_ext}`;
      const img_lg_path_full = path.join(uploadsDir, img_lg_filename);
      
      const img_lg_buffer = Buffer.from(await img_lg.arrayBuffer());
      fs.writeFileSync(img_lg_path_full, img_lg_buffer);
      img_lg_path = `/uploads/${img_lg_filename}`;
    }
    
    // Read db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Create new travel agency
    const newTravelAgency = {
      id: (dbData.events.length + 1).toString(),
      type: type || 'biro-perjalanan',
      title,
      short_description,
      description,
      location,
      services,
      office_address,
      contact,
      pricing,
      facilities,
      gallery_link,
      additional_info,
      img_sm: img_sm_path,
      img_lg: img_lg_path,
      recommended,
      date: new Date().toISOString().split('T')[0],
      hour: '09:00'
    };
    
    // Add to events array
    dbData.events.push(newTravelAgency);
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      travelAgency: newTravelAgency
    });
  } catch (error) {
    console.error('Error creating travel agency:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}
