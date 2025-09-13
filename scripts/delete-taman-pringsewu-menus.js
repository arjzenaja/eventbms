const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'db.json');

// Read current database
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const DEST_ID = '26'; // Taman Pringsewu

console.log('🗑️  Menghapus menu Taman Pringsewu...');

// Count items before deletion
const itemsBefore = db.menu_items.filter(item => item.destinationId === DEST_ID);
console.log(`📊 Menu items sebelum penghapusan: ${itemsBefore.length}`);

// Create backup
const timestamp = Date.now();
const backupPath = `db_backup_${timestamp}.json`;
fs.writeFileSync(backupPath, JSON.stringify(db, null, 2));
console.log(`💾 Backup dibuat: ${backupPath}`);

// Filter out Taman Pringsewu items
const originalCount = db.menu_items.length;
db.menu_items = db.menu_items.filter(item => item.destinationId !== DEST_ID);
const newCount = db.menu_items.length;
const deletedCount = originalCount - newCount;

console.log(`✅ Berhasil menghapus ${deletedCount} menu items dari Taman Pringsewu`);

// Write updated database
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log('🎉 Database berhasil diperbarui!');
console.log(`📊 Total menu items sekarang: ${newCount}`);
