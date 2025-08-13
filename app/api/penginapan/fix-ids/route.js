import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST() {
  try {
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    let hasChanges = false;
    let nextId = 1;
    
    // Filter penginapan and fix IDs
    const fixedPenginapan = dbData.penginapan?.map(penginapan => {
      const currentId = penginapan.id;
      const parsedId = parseInt(currentId);
      
      // Check if ID is invalid
      if (isNaN(parsedId) || !isFinite(parsedId) || parsedId <= 0) {
        console.log(`Fixing invalid ID: ${currentId} -> ${nextId} for penginapan: ${penginapan.title}`);
        penginapan.id = nextId.toString();
        nextId++;
        hasChanges = true;
      } else {
        // Update nextId to be higher than the highest valid ID
        if (parsedId >= nextId) {
          nextId = parsedId + 1;
        }
      }
      
      return penginapan;
    }) || [];
    
    if (hasChanges) {
      // Update the penginapan array
      dbData.penginapan = fixedPenginapan;
      
      // Write back to db.json
      fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
      
      return NextResponse.json({
        success: true,
        message: 'Invalid IDs have been fixed',
        fixedCount: nextId - 1
      });
    } else {
      return NextResponse.json({
        success: true,
        message: 'No invalid IDs found',
        fixedCount: 0
      });
    }
    
  } catch (error) {
    console.error('Error fixing IDs:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}
