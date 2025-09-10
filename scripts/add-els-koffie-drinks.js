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

const drinks = [
  { name: 'Lychee Tea', category: 'Non Coffe+', price: 25000 },
  { name: 'Peach Tea', category: 'Non Coffe+', price: 25000 },
  { name: 'Lemon Tea', category: 'Non Coffe+', price: 25000 },
  { name: 'Blushing Rose', category: 'Non Coffe+', price: 35000, description: 'Coldbrew, cranberry juice, rose syrup' },
  { name: 'Cloudy Luscious', category: 'Non Coffe+', price: 35000, description: 'Espresso, green tea, passion fruit syrup, topped with osmanthus cream' },
  { name: 'Cinnamon Roll', category: 'Non Coffe+', price: 35000, description: 'Coldbrew, vanilla syrup, simple syrup, topped with cinnamon cream' },
  { name: 'Tropical Haze', category: 'Non Coffe+', price: 35000, description: 'Coldbrew, vanilla syrup, lychee syrup, passion fruit syrup, tonic water' }
];

const keyOf = (i) => `${(i.name||'').trim().toLowerCase()}|${(i.category||'').trim().toLowerCase()}`;
const existing = new Set(
  db.menu_items
    .filter(m => (m.destinationId || '').toString() === dest.id.toString())
    .map(keyOf)
);

const toInsert = drinks.filter(d => !existing.has(keyOf(d)));

if (toInsert.length === 0) {
  console.log('No new drinks to add. All already exist.');
  process.exit(0);
}

const newItems = toInsert.map(d => ({
  id: nextId(),
  name: d.name,
  description: d.description || '',
  price: d.price,
  priceIced: null,
  priceHot: null,
  category: d.category,
  cookingTime: '3-5 menit',
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

console.log(`Added ${newItems.length} drinks to Els Koffie:`);
newItems.forEach(i => console.log('-', i.name, `Rp ${i.price}`));
