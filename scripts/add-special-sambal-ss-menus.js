const fs = require('fs');
const path = require('path');

// Database path
const dbPath = path.join(__dirname, 'db.json');

// Restaurant information
const restaurantId = "27";
const restaurantTitle = "Waroeng Spesial Sambal(SS)";
const restaurantSlug = "https://linktr.ee/waroeng.ss?utm_source=linktree_profile_share&ltsid=f2ac6687-ef75-4555-8827-e7858dca41db";

// Helper function to create menu item
function createMenuItem(name, category, price, description = '', isSpicy = false, isPopular = false, additionalInfo = ['Halal']) {
  return {
    name,
    description,
    price,
    cookingTime: "5-10 menit",
    category,
    destinationId: restaurantId,
    destinationSlug: restaurantSlug,
    destinationTitle: restaurantTitle,
    rating: 4.5,
    isPopular,
    isSpicy,
    halal: true,
    available: true,
    additionalInfo,
    image: "/placeholder.jpg",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

// Helper function for dual pricing (es/panas)
function dualPricing(name, category, hotPrice, icedPrice, description = '', isSpicy = false, isPopular = false) {
  return {
    name,
    description,
    priceHot: hotPrice,
    priceIced: icedPrice,
    cookingTime: "5-10 menit",
    category,
    destinationId: restaurantId,
    destinationSlug: restaurantSlug,
    destinationTitle: restaurantTitle,
    rating: 4.5,
    isPopular,
    isSpicy,
    halal: true,
    available: true,
    additionalInfo: ['Halal'],
    image: "/placeholder.jpg",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

// Helper function for triple pricing (jus/es/panas)
function triplePricing(name, category, juicePrice, hotPrice, icedPrice, description = '', isSpicy = false, isPopular = false) {
  return {
    name,
    description,
    priceJuice: juicePrice,
    priceHot: hotPrice,
    priceIced: icedPrice,
    cookingTime: "5-10 menit",
    category,
    destinationId: restaurantId,
    destinationSlug: restaurantSlug,
    destinationTitle: restaurantTitle,
    rating: 4.5,
    isPopular,
    isSpicy,
    halal: true,
    available: true,
    additionalInfo: ['Halal'],
    image: "/placeholder.jpg",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

// Menu items data
const menuItems = [
  // Menu Tanda Tangan (Signature Menu)
  createMenuItem("Jus Gobal Gabul", "Minuman", 14000, "Jus khas dengan rasa unik Gobal Gabul", false, true),
  createMenuItem("Wedang Pedas Gobal Gabul", "Minuman", 12000, "Wedang pedas khas dengan cita rasa Gobal Gabul", true, true),
  createMenuItem("Sambal Gobal Gabul", "Sambal", 8000, "Sambal khas dengan nama usil 'Bingung'", true, true),
  createMenuItem("Ayam Pedas Gobal Gabul", "Ayam", 18500, "Ayam pedas dengan sambal Gobal Gabul", true, true),
  createMenuItem("Telur Dadar Gobal Gabul", "Lauk", 10000, "Telur dadar dengan sambal Gobal Gabul (grg/bkr)", true, false),
  createMenuItem("Tahu Gobal Gabul", "Lauk", 9000, "Tahu dengan sambal Gobal Gabul", true, false),

  // Minuman Khas Nusantara
  createMenuItem("Jus MSNPJ Spesial", "Minuman", 15000, "Jus campuran buah-buahan spesial", false, true),
  createMenuItem("Jus Alpukat", "Minuman", 14000, "Jus alpukat segar", false, false),
  createMenuItem("Jus Daging Buah Durian", "Minuman", 18500, "Jus durian segar", false, false),
  createMenuItem("Jus Jambu", "Minuman", 10000, "Jus jambu segar", false, false),
  createMenuItem("Jus Mangga", "Minuman", 10000, "Jus mangga segar", false, false),
  createMenuItem("Jus Melon", "Minuman", 9000, "Jus melon segar", false, false),
  createMenuItem("Jus Nanas", "Minuman", 7000, "Jus nanas segar", false, false),
  createMenuItem("Jus Nangka", "Minuman", 9000, "Jus nangka segar", false, false),
  createMenuItem("Jus Semangka", "Minuman", 8000, "Jus semangka segar", false, false),
  createMenuItem("Jus Strawberry", "Minuman", 14000, "Jus strawberry segar", false, false),
  createMenuItem("Jus Tomat", "Minuman", 7000, "Jus tomat segar", false, false),
  createMenuItem("Jus Wortel", "Minuman", 7000, "Jus wortel segar", false, false),
  createMenuItem("Jus Sirsak Bulan", "Minuman", 11000, "Jus sirsak bulan segar", false, false),

  // Minuman dengan dual pricing (es/panas)
  dualPricing("Teh", "Minuman", 5000, 5000, "Teh hangat dan dingin", false, false),
  dualPricing("Teh Tawar", "Minuman", 4000, 4000, "Teh tawar hangat dan dingin", false, false),
  dualPricing("Jeruk", "Minuman", 7000, 7000, "Jeruk hangat dan dingin", false, false),
  dualPricing("Jeruk Nipis", "Minuman", 8000, 8000, "Jeruk nipis hangat dan dingin", false, false),
  dualPricing("Lemon Tea", "Minuman", 9500, 9500, "Lemon tea hangat dan dingin", false, false),
  dualPricing("Teh Jeruk Nipis", "Minuman", 8000, 8000, "Teh jeruk nipis hangat dan dingin", false, false),
  dualPricing("Teh Tarik", "Minuman", 9000, 9000, "Teh tarik hangat dan dingin", false, false),
  dualPricing("Kopi Hitam", "Minuman", 9000, 9000, "Kopi hitam hangat dan dingin", false, false),
  dualPricing("Coklat Malt", "Minuman", 9500, 9500, "Coklat malt hangat dan dingin", false, false),
  dualPricing("Susu Coklat", "Minuman", 8000, 8000, "Susu coklat hangat dan dingin", false, false),
  dualPricing("Air Tawar Rebus", "Minuman", 2000, 2000, "Air tawar rebus hangat dan dingin", false, false),

  // Minuman dengan triple pricing (jus/es/panas)
  triplePricing("Coffeemix", "Minuman", 7500, 7500, 7500, "Coffeemix dalam bentuk jus, es, dan panas", false, false),
  triplePricing("Coklat", "Minuman", 8500, 8500, 8500, "Coklat dalam bentuk jus, es, dan panas", false, false),

  // Buah Segar Nusantara
  createMenuItem("Buah Campur / Mix", "Buah", 7000, "Buah campur segar", false, false),
  createMenuItem("Buah Melon", "Buah", 5500, "Buah melon segar", false, false),
  createMenuItem("Buah Nanas", "Buah", 5000, "Buah nanas segar", false, false),
  createMenuItem("Buah Pepaya", "Buah", 4500, "Buah pepaya segar", false, false),
  createMenuItem("Buah Semangka", "Buah", 5000, "Buah semangka segar", false, false),
  createMenuItem("Buah Pisang", "Buah", 9000, "Buah pisang segar", false, false),

  // Sayur Khas Nusantara
  createMenuItem("Kemangi Goreng Tepung", "Sayuran", 4000, "Kemangi goreng tepung", false, false),
  createMenuItem("Kobis Goreng Tepung", "Sayuran", 5000, "Kobis goreng tepung", false, false),
  createMenuItem("Kobis Goreng", "Sayuran", 3500, "Kobis goreng", false, false),
  createMenuItem("Pete Goreng", "Sayuran", 6000, "Pete goreng", false, false),
  createMenuItem("Terong Goreng", "Sayuran", 4500, "Terong goreng", false, false),
  createMenuItem("Gudangan", "Sayuran", 5000, "Sayuran kukus dengan bumbu kelapa", false, false),
  createMenuItem("Karedok", "Sayuran", 5500, "Sayuran mentah dengan sambal kacang", false, false),
  createMenuItem("Lalapan", "Sayuran", 3500, "Sayuran mentah segar", false, false),
  createMenuItem("Pecel", "Sayuran", 5500, "Sayuran dengan sambal kacang", false, false),
  createMenuItem("Plencing Jawa", "Sayuran", 5500, "Sayuran khas Jawa", false, false),
  createMenuItem("Sayur Asem", "Sayuran", 7000, "Sayur asem segar", false, false),
  createMenuItem("Trancam", "Sayuran", 5500, "Sayuran mentah dengan bumbu kelapa", false, false),
  createMenuItem("Jamur (ca/tumis)", "Sayuran", 6000, "Jamur cah atau tumis", false, false),
  createMenuItem("Kangkung (ca/tumis)", "Sayuran", 6000, "Kangkung cah atau tumis", false, false),
  createMenuItem("Buncis (ca/tumis)", "Sayuran", 5500, "Buncis cah atau tumis", false, false),
  createMenuItem("Tauge (ca/tumis)", "Sayuran", 5500, "Tauge cah atau tumis", false, false),
  createMenuItem("Tumis Jengkol", "Sayuran", 8000, "Tumis jengkol", false, false),
  createMenuItem("Tumis Terong", "Sayuran", 6000, "Tumis terong", false, false),
  createMenuItem("Daun Singkong Pedas", "Sayuran", 5000, "Daun singkong pedas", true, false),

  // Nasi Khas Nusantara
  createMenuItem("Nasi Putih (per orang makan)", "Nasi", 5500, "Nasi putih per porsi", false, false),
  createMenuItem("Nasi Putih (Cething)", "Nasi", 22000, "Nasi putih porsi besar", false, false),

  // Menu Paket
  createMenuItem("Paket Pedas Gobal Gabul", "Paket", 28500, "Paket lengkap dengan nasi, sambal terong, ayam pedas, telur dadar, air mineral, dan wedang pedas", true, true),
  createMenuItem("Paket Ayam Telur Gobal Gabul", "Paket", 21000, "Paket ayam dan telur dengan sambal Gobal Gabul", true, false),
  createMenuItem("Paket Lele Penyet Sambal Tomat", "Paket", 17000, "Paket lele penyet dengan sambal tomat", true, false),
  createMenuItem("Paket Nila Pedas Abis", "Paket", 18000, "Paket nila pedas abis", true, false),
  createMenuItem("Paket Telur Tahu Dadar Sambal Kecap", "Paket", 13500, "Paket telur tahu dadar dengan sambal kecap", false, false),

  // Sambal Khas Nusantara
  createMenuItem("Sambal Bajak", "Sambal", 5000, "Sambal bajak dengan nama usil 'Teroris'", true, false),
  createMenuItem("Sambal Bawang", "Sambal", 2500, "Sambal bawang dengan nama usil 'Goalpal'", true, false),
  createMenuItem("Sambal Bawang Joss", "Sambal", 3000, "Sambal bawang joss", true, false),
  createMenuItem("Sambal Bawang Bakar / Goreng", "Sambal", 2500, "Sambal bawang bakar atau goreng", true, false),
  createMenuItem("Sambal Bawang Tomat", "Sambal", 3000, "Sambal bawang tomat dengan nama usil 'Bete'", true, false),
  createMenuItem("Sambal Bawang Brambang Goreng", "Sambal", 4000, "Sambal bawang brambang goreng dengan nama usil 'P3K'", true, false),
  createMenuItem("Sambal Matah", "Sambal", 3000, "Sambal matah segar", true, false),
  createMenuItem("Sambal Kecap", "Sambal", 3500, "Sambal kecap dengan nama usil 'Bull Shit'", true, false),
  createMenuItem("Sambal Bawang Lombok Ijo", "Sambal", 2500, "Sambal bawang lombok ijo dengan nama usil 'Hantu Kiper'", true, false),
  createMenuItem("Sambal Mangga Muda / Nanas", "Sambal", 5500, "Sambal mangga muda atau nanas dengan nama usil 'Semangat'", true, false),
  createMenuItem("Sambal Tomat Trasi Matang", "Sambal", 3500, "Sambal tomat trasi matang dengan nama usil 'The End'", true, false),
  createMenuItem("Sambal Trasi Lombok Ijo", "Sambal", 3000, "Sambal trasi lombok ijo", true, false),
  createMenuItem("Sambal Trasi Matang", "Sambal", 3500, "Sambal trasi matang dengan nama usil 'Senja'", true, false),
  createMenuItem("Sambal Trasi Segar", "Sambal", 3000, "Sambal trasi segar dengan nama usil 'Sport'", true, false),
  createMenuItem("Sambal Trasi Tomat Segar", "Sambal", 3500, "Sambal trasi tomat segar dengan nama usil 'Pusing'", true, false),
  createMenuItem("Sambal Trasi Brambang Tomat Joss", "Sambal", 3500, "Sambal trasi brambang tomat joss", true, false),

  // Lauk Khas Nusantara - Sambal-based dishes
  createMenuItem("Sambal Belut", "Lauk", 7500, "Sambal belut dengan nama usil 'Smack Down'", true, false),
  createMenuItem("Sambal Tahu / Tempe", "Lauk", 3500, "Sambal tahu atau tempe dengan nama usil 'Pede'", true, false),
  createMenuItem("Sambal Masak Teri", "Lauk", 6500, "Sambal masak teri dengan nama usil 'Geli'", true, false),
  createMenuItem("Sambal Rempelo Ati", "Lauk", 4500, "Sambal rempelo ati", true, false),
  createMenuItem("Sambal Jamur", "Lauk", 6500, "Sambal jamur dengan nama usil 'Parasit'", true, false),
  createMenuItem("Sambal Jengkol", "Lauk", 7500, "Sambal jengkol", true, false),
  createMenuItem("Sambal Pete", "Lauk", 7500, "Sambal pete", true, false),
  createMenuItem("Sambal Terong", "Lauk", 5500, "Sambal terong dengan nama usil 'Raksasa'", true, false),
  createMenuItem("Sambal Cumi", "Lauk", 10000, "Sambal cumi dengan nama usil 'Purba'", true, false),
  createMenuItem("Sambal Cumi Tepung", "Lauk", 11500, "Sambal cumi tepung", true, false),
  createMenuItem("Sambal Udang Pedas", "Lauk", 10500, "Sambal udang pedas dengan nama usil 'Hati - hati'", true, false),
  createMenuItem("Sambal Udang Tepung", "Lauk", 11500, "Sambal udang tepung", true, false),
  createMenuItem("Sambal Ikan Pindang", "Lauk", 9000, "Sambal ikan pindang", true, false),
  createMenuItem("Sambal Gongso", "Lauk", 5000, "Sambal gongso", true, false),
  createMenuItem("Sambal Gongso Rempelo Ati", "Lauk", 7500, "Sambal gongso rempelo ati", true, false),

  // Lauk Khas Nusantara - Traditional dishes
  createMenuItem("Bawal (grg/bkr)", "Lauk", 10500, "Bawal goreng atau bakar", false, false),
  createMenuItem("Gurame (grg/bkr)", "Lauk", 41000, "Gurame goreng atau bakar", false, false),
  createMenuItem("Lele (grg/bkr/tpg)", "Lauk", 11000, "Lele goreng, bakar, atau tepung", false, false),
  createMenuItem("Nila (grg/bkr)", "Lauk", 13500, "Nila goreng atau bakar", false, false),
  createMenuItem("Pindang (grg/bkr)", "Lauk", 6500, "Pindang goreng atau bakar", false, false),
  createMenuItem("Wader", "Lauk", 8000, "Wader segar", false, false),
  createMenuItem("Jambal Asin", "Lauk", 7500, "Jambal asin", false, false),
  createMenuItem("Teri Goreng", "Lauk", 5000, "Teri goreng", false, false),
  createMenuItem("Cumi Tepung", "Lauk", 15500, "Cumi tepung", false, false),
  createMenuItem("Udang Tepung", "Lauk", 15000, "Udang tepung", false, false),
  createMenuItem("Daging Sapi (grg/bkr)", "Lauk", 18000, "Daging sapi goreng atau bakar", false, false),
  createMenuItem("Iga Sapi (grg/bkr)", "Lauk", 30000, "Iga sapi goreng atau bakar", false, false),
  createMenuItem("Paru Sapi (grg/bkr)", "Lauk", 20000, "Paru sapi goreng atau bakar", false, false),
  createMenuItem("Babat Sapi (grg/bkr)", "Lauk", 18000, "Babat sapi goreng atau bakar", false, false),
  createMenuItem("Iso Sapi (grg/bkr)", "Lauk", 18500, "Iso sapi goreng atau bakar", false, false),
  createMenuItem("Jamur Tepung", "Lauk", 6500, "Jamur tepung", false, false),
  createMenuItem("Perkedel Ayam (grg/bkr)", "Lauk", 7000, "Perkedel ayam goreng atau bakar", false, false),
  createMenuItem("Rempelo Ati (grg/bkr)", "Lauk", 10500, "Rempelo ati goreng atau bakar", false, false),
  createMenuItem("Telur Dadar Biasa (grg/bkr)", "Lauk", 8500, "Telur dadar biasa goreng atau bakar", false, false),
  createMenuItem("Tahu (grg/bkr)", "Lauk", 5000, "Tahu goreng atau bakar", false, false),
  createMenuItem("Tempe (grg/bkr/tpg)", "Lauk", 5000, "Tempe goreng, bakar, atau tepung", false, false),
];

// Function to add menu items to database
function addMenuItems() {
  try {
    // Read current database
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Initialize menu_items array if it doesn't exist
    if (!dbData.menu_items) {
      dbData.menu_items = [];
    }
    
    // Get the next available ID
    const existingIds = dbData.menu_items.map(item => parseInt(item.id)).filter(id => !isNaN(id));
    let nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
    
    // Add ID to each menu item
    const menuItemsWithIds = menuItems.map(item => {
      const itemWithId = {
        ...item,
        id: nextId.toString()
      };
      nextId++;
      return itemWithId;
    });
    
    // Add menu items to database
    dbData.menu_items.push(...menuItemsWithIds);
    
    // Write back to database
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    console.log(`✅ Successfully added ${menuItemsWithIds.length} menu items for ${restaurantTitle}`);
    console.log(`📊 Categories added:`);
    
    // Count items by category
    const categoryCount = {};
    menuItemsWithIds.forEach(item => {
      categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
    });
    
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`   - ${category}: ${count} items`);
    });
    
    console.log(`\n🎯 Restaurant ID: ${restaurantId}`);
    console.log(`🏪 Restaurant: ${restaurantTitle}`);
    console.log(`📱 Total menu items in database: ${dbData.menu_items.length}`);
    
  } catch (error) {
    console.error('❌ Error adding menu items:', error);
  }
}

// Run the script
console.log('🚀 Adding Special Sambal (SS) menu items...\n');
addMenuItems();
