# Sistem Manajemen Kamar

## Overview
Sistem manajemen kamar yang terpisah dari penginapan, mirip dengan sistem menu kuliner. Sistem ini memungkinkan admin untuk mengelola tipe-tipe kamar yang tersedia di setiap penginapan secara terpisah.

## Fitur yang Diimplementasikan

### 1. Manajemen Kamar Terpisah
- **Penginapan**: Mengelola data penginapan (hotel, villa, homestay, dll)
- **Kamar**: Mengelola tipe-tipe kamar yang tersedia di setiap penginapan

### 2. Halaman Admin
- **Daftar Kamar** (`/admin/rooms`): Menampilkan semua tipe kamar dengan filter dan pencarian
- **Tambah Kamar** (`/admin/rooms/new`): Form untuk menambah tipe kamar baru
- **Edit Kamar** (`/admin/rooms/[id]/edit`): Form untuk mengedit tipe kamar yang ada

### 3. API Endpoints
- **GET** `/api/rooms`: Mengambil semua kamar dengan filter opsional
- **POST** `/api/rooms`: Membuat kamar baru
- **PUT** `/api/rooms`: Mengupdate kamar yang ada
- **DELETE** `/api/rooms?id=[id]`: Menghapus kamar

## Field yang Tersedia

### Informasi Dasar
- **name** (string, required): Nama tipe kamar
- **description** (string): Deskripsi kamar
- **capacity** (string): Kapasitas kamar (jumlah orang)
- **size** (string): Ukuran kamar (m²)
- **bedType** (string): Tipe tempat tidur
- **price** (number, required): Harga per malam
- **accommodationId** (string, required): ID penginapan
- **accommodationSlug** (string): Slug penginapan
- **accommodationTitle** (string): Nama penginapan

### Opsi
- **isPopular** (boolean): Apakah kamar populer
- **available** (boolean): Apakah kamar tersedia
- **facilities** (array): Fasilitas kamar

### Metadata
- **created_at** (string): Waktu pembuatan
- **updated_at** (string): Waktu terakhir diupdate

## Struktur Data

### Database (db.json)
```json
{
  "rooms": [
    {
      "id": "1",
      "name": "Standard Room",
      "description": "Kamar standar dengan fasilitas lengkap",
      "capacity": "2",
      "size": "24m²",
      "bedType": "1 Queen Bed",
      "price": 150000,
      "accommodationId": "1",
      "accommodationSlug": "hotel-banyumas",
      "accommodationTitle": "Hotel Banyumas",
      "facilities": ["AC", "TV", "WiFi", "Kamar Mandi Dalam"],
      "isPopular": false,
      "available": true,
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

## Tipe Tempat Tidur yang Tersedia
- 1 Single Bed
- 1 Queen Bed
- 1 King Bed
- 2 Single Beds
- 2 Queen Beds
- 1 Queen + 1 Single
- 1 King + 1 Single
- Bunk Bed

## Fasilitas Kamar yang Tersedia
- AC
- TV
- WiFi
- Kamar Mandi Dalam
- Air Panas
- Balkon
- Ruang Tamu
- Mini Bar
- Safe Deposit
- Coffee Maker

## Cara Penggunaan

### 1. Akses Manajemen Kamar
1. Buka halaman admin penginapan (`/admin/accommodation`)
2. Klik tombol "Kelola Kamar" (hijau dengan ikon 🛏️)
3. Akan diarahkan ke halaman manajemen kamar

### 2. Menambah Kamar Baru
1. Di halaman manajemen kamar, klik "Tambah Kamar"
2. Isi form dengan informasi kamar:
   - Pilih penginapan dari dropdown
   - Masukkan nama, kapasitas, ukuran, tipe bed, harga
   - Pilih fasilitas yang tersedia
   - Set opsi populer dan ketersediaan
3. Klik "Simpan Kamar"

### 3. Mengedit Kamar
1. Di daftar kamar, klik tombol "Edit" pada kamar yang ingin diedit
2. Ubah informasi yang diperlukan
3. Klik "Simpan Perubahan"

### 4. Menghapus Kamar
1. Di daftar kamar, klik tombol "Hapus" pada kamar yang ingin dihapus
2. Konfirmasi penghapusan

### 5. Mengubah Status Kamar
1. Di daftar kamar, klik tombol status (Tersedia/Tidak Tersedia)
2. Status akan berubah secara otomatis

## Filter dan Pencarian

### Filter
- **Penginapan**: Filter berdasarkan penginapan tertentu
- **Tipe Bed**: Filter berdasarkan tipe tempat tidur

### Pencarian
- Mencari berdasarkan nama kamar atau deskripsi

## Integrasi dengan Sistem Penginapan

### Tombol "Kelola Kamar"
- Ditambahkan di halaman admin penginapan (`/admin/accommodation`)
- Mengarahkan ke halaman manajemen kamar terpisah

### Relasi Data
- Setiap kamar memiliki `accommodationId` yang merujuk ke penginapan
- Data kamar disimpan terpisah di array `rooms` di `db.json`
- Tidak ada lagi field `rooms` di data penginapan

## Keuntungan Sistem Terpisah

1. **Manajemen yang Lebih Mudah**: Kamar dikelola secara terpisah, tidak tercampur dengan data penginapan
2. **Fleksibilitas**: Satu penginapan bisa memiliki banyak tipe kamar
3. **Skalabilitas**: Mudah menambah/mengurangi tipe kamar tanpa mengubah data penginapan
4. **Konsistensi**: Mengikuti pola yang sama dengan sistem menu kuliner

## Troubleshooting

### Kamar Tidak Muncul
- Pastikan `accommodationId` sudah benar
- Cek apakah data tersimpan di `db.json` bagian `rooms`

### Error Saat Menambah/Edit Kamar
- Pastikan semua field required sudah diisi
- Cek format harga (harus angka)
- Pastikan penginapan sudah dipilih

### API Error
- Cek apakah file `db.json` bisa diakses
- Pastikan struktur data sesuai dengan yang diharapkan

## Future Enhancements

1. **Upload Gambar Kamar**: Menambahkan fitur upload gambar untuk setiap tipe kamar
2. **Harga Dinamis**: Sistem harga berdasarkan musim/event
3. **Booking System**: Integrasi dengan sistem pemesanan
4. **Review Kamar**: Sistem review dan rating untuk setiap tipe kamar
5. **Export Data**: Fitur export data kamar ke Excel/CSV
