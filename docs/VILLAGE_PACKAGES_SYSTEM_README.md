# Village Packages System - EventBMS

## Overview
Sistem manajemen paket layanan desa wisata yang memungkinkan admin untuk mengelola berbagai jenis layanan yang ditawarkan oleh desa wisata.

## Fitur Utama

### 1. Manajemen Paket Layanan
- **Create**: Membuat paket layanan baru dengan informasi lengkap
- **Read**: Melihat daftar semua paket layanan
- **Update**: Mengedit informasi paket layanan yang sudah ada
- **Delete**: Menghapus paket layanan

### 2. Kategori Layanan
- **Tiket & Parkir**: Tiket masuk, parkir kendaraan
- **Aktivitas**: Kegiatan wisata, workshop, dll
- **Penginapan**: Homestay, camping, dll
- **Layanan**: Jasa pemandu, transportasi, dll

## Field yang Tersedia

### Informasi Dasar
- `title` - Nama layanan (required)
- `description` - Deskripsi detail layanan (required)
- `price` - Harga dalam Rupiah (required)
- `category` - Kategori layanan (required)
- `duration` - Durasi layanan (opsional)
- `villageId` - ID desa wisata (required)
- `villageSlug` - Slug desa wisata (auto-generated)
- `rating` - Rating layanan (default: 4.8)
- `popular` - Status layanan populer (boolean)
- `available` - Status ketersediaan (boolean)

### Field Baru yang Ditambahkan

#### Kapasitas & Pemesanan
- `maxCapacity` - Kapasitas maksimal peserta
- `minOrder` - Minimum pemesanan (default: 1)
- `difficultyLevel` - Tingkat kesulitan (Mudah/Sedang/Sulit/Sangat Sulit)
- `seasonality` - Musim tersedia (Sepanjang Tahun/Musim Kemarau/Musim Hujan/Musim Semi/Musim Gugur)

#### Media & Visual
- `image` - URL gambar/thumbnail layanan
- `highlights` - Poin unggulan layanan

#### Fitur & Inklusi
- `features` - Fitur layanan (array, dipisahkan koma)
- `includedItems` - Item yang disediakan (array, dipisahkan koma)
- `excludedItems` - Item yang tidak disediakan (array, dipisahkan koma)

#### Lokasi & Kontak
- `location` - Lokasi spesifik layanan
- `contact` - Informasi kontak
- `availableTime` - Waktu tersedia
- `ageRestriction` - Batasan usia

#### Diskon & Penawaran Khusus
- `discountType` - Jenis diskon (percentage/fixed/none)
- `discountValue` - Nilai diskon
- `discountValidUntil` - Berlaku sampai tanggal

#### Syarat & Ketentuan
- `terms` - Syarat dan ketentuan layanan
- `cancellationPolicy` - Kebijakan pembatalan

#### Metadata
- `created_at` - Tanggal pembuatan (auto-generated)
- `updated_at` - Tanggal update terakhir (auto-generated)

## Struktur API

### Endpoints
- `GET /api/villages/packages` - Mendapatkan semua paket
- `POST /api/villages/packages` - Membuat paket baru
- `GET /api/villages/packages/[id]` - Mendapatkan paket berdasarkan ID
- `PUT /api/villages/packages/[id]` - Update paket
- `DELETE /api/villages/packages/[id]` - Hapus paket

### Filter Query Parameters
- `villageId` - Filter berdasarkan ID desa wisata
- `villageSlug` - Filter berdasarkan slug desa wisata
- `category` - Filter berdasarkan kategori

## Halaman Admin

### 1. Daftar Paket (`/admin/villages/packages`)
- Tabel dengan semua paket layanan
- Filter berdasarkan kategori
- Aksi: Edit, Hapus, Toggle Status
- Tombol tambah paket baru

### 2. Tambah Paket Baru (`/admin/villages/packages/new`)
- Form lengkap dengan semua field
- Validasi input required
- Preview data sebelum submit
- Auto-generate village slug

### 3. Edit Paket (`/admin/villages/packages/[id]/edit`)
- Form edit dengan data yang sudah ada
- Update semua field termasuk yang baru
- Validasi input
- Preview perubahan

## Contoh Data Paket

