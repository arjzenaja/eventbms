import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to db.json
const dbPath = path.join(process.cwd(), 'db.json');

export async function GET() {
  try {
    // Read the database file
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Get events data from master data section
    const eventsItems = dbData.events || [];
    
    return NextResponse.json({
      success: true,
      events: eventsItems
    });
  } catch (error) {
    console.error('Error fetching events data:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat mengambil data events'
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
    const type = formData.get('type') || 'festival';
    const category = formData.get('category') || 'Events';
    const date = formData.get('date') || new Date().toISOString().split('T')[0];
    const time = formData.get('time') || '19:00';
    const contact = formData.get('contact') || '';
    const address = formData.get('address') || location;
    const features = formData.get('features') || ['Hiburan', 'Makanan'];
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
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    let img_sm_path = '/placeholder.jpg';
    let img_lg_path = '/placeholder.jpg';
    
    // Save small image
    if (img_sm && img_sm instanceof File) {
      const img_sm_ext = path.extname(img_sm.name);
      const img_sm_filename = `event_sm_${Date.now()}${img_sm_ext}`;
      const img_sm_path_full = path.join(uploadsDir, img_sm_filename);
      
      const img_sm_buffer = Buffer.from(await img_sm.arrayBuffer());
      fs.writeFileSync(img_sm_path_full, img_sm_buffer);
      img_sm_path = `/uploads/${img_sm_filename}`;
    }
    
    // Save large image
    if (img_lg && img_lg instanceof File) {
      const img_lg_ext = path.extname(img_lg.name);
      const img_lg_filename = `event_lg_${Date.now()}${img_lg_ext}`;
      const img_lg_path_full = path.join(uploadsDir, img_lg_filename);
      
      const img_lg_buffer = Buffer.from(await img_lg.arrayBuffer());
      fs.writeFileSync(img_lg_path_full, img_lg_buffer);
      img_lg_path = `/uploads/${img_lg_filename}`;
    }
    
    // Read the database file
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Initialize events array if it doesn't exist
    if (!dbData.events) {
      dbData.events = [];
    }
    
    // Generate new ID
    const validIds = (dbData.events || [])
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
    
    // Create new event item
    const newEventItem = {
      id: newId,
      img_sm: img_sm_path,
      img_lg: img_lg_path,
      title: title,
      location: location,
      short_description: short_description || description?.substring(0, 100) || description,
      description: description,
      type: type,
      category: category,
      date: date,
      time: time,
      contact: contact,
      address: address,
      features: Array.isArray(parsedFeatures) ? parsedFeatures : [parsedFeatures],
      recommended: recommended,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add to events array
    dbData.events.push(newEventItem);
    
    // Write back to database
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Item event berhasil ditambahkan',
      eventItem: newEventItem
    });
  } catch (error) {
    console.error('Error creating event item:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat membuat item event: ' + error.message
      },
      { status: 500 }
    );
  }
}
