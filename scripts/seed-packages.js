const fs = require('fs');
const path = require('path');

// Data dummy dari DesaWisataMenuSection
const dummyPackages = [
  {
    title: "Tiket Masuk",
    description: "Tiket masuk ke desa wisata dengan akses ke semua area umum",
    price: 10000,
    category: "Tiket & Parkir",
    duration: "Seharian",
    rating: 4.8,
    popular: true,
    available: true,
    image: "/placeholder.jpg",
    maxCapacity: "Tidak terbatas",
    minOrder: 1,
    terms: "Wajib membawa KTP, Minimal pemesanan 1 hari sebelumnya, Pembayaran di muka",
    contact: "0812-3456-7890",
    location: "Gerbang utama desa wisata",
    availableTime: "08:00-17:00",
    discount: "Diskon tersedia",
    discountType: "percentage",
    discountValue: "10",
    discountValidUntil: "2025-12-31",
    highlights: "Akses ke semua area umum, Pemandangan indah, Suasana pedesaan",
    includedItems: "Tiket masuk, Peta desa, Brosur informasi",
    excludedItems: "Makanan, Minuman, Transportasi",
    cancellationPolicy: "Bisa dibatalkan 24 jam sebelumnya, Refund 50% jika dibatalkan H-1",
    ageRestriction: "Semua umur",
    difficultyLevel: "Mudah",
    seasonality: "Sepanjang Tahun",
    features: ["Gratis anak < 3 tahun", "Diskon pelajar 50%", "Diskon lansia 25%"]
  },
  {
    title: "Jasa Pemandu",
    description: "Pemandu wisata lokal yang akan menjelaskan budaya dan sejarah desa",
    price: 50000,
    category: "Layanan",
    duration: "2-3 jam",
    rating: 4.9,
    popular: true,
    available: true,
    image: "/placeholder.jpg",
    maxCapacity: "10 orang",
    minOrder: 1,
    terms: "Wajib reservasi minimal 1 hari sebelumnya, Pemandu berpengalaman",
    contact: "0812-3456-7890",
    location: "Pusat informasi desa wisata",
    availableTime: "08:00-16:00",
    discount: "Diskon tersedia",
    discountType: "percentage",
    discountValue: "15",
    discountValidUntil: "2025-12-31",
    highlights: "Pemandu lokal berpengalaman, Penjelasan budaya lengkap, Bahasa Indonesia",
    includedItems: "Pemandu wisata, Penjelasan budaya, Penjelasan sejarah",
    excludedItems: "Makanan, Minuman, Transportasi",
    cancellationPolicy: "Bisa dibatalkan 24 jam sebelumnya, Refund 75% jika dibatalkan H-1",
    ageRestriction: "5+ tahun",
    difficultyLevel: "Mudah",
    seasonality: "Sepanjang Tahun",
    features: ["Max 10 orang", "Termasuk sejarah", "Bahasa Indonesia"]
  },
  {
    title: "Paket Berkebun",
    description: "Aktivitas berkebun tradisional dengan bimbingan petani lokal",
    price: 20000,
    category: "Aktivitas",
    duration: "1-2 jam",
    rating: 4.7,
    popular: false,
    available: true,
    image: "/placeholder.jpg",
    maxCapacity: "15 orang",
    minOrder: 2,
    terms: "Wajib membawa pakaian yang nyaman, Minimal pemesanan 2 orang",
    contact: "0812-3456-7890",
    location: "Area kebun desa wisata",
    availableTime: "07:00-11:00, 15:00-17:00",
    discount: "Diskon tersedia",
    discountType: "percentage",
    discountValue: "20",
    discountValidUntil: "2025-12-31",
    highlights: "Pengalaman berkebun tradisional, Bimbingan petani lokal, Hasil panen segar",
    includedItems: "Alat berkebun, Bimbingan petani, Hasil panen",
    excludedItems: "Pakaian, Sepatu, Topi",
    cancellationPolicy: "Bisa dibatalkan 12 jam sebelumnya, Refund 50% jika dibatalkan H-1",
    ageRestriction: "7+ tahun",
    difficultyLevel: "Sedang",
    seasonality: "Sepanjang Tahun",
    features: ["Alat disediakan", "Hasil panen", "Edukasi pertanian"]
  },
  {
    title: "Memasak Tradisional",
    description: "Belajar memasak masakan tradisional khas desa dengan resep turun temurun",
    price: 30000,
    category: "Aktivitas",
    duration: "2-3 jam",
    rating: 4.8,
    popular: true,
    available: true,
    image: "/placeholder.jpg",
    maxCapacity: "8 orang",
    minOrder: 2,
    terms: "Wajib membawa celemek, Minimal pemesanan 2 orang, Reservasi 1 hari sebelumnya",
    contact: "0812-3456-7890",
    location: "Dapur tradisional desa wisata",
    availableTime: "09:00-12:00, 14:00-17:00",
    discount: "Diskon tersedia",
    discountType: "percentage",
    discountValue: "25",
    discountValidUntil: "2025-12-31",
    highlights: "Resep turun temurun, Bahan segar lokal, Bisa dibawa pulang",
    includedItems: "Bahan masakan, Peralatan dapur, Resep masakan",
    excludedItems: "Celemek, Topi chef, Sepatu dapur",
    cancellationPolicy: "Bisa dibatalkan 24 jam sebelumnya, Refund 60% jika dibatalkan H-1",
    ageRestriction: "10+ tahun",
    difficultyLevel: "Sedang",
    seasonality: "Sepanjang Tahun",
    features: ["Bahan disediakan", "Resep dibagikan", "Bisa dibawa pulang"]
  },
  {
    title: "Kerajinan Tangan",
    description: "Membuat kerajinan tangan tradisional dengan bahan alami",
    price: 25000,
    category: "Aktivitas",
    duration: "1-2 jam",
    rating: 4.6,
    popular: false,
    available: true,
    image: "/placeholder.jpg",
    maxCapacity: "12 orang",
    minOrder: 2,
    terms: "Wajib membawa pakaian yang nyaman, Minimal pemesanan 2 orang",
    contact: "0812-3456-7890",
    location: "Workshop kerajinan desa wisata",
    availableTime: "09:00-12:00, 14:00-17:00",
    discount: "Diskon tersedia",
    discountType: "percentage",
    discountValue: "15",
    discountValidUntil: "2025-12-31",
    highlights: "Bahan alami lokal, Teknik tradisional, Hasil kerajinan unik",
    includedItems: "Bahan kerajinan, Peralatan, Panduan lengkap",
    excludedItems: "Pakaian, Sepatu, Topi",
    cancellationPolicy: "Bisa dibatalkan 12 jam sebelumnya, Refund 50% jika dibatalkan H-1",
    ageRestriction: "8+ tahun",
    difficultyLevel: "Sedang",
    seasonality: "Sepanjang Tahun",
    features: ["Bahan disediakan", "Hasil dibawa pulang", "Panduan lengkap"]
  },
  {
    title: "Homestay Standard",
    description: "Menginap di rumah warga dengan fasilitas standar dan suasana pedesaan",
    price: 100000,
    category: "Penginapan",
    duration: "Per malam",
    rating: 4.5,
    popular: false,
    available: true,
    image: "/placeholder.jpg",
    maxCapacity: "4 orang",
    minOrder: 1,
    terms: "Check-in 14:00, Check-out 11:00, Wajib membawa KTP",
    contact: "0812-3456-7890",
    location: "Rumah warga desa wisata",
    availableTime: "24 jam",
    discount: "Diskon tersedia",
    discountType: "percentage",
    discountValue: "20",
    discountValidUntil: "2025-12-31",
    highlights: "Suasana pedesaan asli, Keramahan warga lokal, Pengalaman menginap unik",
    includedItems: "Kamar tidur, Sarapan, WiFi, Kamar mandi dalam",
    excludedItems: "Makan siang, Makan malam, Transportasi",
    cancellationPolicy: "Bisa dibatalkan 48 jam sebelumnya, Refund 70% jika dibatalkan H-1",
    ageRestriction: "Semua umur",
    difficultyLevel: "Mudah",
    seasonality: "Sepanjang Tahun",
    features: ["Sarapan", "WiFi", "Kamar mandi dalam"]
  },
  {
    title: "Homestay Premium",
    description: "Menginap di rumah warga dengan fasilitas premium dan kenyamanan maksimal",
    price: 150000,
    category: "Penginapan",
    duration: "Per malam",
    rating: 4.8,
    popular: true,
    available: true,
    image: "/placeholder.jpg",
    maxCapacity: "6 orang",
    minOrder: 1,
    terms: "Check-in 14:00, Check-out 11:00, Wajib membawa KTP, Reservasi 2 hari sebelumnya",
    contact: "0812-3456-7890",
    location: "Rumah warga premium desa wisata",
    availableTime: "24 jam",
    discount: "Diskon tersedia",
    discountType: "percentage",
    discountValue: "25",
    discountValidUntil: "2025-12-31",
    highlights: "Fasilitas premium, Kenyamanan maksimal, Suasana pedesaan mewah",
    includedItems: "Kamar tidur premium, Sarapan, WiFi, AC, Kamar mandi dalam, Terrace",
    excludedItems: "Makan siang, Makan malam, Transportasi, Laundry",
    cancellationPolicy: "Bisa dibatalkan 72 jam sebelumnya, Refund 80% jika dibatalkan H-1",
    ageRestriction: "Semua umur",
    difficultyLevel: "Mudah",
    seasonality: "Sepanjang Tahun",
    features: ["Sarapan", "WiFi", "AC", "Kamar mandi dalam", "Terrace"]
  },
  {
    title: "Paket Camping",
    description: "Camping di area desa wisata dengan pemandangan alam yang indah",
    price: 50000,
    category: "Aktivitas",
    duration: "Per malam",
    rating: 4.7,
    popular: false,
    available: true,
    image: "/placeholder.jpg",
    maxCapacity: "20 orang",
    minOrder: 2,
    terms: "Wajib membawa sleeping bag, Minimal pemesanan 2 orang, Reservasi 3 hari sebelumnya",
    contact: "0812-3456-7890",
    location: "Area camping desa wisata",
    availableTime: "24 jam",
    discount: "Diskon tersedia",
    discountType: "percentage",
    discountValue: "30",
    discountValidUntil: "2025-12-31",
    highlights: "Pemandangan alam indah, Suasana camping nyaman, Aktivitas outdoor seru",
    includedItems: "Tenda camping, Makan malam, Sarapan, Pemandu camping",
    excludedItems: "Sleeping bag, Pakaian pribadi, Transportasi, Peralatan pribadi",
    cancellationPolicy: "Bisa dibatalkan 48 jam sebelumnya, Refund 60% jika dibatalkan H-1",
    ageRestriction: "12+ tahun",
    difficultyLevel: "Sedang",
    seasonality: "Musim Kemarau",
    features: ["Tenda disediakan", "Makan malam", "Sarapan", "Pemandu"]
  }
];

