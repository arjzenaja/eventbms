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
    destinationId: "19", // Table Nine Resto destination ID
    destinationSlug: "",
    destinationTitle: "Table Nine Resto",
    rating: 4.5,
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

// Table Nine Resto Menu Items
const tableNineMenus = [
  // PERSONAL MENU
  createMenuItem("Nasi Ayam Goreng Kampung", "Nasi dengan ayam goreng kampung", 45000, "Personal Menu", ["Halal", "Traditional"], false, false, "10-15 menit"),
  createMenuItem("Nasi Ayam Asam Manis", "Nasi dengan ayam asam manis", 45000, "Personal Menu", ["Halal", "Sweet"], false, false, "10-15 menit"),
  createMenuItem("Nasi Ayam Cabe Ijo", "Nasi dengan ayam cabe ijo", 45000, "Personal Menu", ["Halal", "Spicy"], false, true, "10-15 menit"),
  createMenuItem("Nasi Ayam Lada Hitam", "Nasi dengan ayam lada hitam", 45000, "Personal Menu", ["Halal", "Spicy"], false, true, "10-15 menit"),
  createMenuItem("Nasi Goreng Ayam Crispy", "Nasi goreng dengan ayam crispy", 45000, "Personal Menu", ["Halal", "Crispy"], false, false, "10-15 menit"),
  createMenuItem("Garlic Chicken Rice", "Nasi dengan garlic chicken", 45000, "Personal Menu", ["Halal", "Garlic"], false, false, "10-15 menit"),
  createMenuItem("Lemon Grass Chicken Rice", "Nasi dengan lemon grass chicken", 46000, "Personal Menu", ["Halal", "Herbs"], false, false, "10-15 menit"),
  createMenuItem("Teriyaki Chicken Rice", "Nasi dengan teriyaki chicken", 45000, "Personal Menu", ["Halal", "Japanese"], false, false, "10-15 menit"),
  createMenuItem("Katsu Kari Chicken Rice", "Nasi dengan katsu kari chicken", 45000, "Personal Menu", ["Halal", "Japanese"], false, false, "10-15 menit"),
  createMenuItem("Spicy Sour Chicken Rice", "Nasi dengan spicy sour chicken", 45000, "Personal Menu", ["Halal", "Spicy"], false, true, "10-15 menit"),
  createMenuItem("Spaghetti Bolognese", "Spaghetti dengan saus bolognese", 45000, "Personal Menu", ["Halal", "Italian"], false, false, "12-18 menit"),
  createMenuItem("Spaghetti Aglio Olio", "Spaghetti aglio olio", 45000, "Personal Menu", ["Halal", "Italian"], false, false, "12-18 menit"),
  createMenuItem("Teriyaki Beef Rice", "Nasi dengan teriyaki beef", 55000, "Personal Menu", ["Halal", "Japanese"], false, false, "10-15 menit"),
  createMenuItem("Black Pepper Beef Rice", "Nasi dengan black pepper beef", 55000, "Personal Menu", ["Halal", "Spicy"], false, true, "10-15 menit"),
  createMenuItem("Gyudon Beef Rice", "Nasi dengan gyudon beef", 55000, "Personal Menu", ["Halal", "Japanese"], false, false, "10-15 menit"),
  createMenuItem("Nasi Udang Telur Asin", "Nasi dengan udang telur asin", 55000, "Personal Menu", ["Halal", "Seafood"], false, false, "10-15 menit"),
  createMenuItem("Nasi Udang Lada Hitam", "Nasi dengan udang lada hitam", 56000, "Personal Menu", ["Halal", "Seafood", "Spicy"], false, true, "10-15 menit"),
  
  // ANEKA DIMSUM
  createMenuItem("Onde Onde (isi 3)", "Onde onde isi 3 pcs", 24500, "Aneka Dimsum", ["Halal", "Sweet"], false, false, "8-12 menit"),
  createMenuItem("Lumpia Bebek (isi 3)", "Lumpia bebek isi 3 pcs", 24500, "Aneka Dimsum", ["Halal", "Crispy"], false, false, "8-12 menit"),
  createMenuItem("Hakao Udang (isi 3)", "Hakao udang isi 3 pcs", 24500, "Aneka Dimsum", ["Halal", "Seafood"], false, false, "8-12 menit"),
  createMenuItem("Hakao Kombinasi (isi 3)", "Hakao kombinasi isi 3 pcs", 24500, "Aneka Dimsum", ["Halal", "Mixed"], false, false, "8-12 menit"),
  createMenuItem("Kuotie (isi 3)", "Kuotie isi 3 pcs", 24500, "Aneka Dimsum", ["Halal", "Crispy"], false, false, "8-12 menit"),
  createMenuItem("Siomay (isi 3)", "Siomay isi 3 pcs", 24500, "Aneka Dimsum", ["Halal", "Traditional"], false, false, "8-12 menit"),
  createMenuItem("Bakpao (isi 3)", "Bakpao isi 3 pcs", 24500, "Aneka Dimsum", ["Halal", "Sweet"], false, false, "8-12 menit"),
  
  // SNACK
  createMenuItem("Buah Dingin", "Buah dingin segar", 11000, "Snack", ["Halal", "Fresh"], false, false, "2-3 menit"),
  createMenuItem("Onion Ring", "Onion ring renyah", 24500, "Snack", ["Halal", "Crispy"], false, false, "5-8 menit"),
  createMenuItem("French Fries", "Kentang goreng", 25000, "Snack", ["Halal", "Crispy"], false, false, "5-8 menit"),
  createMenuItem("Spicy Potato", "Kentang pedas", 25000, "Snack", ["Halal", "Spicy"], false, true, "5-8 menit"),
  createMenuItem("Mendoan", "Mendoan tempe", 29500, "Snack", ["Halal", "Traditional"], false, false, "5-8 menit"),
  createMenuItem("Jamur Cabe Garam", "Jamur cabe garam", 37500, "Snack", ["Halal", "Spicy"], false, true, "8-12 menit"),
  createMenuItem("Jamur Telur Asin", "Jamur telur asin", 37500, "Snack", ["Halal", "Salted"], false, false, "8-12 menit"),
  createMenuItem("Jamur Enoki Cabe Garam", "Jamur enoki cabe garam", 37500, "Snack", ["Halal", "Spicy"], false, true, "8-12 menit"),
  createMenuItem("Tahu Isi (5pcs)", "Tahu isi 5 pcs", 29500, "Snack", ["Halal", "Crispy"], false, false, "8-12 menit"),
  createMenuItem("Pisang Goreng (6pcs)", "Pisang goreng 6 pcs", 29500, "Snack", ["Halal", "Sweet"], false, false, "8-12 menit"),
  createMenuItem("T9 Platter", "French Fries, Sosis, Onion Ring, Cireng, Singkong gr", 55000, "Snack", ["Halal", "Mixed"], true, false, "10-15 menit"),
  createMenuItem("Tradisional Platter", "Pisang Gr, Tahu isi, Mendoan, Cireng, Singkong gr", 55000, "Snack", ["Halal", "Traditional"], false, false, "10-15 menit"),
  
  // MINUMAN
  createMenuItem("Mineral 330ml", "Air mineral 330ml", 8000, "Minuman", ["Halal", "Fresh"], false, false, "1 menit"),
  createMenuItem("Teh Manis (hot/ice)", "Teh manis hangat/dingin", 9500, "Minuman", ["Halal", "Sweet"], false, false, "2-3 menit"),
  createMenuItem("Jeruk (hot/ice)", "Jeruk hangat/dingin", 19000, "Minuman", ["Halal", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Jeruk Nipis (hot/ice)", "Jeruk nipis hangat/dingin", 19000, "Minuman", ["Halal", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Coklat (hot)", "Coklat hangat", 25000, "Minuman", ["Halal", "Sweet", "Hot"], false, false, "3-5 menit"),
  createMenuItem("Chinese Tea (hot)", "Teh cina hangat", 27500, "Minuman", ["Halal", "Traditional", "Hot"], false, false, "3-5 menit"),
  createMenuItem("Lemon Tea (hot/ice)", "Teh lemon hangat/dingin", 25000, "Minuman", ["Halal", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Lemon Grass (hot/ice)", "Lemon grass hangat/dingin", 25000, "Minuman", ["Halal", "Herbs"], false, false, "3-5 menit"),
  createMenuItem("Thai Tea (hot/ice)", "Teh thai hangat/dingin", 25000, "Minuman", ["Halal", "Thai"], false, false, "3-5 menit"),
  createMenuItem("Teh Tarik (hot/ice)", "Teh tarik hangat/dingin", 25000, "Minuman", ["Halal", "Signature"], false, false, "5-8 menit"),
  createMenuItem("Cappucino (hot/ice)", "Cappucino hangat/dingin", 25000, "Minuman", ["Halal", "Coffee"], false, false, "5-8 menit"),
  createMenuItem("Es Soda Gembira", "Es soda gembira", 25000, "Minuman", ["Halal", "Cold", "Sweet"], false, false, "3-5 menit"),
  createMenuItem("Es Kelapa Muda", "Es kelapa muda", 25000, "Minuman", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Es Kelapa Muda Jeruk", "Es kelapa muda jeruk", 25000, "Minuman", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Lemon Tea Fruit", "Lemon tea fruit", 25000, "Minuman", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Lecy Tea Ice", "Lecy tea es", 25000, "Minuman", ["Halal", "Cold", "Sweet"], false, false, "3-5 menit"),
  createMenuItem("Strawberry Tea", "Teh strawberry", 25000, "Minuman", ["Halal", "Cold", "Sweet"], false, false, "3-5 menit"),
  createMenuItem("Mojito Ice", "Mojito es", 25000, "Minuman", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Mojito Lecy Ice", "Mojito lecy es", 25000, "Minuman", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Milkshake Chocolate", "Milkshake coklat", 25000, "Minuman", ["Halal", "Cold", "Sweet"], false, false, "5-8 menit"),
  createMenuItem("Milkshake Vanilla", "Milkshake vanilla", 25000, "Minuman", ["Halal", "Cold", "Sweet"], false, false, "5-8 menit"),
  createMenuItem("Hawaian Delight", "Hawaian delight", 27500, "Minuman", ["Halal", "Cold", "Tropical"], false, false, "5-8 menit"),
  createMenuItem("Cookies Frappe", "Cookies frappe", 27500, "Minuman", ["Halal", "Cold", "Sweet"], false, false, "5-8 menit"),
  createMenuItem("Chocolate Frappe", "Chocolate frappe", 27500, "Minuman", ["Halal", "Cold", "Sweet"], false, false, "5-8 menit"),
  createMenuItem("Vanilla Frappe", "Vanilla frappe", 27500, "Minuman", ["Halal", "Cold", "Sweet"], false, false, "5-8 menit"),
  createMenuItem("Cappucino Frappe", "Cappucino frappe", 27500, "Minuman", ["Halal", "Cold", "Coffee"], false, false, "5-8 menit"),
  createMenuItem("Greentea Frapucino", "Greentea frapucino", 27500, "Minuman", ["Halal", "Cold", "Green"], false, false, "5-8 menit"),
  createMenuItem("Strawberry Float", "Strawberry float", 27500, "Minuman", ["Halal", "Cold", "Sweet"], false, false, "5-8 menit"),
  createMenuItem("Vanilla Float", "Vanilla float", 27500, "Minuman", ["Halal", "Cold", "Sweet"], false, false, "5-8 menit"),
  createMenuItem("Cappucino Float", "Cappucino float", 27500, "Minuman", ["Halal", "Cold", "Coffee"], false, false, "5-8 menit"),
  createMenuItem("Melon Float", "Melon float", 27500, "Minuman", ["Halal", "Cold", "Fresh"], false, false, "5-8 menit"),
  createMenuItem("Taiwan Dessert", "Taiwan dessert", 27500, "Minuman", ["Halal", "Cold", "Sweet"], false, false, "5-8 menit"),
  createMenuItem("Jus Jambu", "Jus jambu", 27500, "Minuman", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Jus Strawberry", "Jus strawberry", 27500, "Minuman", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Jus Kelapa Muda", "Jus kelapa muda", 27500, "Minuman", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),
  createMenuItem("Jus Greendong", "Jus greendong", 30000, "Minuman", ["Halal", "Cold", "Fresh"], false, false, "3-5 menit"),
  
  // BEBEK
  createMenuItem("Bebek Panggang S", "Bebek panggang kecil", 180000, "Bebek", ["Halal", "Signature"], true, false, "30-40 menit"),
  createMenuItem("Bebek Panggang L", "Bebek panggang besar", 350000, "Bebek", ["Halal", "Signature"], true, false, "40-50 menit"),
  createMenuItem("Bebek Lada Hitam", "Bebek lada hitam", 190000, "Bebek", ["Halal", "Spicy"], false, true, "25-35 menit"),
  createMenuItem("Peking Duck (kungpao/Lada hitam)", "Peking duck dengan pilihan kungpao atau lada hitam", 200000, "Bebek", ["Halal", "Premium"], true, false, "35-45 menit"),
  
  // SUP
  createMenuItem("Sup Ayam", "Sup ayam segar", 57500, "Sup", ["Halal", "Traditional"], false, false, "15-20 menit"),
  createMenuItem("Sup Tofu Ayam", "Sup tofu ayam", 57500, "Sup", ["Halal", "Healthy"], false, false, "15-20 menit"),
  createMenuItem("Sup Tofu Jamur Enoki", "Sup tofu jamur enoki", 57500, "Sup", ["Halal", "Healthy"], false, false, "15-20 menit"),
  createMenuItem("Sup Jagung Ayam", "Sup jagung ayam", 67500, "Sup", ["Halal", "Sweet"], false, false, "15-20 menit"),
  createMenuItem("Sup Perut Ikan", "Sup perut ikan", 67500, "Sup", ["Halal", "Seafood"], false, false, "15-20 menit"),
  createMenuItem("Sup Bakso", "Sup bakso", 87500, "Sup", ["Halal", "Traditional"], false, false, "15-20 menit"),
  createMenuItem("Sup Kombinasi", "Sup kombinasi", 67500, "Sup", ["Halal", "Mixed"], false, false, "15-20 menit"),
  createMenuItem("Sup Tomyam", "Sup tomyam", 57500, "Sup", ["Halal", "Thai", "Spicy"], false, true, "15-20 menit"),
  
  // IKAN
  createMenuItem("Gurame Gandum", "Gurame gandum", 115000, "Ikan", ["Halal", "Seafood"], false, false, "20-25 menit"),
  createMenuItem("Gurame Cabe Garam", "Gurame cabe garam", 115000, "Ikan", ["Halal", "Seafood", "Spicy"], false, true, "20-25 menit"),
  createMenuItem("Gurame Telor Asin", "Gurame telor asin", 115000, "Ikan", ["Halal", "Seafood"], false, false, "20-25 menit"),
  createMenuItem("Gurame Ss Asam Manis", "Gurame asam manis", 115000, "Ikan", ["Halal", "Seafood", "Sweet"], false, false, "20-25 menit"),
  createMenuItem("Gurame Ss Lada Hitam", "Gurame lada hitam", 115000, "Ikan", ["Halal", "Seafood", "Spicy"], false, true, "20-25 menit"),
  createMenuItem("Gurame Ss Mentega", "Gurame mentega", 115000, "Ikan", ["Halal", "Seafood"], false, false, "20-25 menit"),
  createMenuItem("Gurame Goreng", "Gurame goreng", 115000, "Ikan", ["Halal", "Seafood", "Crispy"], false, false, "20-25 menit"),
  createMenuItem("Gurame Tahu Tausi", "Gurame tahu tausi", 115000, "Ikan", ["Halal", "Seafood"], false, false, "20-25 menit"),
  createMenuItem("Gurame Cabe Ijo", "Gurame cabe ijo", 115000, "Ikan", ["Halal", "Seafood", "Spicy"], false, true, "20-25 menit"),
  createMenuItem("Gurame Ss Padang", "Gurame saus padang", 115000, "Ikan", ["Halal", "Seafood", "Spicy"], false, true, "20-25 menit"),
  createMenuItem("Gurame Tim", "Gurame tim", 115000, "Ikan", ["Halal", "Seafood"], false, false, "25-30 menit"),
  createMenuItem("Pepes Bandeng", "Pepes bandeng", 85000, "Ikan", ["Halal", "Traditional"], false, false, "25-30 menit"),
  
  // UDANG
  createMenuItem("Udang Tepung", "Udang tepung", 75000, "Udang", ["Halal", "Seafood", "Crispy"], false, false, "15-20 menit"),
  createMenuItem("Udang Telor Asin", "Udang telor asin", 75000, "Udang", ["Halal", "Seafood"], false, false, "15-20 menit"),
  createMenuItem("Udang Gandum", "Udang gandum", 75000, "Udang", ["Halal", "Seafood"], false, false, "15-20 menit"),
  createMenuItem("Udang Cabe Garam", "Udang cabe garam", 75000, "Udang", ["Halal", "Seafood", "Spicy"], false, true, "15-20 menit"),
  createMenuItem("Udang Mentega", "Udang mentega", 75000, "Udang", ["Halal", "Seafood"], false, false, "15-20 menit"),
  createMenuItem("Udang Lada Hitam", "Udang lada hitam", 75000, "Udang", ["Halal", "Seafood", "Spicy"], false, true, "15-20 menit"),
  createMenuItem("Udang Singapure", "Udang singapure", 75000, "Udang", ["Halal", "Seafood"], false, false, "15-20 menit"),
  createMenuItem("Udang Ss Tiram", "Udang saus tiram", 75000, "Udang", ["Halal", "Seafood"], false, false, "15-20 menit"),
  createMenuItem("Udang Ss Padang", "Udang saus padang", 75000, "Udang", ["Halal", "Seafood", "Spicy"], false, true, "15-20 menit"),
  createMenuItem("Lumpia Udang Ss Plum", "Lumpia udang saus plum", 37500, "Udang", ["Halal", "Seafood", "Crispy"], false, false, "10-15 menit"),
  
  // CUMI
  createMenuItem("Cumi Tepung", "Cumi tepung", 66000, "Cumi", ["Halal", "Seafood", "Crispy"], false, false, "15-20 menit"),
  createMenuItem("Cumi Telor Asin", "Cumi telor asin", 66000, "Cumi", ["Halal", "Seafood"], false, false, "15-20 menit"),
  createMenuItem("Cumi Cabe Garam", "Cumi cabe garam", 66000, "Cumi", ["Halal", "Seafood", "Spicy"], false, true, "15-20 menit"),
  createMenuItem("Cumi Gandum", "Cumi gandum", 66000, "Cumi", ["Halal", "Seafood"], false, false, "15-20 menit"),
  createMenuItem("Sotong Ss Singapure", "Sotong saus singapure", 50000, "Cumi", ["Halal", "Seafood"], false, false, "15-20 menit"),
  createMenuItem("Sotong Ss Mentega", "Sotong saus mentega", 50000, "Cumi", ["Halal", "Seafood"], false, false, "15-20 menit"),
  createMenuItem("Sotong Ss Lada Hitam", "Sotong saus lada hitam", 50000, "Cumi", ["Halal", "Seafood", "Spicy"], false, true, "15-20 menit"),
  createMenuItem("Sotong Ss Tiram", "Sotong saus tiram", 50000, "Cumi", ["Halal", "Seafood"], false, false, "15-20 menit"),
  createMenuItem("Sotong Ss Padang", "Sotong saus padang", 50000, "Cumi", ["Halal", "Seafood", "Spicy"], false, true, "15-20 menit"),
  
  // SHABU & BARBEQUE
  createMenuItem("Shabu Shabu", "Shabu shabu dengan kaldu atau tomyam", 150000, "Shabu & Barbeque", ["Halal", "Hot Pot"], true, false, "30-45 menit"),
  createMenuItem("Mix Barbeque", "Mix barbeque dengan ayam, sapi, bakso ikan, crabstik, dan bombay", 150000, "Shabu & Barbeque", ["Halal", "Grilled"], true, false, "25-35 menit"),
  createMenuItem("Meat Beef Barbeque", "Meat beef barbeque", 150000, "Shabu & Barbeque", ["Halal", "Grilled"], false, false, "25-35 menit"),
  
  // AYAM
  createMenuItem("Ayam Goreng Pedas", "Ayam goreng pedas", 58000, "Ayam", ["Halal", "Spicy"], false, true, "15-20 menit"),
  createMenuItem("Ayam Cabe Ijo", "Ayam cabe ijo", 58000, "Ayam", ["Halal", "Spicy"], false, true, "15-20 menit"),
  createMenuItem("Ayam Goreng Mentega", "Ayam goreng mentega", 58000, "Ayam", ["Halal"], false, false, "15-20 menit"),
  createMenuItem("Ayam Lada Hitam", "Ayam lada hitam", 58000, "Ayam", ["Halal", "Spicy"], false, true, "15-20 menit"),
  createMenuItem("Ayam Asam Manis", "Ayam asam manis", 58000, "Ayam", ["Halal", "Sweet"], false, false, "15-20 menit"),
  createMenuItem("Ayam Panggang Madu", "Ayam panggang madu", 58000, "Ayam", ["Halal", "Sweet"], false, false, "20-25 menit"),
  createMenuItem("Ayam Goreng Kering", "Ayam goreng kering", 58000, "Ayam", ["Halal", "Crispy"], false, false, "15-20 menit"),
  createMenuItem("Ayam Telor Asin", "Ayam telor asin", 58000, "Ayam", ["Halal"], false, false, "15-20 menit"),
  createMenuItem("Ayam Saus Plum", "Ayam saus plum", 58000, "Ayam", ["Halal", "Sweet"], false, false, "15-20 menit"),
  createMenuItem("Ayam Saus Padang", "Ayam saus padang", 58000, "Ayam", ["Halal", "Spicy"], false, true, "15-20 menit"),
  createMenuItem("Ayam Kari", "Ayam kari", 58000, "Ayam", ["Halal", "Curry"], false, false, "15-20 menit"),
  createMenuItem("Garlic Chicken", "Garlic chicken", 58000, "Ayam", ["Halal", "Garlic"], false, false, "15-20 menit"),
  createMenuItem("Katsu Kari Chicken", "Katsu kari chicken", 58000, "Ayam", ["Halal", "Japanese"], false, false, "15-20 menit"),
  createMenuItem("Lemon Grass Chicken", "Lemon grass chicken", 58000, "Ayam", ["Halal", "Herbs"], false, false, "15-20 menit"),
  createMenuItem("Spicy Sour Chicken", "Spicy sour chicken", 58000, "Ayam", ["Halal", "Spicy"], false, true, "15-20 menit"),
  createMenuItem("Chicken Teriyaki", "Chicken teriyaki", 58000, "Ayam", ["Halal", "Japanese"], false, false, "15-20 menit"),
  createMenuItem("Ayam Goreng Kampung", "Ayam goreng kampung", 32500, "Ayam", ["Halal", "Traditional"], false, false, "15-20 menit"),
  createMenuItem("Ayam Goreng Renyah", "Ayam goreng renyah", 92500, "Ayam", ["Halal", "Crispy"], false, false, "15-20 menit"),
  createMenuItem("Ayam Ss Hongkong", "Ayam saus hongkong", 92500, "Ayam", ["Halal", "Chinese"], false, false, "15-20 menit"),
  createMenuItem("Ayam Tim", "Ayam tim", 92500, "Ayam", ["Halal", "Steamed"], false, false, "20-25 menit"),
  createMenuItem("Ayam Panggang Small", "Ayam panggang kecil", 87500, "Ayam", ["Halal", "Roasted"], false, false, "25-30 menit"),
  createMenuItem("Ayam Panggang Large", "Ayam panggang besar", 175000, "Ayam", ["Halal", "Roasted"], false, false, "30-40 menit"),
  
  // SAPI
  createMenuItem("Sapi Lada Hitam", "Sapi lada hitam", 75000, "Sapi", ["Halal", "Spicy"], false, true, "15-20 menit"),
  createMenuItem("Sapi Cabe Ijo", "Sapi cabe ijo", 75000, "Sapi", ["Halal", "Spicy"], false, true, "15-20 menit"),
  createMenuItem("Sapi Mongol", "Sapi mongol", 75000, "Sapi", ["Halal", "Mongolian"], false, false, "15-20 menit"),
  createMenuItem("Sapi Teriyaki", "Sapi teriyaki", 75000, "Sapi", ["Halal", "Japanese"], false, false, "15-20 menit"),
  createMenuItem("Gyudon Beef", "Gyudon beef", 75000, "Sapi", ["Halal", "Japanese"], false, false, "15-20 menit"),
  
  // SAYUR
  createMenuItem("Omelet", "Omelet", 30000, "Sayur", ["Halal", "Egg"], false, false, "5-8 menit"),
  createMenuItem("Buncis Sechuan", "Buncis sechuan", 50000, "Sayur", ["Halal", "Spicy"], false, true, "8-12 menit"),
  createMenuItem("Buncis Telor Asin", "Buncis telor asin", 50000, "Sayur", ["Halal"], false, false, "8-12 menit"),
  createMenuItem("Buncis Cabe Garam", "Buncis cabe garam", 50000, "Sayur", ["Halal", "Spicy"], false, true, "8-12 menit"),
  createMenuItem("Brokoli Bawang Putih", "Brokoli bawang putih", 50000, "Sayur", ["Halal", "Garlic"], false, false, "8-12 menit"),
  createMenuItem("Brokoli Ca Sapi", "Brokoli ca sapi", 57500, "Sayur", ["Halal"], false, false, "8-12 menit"),
  createMenuItem("Brokoli Salju", "Brokoli salju", 50000, "Sayur", ["Halal"], false, false, "8-12 menit"),
  createMenuItem("Pokcoy Bawang Putih", "Pokcoy bawang putih", 50000, "Sayur", ["Halal", "Garlic"], false, false, "8-12 menit"),
  createMenuItem("Pokcoy Ca Sapi", "Pokcoy ca sapi", 57500, "Sayur", ["Halal"], false, false, "8-12 menit"),
  createMenuItem("Hotplate Kangkung", "Hotplate kangkung", 39000, "Sayur", ["Halal", "Hot"], false, false, "8-12 menit"),
  createMenuItem("Tumis/Ca Kangkung", "Tumis/ca kangkung", 39000, "Sayur", ["Halal"], false, false, "8-12 menit"),
  createMenuItem("Tumis Kangkung Balacan", "Tumis kangkung balacan", 39000, "Sayur", ["Halal", "Spicy"], false, true, "8-12 menit"),
  createMenuItem("Cap Cay Goreng", "Cap cay goreng", 50000, "Sayur", ["Halal", "Mixed"], false, false, "10-15 menit"),
  createMenuItem("Ca Toge Teri", "Ca toge teri", 50000, "Sayur", ["Halal"], false, false, "8-12 menit"),
  createMenuItem("Cauliflower Salt Egg", "Cauliflower salt egg", 50000, "Sayur", ["Halal"], false, false, "8-12 menit"),
  createMenuItem("Tofu Crispy Gandum", "Tofu crispy gandum", 50000, "Sayur", ["Halal", "Crispy"], false, false, "8-12 menit"),
  createMenuItem("Tofu Crispy Cabe Garam", "Tofu crispy cabe garam", 50000, "Sayur", ["Halal", "Crispy", "Spicy"], false, true, "8-12 menit"),
  createMenuItem("Tofu Crispy Telur Asin", "Tofu crispy telur asin", 54500, "Sayur", ["Halal", "Crispy"], false, false, "8-12 menit"),
  createMenuItem("Sapo Tahu", "Sapo tahu", 54500, "Sayur", ["Halal"], false, false, "10-15 menit"),
  createMenuItem("Sapo Tausi", "Sapo tausi", 54500, "Sayur", ["Halal"], false, false, "10-15 menit"),
  createMenuItem("Sapo Salju", "Sapo salju", 54500, "Sayur", ["Halal"], false, false, "10-15 menit"),
  createMenuItem("Mun Tahu", "Mun tahu", 54500, "Sayur", ["Halal"], false, false, "10-15 menit"),
  createMenuItem("Mapo Tahu", "Mapo tahu", 54500, "Sayur", ["Halal", "Spicy"], false, true, "10-15 menit"),
  createMenuItem("Tofu Lada Hitam", "Tofu lada hitam", 54500, "Sayur", ["Halal", "Spicy"], false, true, "10-15 menit"),
  createMenuItem("Fuyunghai", "Fuyunghai", 54500, "Sayur", ["Halal", "Egg"], false, false, "10-15 menit"),
  
  // NASI & MIE
  createMenuItem("Nasi Putih", "Nasi putih", 8500, "Nasi & Mie", ["Halal", "Traditional"], false, false, "2-3 menit"),
  createMenuItem("Nasi Goreng T9", "Nasi goreng T9", 45000, "Nasi & Mie", ["Halal", "Signature"], true, false, "10-15 menit"),
  createMenuItem("Nasi Goreng Ayam Madu", "Nasi goreng ayam madu", 45000, "Nasi & Mie", ["Halal", "Sweet"], false, false, "10-15 menit"),
  createMenuItem("Nasi Goreng Telor Asin", "Nasi goreng telor asin", 45000, "Nasi & Mie", ["Halal"], false, false, "10-15 menit"),
  createMenuItem("Nasi Goreng Balacan", "Nasi goreng balacan", 45000, "Nasi & Mie", ["Halal", "Spicy"], false, true, "10-15 menit"),
  createMenuItem("Nasi Goreng Tomyam", "Nasi goreng tomyam", 49500, "Nasi & Mie", ["Halal", "Thai", "Spicy"], false, true, "10-15 menit"),
  createMenuItem("Nasi Goreng Xo", "Nasi goreng XO", 49500, "Nasi & Mie", ["Halal", "Premium"], false, false, "10-15 menit"),
  createMenuItem("Mie Goreng T9", "Mie goreng T9", 45000, "Nasi & Mie", ["Halal", "Signature"], true, false, "10-15 menit"),
  createMenuItem("Mie Godog", "Mie godog", 45000, "Nasi & Mie", ["Halal", "Traditional"], false, false, "10-15 menit"),
  createMenuItem("Mie Kuah Tomat", "Mie kuah tomat", 45000, "Nasi & Mie", ["Halal", "Soup"], false, false, "10-15 menit"),
  createMenuItem("Mie Goreng Xo", "Mie goreng XO", 49500, "Nasi & Mie", ["Halal", "Premium"], false, false, "10-15 menit"),
  createMenuItem("Mie Singapure", "Mie singapure", 49500, "Nasi & Mie", ["Halal", "Singapore"], false, false, "10-15 menit"),
  createMenuItem("Mun Mie", "Mun mie", 53500, "Nasi & Mie", ["Halal"], false, false, "10-15 menit"),
  createMenuItem("Kwetiau Siram Sapi", "Kwetiau siram sapi", 49500, "Nasi & Mie", ["Halal", "Beef"], false, false, "10-15 menit"),
  createMenuItem("Kwetiau Gr Sapi", "Kwetiau goreng sapi", 49500, "Nasi & Mie", ["Halal", "Beef"], false, false, "10-15 menit")
];

// Add table nine menus to database
console.log(`Adding ${tableNineMenus.length} menu items for Table Nine Resto...`);

// Add each menu item
tableNineMenus.forEach(menu => {
  db.menu_items.push(menu);
  console.log(`✓ Added: ${menu.name} - Rp ${menu.price.toLocaleString()}`);
});

// Write updated database
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log(`\n✅ Successfully added ${tableNineMenus.length} menu items for Table Nine Resto!`);
console.log(`📊 Total menu items in database: ${db.menu_items.length}`);

// Summary by category
const categorySummary = tableNineMenus.reduce((acc, menu) => {
  acc[menu.category] = (acc[menu.category] || 0) + 1;
  return acc;
}, {});

console.log('\n📋 Menu Summary by Category:');
Object.entries(categorySummary).forEach(([category, count]) => {
  console.log(`  ${category}: ${count} items`);
});

// Price range summary
const prices = tableNineMenus.map(menu => menu.price);
const minPrice = Math.min(...prices);
const maxPrice = Math.max(...prices);
console.log(`\n💰 Price Range: Rp ${minPrice.toLocaleString()} - Rp ${maxPrice.toLocaleString()}`);
