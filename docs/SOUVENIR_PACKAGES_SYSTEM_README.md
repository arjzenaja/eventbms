# Sistem Manajemen Paket Oleh-oleh

## Overview
Sistem manajemen paket oleh-oleh memungkinkan admin untuk mengelola paket-paket oleh-oleh yang dapat dipesan oleh pengunjung. Sistem ini terpisah dari manajemen oleh-oleh utama, mirip dengan pemisahan antara Kuliner dan Menu.

## Fitur Utama

### 1. Manajemen Paket Oleh-oleh
- **Daftar Paket**: Melihat semua paket oleh-oleh yang tersedia
- **Filter & Pencarian**: Filter berdasarkan oleh-oleh dan pencarian berdasarkan nama/deskripsi
- **Tambah Paket**: Menambahkan paket baru dengan detail lengkap
- **Edit Paket**: Mengubah informasi paket yang sudah ada
- **Hapus Paket**: Menghapus paket yang tidak diperlukan
- **Toggle Status**: Mengaktifkan/menonaktifkan ketersediaan paket

### 2. Integrasi dengan Oleh-oleh
- Setiap paket terkait dengan oleh-oleh tertentu
- Menampilkan nama oleh-oleh di daftar paket
- Validasi keberadaan oleh-oleh saat membuat paket

## Struktur Data

### Paket Oleh-oleh
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "price": "number",
  "souvenirId": "string",
  "souvenirTitle": "string",
  "available": "boolean",
  "createdAt": "string",
  "updatedAt": "string"
}
```

### Field Descriptions
- **id**: ID unik paket (auto-generated)
- **name**: Nama paket (contoh: "Paket Batik 3 Pcs")
- **description**: Deskripsi detail paket
- **price**: Harga paket dalam Rupiah
- **souvenirId**: ID oleh-oleh yang terkait
- **souvenirTitle**: Nama oleh-oleh (untuk display)
- **available**: Status ketersediaan paket
- **createdAt**: Timestamp pembuatan
- **updatedAt**: Timestamp terakhir update

## API Endpoints

### 1. GET /api/souvenirs/packages
Mengambil semua paket oleh-oleh
```json
{
  "success": true,
  "packages": [...]
}
```

### 2. POST /api/souvenirs/packages
Membuat paket baru
```json
{
  "success": true,
  "message": "Paket oleh-oleh berhasil ditambahkan",
  "package": {...}
}
```

### 3. GET /api/souvenirs/packages/[id]
Mengambil detail paket tertentu
```json
{
  "success": true,
  "package": {...}
}
```

### 4. PUT /api/souvenirs/packages/[id]
Mengupdate paket
```json
{
  "success": true,
  "message": "Paket berhasil diperbarui",
  "package": {...}
}
```

### 5. DELETE /api/souvenirs/packages/[id]
Menghapus paket
```json
{
  "success": true,
  "message": "Paket berhasil dihapus"
}
```

## Halaman Admin

### 1. /admin/souvenirs/packages
- **Fungsi**: Daftar semua paket oleh-oleh
- **Fitur**: Filter, pencarian, aksi edit/hapus/toggle status
- **Komponen**: Table dengan pagination, filter dropdown, search input

### 2. /admin/souvenirs/packages/new
- **Fungsi**: Menambah paket baru
- **Fitur**: Form input dengan validasi, dropdown pilihan oleh-oleh
- **Komponen**: Form dengan field name, price, souvenir selection, description

### 3. /admin/souvenirs/packages/[id]/edit
- **Fungsi**: Mengedit paket yang sudah ada
- **Fitur**: Form pre-filled dengan data existing
- **Komponen**: Form edit dengan validasi

## Integrasi dengan Sistem Oleh-oleh

### 1. Button "Kelola Paket"
- Ditambahkan di halaman `/admin/souvenirs`
- Mengarah ke `/admin/souvenirs/packages`

### 2. Data Relationship
- Paket terkait dengan oleh-oleh melalui `souvenirId`
- Menampilkan nama oleh-oleh di daftar paket

### 3. Validasi
- Memastikan oleh-oleh exists sebelum membuat paket
- Menampilkan error jika oleh-oleh tidak ditemukan

## Database Structure

### db.json
```json
{
  "souvenirs": [...],
  "souvenir_packages": [
    {
      "id": "1755222349440",
      "name": "Paket Batik 3 Pcs",
      "description": "Paket berisi 3 pcs batik dengan motif berbeda",
      "price": 150000,
      "souvenirId": "1755222349440",
      "souvenirTitle": "Batik Gajah Uling",
      "available": true,
      "createdAt": "2024-01-14T10:30:00.000Z",
      "updatedAt": "2024-01-14T10:30:00.000Z"
    }
  ]
}
```

## Usage Instructions

### 1. Menambah Paket Baru
1. Buka halaman `/admin/souvenirs/packages`
2. Klik tombol "Tambah Paket"
3. Isi form dengan data lengkap:
   - Nama paket
   - Harga
   - Pilih oleh-oleh terkait
   - Deskripsi (opsional)
   - Status ketersediaan
4. Klik "Simpan Paket"

### 2. Mengelola Paket Existing
1. Buka halaman `/admin/souvenirs/packages`
2. Gunakan filter untuk mencari paket tertentu
3. Klik tombol aksi:
   - **Edit**: Mengubah data paket
   - **Aktifkan/Nonaktifkan**: Toggle status ketersediaan
   - **Hapus**: Menghapus paket (dengan konfirmasi)

### 3. Filter dan Pencarian
- **Filter Oleh-oleh**: Pilih oleh-oleh tertentu untuk melihat paketnya
- **Pencarian**: Ketik nama atau deskripsi paket untuk mencari

## Future Enhancements

### 1. Fitur yang Direncanakan
- **Paket Items**: Menambahkan detail item dalam paket
- **Gambar Paket**: Upload gambar untuk setiap paket
- **Kategori Paket**: Mengelompokkan paket berdasarkan kategori
- **Bulk Operations**: Operasi massal (delete, toggle status)
- **Export/Import**: Export data paket ke Excel/CSV

### 2. Integrasi Frontend
- **Public Package Display**: Menampilkan paket di halaman publik
- **Package Ordering**: Sistem pemesanan paket
- **Package Reviews**: Review dan rating untuk paket

### 3. Analytics
- **Package Performance**: Tracking paket yang paling laris
- **Revenue Analytics**: Analisis pendapatan dari paket
- **Customer Insights**: Data preferensi pelanggan

## Error Handling

### 1. Validation Errors
- Nama paket wajib diisi
- Harga harus berupa angka positif
- Oleh-oleh harus dipilih
- Validasi format data

### 2. Database Errors
- File db.json tidak dapat diakses
- Data corruption
- Concurrent access issues

### 3. Network Errors
- API timeout
- Connection issues
- Server errors

## Security Considerations

### 1. Input Validation
- Sanitasi input user
- Validasi tipe data
- Length restrictions

### 2. Access Control
- Protected routes untuk admin
- Session management
- Role-based access

### 3. Data Protection
- Backup database
- Data encryption (future)
- Audit logging (future)

## Maintenance

### 1. Regular Tasks
- Backup database
- Clean up unused packages
- Update package prices
- Review package performance

### 2. Monitoring
- API response times
- Error rates
- Database size
- User activity

### 3. Updates
- Feature updates
- Security patches
- Performance improvements
- UI/UX enhancements
