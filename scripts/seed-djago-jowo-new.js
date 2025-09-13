const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'db.json');
const DEST_ID = '24';
const DEST_TITLE = 'Djago Jowo';

function readDb() {
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

function nextId(db) {
  const nums = (db.menu_items || []).map(i => parseInt(i.id)).filter(n => !isNaN(n));
  const max = nums.length ? Math.max(...nums) : 0;
  return (max + 1).toString();
}

function item(name, price, category, desc = '') {
  return {
    id: '',
    name,
    description: desc,
    price,
    cookingTime: '10-20 menit',
    category,
    destinationId: DEST_ID,
    destinationSlug: '',
    destinationTitle: DEST_TITLE,
    rating: 4.5,
    isPopular: false,
    isSpicy: false,
    halal: true,
    available: true,
    additionalInfo: ['Halal'],
    image: '/placeholder.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

function run() {
  const db = readDb();
  db.menu_items = db.menu_items || [];

  // Remove existing Djago Jowo menus first
  db.menu_items = db.menu_items.filter(i => String(i.destinationId) !== DEST_ID);

  const rows = [];

  // Ayam Jowo Ageng
  rows.push(item('Ayam 1/8 Ekor', 29000, 'Ayam Jowo Ageng'));
  rows.push(item('Ayam 1/4 Ekor', 53000, 'Ayam Jowo Ageng'));
  rows.push(item('Ayam 1 Ekor', 210000, 'Ayam Jowo Ageng'));
  rows.push(item('Paket Ayam 1/8 Ekor', 35000, 'Ayam Jowo Ageng'));
  rows.push(item('Paket Ayam 1/4 Ekor', 55000, 'Ayam Jowo Ageng'));

  // Bancakan Ber-4
  rows.push(item('Bancakan Ber-4', 160000, 'Bancakan Ber-4', '4 Ayam Jago, 4 Nasi Putih, 4 Gorengan, 4 Teh Es/Hangat, Sayur/Oseng, Mie Goreng, Sambel & Lalapan'));

  // Minuman (es/anget same price -> use single price)
  const minuman = [
    ['Air Es', 1000],
    ['Teh Tawar Es/Anget', 2000],
    ['Air Mineral Botol', 6000],
    ['Teh Manis Es/Anget', 6000],
    ['Lemon Tea DJ Es/Anget', 9000],
    ['Gula Asem Es/Anget', 10000],
    ['Jeruk Es/Anget', 10000],
    ['Jeruk Nipis Es/Anget', 10000],
    ['Kunir Asem Es/Anget', 10000],
    ['Susu Es/Anget', 10000],
    ['Wedang Uwuh', 10000],
    ['Wedang Jahe', 10000],
    ['Kopi Tubruk', 10000],
    ['Teh Gula Batu', 13000],
    ['Jahe Susu', 15000],
    ['Kopi Susu', 15000],
    ['Es Campur', 15000],
    ['Es Dawet', 15000],
    ['Es Cincau Nangka', 15000],
    ['Puding Kelapa Muda', 30000]
  ];
  minuman.forEach(([n, p]) => rows.push(item(n, p, 'Minuman')));

  // Aneka Janganan (Aneka Janganan)
  ['Jangan Pare', 'Jangan Pakis', 'Jangan Balado Terong', 'Jangan Genjer'].forEach(n => rows.push(item(n, 10000, 'Aneka Janganan')));

  // AlaCarte
  const ala = [
    ['Mendoan', 3000],
    ['Bakwan Sayur', 4000],
    ['Nasi Putih', 6000],
    ['Tahu/Tempe Goreng', 7000],
    ['Telur Dadar', 7000],
    ['Kerupuk', 7000],
    ['Rempelo Ati', 9000],
    ['Oseng Tempe', 9000],
    ['Kepala', 9000],
    ['Lodeh Welok', 10000],
    ['Pete (Bakar/Goreng)', 11000],
    ['Jangan Kangkung', 10000],
    ['Mie Goreng Pedas/Tdk Pedas', 15000],
    ['Kikil Gongso Lombok Ijo', 16000],
    ['Cumi Lombok Ijo', 25000]
  ];
  ala.forEach(([n, p]) => rows.push(item(n, p, 'AlaCarte')));

  // Jajanan
  const jajanan = [
    ['Pisang Godhog', 3000],
    ['Pisang Goreng', 3500],
    ['Singkong Goreng Asin', 6000],
    ['Kacang Rebus', 6000],
    ['Rangin Gendis Jawa/Putih (Isi 6)', 10000],
    ['Singkong Goreng Cokelat Keju', 10000],
    ['Emping/Kripik Pisang/Singkong', 10000]
  ];
  jajanan.forEach(([n, p]) => rows.push(item(n, p, 'Jajanan')));

  // Assign IDs and insert (dedupe by name+category)
  const existing = new Set(
    db.menu_items.filter(i => String(i.destinationId) === DEST_ID)
      .map(i => `${(i.name||'').trim().toLowerCase()}|${(i.category||'').trim().toLowerCase()}`)
  );
  const toInsert = [];
  for (const r of rows) {
    const key = `${r.name.trim().toLowerCase()}|${r.category.trim().toLowerCase()}`;
    if (existing.has(key)) continue;
    r.id = nextId(db);
    toInsert.push(r);
    existing.add(key);
    db.menu_items.push(r);
  }

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  console.log(`Inserted ${toInsert.length} Djago Jowo items.`);
}

run();


