import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Filter events by type 'penginapan' (not 'akomodasi')
    const accommodations = dbData.events.filter(event => event.type === 'penginapan');
    
    console.log('Found accommodations:', accommodations); // Debug log
    
    return NextResponse.json({
      success: true,
      accommodations: accommodations
    });
  } catch (error) {
    console.error('Error reading accommodations:', error);
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
    
    // Create new accommodation
    const newAccommodation = {
      id: (dbData.events.length + 1).toString(),
      type: 'penginapan', // Changed from 'akomodasi' to 'penginapan'
      ...body,
      date: body.date || new Date().toISOString().split('T')[0],
      hour: body.hour || '09:00'
    };
    
    // Add to events array
    dbData.events.push(newAccommodation);
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      accommodation: newAccommodation
    });
  } catch (error) {
    console.error('Error creating accommodation:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}
