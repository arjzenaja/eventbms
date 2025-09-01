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
    
    // Try to get menu items from database first
    try {
      const dbData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'db.json'), 'utf8'));
      let menuItems = dbData.menu_items || [];
      
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
          menus: menuItems,
          total: menuItems.length,
          categories: categories,
          priceRange: priceRange
        });
      }
    } catch (dbError) {
      console.log('Database not available, using fallback data');
    }
    
    // Fallback to static data if no database items found
    let menus = menuData.default;
    
    if (destinationSlug && menuData[destinationSlug]) {
      menus = menuData[destinationSlug];
    } else if (destinationId) {
      // You can add logic here to fetch menus from database based on destinationId
      menus = menuData.default;
    }
    
    return NextResponse.json({
      success: true,
      menus: menus,
      total: menus.length,
      categories: [...new Set(menus.map(menu => menu.category))],
      priceRange: {
        min: Math.min(...menus.map(menu => menu.price)),
        max: Math.max(...menus.map(menu => menu.price))
      }
    });
    
  } catch (error) {
    console.error('Error fetching menu data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch menu data',
        menus: menuData.default 
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { destinationId, menuId, quantity, specialInstructions } = body;
    
    // Here you would typically save the order to your database
    console.log('New order received:', {
      destinationId,
      menuId,
      quantity,
      specialInstructions,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({
      success: true,
      message: 'Order received successfully',
      orderId: `ORD-${Date.now()}`,
      estimatedTime: '15-20 menit'
    });
    
  } catch (error) {
    console.error('Error processing order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process order' },
      { status: 500 }
    );
  }
}
