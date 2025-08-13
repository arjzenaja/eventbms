import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db.json');

export async function POST() {
  try {
    // Read the database file
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Get oleh_oleh data
    const olehOleh = dbData.oleh_oleh || [];
    let fixedCount = 0;
    
    // Fix IDs for items that don't have proper IDs
    const fixedOlehOleh = olehOleh.map((item, index) => {
      if (!item.id || item.id === 'undefined' || item.id === 'null') {
        fixedCount++;
        return {
          ...item,
          id: Date.now().toString() + index.toString()
        };
      }
      return item;
    });
    
    // Update the database
    dbData.oleh_oleh = fixedOlehOleh;
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      fixed_count: fixedCount,
      message: `Fixed ${fixedCount} oleh-oleh items`
    });
  } catch (error) {
    console.error('Error fixing oleh-oleh IDs:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fix oleh-oleh IDs',
      error: error.message
    }, { status: 500 });
  }
}
