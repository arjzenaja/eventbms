const fs = require('fs');
const path = require('path');

// Read current database
const dbPath = path.join(__dirname, 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Get the next available ID
const getNextId = () => {
  const maxId = Math.max(...db.menu_items.map(item => parseInt(item.id) || 0));
  return maxId + 1;
};

// Helper function to create menu item
function createMenuItem(name, description, price, category, additionalInfo = [], isPopular = false, isSpicy = false, cookingTime = "5-20 menit") {
  return {
    id: getNextId().toString(),
    name: name,
    description: description,
    price: price,
    cookingTime: cookingTime,
    category: category,
    destinationId: "18", // Taman Langit destination ID
    destinationSlug: "https://linktr.ee/tamanlangit?utm_source=linktree_profile_share&ltsid=f5033cb9-6c05-4a0a-8578-4ef93dc8852b",
    destinationTitle: "Taman Langit",
    rating: 4.6,
    isPopular: isPopular,
    isSpicy: isSpicy,
    halal: true,
    available: true,
    additionalInfo: additionalInfo,
    image: "/placeholder.jpg",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

// Taman Langit Menu Items
const tamanLangitMenus = [
  // SALAD
  createMenuItem("Tango Salad", "Dory Fillet dengan sayuran segar dipadukan dengan spesial bangkok dressing", 45000, "Salad", ["Halal", "Fresh", "Healthy"], false, false, "10-15 menit"),
  createMenuItem("Hashirama Salad", "Karage ayam - Sayuran Segar - Saus Wijen Panggang - Edamame - Telur", 55000, "Salad", ["Halal", "Fresh", "Healthy"], true, false, "12-18 menit"),
  createMenuItem("Chicken Aioli", "Irisan Ayam Panggang - Selada - Saus Parmesan Putih - Roti Garlic", 55000, "Salad", ["Halal", "Fresh", "Healthy"], false, false, "10-15 menit"),
  
  // LIGHT BITES
  createMenuItem("Spicy Chicken Lollipop", "Nugget Ayam Berbalut Saus Spicy Buffalo", 45000, "Makanan Ringan", ["Halal", "Spicy"], false, true, "8-12 menit"),
  createMenuItem("French Fries", "200 gram Original Shoestring French Fries dengan Cheese Sauce", 32000, "Makanan Ringan", ["Halal", "Crispy"], false, false, "5-8 menit"),
  createMenuItem("Corn Ribs", "Jagung Digoreng Berbalut Aromatic Butter Sauce dengan Taburan Parmesan Cheese", 28000, "Makanan Ringan", ["Halal", "Crispy"], false, false, "8-12 menit"),
  createMenuItem("Mendoan Tempe", "Tempe Legendaris Berbalut Tepung Bawang gurih dan Sambal Kecap", 28000, "Makanan Ringan", ["Halal", "Traditional"], false, false, "8-12 menit"),
  
  // PIZZA
  createMenuItem("Napoleon Pizza", "Concasse Sauce, Mozarella, Basil, Tomato", 75000, "Pizza", ["Halal", "Italian"], false, false, "15-20 menit"),
  createMenuItem("Formaggi Pizza", "Bechamel Sauce, Mozarella, Cheddar, Parmesan Cheese", 75000, "Pizza", ["Halal", "Italian"], false, false, "15-20 menit"),
  createMenuItem("Americans Favorite Pizza", "Concasse Sauce, Mozarella, Smoked Beef, Minced Beef, BBQ Sauce, American Cheese, Onion", 85000, "Pizza", ["Halal", "Italian"], true, false, "15-20 menit"),
  
  // ITALIAN
  createMenuItem("Spaghetti Aglio Olio", "Pasta Spaghetti dalam minyak bawang dengan Topping Smoked Beef & Jamur", 55000, "Italian", ["Halal", "Traditional"], false, false, "12-18 menit"),
  createMenuItem("Spaghetti Bolognese", "Pasta Spaghetti disiram dengan Saus Bolognese", 55000, "Italian", ["Halal", "Traditional"], false, false, "12-18 menit"),
  createMenuItem("Creamy Mushroom Spaghetti", "Pasta Spaghetti disiram dengan Saus Krim, ditambahkan Topping Smoked Beef & Jamur", 55000, "Italian", ["Halal", "Creamy"], true, false, "12-18 menit"),
  createMenuItem("Spaghetti Brulee", "Bolognese Spaghetti disiram Saus Bechamel disajikan dengan Mozarella Panggang", 55000, "Italian", ["Halal", "Premium"], false, false, "15-20 menit"),
  
  // THE WORK SIGNATURE
  createMenuItem("Nasi Goreng Rempah", "Wok Style Nasi Goreng Berbumbu 10 Rempah Khas, Daging sapi cincang, Scrambled Egg, dengan Topping Emping & Acar", 50000, "The Work Signature", ["Halal", "Signature"], true, false, "15-20 menit"),
  createMenuItem("Nasi Goreng Tala", "Wok Style Nasi Goreng Spesial Taman Langit dengan Smoked Beef, disajikan dengan Topping Sate Lilit, Telor Mata Sapi, & Sambal Matah", 45000, "The Work Signature", ["Halal", "Signature"], true, false, "15-20 menit"),
  createMenuItem("Mie Goreng Tala", "Wok Style Mie Goreng Aromatik dengan Sayuran, Topping, Telur, Udang & Bakso", 50000, "The Work Signature", ["Halal", "Signature"], false, false, "15-20 menit"),
  createMenuItem("Mie Kuah Klungtung", "Wok Style Mie Kuah dengan cita rasa gurih dan smoky. Disajikan dengan kuah rempah, sayur segar, topping istimewa, dan acar terpisah sebagai pelengkap", 45000, "The Work Signature", ["Halal", "Signature"], false, false, "15-20 menit"),
  
  // FAVORITES NUSANTARA
  createMenuItem("Ayam Bakar Taliwang", "Ayam Kampung Bakar Taliwang Khas NTB, disajikan dengan Nasi Putih & Sambal Matah", 65000, "Favorites Nusantara", ["Halal", "Traditional"], true, false, "20-25 menit"),
  createMenuItem("Beef Satay Taman Langit", "Sate Sapi Khas Taman Langit, disajikan dengan Bumbu Spesial Taman Langit & Nasi Putih", 75000, "Favorites Nusantara", ["Halal", "Signature"], true, false, "15-20 menit"),
  createMenuItem("Iga Bakar Sambal Matah", "Iga Bakar Khas Taman Langit, disajikan dengan Nasi Putih & Sambal Matah & Emping", 85000, "Favorites Nusantara", ["Halal", "Signature"], true, false, "25-30 menit"),
  createMenuItem("Rawon Soerabaja", "Soto Hitam Khas Surabaya, dengan Potongan Daging Kisi, disajikan dengan Nasi Putih, Telur Asin & Krupuk Udang", 80000, "Favorites Nusantara", ["Halal", "Traditional"], false, false, "20-25 menit"),
  createMenuItem("Soto Betawi", "Daging Kisi dalam Kuah Rempah yang Creamy, disajikan dengan Nasi Putih & Emping", 75000, "Favorites Nusantara", ["Halal", "Traditional"], false, false, "20-25 menit"),
  createMenuItem("Ayam Kampung Goreng", "Ayam Kampung Goreng khas Taman Langit disajikan dengan cita rasa autentik Nusantara", 55000, "Favorites Nusantara", ["Halal", "Traditional"], false, false, "15-20 menit"),
  createMenuItem("Ayam Kampung Bakar", "Ayam Kampung Bakar khas Taman Langit disajikan dengan cita rasa autentik Nusantara", 55000, "Favorites Nusantara", ["Halal", "Traditional"], false, false, "20-25 menit"),
  
  // RICE BOWL
  createMenuItem("Chicken Karage Sambal Matah", "Chicken Karage served with Sambal Matah", 45000, "Rice Bowl", ["Halal", "Spicy"], false, true, "12-18 menit"),
  createMenuItem("Pepper Chicken Katsu", "Chicken Katsu served with Blackpepper Sauce & Potato Chips", 45000, "Rice Bowl", ["Halal", "Spicy"], false, true, "12-18 menit"),
  createMenuItem("Bulgogi Beef Rijst", "Korean BBQ Beef Short Plate, served with Potato Chips", 48000, "Rice Bowl", ["Halal", "Korean"], false, false, "15-20 menit"),
  createMenuItem("Pepper Beef Rijst", "Beef Short Plate served with Blackpepper Sauce & Potato Chips", 48000, "Rice Bowl", ["Halal", "Spicy"], false, true, "15-20 menit"),
  createMenuItem("Bulgogi Chicken Don", "Chicken Karage served with Bulgogi Sauce & Scrambled Egg", 45000, "Rice Bowl", ["Halal", "Korean"], false, false, "12-18 menit"),
  
  // KIDS MEAL
  createMenuItem("Kiddo Fried Rice", "Nasi Goreng Butter dengan topping Chicken Lolipop, Krupuk & Nori", 42000, "Kids Meal", ["Halal", "Kids"], false, false, "10-15 menit"),
  createMenuItem("Spaghetti Bolognese Kids", "Pasta Spaghetti disiram dengan Saus Bolognese", 38000, "Kids Meal", ["Halal", "Kids"], false, false, "12-18 menit"),
  createMenuItem("Kids Platter", "Kentang Goreng, Sosis Sapi, Chicken Lolipop, disajikan dengan Saus Cheese & Mayo", 40000, "Kids Meal", ["Halal", "Kids"], false, false, "10-15 menit"),
  createMenuItem("Nanban Katsu", "Ayam Katsu dengan saus Nanban", 38000, "Kids Meal", ["Halal", "Kids"], false, false, "12-18 menit"),
  createMenuItem("Creamy Chicken Mushroom Soup", "Creamy soup with chicken and mushrooms", 25000, "Kids Meal", ["Halal", "Kids"], false, false, "8-12 menit"),
  createMenuItem("Crab Asparagus Soup", "Soup with crab and asparagus", 25000, "Kids Meal", ["Halal", "Kids"], false, false, "8-12 menit"),
  createMenuItem("Creamy Chicken Corn Soup", "Creamy soup with chicken and corn", 25000, "Kids Meal", ["Halal", "Kids"], false, false, "8-12 menit"),
  createMenuItem("Vegetable Soup", "Soup with various vegetables", 25000, "Kids Meal", ["Halal", "Kids"], false, false, "8-12 menit"),
  
  // DESSERT
  createMenuItem("Waffle Crumbling", "Belgian Waffle with Caramel Sauce, Cookies Crumble, and Vanilla Ice Cream", 40000, "Dessert", ["Halal", "Sweet"], false, false, "10-15 menit"),
  createMenuItem("Waffle Choco Almond", "Belgian Waffle with Chocolate Sauce, Almonds, and Chocolate Ice Cream", 40000, "Dessert", ["Halal", "Sweet"], false, false, "10-15 menit"),
  createMenuItem("Waffle Berry Cheese", "Belgian Waffle with Strawberry Sauce, Cream Cheese Frosting, and Vanilla Ice Cream", 40000, "Dessert", ["Halal", "Sweet"], false, false, "10-15 menit"),
  createMenuItem("Cheese Quesillo", "Cream Cheese Caramel Pudding with Strawberry Sauce", 45000, "Dessert", ["Halal", "Sweet"], false, false, "5-10 menit"),
  createMenuItem("Tala Molten", "Chocolate Lava Cake with Vanilla Ice Cream", 40000, "Dessert", ["Halal", "Sweet"], true, false, "10-15 menit"),
  createMenuItem("Cream Cheese Brownie", "Chocolate Brownies with Cream Cheese and Vanilla Ice Cream", 45000, "Dessert", ["Halal", "Sweet"], false, false, "5-10 menit"),
  createMenuItem("Pannacota", "Pannacota with Strawberry Sauce", 45000, "Dessert", ["Halal", "Sweet"], false, false, "5-10 menit"),
  
  // TALA ICE CREAM
  createMenuItem("Choco Brownie Ice Cream", "3 Scoop Coklat Eskrim - Brownis - Dark Coklat Parut", 28000, "Dessert", ["Halal", "Cold", "Sweet"], false, false, "3-5 menit"),
  createMenuItem("Vanilla Cookies Ice Cream", "3 Scoop Vanilla Eskrim - Saus Karamel - Oreo Crumb - Oreo Utuh", 28000, "Dessert", ["Halal", "Cold", "Sweet"], false, false, "3-5 menit"),
  createMenuItem("Vanilla Regal Ice Cream", "3 Scoop Vanilla Eskrim - Karamel Crumb - Biskuit Regal - Saus Karamel", 28000, "Dessert", ["Halal", "Cold", "Sweet"], false, false, "3-5 menit"),
  createMenuItem("Strawberry Cheese Ice Cream", "3 Scoop Strawberry Eskrim - Redvelvet Crumb - Cheddar Parut - Biscuit Ritz", 28000, "Dessert", ["Halal", "Cold", "Sweet"], false, false, "3-5 menit"),
  createMenuItem("Affogato Ice Cream", "3 Scoop Vanilla Eskrim - Expresso - Saus Karamel", 28000, "Dessert", ["Halal", "Cold", "Sweet"], false, false, "3-5 menit"),
  createMenuItem("Tala Mix Ice Cream", "1 Scoop (Vanila - Cokelat - Strawberry Eskrim) - Cheddar Parut - Oreo Crumb - Strawberry Fresh", 32000, "Dessert", ["Halal", "Cold", "Sweet"], true, false, "3-5 menit"),
  
  // SIGNATURE DRINK
  createMenuItem("Strawberry Aperol Sour", "Strawberry Vanilla With Rosela Flower", 37000, "Minuman", ["Halal", "Signature"], false, false, "5-8 menit"),
  createMenuItem("Guavalush", "Guava juice - Mint - Grenadine - Lime", 37000, "Minuman", ["Halal", "Fresh"], false, false, "5-8 menit"),
  createMenuItem("Hazzy Mac Irish", "Irish Cream With Espresso & Nutty", 37000, "Minuman", ["Halal", "Signature"], false, false, "5-8 menit"),
  createMenuItem("Irish Butter Beer", "Irish Cream With Zero Cola", 37000, "Minuman", ["Halal", "Signature"], false, false, "5-8 menit"),
  
  // MOCKTAIL & SODA
  createMenuItem("Pinky Peach", "Soda - Peach - Strawberry - Leci - Mint", 35000, "Minuman", ["Halal", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Summer Feeling", "Soda - Blue Citrus - Lychee - Madu - Mint", 35000, "Minuman", ["Halal", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Mojito", "Soda - Lemon - Lime - Syrup - Mint", 35000, "Minuman", ["Halal", "Fresh"], false, false, "3-5 menit"),
  
  // FRITZY DRINK
  createMenuItem("Apple Freeze", "Apple Juice - Mint - Coconut Water", 35000, "Minuman", ["Halal", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Cucumber Collins", "Soda - Blue Curacao - Cucumber - Mint - Lime", 35000, "Minuman", ["Halal", "Fresh"], false, false, "3-5 menit"),
  
  // FRAPE & SHAKE
  createMenuItem("Avocado Cino", "Espresso - Avocado Frappe - Dark Chocolate - Vanilla Eskrim", 38000, "Minuman", ["Halal", "Cold"], false, false, "5-8 menit"),
  createMenuItem("Chizzu Ichigo", "Strawberry Frappe - CreamCheese - Strawberry Eskrim", 38000, "Minuman", ["Halal", "Cold"], false, false, "5-8 menit"),
  createMenuItem("Gomu No", "Bubble Gum Frappe - Strawberry Sauce - Marshmellow - Strawberry Eskrim", 38000, "Minuman", ["Halal", "Cold"], false, false, "5-8 menit"),
  createMenuItem("Butter Crumbs", "Caramel - Vanilla - Butter Cookies - Caramel Sauce - Vanilla Eskrim", 38000, "Minuman", ["Halal", "Cold"], false, false, "5-8 menit"),
  createMenuItem("Cora Cora", "Dark Cokelat - Caramel - Hazzelnut - Marshmellow", 38000, "Minuman", ["Halal", "Cold"], false, false, "5-8 menit"),
  createMenuItem("Frappio Matcha", "Matcha - Full Cream Milk - Oreo Crumb - Vanilla Ice Cream", 38000, "Minuman", ["Halal", "Cold"], false, false, "5-8 menit"),
  createMenuItem("Ringo Manggo", "Mango Frappe - Peach - Yakult - Vanilla Ice Cream", 38000, "Minuman", ["Halal", "Cold"], false, false, "5-8 menit"),
  createMenuItem("Rhumbaccino", "Espresso - Chocolate Rum Syrup - Dark Chocolate - Chocolate Ice Cream", 38000, "Minuman", ["Halal", "Cold"], false, false, "5-8 menit"),
  createMenuItem("Monstro Milo", "Milo - Chocolate Sauce - Full Cream Milk - Chocolate Ice Cream", 38000, "Minuman", ["Halal", "Cold"], false, false, "5-8 menit"),
  createMenuItem("Cookies Scream", "Vanilla - Oreo Crumb - Full Cream Milk - Vanilla Ice Cream", 38000, "Minuman", ["Halal", "Cold"], false, false, "5-8 menit"),
  createMenuItem("Frappio Taro", "Taro - Full Cream Milk - Oreo Crumb - Vanilla Ice Cream", 38000, "Minuman", ["Halal", "Cold"], false, false, "5-8 menit"),
  
  // BASED MACHIATO
  createMenuItem("Salted Caramel Macchiato", "Salted - Espresso - Caramel Sauce - Susu Full Cream - Macchiato", 34000, "Kopi", ["Halal", "Signature"], false, false, "5-8 menit"),
  createMenuItem("Butterscotch Macchiato", "Butterscotch Sauce - Espresso - Susu Full Cream - Caramel Crumb - Macchiato", 34000, "Kopi", ["Halal", "Signature"], false, false, "5-8 menit"),
  createMenuItem("Matcha Macchiato", "Matcha - Susu Full Cream - Macchiato", 34000, "Kopi", ["Halal", "Signature"], false, false, "5-8 menit"),
  createMenuItem("Redvelvet Macchiato", "Redvelvet - Susu Full Cream - Macchiato", 34000, "Kopi", ["Halal", "Signature"], false, false, "5-8 menit"),
  createMenuItem("Taro Macchiato", "Taro - Susu Full Cream - Macchiato", 34000, "Kopi", ["Halal", "Signature"], false, false, "5-8 menit"),
  
  // ULTIMATE TEA
  createMenuItem("Hot Milktea", "Signature Teh Taman Langit - Susu Steam", 25000, "Teh", ["Halal", "Hot"], false, false, "3-5 menit"),
  createMenuItem("Hot Jasmine Tea", "Teh Celup Melati", 22000, "Teh", ["Halal", "Hot"], false, false, "3-5 menit"),
  createMenuItem("Hot Lemon Tea", "Signature Teh Taman Langit - Madu - Lemon", 25000, "Teh", ["Halal", "Hot"], false, false, "3-5 menit"),
  createMenuItem("Ice Tea", "Signature Teh Taman Langit - Simple Syrup", 22000, "Teh", ["Halal", "Cold"], false, false, "3-5 menit"),
  createMenuItem("Iced Yuzu Lemon Tea", "Signature Teh Taman Langit - Yuzu Citrus - Lemon", 28000, "Teh", ["Halal", "Cold"], false, false, "3-5 menit"),
  createMenuItem("Lychee Tea", "Signature Teh Taman Langit - Lychee", 28000, "Teh", ["Halal", "Cold"], false, false, "3-5 menit"),
  createMenuItem("Berry Tea", "Signature Teh Taman Langit - Fresh Strawberry", 28000, "Teh", ["Halal", "Cold"], false, false, "3-5 menit"),
  createMenuItem("Peach Tea", "Signature Teh Taman Langit - Peach - Mandarin Orange", 28000, "Teh", ["Halal", "Cold"], false, false, "3-5 menit"),
  createMenuItem("Rum Tea", "Signature Teh Taman Langit - Rum - Mint", 28000, "Teh", ["Halal", "Cold"], false, false, "3-5 menit"),
  createMenuItem("Tala Iced Milktea", "Signature Teh Taman Langit - Gula Aren - Susu Full Cream", 28000, "Teh", ["Halal", "Cold"], true, false, "3-5 menit"),
  
  // BASED ICE ESPRESSO
  createMenuItem("Iced Americano", "Espresso - Ice Cube - Mineral Water", 34000, "Kopi", ["Halal", "Cold"], false, false, "3-5 menit"),
  createMenuItem("Mocha Presso", "Espresso - Dark Cokelat - Susu Full Cream", 38000, "Kopi", ["Halal", "Cold"], false, false, "5-8 menit"),
  createMenuItem("Coffee Latte Ice", "Espresso - Susu Full Cream", 38000, "Kopi", ["Halal", "Cold"], false, false, "5-8 menit"),
  createMenuItem("Double Shaken", "Double Shoot Espresso - Susu Full Cream - Aren", 38000, "Kopi", ["Halal", "Cold"], false, false, "5-8 menit"),
  createMenuItem("Cappuccino Presso", "Espresso - Susu Full Cream - Foam", 38000, "Kopi", ["Halal", "Cold"], false, false, "5-8 menit"),
  createMenuItem("Caramel Presso", "Espresso - Caramel - Susu Full Cream", 38000, "Kopi", ["Halal", "Cold"], false, false, "5-8 menit"),
  createMenuItem("Tala Ice Coffee", "Espresso - Susu Full Cream - Aren", 38000, "Kopi", ["Halal", "Cold"], true, false, "5-8 menit"),
  createMenuItem("Black Smack", "Espresso - Apple Lime Soda - Dry Lemon", 38000, "Kopi", ["Halal", "Cold"], false, false, "5-8 menit"),
  
  // HOT STUFF
  createMenuItem("Hot Americano", "Espresso - Hot Water", 28000, "Kopi", ["Halal", "Hot"], false, false, "3-5 menit"),
  createMenuItem("Warm Caramel Latte", "Espresso - Caramel - 65 Celcius Susu Steam dengan Foam", 32000, "Kopi", ["Halal", "Hot"], false, false, "5-8 menit"),
  createMenuItem("Warm Hazelnut Latte", "Espresso - Hazelnut - 65 Celcius Susu Steam dengan Foam", 32000, "Kopi", ["Halal", "Hot"], false, false, "5-8 menit"),
  createMenuItem("Warm Mochaccino", "Espresso - Dark Cokelat - 65 Celcius Susu Steam dengan Foam", 32000, "Kopi", ["Halal", "Hot"], false, false, "5-8 menit"),
  createMenuItem("Warm Milo", "65 Celcius Susu Stream dengan Choco Milo", 28000, "Minuman", ["Halal", "Hot"], false, false, "3-5 menit"),
  createMenuItem("Warm Coffee Latte", "Espresso - 65 Celcius Susu Steam dengan Foam", 32000, "Kopi", ["Halal", "Hot"], false, false, "5-8 menit"),
  createMenuItem("Warm Cappuccino", "Espresso - 65 Celcius Susu Steam dengan Thick Foam", 32000, "Kopi", ["Halal", "Hot"], false, false, "5-8 menit"),
  createMenuItem("Warm Red Velvet Latte", "65 Celcius Susu Stream dengan Red Velvet", 32000, "Minuman", ["Halal", "Hot"], false, false, "5-8 menit"),
  createMenuItem("Warm Matcha Latte", "65 Celcius Susu Stream dengan Matcha", 32000, "Minuman", ["Halal", "Hot"], false, false, "5-8 menit"),
  createMenuItem("Wedang Jahe", "Wedang Jahe Panas", 25000, "Minuman", ["Halal", "Hot"], false, false, "5-8 menit"),
  createMenuItem("Wedang Jahe Susu", "Wedang Jahe Panas dengan Susu", 28000, "Minuman", ["Halal", "Hot"], false, false, "5-8 menit"),
  createMenuItem("Magic Latte", "Double Ristretto with Susu Steam", 32000, "Kopi", ["Halal", "Hot"], true, false, "5-8 menit")
];

// Add taman langit menus to database
console.log(`Adding ${tamanLangitMenus.length} menu items for Taman Langit...`);

// Add each menu item
tamanLangitMenus.forEach(menu => {
  db.menu_items.push(menu);
  console.log(`✓ Added: ${menu.name} - Rp ${menu.price.toLocaleString()}`);
});

// Write updated database
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log(`\n✅ Successfully added ${tamanLangitMenus.length} menu items for Taman Langit!`);
console.log(`📊 Total menu items in database: ${db.menu_items.length}`);

// Summary by category
const categorySummary = tamanLangitMenus.reduce((acc, menu) => {
  acc[menu.category] = (acc[menu.category] || 0) + 1;
  return acc;
}, {});

console.log('\n📋 Menu Summary by Category:');
Object.entries(categorySummary).forEach(([category, count]) => {
  console.log(`  ${category}: ${count} items`);
});

// Summary by original categories
console.log('\n🏷️ Menu Summary by Original Categories:');
const saladCount = tamanLangitMenus.filter(menu => menu.category === 'Salad').length;
const lightBitesCount = tamanLangitMenus.filter(menu => menu.category === 'Makanan Ringan' && (menu.name.includes('Spicy') || menu.name.includes('French') || menu.name.includes('Corn') || menu.name.includes('Mendoan'))).length;
const pizzaCount = tamanLangitMenus.filter(menu => menu.category === 'Pizza').length;
const italianCount = tamanLangitMenus.filter(menu => menu.category === 'Italian').length;
const workSignatureCount = tamanLangitMenus.filter(menu => menu.category === 'The Work Signature').length;
const favoritesNusantaraCount = tamanLangitMenus.filter(menu => menu.category === 'Favorites Nusantara').length;
const riceBowlCount = tamanLangitMenus.filter(menu => menu.category === 'Rice Bowl').length;
const kidsMealCount = tamanLangitMenus.filter(menu => menu.category === 'Kids Meal').length;
const dessertCount = tamanLangitMenus.filter(menu => menu.category === 'Dessert').length;
const signatureDrinkCount = tamanLangitMenus.filter(menu => menu.category === 'Minuman' && (menu.name.includes('Strawberry') || menu.name.includes('Guava') || menu.name.includes('Hazzy') || menu.name.includes('Irish'))).length;
const mocktailSodaCount = tamanLangitMenus.filter(menu => menu.category === 'Minuman' && (menu.name.includes('Pinky') || menu.name.includes('Summer') || menu.name.includes('Mojito'))).length;
const fritzyDrinkCount = tamanLangitMenus.filter(menu => menu.category === 'Minuman' && (menu.name.includes('Apple Freeze') || menu.name.includes('Cucumber'))).length;
const frapeShakeCount = tamanLangitMenus.filter(menu => menu.category === 'Minuman' && (menu.name.includes('Avocado') || menu.name.includes('Chizzu') || menu.name.includes('Gomu') || menu.name.includes('Butter') || menu.name.includes('Cora') || menu.name.includes('Frappio') || menu.name.includes('Ringo') || menu.name.includes('Rhumbaccino') || menu.name.includes('Monstro') || menu.name.includes('Cookies'))).length;
const basedMachitaoCount = tamanLangitMenus.filter(menu => menu.category === 'Kopi' && menu.name.includes('Macchiato')).length;
const ultimateTeaCount = tamanLangitMenus.filter(menu => menu.category === 'Teh').length;
const basedIceEspressoCount = tamanLangitMenus.filter(menu => menu.category === 'Kopi' && (menu.name.includes('Iced') || menu.name.includes('Mocha') || menu.name.includes('Coffee') || menu.name.includes('Double') || menu.name.includes('Cappuccino') || menu.name.includes('Caramel') || menu.name.includes('Tala') || menu.name.includes('Black'))).length;
const hotStuffCount = tamanLangitMenus.filter(menu => (menu.category === 'Kopi' || menu.category === 'Minuman') && (menu.name.includes('Hot') || menu.name.includes('Warm') || menu.name.includes('Wedang') || menu.name.includes('Magic'))).length;

console.log(`  SALAD: ${saladCount} items`);
console.log(`  LIGHT BITES: ${lightBitesCount} items`);
console.log(`  PIZZA: ${pizzaCount} items`);
console.log(`  ITALIAN: ${italianCount} items`);
console.log(`  THE WORK SIGNATURE: ${workSignatureCount} items`);
console.log(`  FAVORITES NUSANTARA: ${favoritesNusantaraCount} items`);
console.log(`  RICE BOWL: ${riceBowlCount} items`);
console.log(`  KIDS MEAL: ${kidsMealCount} items`);
console.log(`  DESSERT: ${dessertCount} items`);
console.log(`  SIGNATURE DRINK: ${signatureDrinkCount} items`);
console.log(`  MOCKTAIL & SODA: ${mocktailSodaCount} items`);
console.log(`  FRITZY DRINK: ${fritzyDrinkCount} items`);
console.log(`  FRAPE & SHAKE: ${frapeShakeCount} items`);
console.log(`  BASED MACHIATO: ${basedMachitaoCount} items`);
console.log(`  ULTIMATE TEA: ${ultimateTeaCount} items`);
console.log(`  BASED ICE ESPRESSO: ${basedIceEspressoCount} items`);
console.log(`  HOT STUFF: ${hotStuffCount} items`);

// Price range summary
const prices = tamanLangitMenus.map(menu => menu.price);
const minPrice = Math.min(...prices);
const maxPrice = Math.max(...prices);
console.log(`\n💰 Price Range: Rp ${minPrice.toLocaleString()} - Rp ${maxPrice.toLocaleString()}`);
