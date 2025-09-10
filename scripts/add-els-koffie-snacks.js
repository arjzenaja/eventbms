const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const dest = db.kuliner.find(k => (k.title || '').toLowerCase().includes('els'));
if (!dest) {
  console.error('Els Koffie destination not found');
  process.exit(1);
}

const nextId = () => {
  const max = Math.max(...db.menu_items.map(m => parseInt(m.id, 10) || 0));
  return (max + 1).toString();
};

const snacks = [
  { name: 'French Fries', price: 24000, description: 'Fried straight cut potato with aromatic garlic powder' },
  { name: 'Potato Wedges', price: 24000, description: 'Fried coated potato wedges with herbs' },
  { name: 'ELS Platter', price: 44000, description: 'Mix selected fried, nachos, chicken finger, great onion ring, and spicy wedges' },
  { name: 'PokPok Chicken Bites', price: 27000, description: 'Breaded chicken thigh with choices of topping (Original / Honey Butter / Chessy / Spicy)' }
];

const keyOf = (i) => `${(i.name||'').trim().toLowerCase()}|snack`;
const existing = new Set(
  db.menu_items
    .filter(m => (m.destinationId || '').toString() === dest.id.toString())
    .map(m => `${(m.name||'').trim().toLowerCase()}|${(m.category||'').trim().toLowerCase()}`)
);

const toInsert = snacks.filter(s => !existing.has(keyOf(s)));

if (toInsert.length === 0) {
  console.log('No new Snack items to add for Els Koffie.');
  process.exit(0);
}

const newItems = toInsert.map(s => ({
  id: nextId(),
  name: s.name,
  description: s.description || '',
  price: s.price,
  priceIced: null,
  priceHot: null,
  category: 'Snack',
  cookingTime: '5-10 menit',
  destinationId: dest.id.toString(),
  destinationSlug: dest.slug || '',
  destinationTitle: dest.title,
  available: true,
  image: null,
  additionalInfo: [],
  flavorOptions: []
}));

db.menu_items.push(...newItems);

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log(`Added ${newItems.length} Snack items to Els Koffie:`);
newItems.forEach(i => console.log('-', i.name, 'Rp', i.price));
