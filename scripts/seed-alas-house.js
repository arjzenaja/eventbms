const fs = require('fs');
const path = require('path');

function readDb(dbPath) {
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

function writeDb(dbPath, data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

function ensureArray(obj, key) {
  if (!obj[key]) obj[key] = [];
  if (!Array.isArray(obj[key])) obj[key] = [];
}

(function main() {
  const dbPath = path.join(process.cwd(), 'db.json');
  const db = readDb(dbPath);

  ensureArray(db, 'culinary_destinations');
  ensureArray(db, 'menu_items');

  let destination = db.culinary_destinations.find((d) => (d.slug || '').toLowerCase() === 'alas-house');

  // Create destination if missing
  if (!destination) {
    const nextDestId = String(
      Math.max(0, ...db.culinary_destinations.map((d) => parseInt(d.id, 10) || 0)) + 1
    );
    destination = {
      id: nextDestId,
      title: 'Alas House',
      slug: 'alas-house',
      address: '',
      phone: '',
      website: '',
      latitude: null,
      longitude: null,
      images: [],
      description: '',
      open_time: '',
      close_time: '',
      created_at: new Date().toISOString(),
    };
    db.culinary_destinations.push(destination);
  }

  const categories = [
    'Snack',
    'Salad',
    'Manual Brew',
    'Additional',
    "Alas House",
    'Coffee Based',
    'Non Coffee',
    'Based Tea',
    'Mocktail',
    'Pressed Juice',
  ];

  const existingKey = new Set(
    db.menu_items
      .filter((m) => (m.destinationId || '') === destination.id)
      .map((m) => `${m.name}|${m.category}`)
  );

  let nextMenuId = Math.max(0, ...db.menu_items.map((m) => parseInt(m.id, 10) || 0)) + 1;

  const now = new Date().toISOString();
  const added = [];
  for (const category of categories) {
    const name = `${category} Item`;
    const key = `${name}|${category}`;
    if (existingKey.has(key)) continue;

    const menuItem = {
      id: String(nextMenuId++),
      name,
      description: '',
      price: 25000,
      priceIced: null,
      priceHot: null,
      category,
      cookingTime: '5-10 menit',
      destinationId: destination.id,
      destinationSlug: destination.slug,
      destinationTitle: destination.title,
      available: true,
      image: '/placeholder.jpg',
      additionalInfo: [],
      flavorOptions: [],
      rating: null,
      isPopular: false,
      isSpicy: false,
      halal: true,
      updated_at: now,
    };

    db.menu_items.push(menuItem);
    existingKey.add(key);
    added.push({ id: menuItem.id, name: menuItem.name, category: menuItem.category });
  }

  writeDb(dbPath, db);
  console.log(
    JSON.stringify(
      { destination: { id: destination.id, title: destination.title, slug: destination.slug }, added },
      null,
      2
    )
  );
})();


