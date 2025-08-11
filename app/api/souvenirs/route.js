import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Filter events by type 'oleh-oleh'
    const souvenirs = dbData.events.filter(event => event.type === 'oleh-oleh');
    
    return NextResponse.json({
      success: true,
      souvenirs: souvenirs
    });
  } catch (error) {
    console.error('Error reading souvenirs:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Read db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Create new souvenir
    const newSouvenir = {
      id: (dbData.events.length + 1).toString(),
      type: 'oleh-oleh',
      ...body,
      date: body.date || new Date().toISOString().split('T')[0],
      hour: body.hour || '10:00'
    };
    
    // Add to events array
    dbData.events.push(newSouvenir);
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      souvenir: newSouvenir
    });
  } catch (error) {
    console.error('Error creating souvenir:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}
