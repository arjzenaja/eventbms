import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// GET all oleh-oleh destinations
export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    const olehOleh = dbData.oleh_oleh || [];
    
    return NextResponse.json({
      success: true,
      title: "Oleh-Oleh",
      description: "Souvenir, makanan khas, dan produk lokal yang cocok dibawa pulang sebagai kenang-kenangan",
      destinations: olehOleh
    });
  } catch (error) {
    console.error('Error reading oleh-oleh destinations:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}
