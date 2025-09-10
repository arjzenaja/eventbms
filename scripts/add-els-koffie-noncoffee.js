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

const items = [
  { name: 'Havilla Tea', priceIced: 27000 },
  { name: 'Iced Tea', priceIced: 18000 },
  { name: 'Mineral Water', priceIced: 10000 }
];

const keyOf = (i) => `${(i.name||'').trim().toLowerCase()}|non coffee`;
const existingKeys = new Set(
  db.menu_items
    .filter(m => (m.destinationId || '').toString() === dest.id.toString())
    .map(m => `${(m.name||'').trim().toLowerCase()}|${(m.category||'').trim().toLowerCase()}`)
);

const toInsert = items.filter(i => !existingKeys.has(keyOf(i)));

if (toInsert.length === 0) {
  console.log('No new Non Coffee items to add for Els Koffie.');
  process.exit(0);
}

const newItems = toInsert.map(d => ({
  id: nextId(),
  name: d.name,
  description: '',
  price: null,
  priceIced: d.priceIced,
  priceHot: null,
  category: 'Non Coffee',
  cookingTime: '2-3 menit',
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
console.log(`Added ${newItems.length} Non Coffee items to Els Koffie:`);
newItems.forEach(i => console.log('-', i.name, '🧊 Rp', i.priceIced));
