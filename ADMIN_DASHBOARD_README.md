# Admin Dashboard - DOLAN BMS

## Overview
Admin dashboard untuk sistem DOLAN BMS yang menampilkan statistik wisata dan manajemen data.

## Fitur yang Tersedia

### 1. Sidebar Navigation
- **MAIN**: Dashboard
- **MASTER DATA**: 
  - Semua Data
  - Objek Wisata
  - Kuliner
  - Penginapan
  - Oleh-oleh
  - Desa Wisata
  - Biro Perjalanan
  - Event
- **SETTING**: Settings, Sign-Out

### 2. Dashboard Statistics
Menampilkan 8 kartu statistik dengan informasi:
- Total Destinasi
- Penginapan
- Oleh-oleh
- Desa Wisata
- Biro Perjalanan
- Kuliner
- Objek Wisata
- Event

### 3. Data Table
- Tabel "Data Wisata Terbaru" dengan kolom:
  - NO
  - ID DESTINASI
  - NAMA DESTINASI
  - LOKASI
  - KATEGORI
  - TANGGAL DIBUAT

### 4. Quick Actions
- Tambah Event Baru
- Tambah Destinasi
- Kelola Semua Data

## Cara Menggunakan

### 1. Akses Dashboard
- Buka `/admin/dashboard`
- Login dengan akun admin yang valid

### 2. Navigasi
- Gunakan sidebar untuk berpindah antar halaman
- Sidebar dapat di-collapse untuk menghemat ruang
- Highlight biru menunjukkan halaman aktif

### 3. Statistik
- Semua kartu statistik menampilkan angka "0" (mock data)
- Dalam implementasi nyata, data akan diambil dari API

### 4. Data Management
- Klik "Lihat Semua Data" untuk akses halaman data lengkap
- Gunakan "Aksi Cepat" untuk menambah data baru

## Struktur File

```
app/admin/
├── layout.jsx          # Layout utama dengan sidebar
├── dashboard/
│   └── page.jsx        # Halaman dashboard utama
├── data/
│   └── page.jsx        # Halaman manajemen data
└── destinations/
    └── new/
        └── page.jsx    # Form tambah destinasi
```

## Komponen yang Digunakan

- **AdminSidebar**: Sidebar navigasi dengan menu collapse
- **AdminHeader**: Header dengan notifikasi dan profil admin
- **ProtectedRoute**: HOC untuk proteksi rute admin
- **AdminContext**: Context untuk state management admin

## Styling

Menggunakan Tailwind CSS dengan tema:
- Background: Dark gray/black untuk sidebar
- Cards: Berbagai warna untuk statistik
- Responsive: Grid layout yang menyesuaikan ukuran layar

## Next Steps

Untuk implementasi lengkap, perlu ditambahkan:
1. API integration untuk data real-time
2. Form input untuk tambah/edit data
3. Pagination dan search untuk tabel data
4. Role-based access control
5. Data export functionality
6. Image upload untuk destinasi wisata

## Testing

1. Jalankan `npm run dev`
2. Buka `http://localhost:3000/admin/dashboard`
3. Login dengan akun admin
4. Test navigasi sidebar dan dashboard cards
