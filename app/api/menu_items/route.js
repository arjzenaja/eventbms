import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to db.json
const dbPath = path.join(process.cwd(), 'db.json');

export async function GET() {
  try {
    // Read the database file
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Get menu_items data from the database
    const menuItems = dbData.menu_items || [];
    
    return NextResponse.json({
      success: true,
      menu_items: menuItems
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat mengambil data menu'
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Read the database file
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Initialize menu_items array if it doesn't exist
    if (!dbData.menu_items) {
      dbData.menu_items = [];
    }
    
    // Generate new ID
    const validIds = (dbData.menu_items || [])
      .map(item => {
        const parsed = parseInt(item.id);
        return isNaN(parsed) || !isFinite(parsed) ? 0 : parsed;
      })
      .filter(id => id > 0);
    
    const newId = validIds.length > 0 ? (Math.max(...validIds) + 1).toString() : "1";
    
    // Create new menu item
    const newMenuItem = {
      id: newId,
      name: body.name || '',
      description: body.description || '',
      price: body.price || 0,
      image: body.image || '/placeholder.jpg',
      rating: body.rating || 0,
      cookingTime: body.cookingTime || '10-15 menit',
      category: body.category || 'Makanan Utama',
      destinationId: body.destinationId || '',
      destinationSlug: body.destinationSlug || '',
      halal: body.halal !== undefined ? body.halal : true,
      available: body.available !== undefined ? body.available : true,
      isPopular: body.isPopular || false,
      isSpicy: body.isSpicy || false,
      additionalInfo: Array.isArray(body.additionalInfo) ? body.additionalInfo : ['Halal'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add to menu_items array
    dbData.menu_items.push(newMenuItem);
    
    // Write back to database
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Menu item berhasil ditambahkan',
      menuItem: newMenuItem
    });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat membuat menu item: ' + error.message
      },
      { status: 500 }
    );
  }
}
