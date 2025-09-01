import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to db.json
const dbPath = path.join(process.cwd(), 'db.json');

// Helper function to read database
const readDatabase = () => {
  try {
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    return dbData;
  } catch (error) {
    console.error('Error reading database:', error);
    return { menu_items: [] };
  }
};

// Helper function to write database
const writeDatabase = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    return false;
  }
};

// GET - Fetch all menu items or by culinary destination
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const destinationId = searchParams.get('destinationId');
    const destinationSlug = searchParams.get('slug');
    const category = searchParams.get('category');
    
    const dbData = readDatabase();
    let menuItems = dbData.menu_items || [];
    
    // Filter by destination if specified
    if (destinationId) {
      menuItems = menuItems.filter(item => item.destinationId === destinationId);
    }
    
    if (destinationSlug) {
      menuItems = menuItems.filter(item => item.destinationSlug === destinationSlug);
    }
    
    // Filter by category if specified
    if (category && category !== 'all') {
      menuItems = menuItems.filter(item => item.category === category);
    }
    
    // Get unique categories
    const categories = [...new Set(menuItems.map(item => item.category))];
    
    // Calculate price range
    const prices = menuItems.map(item => item.price);
    const priceRange = prices.length > 0 ? {
      min: Math.min(...prices),
      max: Math.max(...prices)
    } : { min: 0, max: 0 };
    
    return NextResponse.json({
      success: true,
      menu_items: menuItems,
      total: menuItems.length,
      categories: categories,
      priceRange: priceRange
    });
    
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Terjadi kesalahan saat mengambil data menu',
        menu_items: []
      },
      { status: 500 }
    );
  }
}

// POST - Create new menu item
export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Extract form data
    const name = formData.get('name');
    const description = formData.get('description');
    const price = parseInt(formData.get('price')) || 0;
    const cookingTime = formData.get('cookingTime');
    const category = formData.get('category');
    const destinationId = formData.get('destinationId');
    const destinationSlug = formData.get('destinationSlug');
    const destinationTitle = formData.get('destinationTitle');
    const rating = parseFloat(formData.get('rating')) || 0;
    const isPopular = formData.get('isPopular') === 'true';
    const isSpicy = formData.get('isSpicy') === 'true';
    const additionalInfo = formData.get('additionalInfo') ? 
      JSON.parse(formData.get('additionalInfo')) : [];
    const halal = formData.get('halal') === 'true';
    const available = formData.get('available') === 'true';
    
    // Validate required fields
    if (!name || !description || !price || !cookingTime || !category || !destinationId) {
      return NextResponse.json({
        success: false,
        message: 'Semua field wajib diisi (nama, deskripsi, harga, waktu memasak, kategori, destinasi)'
      }, { status: 400 });
    }
    
    // Handle image upload
    const imageFile = formData.get('image');
    let imagePath = '/placeholder.jpg';
    
    if (imageFile && imageFile instanceof File) {
      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'menu');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = path.extname(imageFile.name);
      const filename = `menu_${timestamp}${fileExtension}`;
      const filePath = path.join(uploadsDir, filename);
      
      // Save file
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      fs.writeFileSync(filePath, buffer);
      
      imagePath = `/uploads/menu/${filename}`;
    }
    
    // Read current database
    const dbData = readDatabase();
    const menuItems = dbData.menu_items || [];
    
    // Generate new ID
    const newId = menuItems.length > 0 ? Math.max(...menuItems.map(item => item.id)) + 1 : 1;
    
    // Create new menu item
    const newMenuItem = {
      id: newId,
      name,
      description,
      price,
      cookingTime,
      category,
      destinationId,
      destinationSlug,
      destinationTitle,
      rating,
      isPopular,
      isSpicy,
      additionalInfo,
      halal,
      available,
      image: imagePath,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to database
    menuItems.push(newMenuItem);
    dbData.menu_items = menuItems;
    
    // Write to database
    if (writeDatabase(dbData)) {
      return NextResponse.json({
        success: true,
        message: 'Menu berhasil ditambahkan',
        menu_item: newMenuItem
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Gagal menyimpan menu ke database'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan saat membuat menu'
    }, { status: 500 });
  }
}

// PUT - Update menu item
export async function PUT(request) {
  try {
    const formData = await request.formData();
    
    const id = formData.get('id');
    const name = formData.get('name');
    const description = formData.get('description');
    const price = parseInt(formData.get('price')) || 0;
    const cookingTime = formData.get('cookingTime');
    const category = formData.get('category');
    const rating = parseFloat(formData.get('rating')) || 0;
    const isPopular = formData.get('isPopular') === 'true';
    const isSpicy = formData.get('isSpicy') === 'true';
    const additionalInfo = formData.get('additionalInfo') ? 
      JSON.parse(formData.get('additionalInfo')) : [];
    const halal = formData.get('halal') === 'true';
    const available = formData.get('available') === 'true';
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'ID menu diperlukan'
      }, { status: 400 });
    }
    
    // Read current database
    const dbData = readDatabase();
    const menuItems = dbData.menu_items || [];
    
    // Find menu item
    const menuIndex = menuItems.findIndex(item => item.id === id);
    if (menuIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Menu tidak ditemukan'
      }, { status: 404 });
    }
    
    // Handle image upload if new image is provided
    const imageFile = formData.get('image');
    let imagePath = menuItems[menuIndex].image;
    
    if (imageFile && imageFile instanceof File) {
      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'menu');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = path.extname(imageFile.name);
      const filename = `menu_${timestamp}${fileExtension}`;
      const filePath = path.join(uploadsDir, filename);
      
      // Save file
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      fs.writeFileSync(filePath, buffer);
      
      imagePath = `/uploads/menu/${filename}`;
    }
    
    // Update menu item
    menuItems[menuIndex] = {
      ...menuItems[menuIndex],
      name: name || menuItems[menuIndex].name,
      description: description || menuItems[menuIndex].description,
      price: price || menuItems[menuIndex].price,
      cookingTime: cookingTime || menuItems[menuIndex].cookingTime,
      category: category || menuItems[menuIndex].category,
      rating: rating || menuItems[menuIndex].rating,
      isPopular,
      isSpicy,
      additionalInfo,
      halal,
      available,
      image: imagePath,
      updatedAt: new Date().toISOString()
    };
    
    // Write to database
    if (writeDatabase(dbData)) {
      return NextResponse.json({
        success: true,
        message: 'Menu berhasil diperbarui',
        menu_item: menuItems[menuIndex]
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Gagal memperbarui menu'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui menu'
    }, { status: 500 });
  }
}

// DELETE - Delete menu item
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'ID menu diperlukan'
      }, { status: 400 });
    }
    
    // Read current database
    const dbData = readDatabase();
    const menuItems = dbData.menu_items || [];
    
    // Find menu item
    const menuIndex = menuItems.findIndex(item => item.id === id);
    if (menuIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Menu tidak ditemukan'
      }, { status: 404 });
    }
    
    // Remove menu item
    menuItems.splice(menuIndex, 1);
    dbData.menu_items = menuItems;
    
    // Write to database
    if (writeDatabase(dbData)) {
      return NextResponse.json({
        success: true,
        message: 'Menu berhasil dihapus'
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Gagal menghapus menu'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus menu'
    }, { status: 500 });
  }
}
