import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST() {
  try {
    // Read db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    let fixedCount = 0;
    
    // Fix desa_wisata IDs
    if (dbData.desa_wisata && Array.isArray(dbData.desa_wisata)) {
      dbData.desa_wisata.forEach((item, index) => {
        if (!item.id || item.id === null || item.id === undefined || item.id === '') {
          // Generate new ID based on timestamp and index
          const timestamp = Date.now();
          const newId = `${timestamp}_${index}`;
          item.id = newId;
          fixedCount++;
        }
      });
    }
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: `Berhasil memperbaiki ${fixedCount} ID desa wisata`,
      fixed_count: fixedCount
    });
  } catch (error) {
    console.error('Error fixing desa wisata IDs:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan saat memperbaiki ID'
    }, { status: 500 });
  }
}
