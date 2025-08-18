import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    console.log('Fetching event with ID:', id);
    
    // Read db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    
    if (!fs.existsSync(dbPath)) {
      console.error('db.json file not found');
      return NextResponse.json({
        success: false,
        message: 'Database file not found'
      }, { status: 500 });
    }
    
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    console.log('Available events:', dbData.events?.length || 0);
    
    if (!dbData.events || !Array.isArray(dbData.events)) {
      console.error('Events array not found in database');
      return NextResponse.json({
        success: false,
        message: 'Events data not available'
      }, { status: 500 });
    }
    
    // Find event by ID (convert to string for comparison)
    const event = dbData.events.find(event => event.id === String(id));
    console.log('Found event:', event ? 'Yes' : 'No');
    
    if (!event) {
      console.log('Event not found for ID:', id);
      return NextResponse.json({
        success: false,
        message: 'Event tidak ditemukan'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      event: event
    });
  } catch (error) {
    console.error('Error reading event:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server: ' + error.message
    }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    
    // Handle FormData for file uploads
    const formData = await request.formData();
    
    // Extract form data
    const title = formData.get('title');
    const location = formData.get('location');
    const description = formData.get('description');
    const short_description = formData.get('short_description');
    const type = formData.get('type') || 'festival';
    const category = formData.get('category') || 'Events';
    const date = formData.get('date') || '';
    const time = formData.get('time') || '';
    const venue = formData.get('venue') || '';
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
    
    // Read the database file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find the specific item by ID
    const eventIndex = dbData.events.findIndex(event => event.id === String(id));
    
    if (eventIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: 'Event tidak ditemukan'
        },
        { status: 404 }
      );
    }
    
    const existingEvent = dbData.events[eventIndex];
    
    // Handle image files
    const img_sm = formData.get('img_sm');
    const img_lg = formData.get('img_lg');
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    let img_sm_path = existingEvent.img_sm || '/placeholder.jpg';
    let img_lg_path = existingEvent.img_lg || '/placeholder.jpg';
    
    // Save small image if provided
    if (img_sm && img_sm instanceof File) {
      const img_sm_ext = path.extname(img_sm.name);
      const img_sm_filename = `event_sm_${Date.now()}${img_sm_ext}`;
      const img_sm_path_full = path.join(uploadsDir, img_sm_filename);
      
      const img_sm_buffer = Buffer.from(await img_sm.arrayBuffer());
      fs.writeFileSync(img_sm_path_full, img_sm_buffer);
      img_sm_path = `/uploads/${img_sm_filename}`;
    }
    
    // Save large image if provided
    if (img_lg && img_lg instanceof File) {
      const img_lg_ext = path.extname(img_lg.name);
      const img_lg_filename = `event_lg_${Date.now()}${img_lg_ext}`;
      const img_lg_path_full = path.join(uploadsDir, img_lg_filename);
      
      const img_lg_buffer = Buffer.from(await img_lg.arrayBuffer());
      fs.writeFileSync(img_lg_path_full, img_lg_buffer);
      img_lg_path = `/uploads/${img_lg_filename}`;
    }
    
    // Parse features if it's a JSON string
    let parsedFeatures = features;
    if (typeof features === 'string') {
      try {
        parsedFeatures = JSON.parse(features);
      } catch (e) {
        parsedFeatures = [features];
      }
    }
    
    // Update the event item
    const updatedEvent = {
      ...existingEvent,
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
      venue: venue,
      contact: contact,
      address: address,
      features: Array.isArray(parsedFeatures) ? parsedFeatures : [parsedFeatures],
      recommended: recommended,
      updated_at: new Date().toISOString()
    };
    
    // Update the item in the array
    dbData.events[eventIndex] = updatedEvent;
    
    // Write back to database
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Event berhasil diperbarui',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat memperbarui event: ' + error.message
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    // Read db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find event by ID (convert to string for comparison)
    const eventIndex = dbData.events.findIndex(event => event.id === String(id));
    
    if (eventIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Event tidak ditemukan'
      }, { status: 404 });
    }
    
    // Remove event
    dbData.events.splice(eventIndex, 1);
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Event berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}
