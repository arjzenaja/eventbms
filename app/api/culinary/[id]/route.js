import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to db.json
const dbPath = path.join(process.cwd(), 'db.json');

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // Read the database file
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find the culinary item by ID
    const culinaryItem = dbData.events.find(event => event.id === id && event.type === 'kuliner');
    
    if (!culinaryItem) {
      return NextResponse.json(
        {
          success: false,
          message: 'Item kuliner tidak ditemukan'
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      culinaryItem: culinaryItem
    });
  } catch (error) {
    console.error('Error fetching culinary item:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat mengambil data item kuliner'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Read the database file
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find the index of the culinary item
    const itemIndex = dbData.events.findIndex(event => event.id === id && event.type === 'kuliner');
    
    if (itemIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: 'Item kuliner tidak ditemukan'
        },
        { status: 404 }
      );
    }
    
    // Update the culinary item
    const updatedItem = {
      ...dbData.events[itemIndex],
      ...body,
      id: id, // Ensure ID doesn't change
      type: 'kuliner' // Ensure type remains kuliner
    };
    
    dbData.events[itemIndex] = updatedItem;
    
    // Write back to database
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Item kuliner berhasil diperbarui',
      culinaryItem: updatedItem
    });
  } catch (error) {
    console.error('Error updating culinary item:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat memperbarui item kuliner'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // Read the database file
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find the index of the culinary item
    const itemIndex = dbData.events.findIndex(event => event.id === id && event.type === 'kuliner');
    
    if (itemIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: 'Item kuliner tidak ditemukan'
        },
        { status: 404 }
      );
    }
    
    // Remove the culinary item
    const deletedItem = dbData.events.splice(itemIndex, 1)[0];
    
    // Write back to database
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Item kuliner berhasil dihapus',
      deletedItem: deletedItem
    });
  } catch (error) {
    console.error('Error deleting culinary item:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat menghapus item kuliner'
      },
      { status: 500 }
    );
  }
}