```json
{
  "id": "1756715196392",
  "title": "Paket Camping Premium",
  "description": "Camping di area desa wisata dengan pemandangan alam yang indah",
  "price": 50000,
  "category": "Penginapan",
  "duration": "Per malam",
  "villageId": "village_001",
  "villageSlug": "desa-wisata-banyumas",
  "features": ["Tenda disediakan", "Makan malam", "Sarapan", "Pemandu"],
  "popular": true,
  "available": true,
  "rating": 4.8,
  "image": "https://example.com/camping.jpg",
  "maxCapacity": "10 orang",
  "minOrder": 1,
  "terms": "Wajib membawa sleeping bag, Minimal pemesanan 1 hari sebelumnya",
  "contact": "0812-3456-7890",
  "location": "Area camping desa",
  "availableTime": "24 jam",
  "discountType": "percentage",
  "discountValue": "10",
  "discountValidUntil": "2025-12-31",
  "highlights": "Pemandangan sunset, Udara segar, Suasana tenang",
  "includedItems": ["Tenda", "Makanan", "Pemandu", "Perlengkapan camping"],
  "excludedItems": ["Sleeping bag", "Pakaian pribadi", "Transportasi"],
  "cancellationPolicy": "Bisa dibatalkan 24 jam sebelumnya, Refund 50% jika dibatalkan H-1",
  "ageRestriction": "12+ tahun",
  "difficultyLevel": "Mudah",
  "seasonality": "Sepanjang Tahun",
  "created_at": "2025-01-27T10:00:00.000Z",
  "updated_at": "2025-01-27T10:00:00.000Z"
}
```

## Fitur Tambahan

### 1. Sistem Rating
- Rating default 4.8
- Pilihan rating: 4.5, 4.7, 4.8, 4.9, 5.0
- Visual dengan bintang

### 2. Status Layanan
- **Available**: Layanan tersedia untuk dipesan
- **Popular**: Layanan populer dengan badge khusus
- **Toggle Status**: Admin bisa mengubah status ketersediaan

### 3. Validasi Input
- Field required ditandai dengan asterisk (*)
- Validasi format input (email, URL, tanggal)
- Minimum value untuk angka
- Placeholder text untuk panduan

### 4. Responsive Design
- Layout responsive untuk mobile dan desktop
- Grid system yang fleksibel
- Form yang mudah digunakan di semua device

## Cara Penggunaan

### 1. Membuat Paket Baru
1. Buka `/admin/villages/packages/new`
2. Isi semua field yang diperlukan
3. Pilih desa wisata dari dropdown
4. Set kategori dan harga
5. Tambahkan fitur dan inklusi
6. Set status dan rating
7. Submit form

### 2. Mengedit Paket
1. Dari daftar paket, klik tombol edit (✏️)
2. Form akan terisi dengan data yang ada
3. Edit field yang diperlukan
4. Update paket

### 3. Mengelola Status
1. Toggle status ketersediaan dengan tombol 🚫/✅
2. Set layanan populer dengan checkbox
3. Hapus paket dengan tombol 🗑️

## Integrasi dengan Sistem Lain

### 1. Desa Wisata
- Terhubung dengan tabel `desa_wisata`
- Auto-generate village slug
- Validasi village ID

### 2. Frontend Display
- Data paket bisa ditampilkan di halaman desa wisata
- Filter berdasarkan kategori
- Sorting berdasarkan rating, harga, popular

### 3. Booking System
- Siap untuk integrasi sistem pemesanan
- Field `minOrder` dan `maxCapacity` untuk validasi
- `cancellationPolicy` untuk aturan pembatalan

## Maintenance & Updates

### 1. Backup Data
- Backup database secara berkala
- Export data paket jika diperlukan

### 2. Monitoring
- Log semua operasi CRUD
- Track perubahan data
- Monitor performa API

### 3. Updates
- Field baru bisa ditambahkan dengan mudah
- Backward compatibility untuk field lama
- Migration script jika diperlukan

## Troubleshooting

### 1. Error Umum
- **Village not found**: Pastikan village ID valid
- **Required field missing**: Cek semua field required
- **Invalid format**: Validasi format input

### 2. Performance Issues
- Index database untuk field yang sering di-query
- Pagination untuk data yang banyak
- Caching untuk data yang jarang berubah

### 3. Data Consistency
- Validasi data sebelum save
- Transaction untuk operasi kompleks
- Rollback jika terjadi error

## Future Enhancements

### 1. Fitur yang Direncanakan
- Upload gambar multiple
- Rich text editor untuk deskripsi
- Template paket untuk kategori tertentu
- Bulk import/export data

### 2. Integrasi Lanjutan
- Payment gateway
- Notification system
- Analytics dashboard
- Mobile app API

### 3. Advanced Features
- Dynamic pricing
- Seasonal packages
- Package combinations
- Customer reviews system
