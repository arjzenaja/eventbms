const fs = require('fs');
const path = require('path');

// DB
const dbPath = path.join(process.cwd(), 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// RM Suren destination
const DEST_ID = '28';
const DEST_TITLE = 'RM suren';

// Helper to get next id
const getNextId = () => {
  const maxId = Math.max(
    0,
    ...((db.menu_items || []).map(i => parseInt(i.id)).filter(n => !isNaN(n)))
  );
  return (maxId + 1).toString();
};

const baseItem = (name, price, category, description = '') => ({
  id: getNextId(),
  name,
  description,
  price,
  cookingTime: '10-20 menit',
  category,
  destinationId: DEST_ID,
  destinationSlug: '',
  destinationTitle: DEST_TITLE,
  rating: 4.4,
  isPopular: false,
  isSpicy: false,
  halal: true,
  available: true,
  additionalInfo: ['Halal'],
  image: '/placeholder.jpg',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

// Categories requested:
// - Aneka Gurameh
// - Gorengan
// - Aneka Minuman
// - Makanan

const makanan = [
  ['Nasi Lidah Matah', 40000],
  ['Nasi Lidah Balado', 37500],
  ['Nasi Lidah Lado Ijo', 37500],
  ['Nasi Rendang', 30000],
  ['Nasi Sambal Goreng Daging', 32000],
  ['Nasi Rawon', 30000],
  ['Nasi Soto Bandung', 27500],
  ['Nasi Tongkol Rujak', 27500],
  ['Nasi Tongkol Suwir', 22500],
  ['Nasi Tulang Jambal', 24000],
  ['Nasi Ayam Serundeng', 24000],
  ['Ketoprak', 17000],
  ['Nasi Telor Balado', 18000],
  ['Nasi Tumis', 12000],
  ['Leupeut Oncom (2 pcs)', 9000],
].map(([name, price]) => baseItem(name, price, 'Makanan'));

const anekaGurameh = [
  ['Gurameh Acar Kuning', 70000],
  ['Gurameh Pecak', 70000],
  ['Gurameh Asam Manis', 70000],
  ['Gurameh Cabe Ijo', 70000],
  ['Gurameh Bakar', 84000],
  ['Gurameh Goreng', 84000],
].map(([name, price]) => baseItem(name, price, 'Aneka Gurameh'));

const gorengan = [
  ['Mendoan', 12000],
  ['Tahu Aci', 12000],
  ['Pisang Goreng', 12000],
  ['Bakwan', 10000],
  ['Nasi Putih', 5000],
].map(([name, price]) => baseItem(name, price, 'Gorengan'));

const anekaMinuman = [
  ['Aneka Jus', 6000],
  ['Jeruk Panas', 4000],
  ['Jeruk Anget', 4000],
  ['Es Jeruk', 5000],
  ['Es Teh Manis', 3000],
  ['Es Teh Tawar', 1500],
  ['Teh Tawar', 1500],
  ['Air Es', 2000],
  ['Teh Jahe', 5000],
  ['Es Teh Jahe', 5000],
  ['Wedang Jahe Biasa', 4000],
  ['Asem Panas', 4000],
  ['Es Asem', 5000],
  ['Kopi Biasa', 4000],
  ['Kopi Susu', 5000],
  ['Kopi Jahe', 5000],
].map(([name, price]) => baseItem(name, price, 'Aneka Minuman'));

const itemsToAdd = [...makanan, ...anekaGurameh, ...gorengan, ...anekaMinuman];

// Ensure db.menu_items exists
db.menu_items = db.menu_items || [];

// Avoid re-adding exact name-category duplicates for this destination
const existingKeys = new Set(
  db.menu_items
    .filter(i => String(i.destinationId) === DEST_ID)
    .map(i => `${(i.name||'').trim().toLowerCase()}|${(i.category||'').trim().toLowerCase()}`)
);

const toInsert = itemsToAdd.filter(i => {
  const key = `${i.name.trim().toLowerCase()}|${i.category.trim().toLowerCase()}`;
  if (existingKeys.has(key)) return false;
  existingKeys.add(key);
  return true;
});

db.menu_items.push(...toInsert);

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log(`Inserted ${toInsert.length} RM Suren items across categories Makanan, Aneka Gurameh, Gorengan, Aneka Minuman.`);


