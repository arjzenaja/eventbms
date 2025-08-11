import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // Read db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find event by ID (convert to string for comparison)
    const event = dbData.events.find(event => event.id === String(id));
    
    if (!event) {
      return NextResponse.json({
        success: false,
        message: 'Event tidak ditemukan'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      event: event
    });
  } catch (error) {
    console.error('Error reading event:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Read db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find event by ID (convert to string for comparison)
    const eventIndex = dbData.events.findIndex(event => event.id === String(id));
    
    if (eventIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Event tidak ditemukan'
      }, { status: 404 });
    }
    
    // Update event
    dbData.events[eventIndex] = {
      ...dbData.events[eventIndex],
      ...body,
      id: String(id) // Ensure ID remains the same
    };
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      event: dbData.events[eventIndex]
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // Read db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find event by ID (convert to string for comparison)
    const eventIndex = dbData.events.findIndex(event => event.id === String(id));
    
    if (eventIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Event tidak ditemukan'
      }, { status: 404 });
    }
    
    // Remove event
    dbData.events.splice(eventIndex, 1);
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Event berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}
