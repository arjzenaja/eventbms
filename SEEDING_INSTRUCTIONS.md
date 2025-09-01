# Cara Menjalankan Script Seeding Data Dummy Paket Desa Wisata

## 🎯 Tujuan
Script ini akan mengisi database dengan data dummy paket desa wisata yang diambil dari halaman `DesaWisataMenuSection` yang ada di `http://localhost:3000/dolan-banyumas/desa_wisata/1`.

## 📋 Data yang Akan Ditambahkan

### 1. **Tiket Masuk** - Rp 10.000
- Kategori: Tiket & Parkir
- Rating: 4.8 ⭐
- Status: Populer ✅
- Fitur: Gratis anak < 3 tahun, Diskon pelajar 50%, Diskon lansia 25%

### 2. **Jasa Pemandu** - Rp 50.000
- Kategori: Layanan
- Rating: 4.9 ⭐
- Status: Populer ✅
- Fitur: Max 10 orang, Termasuk sejarah, Bahasa Indonesia

### 3. **Paket Berkebun** - Rp 20.000
- Kategori: Aktivitas
- Rating: 4.7 ⭐
- Status: Tersedia
- Fitur: Alat disediakan, Hasil panen, Edukasi pertanian

### 4. **Memasak Tradisional** - Rp 30.000
- Kategori: Aktivitas
- Rating: 4.8 ⭐
- Status: Populer ✅
- Fitur: Bahan disediakan, Resep dibagikan, Bisa dibawa pulang

### 5. **Kerajinan Tangan** - Rp 25.000
- Kategori: Aktivitas
- Rating: 4.6 ⭐
- Status: Tersedia
- Fitur: Bahan disediakan, Hasil dibawa pulang, Panduan lengkap

### 6. **Homestay Standard** - Rp 100.000
- Kategori: Penginapan
- Rating: 4.5 ⭐
- Status: Tersedia
- Fitur: Sarapan, WiFi, Kamar mandi dalam

### 7. **Homestay Premium** - Rp 150.000
- Kategori: Penginapan
- Rating: 4.8 ⭐
- Status: Populer ✅
- Fitur: Sarapan, WiFi, AC, Kamar mandi dalam, Terrace

### 8. **Paket Camping** - Rp 50.000
- Kategori: Aktivitas
- Rating: 4.7 ⭐
- Status: Tersedia
- Fitur: Tenda disediakan, Makan malam, Sarapan, Pemandu

## 🚀 Cara Menjalankan Script

### Metode 1: Menggunakan Node.js Langsung

1. **Buka terminal/command prompt**
2. **Arahkan ke direktori project**
   ```bash
   cd /path/to/eventbms
   ```
3. **Jalankan script**
   ```bash
   node seed-packages.js
   ```

### Metode 2: Menggunakan npm Script (Jika sudah dikonfigurasi)

1. **Tambahkan script ke package.json**
   ```json
   {
     "scripts": {
       "seed:packages": "node seed-packages.js"
     }
   }
   ```

2. **Jalankan dengan npm**
   ```bash
   npm run seed:packages
   ```

### Metode 3: Menggunakan PowerShell (Windows)

1. **Buka PowerShell**
2. **Arahkan ke direktori project**
   ```powershell
   cd D:\clone\eventbms
   ```
3. **Jalankan script**
   ```powershell
   node seed-packages.js
   ```

## 📊 Output yang Diharapkan

Setelah script berhasil dijalankan, Anda akan melihat output seperti ini:

```
🚀 Memulai proses seeding data paket desa wisata...
✅ Ditambahkan: Tiket Masuk
✅ Ditambahkan: Jasa Pemandu
✅ Ditambahkan: Paket Berkebun
✅ Ditambahkan: Memasak Tradisional
✅ Ditambahkan: Kerajinan Tangan
✅ Ditambahkan: Homestay Standard
✅ Ditambahkan: Homestay Premium
✅ Ditambahkan: Paket Camping

🎉 Proses seeding selesai!
📊 Total paket yang ditambahkan: 8
📊 Total paket di database: 8

📋 Ringkasan Paket yang Ditambahkan:
1. Tiket Masuk - Rp 10.000 (Tiket & Parkir)
2. Jasa Pemandu - Rp 50.000 (Layanan)
3. Paket Berkebun - Rp 20.000 (Aktivitas)
4. Memasak Tradisional - Rp 30.000 (Aktivitas)
5. Kerajinan Tangan - Rp 25.000 (Aktivitas)
6. Homestay Standard - Rp 100.000 (Penginapan)
7. Homestay Premium - Rp 150.000 (Penginapan)
8. Paket Camping - Rp 50.000 (Aktivitas)
```

## 🔍 Verifikasi Data

Setelah script berhasil dijalankan, Anda bisa memverifikasi data dengan:

1. **Buka halaman admin packages**
   ```
   http://localhost:3000/admin/villages/packages
   ```

2. **Lihat apakah data sudah muncul di tabel**

3. **Cek detail setiap paket dengan klik tombol edit (✏️)**

## ⚠️ Catatan Penting

### Data yang Ditambahkan
- **ID Desa Wisata**: `desa_wisata_001` (default)
- **Slug Desa**: `desa-wisata-banyumas` (default)
- **Timestamp**: Waktu saat script dijalankan
- **Status**: Semua paket set sebagai `available: true`

### Duplikasi Data
- Script akan mengecek apakah paket sudah ada berdasarkan `title`
- Jika sudah ada, paket tidak akan ditambahkan lagi
- Output akan menampilkan `⏭️ Sudah ada: [Nama Paket]`

### Backup Database
- Script akan membaca dan menulis langsung ke `db.json`
- Pastikan database sudah di-backup sebelum menjalankan script
- Script akan menambahkan data baru tanpa menghapus data yang sudah ada

## 🛠️ Troubleshooting

### Error: "Cannot find module 'fs'"
- Pastikan menggunakan Node.js (bukan browser)
- Module `fs` adalah built-in Node.js

### Error: "Cannot read file 'db.json'"
- Pastikan file `db.json` ada di root project
- Pastikan path yang benar

### Error: "Permission denied"
- Pastikan memiliki akses write ke file `db.json`
- Coba jalankan dengan administrator privileges

### Data Tidak Muncul di Admin
- Refresh halaman admin
- Cek console browser untuk error
- Pastikan API endpoint berfungsi dengan baik

## 📝 Modifikasi Data

Jika ingin mengubah data dummy, edit file `seed-packages.js`:

1. **Ubah array `dummyPackages`**
2. **Modifikasi field yang diinginkan**
3. **Jalankan ulang script**

## 🎉 Hasil Akhir

Setelah script berhasil dijalankan, Anda akan memiliki:

- **8 paket layanan** dengan informasi lengkap
- **Data yang konsisten** dengan form admin yang sudah dibuat
- **Field lengkap** termasuk yang baru ditambahkan
- **Data siap ditampilkan** di halaman admin dan frontend

Sekarang Anda bisa mengelola semua paket layanan desa wisata melalui admin panel yang sudah lengkap! 🚀
