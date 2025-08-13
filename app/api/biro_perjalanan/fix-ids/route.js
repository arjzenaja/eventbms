import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db.json');

export async function POST() {
  try {
    // Read the database file
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Fix biro perjalanan IDs
    if (dbData.biro_perjalanan && Array.isArray(dbData.biro_perjalanan)) {
      dbData.biro_perjalanan.forEach((agency, index) => {
        agency.id = (index + 1).toString();
      });
      
      // Write back to file
      fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
      
      return NextResponse.json({
        success: true,
        message: 'Biro perjalanan IDs fixed successfully',
        count: dbData.biro_perjalanan.length
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'No biro perjalanan data found to fix'
      });
    }
  } catch (error) {
    console.error('Error fixing travel agencies IDs:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fix travel agencies IDs',
      error: error.message
    }, { status: 500 });
  }
}
