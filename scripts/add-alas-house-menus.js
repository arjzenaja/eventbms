const fs = require('fs');
const path = require('path');

function readDb(dbPath) {
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

function writeDb(dbPath, data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

function nextId(items) {
  return Math.max(0, ...items.map((m) => parseInt(m.id, 10) || 0)) + 1;
}

(function main() {
  const dbPath = path.join(process.cwd(), 'db.json');
  const db = readDb(dbPath);
  db.menu_items = db.menu_items || [];
  db.culinary_destinations = db.culinary_destinations || [];

  const dest = db.culinary_destinations.find((d) => (d.slug || '').toLowerCase() === 'alas-house');
  if (!dest) {
    console.error('Destination Alas House not found. Run seed-alas-house.js first.');
    process.exit(1);
  }

  const now = new Date().toISOString();
  const makeItem = (name, category, price, opts = {}) => ({
    id: String(opts.id || (nextBaseId++)),
    name,
    description: opts.description || '',
    price: opts.price !== undefined ? opts.price : price || null,
    priceIced: opts.priceIced !== undefined ? opts.priceIced : null,
    priceHot: opts.priceHot !== undefined ? opts.priceHot : null,
    category,
    cookingTime: opts.cookingTime || '5-10 menit',
    destinationId: dest.id,
    destinationSlug: dest.slug,
    destinationTitle: dest.title,
    available: true,
    image: opts.image || '/placeholder.jpg',
    additionalInfo: [],
    flavorOptions: [],
    rating: null,
    isPopular: false,
    isSpicy: false,
    halal: true,
    updated_at: now,
  });

  let nextBaseId = nextId(db.menu_items);

  const items = [];

  // Pasta / Rice
  items.push(
    makeItem('Mac & Cheese', 'Pasta', null, { price: 38500 }),
    makeItem('Spaghetti Aglio Fragante', 'Pasta', null, { price: 32500 }),
    makeItem('Fettuccine Alfredo', 'Pasta', null, { price: 32000 }),
    makeItem('Spaghetti et Truffle', 'Pasta', null, { price: 55000 }),
    makeItem('Mentai Butter Rice', 'Rice', null, { price: 29000 }),
    makeItem('Chicken Curry Cutlet', 'Rice', null, { price: 37500 }),
    makeItem('Alas Fried Rice', 'Rice', null, { price: 31000 }),
    makeItem('Sweet Savory Beef', 'Rice', null, { price: 47500 }),
    makeItem('Chicken Sambal Matah', 'Rice', null, { price: 37000 })
  );

  // Snack
  items.push(
    makeItem('Garlic Cheese Bread', 'Snack', null, { price: 37500 }),
    makeItem('Spicy Chicken Wings', 'Snack', null, { price: 31500 }),
    makeItem('Alas Platter', 'Snack', null, { price: 49000 }),
    makeItem('Local Platter', 'Snack', null, { price: 44000 }),
    makeItem('Nori Crispy', 'Snack', null, { price: 18000 }),
    makeItem('Crispy Potato Wedges', 'Snack', null, { price: 27500 }),
    makeItem('Crispy Enoki Mushrooms', 'Snack', null, { price: 25000 }),
    makeItem('Tortilla Fat Wrap', 'Snack', null, { price: 33000 })
  );

  // Pressed Juice (single price)
  items.push(
    makeItem('Orange Boost', 'Pressed Juice', null, { price: 27000 }),
    makeItem('Garden Boost', 'Pressed Juice', null, { price: 28000 }),
    makeItem('Green Boost', 'Pressed Juice', null, { price: 27000 }),
    makeItem('Sunny Boost', 'Pressed Juice', null, { price: 28000 })
  );

  // Manual Brew - use separate items for variants
  items.push(
    makeItem('V60 Daily', 'Manual Brew', null, { price: 24000 }),
    makeItem('V60 Seasonal', 'Manual Brew', null, { price: 30000 }),
    makeItem('V60 Exotic Beans', 'Manual Brew', null, { price: 50000 }),
    makeItem('Aeropress Daily', 'Manual Brew', null, { price: 24000 }),
    makeItem('Aeropress Seasonal', 'Manual Brew', null, { price: 28000 }),
    makeItem('Aeropress Exotic Beans', 'Manual Brew', null, { price: 50000 }),
    makeItem('Coldbrew', 'Manual Brew', null, { price: 25000 })
  );

  // Additional
  items.push(
    makeItem('Extra Shoot', 'Additional', null, { price: 9000 }),
    makeItem('Extra Ice', 'Additional', null, { price: 3000 }),
    makeItem('Extra Ice Cream', 'Additional', null, { price: 6000 })
  );

  // Alas House Signature
  items.push(makeItem('Alas Coffee Mexe', 'Alas House', null, { price: 27000 }));

  // Coffee Based (dual pricing for some)
  items.push(
    makeItem('Espresso Single', 'Coffee Based', null, { price: null, priceHot: 21000, priceIced: null }),
    makeItem('Espresso Double', 'Coffee Based', null, { price: null, priceHot: 23000, priceIced: null }),
    makeItem('Cappuccino', 'Coffee Based', null, { price: null, priceHot: 26000, priceIced: null }),
    makeItem('Affogato', 'Coffee Based', null, { price: 24000 }),
    makeItem('Vanilla Latte', 'Coffee Based', null, { priceHot: 27000, priceIced: 27000 }),
    makeItem('Americano', 'Coffee Based', null, { priceHot: 25000, priceIced: 25000 }),
    makeItem('Caramel Latte', 'Coffee Based', null, { priceHot: 27000, priceIced: 27000 }),
    makeItem('Caffe Latte', 'Coffee Based', null, { priceHot: 26000, priceIced: 28000 }),
    makeItem('Mochaccino', 'Coffee Based', null, { price: null, priceHot: 24000, priceIced: null }),
    makeItem('Walnut Latte', 'Coffee Based', null, { priceHot: 27000, priceIced: 27000 }),
    makeItem('Butterscotch Iced Coffee', 'Coffee Based', null, { priceHot: 27000, priceIced: 27000 }),
    makeItem('House Rum Regal', 'Coffee Based', null, { priceHot: 27000, priceIced: 27000 }),
    makeItem('Banana Iced Coffee', 'Coffee Based', null, { priceHot: 27000, priceIced: 27000 })
  );

  // Non Coffee (dual pricing)
  items.push(
    makeItem('Chocolate', 'Non Coffee', null, { priceHot: 27000, priceIced: 26000 }),
    makeItem('Taro', 'Non Coffee', null, { priceHot: 26000, priceIced: 26000 }),
    makeItem('Red Velvet', 'Non Coffee', null, { priceHot: 26000, priceIced: 26000 }),
    makeItem('Matcha', 'Non Coffee', null, { priceHot: 26000, priceIced: 27000 }),
    makeItem('Klepon', 'Non Coffee', null, { priceHot: 27000, priceIced: 27000 }),
    makeItem('Charcoal', 'Non Coffee', null, { priceHot: 27000, priceIced: 26000 }),
    makeItem('Flamingo', 'Non Coffee', null, { price: 25000 }),
    makeItem('Pink Booster', 'Non Coffee', null, { price: 25000 }),
    makeItem('Choco Banana Ice', 'Non Coffee', null, { price: 28000 }),
    makeItem('Mineral Water', 'Non Coffee', null, { price: 6000 })
  );

  // Based Tea (dual but same price)
  items.push(
    makeItem('Lemon Tea', 'Based Tea', null, { priceHot: 25000, priceIced: 25000 }),
    makeItem('Lychee Tea', 'Based Tea', null, { priceHot: 25000, priceIced: 25000 }),
    makeItem('Strawberry Tea', 'Based Tea', null, { priceHot: 25000, priceIced: 25000 })
  );

  // Mocktail
  items.push(
    makeItem('Sugar Beads Ice Cream', 'Mocktail', null, { price: 28000 }),
    makeItem('The Harmony', 'Mocktail', null, { price: 28000 }),
    makeItem('Yellow Fancy', 'Mocktail', null, { price: 28000 }),
    makeItem('Gelora', 'Mocktail', null, { price: 28000 })
  );

  // Salad
  items.push(
    makeItem('Caesar Salad', 'Salad', null, { price: 35000 }),
    makeItem('Roasted Sesame Salad', 'Salad', null, { price: 31000 })
  );

  // Sweet Dessert
  items.push(
    makeItem('Lava Milo Toast', 'Sweet Dessert', null, { price: 38500 }),
    makeItem('One Bite Churros', 'Sweet Dessert', null, { price: 29000 }),
    makeItem('Brulee Toast', 'Sweet Dessert', null, { price: 26000 }),
    makeItem('Tiramisu Twist Waffle', 'Sweet Dessert', null, { price: 29000 }),
    makeItem('Kitkat Krazy Waffle', 'Sweet Dessert', null, { price: 33000 }),
    makeItem('Matcha Madness Waffle', 'Sweet Dessert', null, { price: 29000 }),
    makeItem('Chocolate Toast', 'Sweet Dessert', null, { price: 26000 })
  );

  // Deduplicate by name+category for this destination
  const existing = new Set(
    db.menu_items
      .filter((m) => m.destinationId === dest.id)
      .map((m) => `${m.name}|${m.category}`)
  );
  const toInsert = items.filter((m) => !existing.has(`${m.name}|${m.category}`));

  // Ensure unique IDs
  let idCursor = nextId(db.menu_items);
  for (const item of toInsert) {
    item.id = String(idCursor++);
  }

  db.menu_items.push(...toInsert);
  writeDb(dbPath, db);
  console.log(`Inserted ${toInsert.length} Alas House menus for destination id ${dest.id}`);
})();
