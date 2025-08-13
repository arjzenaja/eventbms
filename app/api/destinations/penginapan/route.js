import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// GET all penginapan destinations
export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    const penginapan = dbData.penginapan || [];
    
    return NextResponse.json({
      success: true,
      title: "Penginapan",
      description: "Hotel, homestay, villa, dan tempat menginap lainnya untuk kenyamanan wisatawan",
      destinations: penginapan
    });
  } catch (error) {
    console.error('Error reading penginapan destinations:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}
