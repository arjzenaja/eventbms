import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// GET all events destinations
export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    const events = dbData.events || [];
    
    return NextResponse.json({
      success: true,
      title: "Events & Acara",
      description: "Berbagai acara, festival, dan kegiatan yang dapat diikuti selama berwisata",
      destinations: events
    });
  } catch (error) {
    console.error('Error reading events destinations:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}
