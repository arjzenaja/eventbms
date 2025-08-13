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
    const culinaryItem = dbData.kuliner.find(item => item.id === id);
    
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
      kuliner: culinaryItem
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
    const itemIndex = dbData.kuliner.findIndex(item => item.id === id);
    
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
      ...dbData.kuliner[itemIndex],
      ...body,
      id: id, // Ensure ID doesn't change
      updated_at: new Date().toISOString()
    };
    
    dbData.kuliner[itemIndex] = updatedItem;
    
    // Write back to database
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Item kuliner berhasil diperbarui',
      kuliner: updatedItem
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
    const itemIndex = dbData.kuliner.findIndex(item => item.id === id);
    
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
    const deletedItem = dbData.kuliner.splice(itemIndex, 1)[0];
    
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
