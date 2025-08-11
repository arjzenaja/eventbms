import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Filter events by type 'desa-wisata'
    const villages = dbData.events.filter(event => event.type === 'desa-wisata');
    
    return NextResponse.json({
      success: true,
      villages: villages
    });
  } catch (error) {
    console.error('Error reading villages:', error);
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
    
    // Create new village
    const newVillage = {
      id: (dbData.events.length + 1).toString(),
      type: 'desa-wisata',
      ...body,
      date: body.date || new Date().toISOString().split('T')[0],
      hour: body.hour || '08:00'
    };
    
    // Add to events array
    dbData.events.push(newVillage);
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      village: newVillage
    });
  } catch (error) {
    console.error('Error creating village:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}
