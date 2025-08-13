import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST() {
  try {
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    let hasChanges = false;
    let nextId = 1;
    
    // Filter events and fix IDs (exclude tourism/destinasi entries)
    const fixedEvents = dbData.events.map(event => {
      // Check if this is NOT a destination (exclude tourism types)
      const isNotDestination = !(
        event.type === 'wisata-alam' || 
        event.type === 'wisata-taman' || 
        event.type === 'wisata-budaya' || 
        event.type === 'wisata-sejarah' || 
        event.type === 'wisata-buatan' || 
        event.type === 'wisata-minat-khusus' || 
        event.type === 'wisata-religi'
      );
      
      if (isNotDestination) {
        const currentId = event.id;
        const parsedId = parseInt(currentId);
        
        // Check if ID is invalid
        if (isNaN(parsedId) || !isFinite(parsedId) || parsedId <= 0) {
          console.log(`Fixing invalid ID: ${currentId} -> ${nextId} for event: ${event.title}`);
          event.id = nextId.toString();
          nextId++;
          hasChanges = true;
        } else {
          // Update nextId to be higher than the highest valid ID
          if (parsedId >= nextId) {
            nextId = parsedId + 1;
          }
        }
      }
      
      return event;
    });
    
    if (hasChanges) {
      // Update the events array
      dbData.events = fixedEvents;
      
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
