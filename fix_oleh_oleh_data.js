const fs = require('fs');
const path = require('path');

// Baca database
const dbPath = path.join(process.cwd(), 'db.json');
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Perbaiki data oleh_oleh
if (dbData.oleh_oleh && Array.isArray(dbData.oleh_oleh)) {
  dbData.oleh_oleh = dbData.oleh_oleh.map((item, index) => {
    // Pastikan semua field yang diperlukan ada
    return {
      id: item.id || (index + 1).toString(),
      title: item.title || '',
      location: item.location || '',
      type: item.type || 'makanan',
      category: item.category || 'oleh_oleh',
      short_description: item.short_description || '',
      description: item.description || '',
      price_range: item.price_range || item.entrance_fee || 'Gratis',
      contact: item.contact || '',
      address: item.address || '',
      features: Array.isArray(item.features) ? item.features : [],
      recommended: item.recommended || false,
      img_sm: item.img_sm || `/upcoming/img/art/${(index + 1)}-sm.png`,
      img_lg: item.img_lg || `/upcoming/img/art/${(index + 1)}-lg.png`,
      created_at: item.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  });
}

// Tulis kembali ke database
fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));

console.log('Data oleh_oleh berhasil diperbaiki!');
console.log(`Total data: ${dbData.oleh_oleh ? dbData.oleh_oleh.length : 0}`);