// Fungsi untuk mengisi database
async function seedVillagePackages() {
  try {
    console.log('🚀 Memulai proses seeding data paket desa wisata...');
    
    // Baca database yang ada
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Inisialisasi array village_packages jika belum ada
    if (!dbData.village_packages) {
      dbData.village_packages = [];
    }
    
    // Tambahkan data dummy dengan ID unik dan timestamp
    const timestamp = new Date().toISOString();
    let addedCount = 0;
    
    dummyPackages.forEach((packageData, index) => {
      // Cek apakah paket sudah ada berdasarkan title
      const existingPackage = dbData.village_packages.find(pkg => pkg.title === packageData.title);
      
      if (!existingPackage) {
        const newPackage = {
          id: `pkg_${Date.now()}_${index}`,
          ...packageData,
          villageId: "desa_wisata_001", // ID default desa wisata
          villageSlug: "desa-wisata-banyumas", // Slug default
          created_at: timestamp,
          updated_at: timestamp
        };
        
        dbData.village_packages.push(newPackage);
        addedCount++;
        console.log(`✅ Ditambahkan: ${packageData.title}`);
      } else {
        console.log(`⏭️  Sudah ada: ${packageData.title}`);
      }
    });
    
    // Tulis kembali ke database
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    console.log(`\n🎉 Proses seeding selesai!`);
    console.log(`📊 Total paket yang ditambahkan: ${addedCount}`);
    console.log(`📊 Total paket di database: ${dbData.village_packages.length}`);
    
    // Tampilkan ringkasan
    console.log('\n📋 Ringkasan Paket yang Ditambahkan:');
    dbData.village_packages.forEach((pkg, index) => {
      console.log(`${index + 1}. ${pkg.title} - Rp ${pkg.price.toLocaleString('id-ID')} (${pkg.category})`);
    });
    
  } catch (error) {
    console.error('❌ Error saat seeding:', error);
  }
}

// Jalankan fungsi seeding
seedVillagePackages();
