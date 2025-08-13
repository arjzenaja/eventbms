import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Extract form data
    const title = formData.get('title');
    const short_description = formData.get('short_description');
    const description = formData.get('description');
    const type = formData.get('category'); // 'event-rakyat' | 'event-banyumas'
    const event_type = formData.get('event_type');
    const date = formData.get('date');
    const hour = formData.get('time');
    const end_date = formData.get('end_date');
    const end_time = formData.get('end_time');
    const location = formData.get('location');
    const organizer = formData.get('organizer');
    const poster_link = formData.get('poster_link');
    const ticket_link = formData.get('ticket_link');
    const additional_info = formData.get('additional_info');
    const recommended = formData.get('recommended') === 'true';
    
    // Parse JSON fields
    const highlights = JSON.parse(formData.get('highlights') || '[]');
    const performers = JSON.parse(formData.get('performers') || '[]');
    const pricing = JSON.parse(formData.get('pricing') || '{}');
    const facilities = JSON.parse(formData.get('facilities') || '[]');
    
    // Handle image uploads
    const img_sm = formData.get('img_sm');
    const img_lg = formData.get('img_lg');
    
    let img_sm_path = '/upcoming/img/art/1-sm.png';
    let img_lg_path = '/upcoming/img/art/1-lg.png';
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
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
    
    // Read current db.json
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Generate new ID
    let newId = 1;
    if (dbData.events && dbData.events.length > 0) {
      const validIds = dbData.events
        .map(e => parseInt(e.id))
        .filter(id => !isNaN(id) && isFinite(id));
      
      if (validIds.length > 0) {
        newId = Math.max(...validIds) + 1;
      }
    }
    
    // Create new event
    const newEvent = {
      id: newId.toString(),
      title,
      short_description,
      description,
      type,
      event_type,
      date,
      hour,
      end_date,
      end_time,
      location,
      organizer,
      highlights,
      performers,
      pricing,
      facilities,
      poster_link,
      ticket_link,
      additional_info,
      img_sm: img_sm_path,
      img_lg: img_lg_path,
      seats: [
        {
          seat: 'Regular',
          price: pricing.free ? 0 : (parseInt(pricing.normal) || 0)
        }
      ],
      organizers: [
        {
          img_avatar: '/organizers/organizer-avt-1.png',
          name: organizer || 'Admin',
          job: 'Event Manager'
        }
      ],
      recommended,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add to events array
    dbData.events.push(newEvent);
    
    // Write back to file
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Event berhasil dibuat',
      event: newEvent
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan saat membuat event'
    }, { status: 500 });
  }
}
