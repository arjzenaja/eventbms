import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// GET all kuliner destinations
export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    const kuliner = dbData.kuliner || [];
    
    return NextResponse.json({
      success: true,
      title: "Kuliner",
      description: "Tempat makan dan minuman khas daerah dengan cita rasa lokal yang autentik",
      destinations: kuliner
    });
  } catch (error) {
    console.error('Error reading kuliner destinations:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}
