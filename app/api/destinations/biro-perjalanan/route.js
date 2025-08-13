import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// GET all biro perjalanan destinations
export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    const biroPerjalanan = dbData.biro_perjalanan || [];
    
    return NextResponse.json({
      success: true,
      title: "Biro Perjalanan",
      description: "Layanan tour dan travel untuk memudahkan perencanaan dan pelaksanaan perjalanan wisata",
      destinations: biroPerjalanan
    });
  } catch (error) {
    console.error('Error reading biro perjalanan destinations:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}
