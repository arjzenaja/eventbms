import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    // Read db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find accommodation by ID
    const accommodation = dbData.penginapan.find(item => item.id === id);
    
    if (!accommodation) {
      return NextResponse.json({
        success: false,
        message: 'Akomodasi tidak ditemukan'
      }, { status: 404 });
    }
    // Attach related rooms (mapped to user-facing schema) so the user page can render rooms
    const allRooms = Array.isArray(dbData.rooms) ? dbData.rooms : [];
    const relatedRooms = allRooms
      .filter(room => room.accommodationId === id)
      .map(room => ({
        id: room.id,
        name: room.name,
        description: room.description || '',
        price: room.price,
        // User page expects `includes` (array of facilities)
        includes: Array.isArray(room.facilities) ? room.facilities : (room.facilities ? [room.facilities] : []),
        // User page expects human readable capacity like "2 orang"
        capacity: room.capacity ? `${room.capacity} orang` : undefined,
        size: room.size,
        // User page expects `bed`
        bed: room.bedType,
        // User page expects `popular`
        popular: Boolean(room.isPopular),
        // Keep availability if needed elsewhere
        available: room.available !== false
      }));

    const responseData = {
      ...accommodation,
      rooms: relatedRooms
    };

    return NextResponse.json({
      success: true,
      penginapan: responseData
    });
  } catch (error) {
    console.error('Error reading accommodation:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Read db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find accommodation by ID
    const accommodationIndex = dbData.penginapan.findIndex(item => item.id === id);
    
    if (accommodationIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Akomodasi tidak ditemukan'
      }, { status: 404 });
    }
    
    // Update accommodation
    dbData.penginapan[accommodationIndex] = {
      ...dbData.penginapan[accommodationIndex],
      ...body,
      updated_at: new Date().toISOString()
    };
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      penginapan: dbData.penginapan[accommodationIndex]
    });
  } catch (error) {
    console.error('Error updating accommodation:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    // Read db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find accommodation by ID
    const accommodationIndex = dbData.penginapan.findIndex(item => item.id === id);
    
    if (accommodationIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Akomodasi tidak ditemukan'
      }, { status: 404 });
    }
    
    // Remove accommodation
    dbData.penginapan.splice(accommodationIndex, 1);
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Akomodasi berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting accommodation:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}
