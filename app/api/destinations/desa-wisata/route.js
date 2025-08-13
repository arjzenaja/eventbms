import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// GET all desa wisata destinations
export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    const desaWisata = dbData.desa_wisata || [];
    
    return NextResponse.json({
      success: true,
      title: "Desa Wisata",
      description: "Desa-desa yang dikembangkan sebagai destinasi wisata dengan budaya dan kehidupan masyarakat lokal",
      destinations: desaWisata
    });
  } catch (error) {
    console.error('Error reading desa wisata destinations:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}
