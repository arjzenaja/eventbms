import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to db.json
const dbPath = path.join(process.cwd(), 'db.json');

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    // Read the database file
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Get kuliner data from master data section
    const kulinerItems = dbData.kuliner || [];
    
    // Find the specific kuliner item by ID
    const kulinerItem = kulinerItems.find(item => item.id === id);
    
    if (!kulinerItem) {
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
      kuliner: kulinerItem
    });
  } catch (error) {
    console.error('Error fetching kuliner item:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat mengambil data kuliner'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    
    // Check content type to handle both JSON and FormData
    const contentType = request.headers.get('content-type');
    
    let title, location, description, short_description, type, price_range, cuisine, opening_hours, contact, address, features, recommended, img_sm, img_lg;
    
    if (contentType && contentType.includes('application/json')) {
      // Handle JSON data
      const jsonData = await request.json();
      title = jsonData.title;
      location = jsonData.location;
      description = jsonData.description;
      short_description = jsonData.short_description;
      type = jsonData.type || 'cafe';
      price_range = jsonData.price_range || '25.000 - 50.000';
      cuisine = jsonData.cuisine || 'Indonesia';
      opening_hours = jsonData.opening_hours || '10:00 - 22:00';
      contact = jsonData.contact || '';
      address = jsonData.address || location;
      features = jsonData.features || ['Masakan Indonesia', 'Suasana Nyaman'];
      recommended = jsonData.recommended || false;
      img_sm = jsonData.img_sm;
      img_lg = jsonData.img_lg;
    } else {
      // Handle FormData for file uploads
      const formData = await request.formData();
      
      title = formData.get('title');
      location = formData.get('location');
      description = formData.get('description');
      short_description = formData.get('short_description');
      type = formData.get('type') || 'cafe';
      price_range = formData.get('price_range') || '25.000 - 50.000';
      cuisine = formData.get('cuisine') || 'Indonesia';
      opening_hours = formData.get('opening_hours') || '10:00 - 22:00';
      contact = formData.get('contact') || '';
      address = formData.get('address') || location;
      features = formData.get('features') || ['Masakan Indonesia', 'Suasana Nyaman'];
      recommended = formData.get('recommended') === 'true';
      img_sm = formData.get('img_sm');
      img_lg = formData.get('img_lg');
    }
    
    // Read the database file
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find the kuliner item to update
    const kulinerIndex = dbData.kuliner.findIndex(item => item.id === id);
    
    if (kulinerIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: 'Item kuliner tidak ditemukan'
        },
        { status: 404 }
      );
    }
    
    // Update the kuliner item
    const updatedKulinerItem = {
      ...dbData.kuliner[kulinerIndex],
      title: title || dbData.kuliner[kulinerIndex].title,
      location: location || dbData.kuliner[kulinerIndex].location,
      description: description || dbData.kuliner[kulinerIndex].description,
      short_description: short_description || dbData.kuliner[kulinerIndex].short_description,
      type: type || dbData.kuliner[kulinerIndex].type,
      price_range: price_range || dbData.kuliner[kulinerIndex].price_range,
      cuisine: cuisine || dbData.kuliner[kulinerIndex].cuisine,
      opening_hours: opening_hours || dbData.kuliner[kulinerIndex].opening_hours,
      contact: contact || dbData.kuliner[kulinerIndex].contact,
      address: address || dbData.kuliner[kulinerIndex].address,
      features: features || dbData.kuliner[kulinerIndex].features,
      recommended: recommended !== undefined ? recommended : dbData.kuliner[kulinerIndex].recommended,
      updated_at: new Date().toISOString()
    };
    
    // Update image paths if new images are provided
    if (img_sm) {
      updatedKulinerItem.img_sm = `/uploads/culinary_sm_${Date.now()}.jpg`;
    }
    if (img_lg) {
      updatedKulinerItem.img_lg = `/uploads/culinary_lg_${Date.now()}.jpg`;
    }
    
    // Update the item in the array
    dbData.kuliner[kulinerIndex] = updatedKulinerItem;
    
    // Write back to database
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Item kuliner berhasil diperbarui',
      kuliner: updatedKulinerItem
    });
  } catch (error) {
    console.error('Error updating kuliner item:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat memperbarui item kuliner: ' + error.message
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    // Read the database file
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find the kuliner item to delete
    const kulinerIndex = dbData.kuliner.findIndex(item => item.id === id);
    
    if (kulinerIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: 'Item kuliner tidak ditemukan'
        },
        { status: 404 }
      );
    }
    
    // Remove the item from the array
    const deletedItem = dbData.kuliner.splice(kulinerIndex, 1)[0];
    
    // Write back to database
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Item kuliner berhasil dihapus',
      kuliner: deletedItem
    });
  } catch (error) {
    console.error('Error deleting kuliner item:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat menghapus item kuliner: ' + error.message
      },
      { status: 500 }
    );
  }
}
