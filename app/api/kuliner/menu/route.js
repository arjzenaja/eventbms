import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Sample menu data for culinary destinations
const menuData = {
  // Default menus for any culinary destination
  default: [
    {
      id: 1,
      name: "Nasi Goreng Spesial",
      description: "Nasi goreng dengan telur, ayam, dan sayuran segar khas Banyumas",
      price: 25000,
      image: "/placeholder.jpg",
      rating: 4.8,
      cookingTime: "10-15 menit",
      isPopular: true,
      isSpicy: false,
      category: "Nasi",
      additionalInfo: ["Halal", "Fresh"]
    },
    {
      id: 2,
      name: "Sate Banyumas",
      description: "Sate ayam dengan bumbu kacang khas Banyumas yang lezat",
      price: 35000,
      image: "/placeholder.jpg",
      rating: 4.9,
      cookingTime: "15-20 menit",
      isPopular: true,
      isSpicy: true,
      category: "Sate",
      additionalInfo: ["Halal", "Signature"]
    },
    {
      id: 3,
      name: "Soto Sokaraja",
      description: "Soto ayam dengan kuah bening dan pelengkap lengkap",
      price: 28000,
      image: "/placeholder.jpg",
      rating: 4.7,
      cookingTime: "12-18 menit",
      isPopular: false,
      isSpicy: false,
      category: "Soto",
      additionalInfo: ["Halal", "Traditional"]
    },
    {
      id: 4,
      name: "Gudeg Banyumas",
      description: "Gudeg nangka muda dengan telur dan ayam, manis gurih",
      price: 32000,
      image: "/placeholder.jpg",
      rating: 4.6,
      cookingTime: "20-25 menit",
      isPopular: false,
      isSpicy: false,
      category: "Gudeg",
      additionalInfo: ["Halal", "Local"]
    },
    {
      id: 5,
      name: "Bakso Malang",
      description: "Bakso daging sapi dengan kuah kaldu yang gurih",
      price: 22000,
      image: "/placeholder.jpg",
      rating: 4.5,
      cookingTime: "8-12 menit",
      isPopular: false,
      isSpicy: false,
      category: "Bakso",
      additionalInfo: ["Halal", "Comfort"]
    },
    {
      id: 6,
      name: "Mie Goreng Jawa",
      description: "Mie goreng dengan bumbu Jawa yang khas dan lezat",
      price: 20000,
      image: "/placeholder.jpg",
      rating: 4.4,
      cookingTime: "10-15 menit",
      isPopular: false,
      isSpicy: true,
      category: "Mie",
      additionalInfo: ["Halal", "Spicy"]
    },
    {
      id: 7,
      name: "Es Cendol Banyumas",
      description: "Es cendol dengan santan dan gula merah khas Banyumas",
      price: 8000,
      image: "/placeholder.jpg",
      rating: 4.8,
      cookingTime: "5-8 menit",
      isPopular: true,
      isSpicy: false,
      category: "Minuman",
      additionalInfo: ["Halal", "Dessert"]
    },
    {
      id: 8,
      name: "Wedang Jahe",
      description: "Minuman jahe hangat dengan gula merah dan rempah",
      price: 5000,
      image: "/placeholder.jpg",
      rating: 4.3,
      cookingTime: "3-5 menit",
      isPopular: false,
      isSpicy: false,
      category: "Minuman",
      additionalInfo: ["Halal", "Warm"]
    },
    {
      id: 9,
      name: "Ayam Goreng Banyumas",
      description: "Ayam goreng dengan bumbu khas Banyumas yang gurih",
      price: 45000,
      image: "/placeholder.jpg",
      rating: 4.7,
      cookingTime: "20-25 menit",
      isPopular: true,
      isSpicy: false,
      category: "Ayam",
      additionalInfo: ["Halal", "Signature"]
    },
    {
      id: 10,
      name: "Ikan Gurame Goreng",
      description: "Ikan gurame goreng dengan sambal terasi yang pedas",
      price: 55000,
      image: "/placeholder.jpg",
      rating: 4.6,
      cookingTime: "25-30 menit",
      isPopular: false,
      isSpicy: true,
      category: "Ikan",
      additionalInfo: ["Halal", "Fresh"]
    },
    {
      id: 11,
      name: "Es Teh Manis",
      description: "Es teh manis segar untuk menemani hidangan Anda",
      price: 3000,
      image: "/placeholder.jpg",
      rating: 4.2,
      cookingTime: "2-3 menit",
      isPopular: false,
      isSpicy: false,
      category: "Minuman",
      additionalInfo: ["Halal", "Refresh"]
    },
    {
      id: 12,
      name: "Kopi Tubruk",
      description: "Kopi tubruk tradisional dengan gula aren",
      price: 4000,
      image: "/placeholder.jpg",
      rating: 4.4,
      cookingTime: "5-7 menit",
      isPopular: false,
      isSpicy: false,
      category: "Minuman",
      additionalInfo: ["Halal", "Traditional"]
    }
  ],
  
  // Specific menus for different culinary destinations
  "warung-makan-sederhana": [
    {
      id: 1,
      name: "Nasi Campur",
      description: "Nasi dengan berbagai lauk pauk pilihan",
      price: 15000,
      image: "/placeholder.jpg",
      rating: 4.5,
      cookingTime: "8-12 menit",
      isPopular: true,
      isSpicy: false,
      category: "Nasi",
      additionalInfo: ["Halal", "Budget"]
    },
    {
      id: 2,
      name: "Mie Goreng",
      description: "Mie goreng dengan telur dan sayuran",
      price: 12000,
      image: "/placeholder.jpg",
      rating: 4.3,
      cookingTime: "10-15 menit",
      isPopular: false,
      isSpicy: false,
      category: "Mie",
      additionalInfo: ["Halal", "Simple"]
    }
  ],
  
  "restoran-seafood": [
    {
      id: 1,
      name: "Ikan Bakar",
      description: "Ikan bakar dengan bumbu khas",
      price: 75000,
      image: "/placeholder.jpg",
      rating: 4.8,
      cookingTime: "30-35 menit",
      isPopular: true,
      isSpicy: true,
      category: "Ikan",
      additionalInfo: ["Halal", "Fresh"]
    },
    {
      id: 2,
      name: "Udang Goreng",
      description: "Udang goreng tepung yang renyah",
      price: 85000,
      image: "/placeholder.jpg",
      rating: 4.7,
      cookingTime: "15-20 menit",
      isPopular: true,
      isSpicy: false,
      category: "Seafood",
      additionalInfo: ["Halal", "Crispy"]
    }
  ]
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const destinationId = searchParams.get('destinationId');
    const destinationSlug = searchParams.get('slug');
    const id = searchParams.get('id');
    
    // Try to get menu items from database first
    try {
      const dbData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'db.json'), 'utf8'));
      let menuItems = dbData.menu_items || [];
      
      // If specific ID is requested, return that menu item
      if (id) {
        const menuItem = menuItems.find(item => 
          item.id === parseInt(id) || item.id === id || item.id === id.toString()
        );
        if (menuItem) {
          return NextResponse.json({
            success: true,
            menu_items: [menuItem],
            menus: [menuItem], // Keep for backward compatibility
            total: 1
          });
        } else {
          return NextResponse.json({
            success: false,
            error: 'Menu item not found',
            menu_items: [],
            menus: []
          }, { status: 404 });
        }
      }
      
      // Filter by destination if specified
      if (destinationId) {
        menuItems = menuItems.filter(item => item.destinationId === destinationId);
      }
      
      if (destinationSlug) {
        menuItems = menuItems.filter(item => item.destinationSlug === destinationSlug);
      }
      
      // If we have menu items from database, return them
      if (menuItems.length > 0) {
        const categories = [...new Set(menuItems.map(menu => menu.category))];
        const prices = menuItems.map(menu => menu.price);
        const priceRange = prices.length > 0 ? {
          min: Math.min(...prices),
          max: Math.max(...prices)
        } : { min: 0, max: 0 };
        
        return NextResponse.json({
          success: true,
          menu_items: menuItems,
          menus: menuItems, // Keep for backward compatibility
          total: menuItems.length,
          categories: categories,
          priceRange: priceRange
        });
      }
    } catch (dbError) {
      console.log('Database not available, using fallback data');
    }
    
    // Return empty array if no database items found
    return NextResponse.json({
      success: true,
      menu_items: [],
      menus: [], // Keep for backward compatibility
      total: 0,
      categories: [],
      priceRange: { min: 0, max: 0 }
    });
    
  } catch (error) {
    console.error('Error fetching menu data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch menu data',
        menu_items: [],
        menus: [] // Don't return static data on error
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Extract form data
    const name = formData.get('name');
    const description = formData.get('description');
    const price = parseFloat(formData.get('price')) || null;
    const priceIced = parseFloat(formData.get('priceIced')) || null;
    const priceHot = parseFloat(formData.get('priceHot')) || null;
    const cookingTime = formData.get('cookingTime');
    const category = formData.get('category');
    const destinationId = formData.get('destinationId');
    const destinationSlug = formData.get('destinationSlug');
    const destinationTitle = formData.get('destinationTitle');
    const rating = parseFloat(formData.get('rating')) || 0;
    const isPopular = formData.get('isPopular') === 'true';
    const isSpicy = formData.get('isSpicy') === 'true';
    const halal = formData.get('halal') === 'true';
    const available = formData.get('available') === 'true';
    let additionalInfo = [];
    let flavorOptions = [];
    
    try {
      additionalInfo = JSON.parse(formData.get('additionalInfo') || '[]');
    } catch (error) {
      console.error('Error parsing additionalInfo:', error);
      additionalInfo = [];
    }
    
    try {
      flavorOptions = JSON.parse(formData.get('flavorOptions') || '[]');
    } catch (error) {
      console.error('Error parsing flavorOptions:', error);
      flavorOptions = [];
    }
    const image = formData.get('image');
    
    // Validate required fields
    if (!name || !description || !cookingTime || !category || !destinationId) {
      return NextResponse.json(
        { success: false, message: 'Semua field wajib diisi' },
        { status: 400 }
      );
    }

    // Validate pricing based on category
    const dualPricingCategories = [
      'THE ESPRESSO BASED',
      'SHAKEN SWEET & CREAMY Series',
      'SHAKEN FRESH Presso'
    ];
    
    if (dualPricingCategories.includes(category)) {
      if (!priceIced && !priceHot) {
        return NextResponse.json(
          { success: false, message: 'Untuk minuman dengan dual pricing, minimal salah satu harga (Iced atau Hot) harus diisi' },
          { status: 400 }
        );
      }
    } else {
      if (!price) {
        return NextResponse.json(
          { success: false, message: 'Harga wajib diisi' },
          { status: 400 }
        );
      }
    }
    
    // Read database
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Generate new ID
    const newId = Math.max(...(dbData.menu_items || []).map(item => parseInt(item.id) || 0)) + 1;
    
    // Handle image upload
    let imagePath = '/placeholder.jpg';
    if (image && image.size > 0) {
      const timestamp = Date.now();
      const fileName = `menu_${timestamp}.${image.name.split('.').pop()}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'menu');
      
      // Ensure upload directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const filePath = path.join(uploadDir, fileName);
      const buffer = await image.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(buffer));
      imagePath = `/uploads/menu/${fileName}`;
    }
    
    // Create new menu item
    const newMenuItem = {
      id: newId.toString(),
      name,
      description,
      price: dualPricingCategories.includes(category) ? null : price,
      priceIced: dualPricingCategories.includes(category) ? priceIced : null,
      priceHot: dualPricingCategories.includes(category) ? priceHot : null,
      cookingTime,
      category,
      destinationId,
      destinationSlug: destinationSlug || '',
      destinationTitle: destinationTitle || '',
      rating,
      isPopular,
      isSpicy,
      halal,
      available,
      additionalInfo,
      flavorOptions,
      image: imagePath,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add to database
    if (!dbData.menu_items) {
      dbData.menu_items = [];
    }
    dbData.menu_items.push(newMenuItem);
    
    // Save to database
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Menu berhasil ditambahkan',
      menu_item: newMenuItem
    });
    
  } catch (error) {
    console.error('Error creating menu item:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { success: false, message: `Gagal menambahkan menu: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const formData = await request.formData();
    const id = formData.get('id');
    
    console.log('PUT request - ID:', id, 'Type:', typeof id);
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID menu diperlukan' },
        { status: 400 }
      );
    }
    
    // Read database
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find menu item - handle both string and integer IDs
    const menuIndex = dbData.menu_items?.findIndex(item => {
      const itemId = item.id;
      const searchId = id;
      
      // Try exact match first
      if (itemId === searchId) return true;
      
      // Try integer comparison
      if (parseInt(itemId) === parseInt(searchId)) return true;
      
      // Try string comparison
      if (itemId.toString() === searchId.toString()) return true;
      
      return false;
    });
    
    console.log('Menu index found:', menuIndex);
    console.log('Available menu IDs:', dbData.menu_items?.map(item => ({ id: item.id, type: typeof item.id })));
    
    if (menuIndex === -1 || !dbData.menu_items) {
      return NextResponse.json(
        { success: false, message: 'Menu tidak ditemukan' },
        { status: 404 }
      );
    }
    
    // Update fields
    const updateFields = {};
    const fields = ['name', 'description', 'price', 'priceIced', 'priceHot', 'cookingTime', 'category', 'destinationId', 'destinationSlug', 'destinationTitle', 'rating', 'isPopular', 'isSpicy', 'halal', 'available', 'additionalInfo', 'flavorOptions'];
    
    fields.forEach(field => {
      const value = formData.get(field);
      if (value !== null) {
        if (field === 'price' || field === 'priceIced' || field === 'priceHot' || field === 'rating') {
          updateFields[field] = parseFloat(value) || null;
        } else if (field === 'isPopular' || field === 'isSpicy' || field === 'halal' || field === 'available') {
          updateFields[field] = value === 'true';
        } else if (field === 'additionalInfo' || field === 'flavorOptions') {
          try {
            updateFields[field] = JSON.parse(value || '[]');
          } catch (error) {
            console.error(`Error parsing ${field}:`, error);
            console.error(`Value:`, value);
            // If it's not valid JSON, treat it as a single item array
            updateFields[field] = value ? [value] : [];
          }
        } else {
          updateFields[field] = value;
        }
      }
    });
    
    // Handle image upload if provided
    const image = formData.get('image');
    if (image && image.size > 0) {
      const timestamp = Date.now();
      const fileName = `menu_${timestamp}.${image.name.split('.').pop()}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'menu');
      
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const filePath = path.join(uploadDir, fileName);
      const buffer = await image.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(buffer));
      updateFields.image = `/uploads/menu/${fileName}`;
    }
    
    // Update menu item
    updateFields.updated_at = new Date().toISOString();
    dbData.menu_items[menuIndex] = { ...dbData.menu_items[menuIndex], ...updateFields };
    
    // Save to database
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Menu berhasil diperbarui',
      menu_item: dbData.menu_items[menuIndex]
    });
    
  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui menu' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID menu diperlukan' },
        { status: 400 }
      );
    }
    
    // Read database
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find and remove menu item
    if (!dbData.menu_items) {
      return NextResponse.json(
        { success: false, message: 'Menu tidak ditemukan' },
        { status: 404 }
      );
    }
    
    const menuIndex = dbData.menu_items.findIndex(item => {
      const itemId = item.id;
      const searchId = id;
      
      // Try exact match first
      if (itemId === searchId) return true;
      
      // Try integer comparison
      if (parseInt(itemId) === parseInt(searchId)) return true;
      
      // Try string comparison
      if (itemId.toString() === searchId.toString()) return true;
      
      return false;
    });
    if (menuIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Menu tidak ditemukan' },
        { status: 404 }
      );
    }
    
    // Remove menu item
    dbData.menu_items.splice(menuIndex, 1);
    
    // Save to database
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Menu berhasil dihapus'
    });
    
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus menu' },
      { status: 500 }
    );
  }
}
