import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to db.json
const dbPath = path.join(process.cwd(), 'db.json');

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const accommodationId = searchParams.get('accommodationId');
    const accommodationSlug = searchParams.get('accommodationSlug');
    const bedType = searchParams.get('bedType');
    
    // Read the database file
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Get rooms data
    let rooms = dbData.rooms || [];
    
    // Filter by id if provided
    if (id) {
      rooms = rooms.filter(room => room.id === id);
    }
    
    // Filter by accommodation if specified
    if (accommodationId) {
      rooms = rooms.filter(room => room.accommodationId === accommodationId);
    }
    
    if (accommodationSlug) {
      rooms = rooms.filter(room => room.accommodationSlug === accommodationSlug);
    }
    
    if (bedType) {
      rooms = rooms.filter(room => room.bedType === bedType);
    }
    
    return NextResponse.json({
      success: true,
      rooms: rooms,
      total: rooms.length
    });
  } catch (error) {
    console.error('Error fetching rooms data:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat mengambil data kamar'
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Handle FormData for file uploads
    const formData = await request.formData();
    
    // Extract form data
    const name = formData.get('name');
    const description = formData.get('description');
    const capacity = formData.get('capacity');
    const size = formData.get('size');
    const bedType = formData.get('bedType');
    const price = formData.get('price');
    const accommodationId = formData.get('accommodationId');
    const accommodationSlug = formData.get('accommodationSlug');
    const accommodationTitle = formData.get('accommodationTitle');
    const isPopular = formData.get('isPopular') === 'true';
    const available = formData.get('available') === 'true';
    const facilities = formData.get('facilities') || [];
    
    // Validate required fields
    if (!name || !price || !accommodationId) {
      return NextResponse.json({
        success: false,
        message: 'Nama kamar, harga, dan penginapan harus diisi'
      }, { status: 400 });
    }
    
    // Read the database file
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Initialize rooms array if it doesn't exist
    if (!dbData.rooms) {
      dbData.rooms = [];
    }
    
    // Generate new ID
    const validIds = (dbData.rooms || [])
      .map(item => {
        const parsed = parseInt(item.id);
        return isNaN(parsed) || !isFinite(parsed) ? 0 : parsed;
      })
      .filter(id => id > 0);
    
    const newId = validIds.length > 0 ? (Math.max(...validIds) + 1).toString() : "1";
    
    // Parse facilities if it's a JSON string
    let parsedFacilities = facilities;
    if (typeof facilities === 'string') {
      try {
        parsedFacilities = JSON.parse(facilities);
      } catch (e) {
        parsedFacilities = [facilities];
      }
    }
    
    // Create new room item
    const newRoomItem = {
      id: newId,
      name: name,
      description: description || '',
      capacity: capacity || '',
      size: size || '',
      bedType: bedType || '',
      price: parseInt(price),
      accommodationId: accommodationId,
      accommodationSlug: accommodationSlug || '',
      accommodationTitle: accommodationTitle || '',
      facilities: Array.isArray(parsedFacilities) ? parsedFacilities : [parsedFacilities],
      isPopular: isPopular,
      available: available,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add to rooms array
    dbData.rooms.push(newRoomItem);
    
    // Write back to database
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Kamar berhasil ditambahkan',
      roomItem: newRoomItem
    });
  } catch (error) {
    console.error('Error creating room item:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat membuat kamar: ' + error.message
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const formData = await request.formData();
    const id = formData.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'ID kamar diperlukan'
      }, { status: 400 });
    }
    
    // Read the database file
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find room by ID
    const roomIndex = dbData.rooms.findIndex(room => room.id === id);
    
    if (roomIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Kamar tidak ditemukan'
      }, { status: 404 });
    }
    
    // Update room data
    const updateData = {};
    
    // Get all form fields
    const fields = ['name', 'description', 'capacity', 'size', 'bedType', 'price', 
                   'accommodationId', 'accommodationSlug', 'accommodationTitle', 
                   'isPopular', 'available', 'facilities'];
    
    fields.forEach(field => {
      const value = formData.get(field);
      if (value !== null) {
        if (field === 'price') {
          updateData[field] = parseInt(value);
        } else if (field === 'isPopular' || field === 'available') {
          updateData[field] = value === 'true';
        } else if (field === 'facilities') {
          try {
            updateData[field] = JSON.parse(value);
          } catch (e) {
            updateData[field] = [value];
          }
        } else {
          updateData[field] = value;
        }
      }
    });
    
    // Update room
    dbData.rooms[roomIndex] = {
      ...dbData.rooms[roomIndex],
      ...updateData,
      updated_at: new Date().toISOString()
    };
    
    // Write back to database
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Kamar berhasil diperbarui',
      roomItem: dbData.rooms[roomIndex]
    });
  } catch (error) {
    console.error('Error updating room item:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat memperbarui kamar: ' + error.message
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'ID kamar diperlukan'
      }, { status: 400 });
    }
    
    // Read the database file
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find room by ID
    const roomIndex = dbData.rooms.findIndex(room => room.id === id);
    
    if (roomIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Kamar tidak ditemukan'
      }, { status: 404 });
    }
    
    // Remove room
    dbData.rooms.splice(roomIndex, 1);
    
    // Write back to database
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Kamar berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting room item:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat menghapus kamar: ' + error.message
      },
      { status: 500 }
    );
  }
}
