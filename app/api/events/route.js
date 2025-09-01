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
    const event_type = formData.get('event_type') || '';
    const date = formData.get('date') || new Date().toISOString().split('T')[0];
    const time = formData.get('time') || '19:00';
    const end_date = formData.get('end_date') || '';
    const end_time = formData.get('end_time') || '';
    const contact = formData.get('contact') || '';
    const address = formData.get('address') || location;
    const organizer = formData.get('organizer') || '';
    const features = formData.get('features') || ['Hiburan', 'Makanan'];
    const seatsRaw = formData.get('seats');
    const recommended = formData.get('recommended') === 'true';
    
    // New fields
    const highlightsRaw = formData.get('highlights');
    const performersRaw = formData.get('performers');
    const pricingRaw = formData.get('pricing');
    const facilitiesRaw = formData.get('facilities');
    const poster_link = formData.get('poster_link') || '';
    const ticket_link = formData.get('ticket_link') || '';
    const additional_info = formData.get('additional_info') || '';
    const organizersRaw = formData.get('organizers');
    
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
    const galleryFiles = formData.getAll('gallery[]');
    const latitude = formData.get('latitude') || '';
    const longitude = formData.get('longitude') || '';
    const opening_hours = formData.get('opening_hours') || '';
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    let img_sm_path = '/placeholder.jpg';
    let img_lg_path = '/placeholder.jpg';
    const galleryPaths = [];
    
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
    // Save gallery images
    for (const file of galleryFiles) {
      if (file && file instanceof File) {
        const ext = path.extname(file.name) || '.jpg';
        const filename = `event_gallery_${Date.now()}_${Math.random().toString(16).slice(2)}${ext}`;
        const full = path.join(uploadsDir, filename);
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(full, buffer);
        galleryPaths.push(`/uploads/${filename}`);
      }
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
    
    // Parse seats if provided
    let seats = [];
    if (typeof seatsRaw === 'string' && seatsRaw.length) {
      try {
        const parsed = JSON.parse(seatsRaw);
        if (Array.isArray(parsed)) seats = parsed.map(s => ({
          seat: s.seat || s.name || '',
          price: Number(s.price || 0),
          desc: s.desc || '',
          includes: Array.isArray(s.includes) ? s.includes : [],
          terms_requirements: Array.isArray(s.terms_requirements) ? s.terms_requirements : [],
          terms_cancellation: Array.isArray(s.terms_cancellation) ? s.terms_cancellation : []
        }));
      } catch { /* ignore */ }
    }

    // Parse highlights if provided
    let highlights = [];
    if (typeof highlightsRaw === 'string' && highlightsRaw.length) {
      try {
        highlights = JSON.parse(highlightsRaw);
      } catch (e) {
        highlights = [highlightsRaw];
      }
    }

    // Parse performers if provided
    let performers = [];
    if (typeof performersRaw === 'string' && performersRaw.length) {
      try {
        performers = JSON.parse(performersRaw);
      } catch (e) {
        performers = [performersRaw];
      }
    }

    // Parse pricing if provided
    let pricing = {
      presale: '',
      normal: '',
      vip: '',
      free: false
    };
    if (typeof pricingRaw === 'string' && pricingRaw.length) {
      try {
        pricing = JSON.parse(pricingRaw);
      } catch (e) {
        // Keep default pricing
      }
    }

    // Parse facilities if provided
    let facilities = [];
    if (typeof facilitiesRaw === 'string' && facilitiesRaw.length) {
      try {
        facilities = JSON.parse(facilitiesRaw);
      } catch (e) {
        facilities = [facilitiesRaw];
      }
    }

    // Parse organizers if provided
    let organizers = [];
    if (typeof organizersRaw === 'string' && organizersRaw.length) {
      try {
        organizers = JSON.parse(organizersRaw);
      } catch (e) {
        organizers = organizer ? [{ name: organizer, role: 'Penyelenggara Utama' }] : [];
      }
    } else if (organizer) {
      organizers = [{ name: organizer, role: 'Penyelenggara Utama' }];
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
      event_type: event_type,
      latitude: latitude,
      longitude: longitude,
      opening_hours: opening_hours,
      date: date,
      time: time,
      end_date: end_date,
      end_time: end_time,
      contact: contact,
      address: address,
      organizer: organizer,
      organizers: organizers,
      features: Array.isArray(parsedFeatures) ? parsedFeatures : [parsedFeatures],
      highlights: highlights,
      performers: performers,
      pricing: pricing,
      facilities: facilities,
      poster_link: poster_link,
      ticket_link: ticket_link,
      additional_info: additional_info,
      seats: seats,
      gallery: galleryPaths,
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
