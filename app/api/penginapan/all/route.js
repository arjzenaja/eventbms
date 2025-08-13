import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Filter only accommodation-related data (not tourist attractions)
    const accommodationData = dbData.events.filter(event => 
      event.type === 'penginapan' || 
      event.type === 'hotel' || 
      event.type === 'villa' || 
      event.type === 'guesthouse' || 
      event.type === 'homestay'
    );
    
    console.log('Found accommodation data:', accommodationData); // Debug log
    
    return NextResponse.json({
      success: true,
      accommodations: accommodationData
    });
  } catch (error) {
    console.error('Error reading all data:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}
