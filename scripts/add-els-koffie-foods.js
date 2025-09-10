const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const dest = db.kuliner.find(k => (k.title || '').toLowerCase().includes('els')); // Els Koffie
if (!dest) {
  console.error('Els Koffie destination not found');
  process.exit(1);
}

const nextId = () => {
  const max = Math.max(...db.menu_items.map(m => parseInt(m.id, 10) || 0));
  return (max + 1).toString();
};

const foods = [
  {
    name: 'Ayam Kecombrang with Butter Rice',
    description: 'Authentic marinated fried chicken, served with butter rice, topped with kecombrang spicy flavor and spinach',
    price: 44000,
  },
  {
    name: 'Saikoro Dabu Dabu with Butter Rice',
    description: 'Saikoro beef with traditional dabu-dabu sauce, sautéed spinach, served with aromatic butter rice',
    price: 60000,
  },
  {
    name: 'Sop Iga',
    description: 'Traditional ribs soup with aromatic fragrance, served with rice, green chili sambal and crackers',
    price: 80000,
  }
];

const newItems = foods.map(f => ({
  id: nextId(),
  name: f.name,
  description: f.description,
  price: f.price,
  priceIced: null,
  priceHot: null,
  category: 'Makanan Utama',
  cookingTime: '10-20 menit',
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

console.log(`Added ${newItems.length} foods to Els Koffie:`);
newItems.forEach(i => console.log('-', i.name, 'Rp', i.price));
