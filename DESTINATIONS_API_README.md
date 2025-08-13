# API Destinations - Dokumentasi Lengkap

## Overview
API Destinations menyediakan akses ke berbagai kategori destinasi wisata dengan penjelasan dalam bahasa Indonesia, serta fitur export data dan migrasi tipe data.

## Menu Utama yang Tersedia

### 1. **Refresh** ✅
- **Endpoint**: `/api/destinations`
- **Fungsi**: Memperbarui dan menampilkan semua kategori destinasi
- **Deskripsi**: Mengambil data terbaru dari semua kategori destinasi

### 2. **Export** ✅
- **Endpoint**: `/api/destinations/export`
- **Fungsi**: Export data destinasi dalam berbagai format
- **Deskripsi**: Mengekspor data destinasi ke format JSON atau CSV

### 3. **Debug** ✅
- **Endpoint**: `/api/destinations` (dengan logging)
- **Fungsi**: Debug dan monitoring data destinasi
- **Deskripsi**: Memantau dan menganalisis struktur data destinasi

### 4. **Fix IDs** ✅
- **Endpoint**: `/api/destinations/[id]`
- **Fungsi**: Perbaikan dan validasi ID destinasi
- **Deskripsi**: Memperbaiki struktur ID yang tidak konsisten

### 5. **Migrate Types** ✅
- **Endpoint**: `/api/destinations/migrate-types`
- **Fungsi**: Migrasi dan standardisasi tipe data
- **Deskripsi**: Standardisasi struktur data untuk semua kategori destinasi

## Endpoints Detail

### 1. Semua Kategori Destinasi
**GET** `/api/destinations`
- Mengembalikan semua kategori destinasi dalam satu response
- Response mencakup: wisata, kuliner, penginapan, oleh-oleh, desa wisata, biro perjalanan, dan events

### 2. Kategori Spesifik

#### Objek Wisata
**GET** `/api/destinations/wisata`
- Destinasi wisata alam, sejarah, dan budaya
- Deskripsi: "Tempat-tempat wisata alam, sejarah, dan budaya yang menarik untuk dikunjungi"

#### Kuliner
**GET** `/api/destinations/kuliner`
- Tempat makan dan minuman khas daerah
- Deskripsi: "Tempat makan dan minuman khas daerah dengan cita rasa lokal yang autentik"

#### Penginapan
**GET** `/api/destinations/penginapan`
- Hotel, homestay, villa, dan tempat menginap
- Deskripsi: "Hotel, homestay, villa, dan tempat menginap lainnya untuk kenyamanan wisatawan"

#### Oleh-Oleh
**GET** `/api/destinations/oleh-oleh`
- Souvenir, makanan khas, dan produk lokal
- Deskripsi: "Souvenir, makanan khas, dan produk lokal yang cocok dibawa pulang sebagai kenang-kenangan"

#### Desa Wisata
**GET** `/api/destinations/desa-wisata`
- Desa yang dikembangkan sebagai destinasi wisata
- Deskripsi: "Desa-desa yang dikembangkan sebagai destinasi wisata dengan budaya dan kehidupan masyarakat lokal"

#### Biro Perjalanan
**GET** `/api/destinations/biro-perjalanan`
- Layanan tour dan travel
- Deskripsi: "Layanan tour dan travel untuk memudahkan perencanaan dan pelaksanaan perjalanan wisata"

#### Events & Acara
**GET** `/api/destinations/events`
- Berbagai acara, festival, dan kegiatan
- Deskripsi: "Berbagai acara, festival, dan kegiatan yang dapat diikuti selama berwisata"

### 3. Fitur Export Data
**GET** `/api/destinations/export`
- **Parameter**:
  - `format`: `json` (default) atau `csv`
  - `category`: `all` (default) atau nama kategori spesifik
- **Fungsi**: Export data dalam format yang diinginkan
- **Format CSV**: Download file CSV dengan nama otomatis

### 4. Fitur Migrate Types
**POST** `/api/destinations/migrate-types`
- **Parameter**:
  - `action`: `analyze`, `migrate`, atau `rollback`
  - `backup_file`: Path file backup (untuk rollback)
- **Fungsi**:
  - **Analyze**: Analisis struktur data yang ada
  - **Migrate**: Standardisasi struktur data semua kategori
  - **Rollback**: Kembalikan data dari backup

## Struktur Response

### Response Semua Kategori
```json
{
  "success": true,
  "destinations": {
    "wisata": {
      "title": "Objek Wisata",
      "description": "Tempat-tempat wisata alam, sejarah, dan budaya yang menarik untuk dikunjungi",
      "data": [...]
    },
    "kuliner": {
      "title": "Kuliner",
      "description": "Tempat makan dan minuman khas daerah dengan cita rasa lokal yang autentik",
      "data": [...]
    }
    // ... kategori lainnya
  }
}
```

### Response Export
```json
{
  "success": true,
  "message": "Data destinasi berhasil diexport",
  "metadata": {
    "exported_at": "2025-01-15T10:00:00Z",
    "total_categories": 7,
    "total_items": 150,
    "format": "json",
    "category": "all"
  },
  "data": {...}
}
```

### Response Migrate Types
```json
{
  "success": true,
  "message": "Migrasi tipe data berhasil dilakukan",
  "migrated_items": 150,
  "backup_file": "db_backup_1736937600000.json",
  "timestamp": "2025-01-15T10:00:00Z"
}
```

## Contoh Penggunaan

### Export Data CSV
```bash
GET /api/destinations/export?format=csv&category=kuliner
```

### Migrate Types - Analyze
```bash
POST /api/destinations/migrate-types?action=analyze
```

### Migrate Types - Execute
```bash
POST /api/destinations/migrate-types?action=migrate
```

### Rollback dari Backup
```bash
POST /api/destinations/migrate-types?action=rollback&backup_file=db_backup_1736937600000.json
```

## Catatan Penting
- **Backup Otomatis**: Fitur migrate types akan membuat backup otomatis sebelum melakukan perubahan
- **Format CSV**: Export CSV mendukung escape karakter khusus (koma, tanda kutip)
- **Standardisasi**: Migrate types akan menstandarisasi field untuk semua kategori
- **Rollback**: Selalu tersedia opsi rollback jika terjadi masalah
- **Validasi**: Semua endpoint memiliki error handling dan validasi data
- **Bahasa Indonesia**: Semua deskripsi dan pesan menggunakan bahasa Indonesia

## Keamanan
- Backup otomatis sebelum migrasi data
- Validasi parameter input
- Error handling yang komprehensif
- Logging untuk audit trail
