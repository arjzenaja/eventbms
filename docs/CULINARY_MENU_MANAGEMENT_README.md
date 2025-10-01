# Sistem Manajemen Menu Kuliner

## Overview

Sistem manajemen menu kuliner telah berhasil diimplementasikan untuk memungkinkan tim pengelola (admin) menambahkan, mengedit, dan mengelola menu makanan individual untuk setiap destinasi kuliner. Sistem ini menyediakan interface yang lengkap dan user-friendly untuk mengelola semua aspek menu kuliner.

## Fitur yang Diimplementasikan

### 1. API Menu Management (`/api/culinary/menu`)
- **CRUD Operations**: Create, Read, Update, Delete menu items
- **File Upload**: Upload gambar menu dengan validasi
- **Database Integration**: Integrasi dengan db.json untuk penyimpanan data
- **Filtering**: Filter menu berdasarkan destinasi, kategori, dan parameter lainnya
- **Fallback System**: Menggunakan data statis jika database tidak tersedia

### 2. Admin Interface untuk Menu Management

#### Halaman Utama Menu (`/admin/culinary/menu`)
- **Dashboard Menu**: Tampilan tabel semua menu dengan informasi lengkap
- **Filtering & Search**: Filter berdasarkan destinasi, kategori, dan pencarian teks
- **Status Management**: Toggle status tersedia/tidak tersedia
- **Quick Actions**: Edit dan hapus menu langsung dari tabel
- **Visual Indicators**: Badge untuk menu populer, pedas, halal, dll

#### Form Tambah Menu Baru (`/admin/culinary/menu/new`)
- **Form Komprehensif**: Semua field yang diperlukan untuk menu makanan
- **Image Upload**: Upload dan preview gambar menu
- **Dynamic Categories**: Pilihan kategori yang luas dan fleksibel
- **Additional Info**: Sistem tag informasi tambahan (halal, fresh, dll)
- **Validation**: Validasi form yang ketat untuk memastikan data lengkap

#### Form Edit Menu (`/admin/culinary/menu/[id]/edit`)
- **Pre-filled Data**: Form terisi dengan data menu yang ada
- **Image Management**: Update gambar dengan preview
- **Full Edit Capability**: Edit semua aspek menu
- **Data Integrity**: Mempertahankan data yang tidak diubah

### 3. Field Menu yang Tersedia

#### Informasi Dasar
- **Nama Menu**: Nama makanan/minuman
- **Deskripsi**: Penjelasan singkat tentang menu
- **Kategori**: Klasifikasi menu (Makanan Utama, Minuman, dll)
- **Gambar**: Foto menu untuk tampilan visual

#### Informasi Harga dan Waktu
- **Harga**: Harga dalam Rupiah
- **Estimasi Waktu**: Waktu memasak/penyajian

#### Informasi Destinasi
- **Destinasi Kuliner**: Link ke destinasi kuliner tertentu
- **Auto-fill**: Otomatis mengisi informasi destinasi

#### Rating dan Status
- **Rating**: Rating 1-5 dengan desimal
- **Menu Populer**: Flag untuk menu yang populer
- **Menu Pedas**: Flag untuk menu pedas
- **Halal**: Status halal menu
- **Tersedia**: Status ketersediaan menu

#### Informasi Tambahan
- **Additional Info**: Array tag informasi tambahan
- **Predefined Options**: Opsi yang sudah disediakan (Fresh, Traditional, dll)
- **Custom Tags**: Kemampuan menambah tag kustom

## Struktur Data Menu

```javascript
{
  id: 1,
  name: "Nasi Goreng Spesial",
  description: "Nasi goreng dengan telur, ayam, dan sayuran segar khas Banyumas",
  price: 25000,
  cookingTime: "10-15 menit",
  category: "Makanan Utama",
  destinationId: "1",
  destinationSlug: "warung-makan-sederhana",
  destinationTitle: "Warung Makan Sederhana",
  rating: 4.8,
  isPopular: true,
  isSpicy: false,
  halal: true,
  available: true,
  additionalInfo: ["Halal", "Fresh", "Traditional"],
  image: "/uploads/menu/menu_1234567890.jpg",
  createdAt: "2024-01-15T10:30:00.000Z",
  updatedAt: "2024-01-15T10:30:00.000Z"
}
```

## Kategori Menu yang Tersedia

### Makanan
- Makanan Utama
- Makanan Ringan
- Sate
- Soto
- Nasi
- Mie
- Seafood
- Ayam
- Daging
- Sayuran
- Sup
- Gorengan
- Bakso

### Minuman
- Minuman
- Dessert
- Es
- Kopi
- Teh
- Jus

### Lainnya
- Lainnya

## Informasi Tambahan yang Tersedia

