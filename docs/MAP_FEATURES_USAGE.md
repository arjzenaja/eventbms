# 🗺️ Panduan Penggunaan Fitur Peta & Lokasi

## 📖 Cara Menggunakan Fitur Peta dan Lokasi

### 🎯 Halaman yang Memiliki Fitur Peta

Fitur peta dan lokasi telah diimplementasikan di halaman detail wisata:
```
http://localhost:3000/dolan-banyumas/wisata/[id]
```

Contoh: `http://localhost:3000/dolan-banyumas/wisata/34`

## 🗺️ Fitur Peta Interaktif

### 1. Melihat Peta
- **Peta Google Maps** akan muncul di bagian "Peta Interaktif"
- **Marker Biru** menunjukkan lokasi destinasi wisata
- **Marker Hijau** (jika ada) menunjukkan lokasi Anda saat ini
- **Garis Biru** menunjukkan rute dari lokasi Anda ke destinasi

### 2. Interaksi dengan Peta
- **Zoom In/Out**: Gunakan tombol + dan - atau scroll mouse
- **Pan**: Klik dan drag untuk memindahkan peta
- **Street View**: Klik icon street view untuk melihat tampilan jalan
- **Fullscreen**: Klik icon fullscreen untuk tampilan penuh

### 3. Marker dan Info Window
- **Klik Marker**: Klik marker destinasi untuk melihat info window
- **Info Window**: Menampilkan nama destinasi, lokasi, dan koordinat
- **Tutup Info**: Klik di area peta untuk menutup info window

## 📍 Fitur Navigasi

### 1. Tombol "Buka di Maps"
- **Google Maps**: Buka lokasi di Google Maps web/app
- **Waze**: Buka navigasi di aplikasi Waze
- **Apple Maps**: Buka di Apple Maps (untuk pengguna iOS)

### 2. Salin Koordinat
- **Klik "Salin Koordinat"**: Koordinat GPS akan disalin ke clipboard
- **Format**: `-7.3056, 109.2194`
- **Gunakan**: Paste di aplikasi maps lain atau GPS device

### 3. Tombol Navigasi Tambahan
- **Apple Maps**: Untuk pengguna iPhone/iPad
- **Waze**: Aplikasi navigasi komunitas

## 📏 Informasi Jarak & Waktu

### 1. Jarak dari Lokasi Anda
- **Otomatis**: Jarak dihitung otomatis jika lokasi diizinkan
- **Format**: Ditampilkan dalam kilometer (km)
- **Akurasi**: Menggunakan Google Directions API

### 2. Estimasi Waktu Tempuh
Tersedia untuk berbagai moda transportasi:

#### 🚗 Mobil
- **Kecepatan**: 40 km/jam (rata-rata)
- **Kondisi**: Jalan raya dan dalam kota

#### 🏍️ Motor
- **Kecepatan**: 50 km/jam (rata-rata)
- **Kondisi**: Lebih fleksibel di lalu lintas

#### 🚌 Bus
- **Kecepatan**: 24 km/jam (termasuk pemberhentian)
- **Kondisi**: Transportasi umum

#### 🚂 Kereta
- **Kecepatan**: 30 km/jam (termasuk pemberhentian)
- **Kondisi**: Transportasi rel

#### 🚶 Jalan Kaki
- **Kecepatan**: 5 km/jam (rata-rata)
- **Kondisi**: Untuk jarak dekat

#### 🚴 Sepeda
- **Kecepatan**: 15 km/jam (rata-rata)
- **Kondisi**: Untuk jarak menengah

## 🌤️ Informasi Cuaca

### 1. Kondisi Cuaca Saat Ini
- **Suhu**: Ditampilkan dalam Celsius (°C)
- **Suhu Terasa**: Suhu yang dirasakan tubuh
- **Kondisi**: Cerah, berawan, hujan ringan, dll.

### 2. Detail Cuaca
- **Kelembaban**: Persentase kelembaban udara
- **Kecepatan Angin**: Dalam km/jam
- **UV Index**: Indeks radiasi ultraviolet
- **Jarak Pandang**: Dalam kilometer

### 3. Matahari Terbit/Terbenam
- **Matahari Terbit**: Waktu matahari terbit
- **Matahari Terbenam**: Waktu matahari terbenam

### 4. Tips Cuaca
Tips otomatis berdasarkan kondisi cuaca:
- **Hujan**: Bawa payung atau jas hujan
- **UV Tinggi**: Gunakan tabir surya dan topi
- **Suhu Tinggi**: Minum banyak air
- **Angin Kencang**: Perhatikan barang-barang

## 🚌 Informasi Transportasi Publik

### 1. Jenis Transportasi
- **Bus**: Bus antar kota dan dalam kota
- **Kereta Api**: Kereta komuter dan jarak jauh

### 2. Informasi Rute
- **Rute**: Dari mana ke mana
- **Pemberhentian**: Titik-titik pemberhentian
- **Operator**: Perusahaan transportasi

### 3. Jadwal dan Biaya
- **Jadwal**: Waktu keberangkatan
- **Frekuensi**: Seberapa sering beroperasi
- **Biaya**: Harga tiket
- **Durasi**: Waktu perjalanan

