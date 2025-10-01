# Admin Dashboard - Destinations Management

## Overview
Halaman admin untuk mengelola data objek wisata (destinations) dengan fitur CRUD lengkap.

## Fitur yang Tersedia

### 1. Halaman Utama Destinations (`/admin/destinations`)
- **Tampilan Tabel**: Menampilkan semua data objek wisata dalam format tabel
- **Kolom yang Ditampilkan**:
  - NO: Nomor urut
  - ID: ID unik objek wisata
  - NAMA: Nama destinasi dengan thumbnail gambar dan deskripsi singkat
  - LOKASI: Lokasi destinasi dengan ikon pin
  - KATEGORI: Kategori destinasi (Objek Wisata)
  - TIPE: Tipe spesifik destinasi (Wisata Alam, Wisata Taman, dll)
  - TANGGAL: Tanggal destinasi
  - AKSI: Tombol aksi (Lihat, Edit, Hapus)

- **Fitur Pencarian**: Search berdasarkan nama atau lokasi
- **Filter**: Filter berdasarkan tipe destinasi
- **Refresh Data**: Tombol untuk refresh data dari server
- **Debug Tools**: Tools untuk debugging dan maintenance

### 2. Halaman Detail (`/admin/destinations/[id]/view`)
- **Informasi Lengkap**: Menampilkan semua detail destinasi
- **Gambar**: Thumbnail dan gambar besar destinasi
- **Informasi Dasar**: Tipe, lokasi, tanggal, jam
- **Informasi Tiket**: Harga tiket masuk
- **Status**: Direkomendasikan atau tidak
- **Action Buttons**: Tombol untuk edit dan kembali

### 3. Halaman Edit (`/admin/destinations/[id]`)
- **Form Edit Lengkap**: Semua field dapat diedit
- **Field yang Tersedia**:
  - Nama Destinasi (required)
  - Deskripsi Singkat (required)
  - Deskripsi Lengkap (required)
  - Lokasi (required)
  - Tipe Destinasi (required)
  - Harga Tiket (required)
  - Pengelola Wisata
  - Tanggal
  - Gambar Kecil
  - Gambar Besar
  - Direkomendasikan (checkbox)

- **Upload Gambar**: Support untuk upload gambar baru
- **Preview Gambar**: Menampilkan gambar saat ini dan preview
- **Validasi**: Validasi file type dan ukuran (max 5MB)

### 4. Halaman Tambah Baru (`/admin/destinations/new`)
- **Form Input**: Form untuk menambah destinasi baru
- **Field yang Sama**: Semua field yang ada di halaman edit
- **Validasi**: Validasi input dan file upload

## Struktur Data

### Format Data Destinasi
```json
{
  "id": "string",
  "type": "wisata-alam|wisata-taman|wisata-budaya|wisata-sejarah|wisata-buatan|wisata-minat-khusus|wisata-religi",
  "img_sm": "path/to/small/image",
  "img_lg": "path/to/large/image",
  "title": "Nama Destinasi",
  "location": "Lokasi Destinasi",
  "short_description": "Deskripsi singkat",
  "description": "Deskripsi lengkap",
  "manager": "Pengelola Wisata",
  "seats": [
    {
      "seat": "Tiket Masuk",
      "price": 25000
    }
  ],
  "organizers": [...],
  "recommended": false,
  "packages": [],
  "date": "2024-01-15"
}
```

## API Endpoints

### GET `/api/destinations`
- Mengambil semua data destinasi
- Response: `{ success: boolean, destinations: array }`

### GET `/api/destinations/[id]`
- Mengambil data destinasi berdasarkan ID
- Response: `{ success: boolean, destination: object }`

### PUT `/api/destinations/[id]`
- Update data destinasi
- Method: PUT dengan FormData
- Support file upload untuk gambar

### DELETE `/api/destinations/[id]`
- Hapus data destinasi
- Method: DELETE
- Konfirmasi sebelum penghapusan

### POST `/api/destinations/fix-ids`
- Fix ID yang bermasalah
- Method: POST
- Untuk maintenance database

## Fitur Keamanan

### Protected Routes
- Semua halaman admin dilindungi dengan `ProtectedRoute`
- Hanya admin yang sudah login yang bisa akses

### File Upload Security
- Validasi file type (hanya gambar)
- Validasi ukuran file (max 5MB)
- Nama file yang aman (timestamp + extension)

## Troubleshooting

### Masalah Umum

1. **Data tidak muncul**
   - Cek koneksi database
   - Gunakan tombol refresh
   - Cek console browser untuk error

2. **Gambar tidak tampil**
   - Pastikan path gambar benar
   - Cek apakah file ada di folder uploads
   - Gunakan placeholder image jika perlu

3. **Edit tidak tersimpan**
   - Cek semua field required sudah diisi
   - Cek ukuran file gambar
   - Cek console browser untuk error

4. **Hapus tidak berfungsi**
   - Pastikan konfirmasi sudah diklik
   - Cek apakah ada error di console
   - Gunakan tombol refresh setelah hapus

### Debug Tools
- Tombol Debug: Menampilkan informasi state
- Tombol Fix IDs: Memperbaiki ID yang bermasalah
- Console Log: Log detail untuk troubleshooting

## Best Practices

1. **Backup Data**: Selalu backup database sebelum operasi besar
2. **Validasi Input**: Pastikan semua input sudah divalidasi
3. **Error Handling**: Handle error dengan graceful
4. **User Feedback**: Berikan feedback yang jelas untuk setiap aksi
5. **Responsive Design**: Pastikan tampilan responsive di semua device

## Dependencies

- Next.js 14
- React 18
- Tailwind CSS
- File System (fs) untuk file handling
- Path module untuk path manipulation

## File Structure

```
app/admin/destinations/
├── page.jsx                    # Halaman utama
├── [id]/
│   ├── page.jsx               # Halaman edit
│   └── view/
│       └── page.jsx           # Halaman detail
└── new/
    └── page.jsx               # Halaman tambah baru

app/api/destinations/
├── route.js                   # API untuk semua destinasi
└── [id]/
    └── route.js               # API untuk destinasi spesifik
```

## Support

Untuk bantuan teknis atau bug report, silakan hubungi tim development.
