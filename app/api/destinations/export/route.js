import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// GET export destinations data
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';
    const category = searchParams.get('category') || 'all';
    
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    let exportData = {};
    
    if (category === 'all') {
      // Export semua kategori
      exportData = {
        wisata: dbData.wisata || [],
        kuliner: dbData.kuliner || [],
        penginapan: dbData.penginapan || [],
        oleh_oleh: dbData.oleh_oleh || [],
        desa_wisata: dbData.desa_wisata || [],
        biro_perjalanan: dbData.biro_perjalanan || [],
        events: dbData.events || []
      };
    } else {
      // Export kategori tertentu
      exportData = {
        [category]: dbData[category] || []
      };
    }
    
    // Tambahkan metadata export
    const exportMetadata = {
      exported_at: new Date().toISOString(),
      total_categories: Object.keys(exportData).length,
      total_items: Object.values(exportData).reduce((sum, arr) => sum + arr.length, 0),
      format: format,
      category: category
    };
    
    if (format === 'csv') {
      // Convert to CSV format
      let csvContent = '';
      
      // Header untuk CSV
      const headers = ['id', 'title', 'location', 'type', 'category', 'short_description', 'description', 'entrance_fee', 'contact', 'address', 'recommended', 'created_at'];
      csvContent += headers.join(',') + '\n';
      
      // Data untuk setiap kategori
      Object.entries(exportData).forEach(([catName, items]) => {
        items.forEach(item => {
          const row = headers.map(header => {
            let value = item[header] || '';
            // Escape commas and quotes for CSV
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              value = `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          });
          csvContent += row.join(',') + '\n';
        });
      });
      
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="destinations_${category}_${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }
    
    // Default JSON format
    return NextResponse.json({
      success: true,
      message: 'Data destinasi berhasil diexport',
      metadata: exportMetadata,
      data: exportData
    });
    
  } catch (error) {
    console.error('Error exporting destinations:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan saat export data'
    }, { status: 500 });
  }
}
