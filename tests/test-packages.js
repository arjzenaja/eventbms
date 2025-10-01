const fs = require('fs');
const path = require('path');

// Test script untuk memverifikasi data paket desa wisata
function testVillagePackages() {
  try {
    console.log('🔍 Memverifikasi data paket desa wisata...');
    
    // Baca database
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Cek apakah village_packages ada
    if (!dbData.village_packages) {
      console.log('❌ village_packages tidak ditemukan di database');
      return;
    }
    
    console.log(`✅ village_packages ditemukan dengan ${dbData.village_packages.length} paket`);
    
    // Tampilkan semua paket
    dbData.village_packages.forEach((pkg, index) => {
      console.log(`\n📦 Paket ${index + 1}:`);
      console.log(`   ID: ${pkg.id}`);
      console.log(`   Title: ${pkg.title}`);
      console.log(`   Category: ${pkg.category}`);
      console.log(`   Price: Rp ${pkg.price?.toLocaleString('id-ID') || 'N/A'}`);
      console.log(`   Available: ${pkg.available ? '✅' : '❌'}`);
      console.log(`   Popular: ${pkg.popular ? '🔥' : '❌'}`);
      console.log(`   Village ID: ${pkg.villageId}`);
      console.log(`   Village Slug: ${pkg.villageSlug}`);
    });
    
    // Cek field yang diperlukan
    const requiredFields = ['title', 'description', 'price', 'category', 'available', 'popular'];
    const missingFields = [];
    
    dbData.village_packages.forEach((pkg, index) => {
      requiredFields.forEach(field => {
        if (pkg[field] === undefined || pkg[field] === null) {
          missingFields.push(`Paket ${index + 1} (${pkg.title}): ${field}`);
        }
      });
    });
    
    if (missingFields.length > 0) {
      console.log('\n⚠️  Field yang hilang:');
      missingFields.forEach(field => console.log(`   ${field}`));
    } else {
      console.log('\n✅ Semua field yang diperlukan tersedia');
    }
    
    // Test API endpoint simulation
    console.log('\n🧪 Test API Endpoint Simulation:');
    const packages = dbData.village_packages || [];
    const availablePackages = packages.filter(pkg => pkg.available);
    const popularPackages = packages.filter(pkg => pkg.popular);
    
    console.log(`   Total Packages: ${packages.length}`);
    console.log(`   Available: ${availablePackages.length}`);
    console.log(`   Popular: ${popularPackages.length}`);
    
    // Test search functionality
    const searchTerm = 'Tiket';
    const searchResults = packages.filter(pkg => 
      pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    console.log(`\n🔍 Search Results untuk "${searchTerm}":`);
    if (searchResults.length > 0) {
      searchResults.forEach(pkg => {
        console.log(`   ✅ ${pkg.title} - ${pkg.category}`);
      });
    } else {
      console.log('   ❌ Tidak ada hasil pencarian');
    }
    
  } catch (error) {
    console.error('❌ Error saat testing:', error);
  }
}

// Jalankan test
testVillagePackages();
