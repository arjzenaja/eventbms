const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');
const restaurantId = "30";
const restaurantTitle = "Kopi Pletok";
const restaurantSlug = "";

function createMenuItem(name, category, price, description = '', isSpicy = false, isPopular = false) {
  return {
    name,
    description,
    price,
    cookingTime: "10-15 menit",
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

const menuItems = [
  // LAWUH (Side Dishes)
  createMenuItem("Tahu/ Tempe Bacem", "Lawuh", 4000, "Tahu atau tempe bacem", false, false),
  createMenuItem("Ndog Pletok", "Lawuh", 8000, "Ndog pletok khas", false, false),
  createMenuItem("Pepes Tahu", "Lawuh", 9000, "Pepes tahu", false, false),
  createMenuItem("Pepes Peda/ Telor Asin", "Lawuh", 12000, "Pepes peda atau telor asin", false, false),
  createMenuItem("Pepes Ayam", "Lawuh", 19000, "Pepes ayam", false, false),
  createMenuItem("Lembutan", "Lawuh", 13000, "Lembutan", false, false),
  createMenuItem("Ati Ampela Kampung", "Lawuh", 8000, "Ati ampela ayam kampung", false, false),
  createMenuItem("Kepala Ayam Kampung", "Lawuh", 9000, "Kepala ayam kampung", false, false),
  createMenuItem("Ayam Negeri Goreng", "Lawuh", 20000, "Ayam negeri goreng", false, false),
  createMenuItem("Ayam Kampung Goreng", "Lawuh", 28000, "Ayam kampung goreng", false, false),
  createMenuItem("Bebek Goreng 1/4", "Lawuh", 35000, "Bebek goreng seperempat", false, false),
  createMenuItem("Ikan Asin/ Gesek", "Lawuh", 7000, "Ikan asin atau gesek", false, false),
  createMenuItem("Pete (Per Lenjer)", "Lawuh", 10000, "Pete per lenjer", false, false),
  createMenuItem("Sambel Trasi", "Lawuh", 3500, "Sambel trasi", true, false),
  createMenuItem("Sambel Mateng", "Lawuh", 3500, "Sambel matang", true, false),
  createMenuItem("Sambel Ijo", "Lawuh", 3500, "Sambel ijo", true, false),
  createMenuItem("Sambel Dadak", "Lawuh", 5500, "Sambel dadak", true, false),
  createMenuItem("Aneka Kerupuk", "Lawuh", 2500, "Aneka kerupuk", false, false),
  createMenuItem("Lele Goreng", "Lawuh", 11000, "Lele goreng", false, false),
  createMenuItem("Nila Goreng", "Lawuh", 17000, "Nila goreng", false, false),
  createMenuItem("Tempe Garit", "Lawuh", 3500, "Tempe garit", false, false),

  // JAJANAN (Snacks)
  createMenuItem("Timus", "Jajanan", 9000, "Timus khas", false, false),
  createMenuItem("Serabi Pletok", "Jajanan", 10000, "Serabi pletok khas", false, true),
  createMenuItem("Pisang Goreng", "Jajanan", 9000, "Pisang goreng", false, false),
  createMenuItem("Mendoan", "Jajanan", 9000, "Mendoan tempe", false, false),
  createMenuItem("Dage Goreng", "Jajanan", 6000, "Dage goreng", false, false),
  createMenuItem("Tape Goreng", "Jajanan", 9000, "Tape goreng", false, false),
  createMenuItem("Singkong Goreng", "Jajanan", 6000, "Singkong goreng", false, false),

  // DAHARAN (Main Meals/Rice Dishes)
  createMenuItem("Sega Putih Pisah", "Daharan", 5500, "Nasi putih pisah", false, false),
  createMenuItem("Sega Abang Pisah", "Daharan", 8000, "Nasi merah pisah", false, false),
  createMenuItem("Lodeh Terong Pisah", "Daharan", 7000, "Lodeh terong pisah", false, false),
  createMenuItem("Lodeh Tempe Pisah", "Daharan", 7000, "Lodeh tempe pisah", false, false),
  createMenuItem("Sayur Asem Pisah", "Daharan", 7000, "Sayur asem pisah", false, false),
  createMenuItem("Oseng Oseng Pisah", "Daharan", 7000, "Oseng oseng pisah", false, false),
  createMenuItem("Sop Ceker Ayam Pisah", "Daharan", 10000, "Sop ceker ayam pisah", false, false),
  createMenuItem("Mie Goreng Pisah", "Daharan", 10000, "Mie goreng pisah", false, false),
];

// Add to database
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const existingIds = dbData.menu_items?.map(item => parseInt(item.id)).filter(id => !isNaN(id)) || [];
let nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;

const menuItemsWithIds = menuItems.map(item => {
  const itemWithId = { ...item, id: nextId.toString() };
  nextId++;
  return itemWithId;
});

if (!dbData.menu_items) dbData.menu_items = [];
dbData.menu_items.push(...menuItemsWithIds);

fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));

console.log(`✅ Added ${menuItemsWithIds.length} menu items for ${restaurantTitle}`);
console.log(`📊 Categories: Lawuh (21), Jajanan (7), Daharan (8)`);
console.log(`🎯 Restaurant ID: ${restaurantId}`);
