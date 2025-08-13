import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// POST migrate destination types
export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'analyze';
    
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    if (action === 'analyze') {
      // Analisis struktur data yang ada
      const analysis = {
        timestamp: new Date().toISOString(),
        categories: {},
        type_mapping: {},
        recommendations: []
      };
      
      // Analisis setiap kategori
      const categories = ['wisata', 'kuliner', 'penginapan', 'oleh_oleh', 'desa_wisata', 'biro_perjalanan', 'events'];
      
      categories.forEach(category => {
        if (dbData[category]) {
          const items = dbData[category];
          const types = [...new Set(items.map(item => item.type).filter(Boolean))];
          const fields = items.length > 0 ? Object.keys(items[0]) : [];
          
          analysis.categories[category] = {
            total_items: items.length,
            unique_types: types,
            fields: fields,
            sample_item: items[0] || null
          };
          
          // Mapping tipe yang ada
          types.forEach(type => {
            if (!analysis.type_mapping[type]) {
              analysis.type_mapping[type] = [];
            }
            analysis.type_mapping[type].push(category);
          });
        }
      });
      
      // Rekomendasi standardisasi
      const commonFields = ['id', 'title', 'location', 'type', 'category', 'short_description', 'description'];
      const recommendedFields = [...commonFields, 'entrance_fee', 'contact', 'address', 'features', 'recommended', 'created_at', 'updated_at'];
      
      analysis.recommendations = [
        'Standardisasi field untuk semua kategori',
        'Penambahan field yang konsisten',
        'Validasi tipe data yang seragam',
        'Backup data sebelum migrasi'
      ];
      
      return NextResponse.json({
        success: true,
        message: 'Analisis struktur data berhasil',
        analysis: analysis,
        recommended_fields: recommendedFields
      });
      
    } else if (action === 'migrate') {
      // Lakukan migrasi data
      const backupPath = path.join(process.cwd(), `db_backup_${Date.now()}.json`);
      
      // Backup database terlebih dahulu
      fs.writeFileSync(backupPath, JSON.stringify(dbData, null, 2));
      
      // Standardisasi struktur untuk setiap kategori
      const categories = ['wisata', 'kuliner', 'penginapan', 'oleh_oleh', 'desa_wisata', 'biro_perjalanan', 'events'];
      let migratedCount = 0;
      
      categories.forEach(category => {
        if (dbData[category]) {
          dbData[category] = dbData[category].map(item => {
            const migratedItem = {
              id: item.id || '',
              title: item.title || '',
              location: item.location || '',
              type: item.type || 'umum',
              category: category,
              short_description: item.short_description || item.description || '',
              description: item.description || item.short_description || '',
              entrance_fee: item.entrance_fee || 'Gratis',
              contact: item.contact || '',
              address: item.address || '',
              features: Array.isArray(item.features) ? item.features : ['Fasilitas Dasar'],
              recommended: Boolean(item.recommended),
              created_at: item.created_at || new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            
            // Tambahkan field khusus kategori jika ada
            if (category === 'kuliner') {
              migratedItem.menu_highlight = item.menu_highlight || '';
              migratedItem.price_range = item.price_range || 'Menengah';
            } else if (category === 'penginapan') {
              migratedItem.room_types = item.room_types || ['Standard'];
              migratedItem.price_range = item.price_range || 'Menengah';
            } else if (category === 'events') {
              migratedItem.event_date = item.event_date || '';
              migratedItem.event_time = item.event_time || '';
              migratedItem.organizer = item.organizer || '';
            }
            
            migratedCount++;
            return migratedItem;
          });
        }
      });
      
      // Simpan database yang sudah dimigrasi
      fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
      
      return NextResponse.json({
        success: true,
        message: 'Migrasi tipe data berhasil dilakukan',
        migrated_items: migratedCount,
        backup_file: backupPath,
        timestamp: new Date().toISOString()
      });
      
    } else if (action === 'rollback') {
      // Rollback dari backup
      const backupPath = searchParams.get('backup_file');
      if (!backupPath || !fs.existsSync(backupPath)) {
        return NextResponse.json({
          success: false,
          message: 'File backup tidak ditemukan'
        }, { status: 400 });
      }
      
      const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
      fs.writeFileSync(dbPath, JSON.stringify(backupData, null, 2));
      
      return NextResponse.json({
        success: true,
        message: 'Rollback berhasil dilakukan',
        restored_from: backupPath,
        timestamp: new Date().toISOString()
      });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Action tidak valid. Gunakan: analyze, migrate, atau rollback'
    }, { status: 400 });
    
  } catch (error) {
    console.error('Error migrating destination types:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan saat migrasi tipe data'
    }, { status: 500 });
  }
}
