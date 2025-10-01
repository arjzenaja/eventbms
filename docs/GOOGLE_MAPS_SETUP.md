# 🗺️ Setup Google Maps Integration

## Prerequisites

Untuk menggunakan fitur peta dan lokasi, Anda perlu mengatur Google Maps API key.

### 1. Dapatkan Google Maps API Key

1. Kunjungi [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih project yang sudah ada
3. Aktifkan Google Maps APIs berikut:
   - **Maps JavaScript API**
   - **Places API**
   - **Geocoding API**
   - **Directions API**

4. Buat credentials (API Key):
   - Buka menu "APIs & Services" > "Credentials"
   - Klik "Create Credentials" > "API Key"
   - Salin API key yang dihasilkan

### 2. Konfigurasi Environment Variables

Buat file `.env.local` di root project dan tambahkan:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_ACTUAL_API_KEY_HERE
```

### 3. Restrict API Key (Recommended)

Untuk keamanan, batasi API key Anda:

1. Buka Google Cloud Console > APIs & Services > Credentials
2. Klik pada API key yang baru dibuat
3. Di bagian "Application restrictions", pilih "HTTP referrers"
4. Tambahkan domain Anda:
   - `localhost:3000/*` (untuk development)
   - `yourdomain.com/*` (untuk production)

### 4. Billing Setup

Google Maps API memerlukan billing account:
1. Buka Google Cloud Console > Billing
2. Link billing account ke project Anda
3. Google Maps API memiliki free tier yang cukup untuk penggunaan dasar

## Fitur yang Tersedia

### 🗺️ Peta Interaktif
- Tampilan peta dengan marker lokasi destinasi
- Koordinat GPS yang akurat
- Fallback display jika API tidak tersedia

### 📍 Navigasi
- Tombol "Buka di Google Maps"
- Tombol "Buka di Waze"
- Tombol "Buka di Apple Maps"
- Copy koordinat ke clipboard

### 📏 Informasi Jarak & Waktu
- Perhitungan jarak dari lokasi pengguna
- Estimasi waktu tempuh untuk berbagai moda transportasi:
  - Mobil (40 km/h)
  - Motor (50 km/h)
  - Bus (24 km/h)
  - Kereta (30 km/h)
  - Jalan kaki (5 km/h)
  - Sepeda (15 km/h)

### 💡 Tips Perjalanan
- Rekomendasi waktu terbaik untuk berkunjung
- Tips menghindari keramaian
- Saran persiapan perjalanan

## Struktur Data

### Koordinat GPS
```json
{
  "coordinates": {
    "lat": -7.3056,
    "lng": 109.2194
  }
}
```

### Alamat Lengkap
```json
{
  "address": "Jl. Raya Baturraden No. 123, Baturraden, Banyumas, Jawa Tengah"
}
```

## Komponen yang Digunakan

### DestinationMap.jsx
- Komponen utama untuk menampilkan peta
- Integrasi dengan Google Maps API
- Tombol navigasi ke berbagai platform maps

### LocationInfo.jsx
- Informasi detail lokasi
- Perhitungan jarak dan waktu tempuh
- Tips perjalanan

## Troubleshooting

### API Key Error
- Pastikan API key sudah benar
- Periksa apakah APIs sudah diaktifkan
- Pastikan billing account sudah dikonfigurasi

### Maps Tidak Muncul
- Periksa console browser untuk error
- Pastikan domain sudah ditambahkan ke API key restrictions
- Coba refresh halaman

### Geolocation Tidak Berfungsi
- Pastikan browser mendukung geolocation
- User harus mengizinkan akses lokasi
- HTTPS diperlukan untuk geolocation di production

## Cost Optimization

### Free Tier Limits
- Maps JavaScript API: 28,500 loads/month
- Places API: 1,000 requests/day
- Geocoding API: 2,500 requests/day

### Tips Menghemat Biaya
- Gunakan caching untuk data lokasi
- Implementasi lazy loading untuk peta
- Batasi penggunaan API yang tidak perlu

## Security Best Practices

1. **Restrict API Key**: Batasi domain yang bisa menggunakan API key
2. **Environment Variables**: Jangan hardcode API key di source code
3. **HTTPS Only**: Gunakan HTTPS di production untuk geolocation
4. **Rate Limiting**: Implementasi rate limiting untuk mencegah abuse

## Testing

### Development
```bash
npm run dev
```
Buka http://localhost:3000/dolan-banyumas/wisata/34 untuk melihat fitur peta

### Production
```bash
npm run build
npm start
```

## Support

Jika mengalami masalah:
1. Periksa Google Cloud Console untuk error logs
2. Periksa browser console untuk JavaScript errors
3. Pastikan semua dependencies sudah terinstall
4. Restart development server jika diperlukan