### 4. Tips Transportasi
- Datang 15-30 menit sebelum keberangkatan
- Siapkan uang pas untuk tiket
- Bawa kartu identitas untuk kereta
- Periksa jadwal terbaru

## 🔧 Pengaturan Lokasi

### 1. Mengizinkan Akses Lokasi
Saat pertama kali mengakses halaman:
1. **Browser akan meminta izin** akses lokasi
2. **Klik "Izinkan"** untuk mendapatkan jarak akurat
3. **Klik "Tolak"** jika tidak ingin membagikan lokasi

### 2. Jika Lokasi Ditolak
- **Fallback**: Sistem akan menggunakan perhitungan manual
- **Estimasi**: Jarak diestimasi berdasarkan koordinat default
- **Fungsionalitas**: Semua fitur tetap berfungsi

### 3. Mengubah Izin Lokasi
- **Chrome**: Settings > Privacy and security > Site Settings > Location
- **Firefox**: Settings > Privacy & Security > Permissions > Location
- **Safari**: Preferences > Websites > Location

## 📱 Penggunaan di Mobile

### 1. Responsive Design
- **Otomatis**: Halaman menyesuaikan ukuran layar
- **Touch Friendly**: Tombol dan interaksi mudah disentuh
- **Mobile Optimized**: Optimasi untuk layar kecil

### 2. Fitur Mobile
- **Geolocation**: Akses lokasi lebih akurat
- **Native Maps**: Buka di aplikasi maps bawaan
- **Touch Gestures**: Zoom dan pan dengan jari

### 3. Aplikasi Maps
- **Google Maps**: Terintegrasi dengan aplikasi Google Maps
- **Waze**: Navigasi real-time dengan komunitas
- **Apple Maps**: Untuk pengguna iOS

## ⚠️ Troubleshooting

### 1. Peta Tidak Muncul
**Kemungkinan Penyebab:**
- Google Maps API key belum dikonfigurasi
- Koneksi internet bermasalah
- Browser tidak mendukung Google Maps

**Solusi:**
1. Periksa file `.env.local` untuk API key
2. Refresh halaman
3. Coba browser lain
4. Gunakan fitur fallback

### 2. Lokasi Tidak Akurat
**Kemungkinan Penyebab:**
- GPS tidak aktif
- Lokasi di dalam gedung
- Browser tidak mengizinkan lokasi

**Solusi:**
1. Aktifkan GPS di device
2. Pindah ke area terbuka
3. Izinkan akses lokasi di browser
4. Refresh halaman

### 3. Informasi Cuaca Tidak Muncul
**Kemungkinan Penyebab:**
- Koneksi internet lambat
- API cuaca bermasalah

**Solusi:**
1. Tunggu beberapa saat
2. Refresh halaman
3. Periksa koneksi internet

### 4. Transportasi Tidak Tersedia
**Kemungkinan Penyebab:**
- Lokasi tidak memiliki data transportasi
- Data belum tersedia untuk area tersebut

**Solusi:**
1. Cek lokasi lain yang memiliki data
2. Gunakan fitur navigasi manual
3. Hubungi admin untuk menambah data

## 🎯 Tips Penggunaan

### 1. Untuk Wisatawan
- **Periksa Cuaca**: Lihat kondisi cuaca sebelum berangkat
- **Pilih Transportasi**: Bandingkan waktu dan biaya transportasi
- **Salin Koordinat**: Simpan koordinat untuk backup
- **Gunakan Navigasi**: Buka di aplikasi maps favorit

### 2. Untuk Perencanaan Perjalanan
- **Estimasi Waktu**: Gunakan estimasi waktu tempuh
- **Pilih Waktu**: Hindari jam sibuk
- **Siapkan Transportasi**: Cek jadwal bus/kereta
- **Bawa Bekal**: Sesuai dengan durasi perjalanan

### 3. Untuk Keamanan
- **Bagikan Lokasi**: Bagikan lokasi dengan keluarga/teman
- **Simpan Kontak**: Simpan nomor darurat
- **Bawa Powerbank**: Untuk device yang digunakan navigasi
- **Periksa Rute**: Pastikan rute aman

## 🔄 Fitur yang Akan Datang

### 1. Fitur yang Direncanakan
- **Offline Maps**: Peta tanpa internet
- **Real Weather**: Data cuaca real-time
- **Public Transport API**: Data transportasi real-time
- **User Reviews**: Review dari pengunjung
- **Social Sharing**: Bagikan ke social media
- **Booking Integration**: Booking transportasi

### 2. Peningkatan Teknis
- **Service Workers**: Caching untuk offline
- **Progressive Web App**: Fitur PWA
- **Advanced Analytics**: Tracking penggunaan detail
- **A/B Testing**: Testing UI variations

## 📞 Bantuan & Support

### 1. Jika Mengalami Masalah
1. **Refresh halaman** terlebih dahulu
2. **Periksa koneksi internet**
3. **Coba browser lain**
4. **Bersihkan cache browser**

### 2. Kontak Support
- **Email**: support@eventbms.com
- **WhatsApp**: +62 812-3456-7890
- **Telegram**: @eventbms_support

### 3. Feedback
- **Bug Report**: Laporkan bug yang ditemukan
- **Feature Request**: Minta fitur baru
- **Improvement**: Saran perbaikan

---

**Selamat menggunakan fitur Peta & Lokasi! 🗺️✨**
