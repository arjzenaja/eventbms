import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to db.json
const dbPath = path.join(process.cwd(), 'db.json');

export async function GET() {
  try {
    // Read the database file
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Filter events by type "kuliner"
    const culinaryItems = dbData.events.filter(event => event.type === 'kuliner');
    
    return NextResponse.json({
      success: true,
      culinaryItems: culinaryItems
    });
  } catch (error) {
    console.error('Error fetching culinary data:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat mengambil data kuliner'
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Read the database file
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Generate new ID
    const newId = (Math.max(...dbData.events.map(e => parseInt(e.id))) + 1).toString();
    
    // Create new culinary item
    const newCulinaryItem = {
      id: newId,
      type: 'kuliner',
      img_sm: body.img_sm || '/upcoming/img/food/1-sm.png',
      img_lg: body.img_lg || '/upcoming/img/food/1-lg.png',
      date: body.date || new Date().toISOString().split('T')[0],
      hour: body.hour || '12:00',
      title: body.title,
      location: body.location,
      short_description: body.short_description || body.description,
      description: body.description,
      seats: body.seats || [
        {
          seat: "Tiket Masuk",
          price: 25000
        }
      ],
      organizers: body.organizers || [
        {
          img_avatar: "/organizers/organizer-avt-1.png",
          name: "Restaurant Owner",
          job: "Restaurant Manager"
        }
      ],
      recommended: body.recommended || false
    };
    
    // Add to events array
    dbData.events.push(newCulinaryItem);
    
    // Write back to database
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Item kuliner berhasil ditambahkan',
      culinaryItem: newCulinaryItem
    });
  } catch (error) {
    console.error('Error creating culinary item:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat membuat item kuliner'
      },
      { status: 500 }
    );
  }
}