### Status Makanan
- Halal
- Vegetarian
- Vegan
- Gluten Free
- Dairy Free
- Nut Free

### Karakteristik
- Fresh
- Traditional
- Signature
- Local
- Comfort
- Refresh
- Spicy
- Sweet
- Sour
- Crispy
- Soft
- Hot
- Cold

### Kategori Harga
- Budget
- Premium

### Kesehatan
- Quick
- Healthy
- Organic

## Cara Penggunaan

### 1. Akses Menu Management
1. Login sebagai admin
2. Buka halaman `/admin/culinary`
3. Klik tombol "🍽️ Kelola Menu"

### 2. Menambah Menu Baru
1. Klik "Tambah Menu" di halaman menu management
2. Isi semua field yang diperlukan (ditandai dengan *)
3. Upload gambar menu (opsional)
4. Pilih kategori dan destinasi kuliner
5. Set rating dan status menu
6. Tambah informasi tambahan sesuai kebutuhan
7. Klik "Simpan Menu"

### 3. Mengedit Menu
1. Klik tombol "Edit" pada menu yang ingin diedit
2. Ubah field yang diperlukan
3. Upload gambar baru jika diperlukan
4. Klik "Simpan Perubahan"

### 4. Mengelola Status Menu
1. Klik badge status pada tabel menu
2. Status akan berubah antara "Tersedia" dan "Tidak Tersedia"

### 5. Menghapus Menu
1. Klik tombol "Hapus" pada menu yang ingin dihapus
2. Konfirmasi penghapusan

## API Endpoints

### GET `/api/culinary/menu`
**Query Parameters:**
- `destinationId`: ID destinasi kuliner
- `slug`: Slug destinasi kuliner
- `category`: Kategori menu

**Response:**
```json
{
  "success": true,
  "menu_items": [...],
  "total": 12,
  "categories": ["Makanan Utama", "Minuman"],
  "priceRange": {
    "min": 3000,
    "max": 55000
  }
}
```

### POST `/api/culinary/menu`
**Request Body (FormData):**
- `name`: Nama menu (required)
- `description`: Deskripsi menu (required)
- `price`: Harga (required)
- `cookingTime`: Estimasi waktu (required)
- `category`: Kategori (required)
- `destinationId`: ID destinasi (required)
- `rating`: Rating (optional)
- `isPopular`: Boolean (optional)
- `isSpicy`: Boolean (optional)
- `halal`: Boolean (optional)
- `available`: Boolean (optional)
- `additionalInfo`: JSON array (optional)
- `image`: File gambar (optional)

### PUT `/api/culinary/menu`
**Request Body (FormData):**
- `id`: ID menu (required)
- Semua field yang sama dengan POST

### DELETE `/api/culinary/menu?id={id}`
**Response:**
```json
{
  "success": true,
  "message": "Menu berhasil dihapus"
}
```

## Integrasi dengan Frontend

### Menu Display
Menu yang ditambahkan melalui admin panel akan otomatis muncul di:
- Halaman detail destinasi kuliner
- Menu section di halaman kuliner
- Menu card components

### Fallback System
Jika tidak ada menu di database, sistem akan menggunakan data statis sebagai fallback untuk memastikan tampilan tetap berfungsi.

## Keamanan dan Validasi

### File Upload
- Validasi tipe file (hanya gambar)
- Batasan ukuran file (maksimal 5MB)
- Generate nama file unik untuk menghindari konflik

### Form Validation
- Validasi field required
- Validasi format data (harga, rating, dll)
- Sanitasi input untuk mencegah XSS

### Access Control
- Semua halaman admin dilindungi dengan `ProtectedRoute`
- Hanya admin yang dapat mengakses menu management

## Database Structure

Menu items disimpan dalam `db.json` dengan struktur:
```json
{
  "menu_items": [
    {
      // menu item data
    }
  ]
}
```

## Troubleshooting

### Menu Tidak Muncul
1. Periksa apakah menu sudah disimpan dengan benar
2. Pastikan destinasi kuliner sudah dipilih
3. Periksa status "Tersedia" menu

### Gambar Tidak Tampil
1. Periksa path file gambar
2. Pastikan file sudah diupload dengan benar
3. Periksa permission folder uploads

### Error Saat Menyimpan
1. Periksa semua field required sudah diisi
2. Pastikan format data sesuai (harga angka, rating 1-5)
3. Periksa koneksi database

## Future Enhancements

1. **Bulk Operations**: Import/export menu dalam batch
2. **Menu Templates**: Template untuk menu yang sering digunakan
3. **Advanced Filtering**: Filter berdasarkan rating, harga range, dll
4. **Menu Analytics**: Statistik menu yang paling populer
5. **Menu Scheduling**: Jadwal ketersediaan menu
6. **Multi-language Support**: Dukungan bahasa untuk menu internasional
