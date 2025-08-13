# Halaman Oleh-Oleh - Admin Panel

## Overview
Halaman manajemen oleh-oleh untuk admin panel EventBMS. Fitur ini memungkinkan admin untuk mengelola data oleh-oleh, souvenir, dan produk lokal.

## Fitur Utama

### 1. Tampilan Data
- **Tabel Responsif**: Menampilkan semua data oleh-oleh dalam format tabel
- **Pencarian**: Filter berdasarkan nama atau lokasi
- **Filter Tipe**: Filter berdasarkan tipe oleh-oleh (makanan, pakaian, kerajinan, aksesoris)
- **Summary Cards**: Statistik total data, data tersaring, dan jenis tipe

### 2. Tombol Aksi
- **👀 Quick View**: Tampilkan informasi singkat dalam popup
- **👁️ Lihat Detail**: Navigasi ke halaman detail lengkap
- **✏️ Edit**: Navigasi ke halaman edit
- **📋 Duplikasi**: Buat salinan item oleh-oleh
- **🗑️ Hapus**: Hapus item oleh-oleh

### 3. Tombol Toolbar
- **🔄 Refresh**: Muat ulang data dari server
- **🔧 Fix IDs**: Perbaiki ID yang tidak valid
- **📊 Export**: Export data ke format CSV
- **+ Add New**: Tambah item oleh-oleh baru

## Struktur Data

### Field Oleh-Oleh
```javascript
{
  id: "string",                    // ID unik
  title: "string",                 // Nama oleh-oleh
  type: "string",                  // Tipe (makanan, pakaian, kerajinan, aksesoris)
  location: "string",              // Lokasi
  category: "string",              // Kategori (oleh-oleh, souvenir, handicraft, local-product)
  short_description: "string",     // Deskripsi singkat
  description: "string",           // Deskripsi lengkap
  price_range: "string",           // Range harga
  contact: "string",               // Kontak
  address: "string",               // Alamat lengkap
  features: ["string"],            // Array fitur
  recommended: boolean,            // Status rekomendasi
  img_sm: "string",                // URL gambar kecil
  img_lg: "string",                // URL gambar besar
  created_at: "string",            // Tanggal dibuat
  updated_at: "string"             // Tanggal diperbarui
}
```

## Halaman Terkait

### 1. Halaman Utama (`/admin/oleh-oleh`)
- Tabel data oleh-oleh
- Fitur pencarian dan filter
- Tombol aksi untuk setiap item

### 2. Halaman Tambah Baru (`/admin/oleh-oleh/new`)
- Form untuk menambah oleh-oleh baru
- Validasi input
- Upload gambar (opsional)

### 3. Halaman Edit (`/admin/oleh-oleh/[id]`)
- Form edit data oleh-oleh
- Pre-filled dengan data existing
- Validasi dan update data

### 4. Halaman Detail (`/admin/oleh-oleh/[id]/view`)
- Tampilan lengkap data oleh-oleh
- Informasi detail
- Tombol navigasi ke edit

## API Endpoints

### 1. GET `/api/oleh_oleh`
**Fungsi**: Ambil semua data oleh-oleh
**Response**:
```json
{
  "success": true,
  "oleh_oleh": [...],
  "message": "Oleh-oleh data retrieved successfully"
}
```

### 2. POST `/api/oleh_oleh`
**Fungsi**: Buat oleh-oleh baru
**Body**: FormData
**Response**:
```json
{
  "success": true,
  "olehOleh": {...},
  "message": "Oleh-oleh created successfully"
}
```

### 3. GET `/api/oleh_oleh/[id]`
**Fungsi**: Ambil data oleh-oleh berdasarkan ID
**Response**:
```json
{
  "success": true,
  "oleh_oleh": {...}
}
```

### 4. PUT `/api/oleh_oleh/[id]`
**Fungsi**: Update data oleh-oleh
**Body**: JSON
**Response**:
```json
{
  "success": true,
  "oleh_oleh": {...}
}
```

### 5. DELETE `/api/oleh_oleh/[id]`
**Fungsi**: Hapus oleh-oleh
**Response**:
```json
{
  "success": true,
  "message": "Oleh-oleh berhasil dihapus"
}
```

### 6. POST `/api/oleh_oleh/fix-ids`
**Fungsi**: Perbaiki ID yang tidak valid
**Response**:
```json
{
  "success": true,
  "fixed_count": 5,
  "message": "Fixed 5 oleh-oleh items"
}
```

## Komponen yang Digunakan

### 1. ProtectedRoute
- Wrapper untuk autentikasi admin
- Redirect ke login jika tidak terautentikasi

### 2. LoadingSpinner
- Indikator loading saat memuat data
- Custom message untuk konteks

### 3. ErrorHandler
- Handle error dengan retry option
- User-friendly error messages

## Styling dan UI

### Color Scheme
- **Primary**: Blue (`blue-600`)
- **Success**: Green (`green-600`)
- **Warning**: Yellow (`yellow-600`)
- **Danger**: Red (`red-600`)
- **Info**: Purple (`purple-600`)

### Responsive Design
- **Desktop**: Full table dengan semua kolom
- **Tablet**: Condensed table
- **Mobile**: Stacked layout

### Hover Effects
- Background color changes
- Smooth transitions
- Visual feedback

## Error Handling

### 1. Network Errors
- Try-catch untuk semua API calls
- User-friendly error messages
- Console logging untuk debugging

### 2. Validation Errors
- Client-side validation
- Server-side validation
- Clear error messages

### 3. Loading States
- Disabled buttons saat loading
- Loading spinners
- Progress indicators

## Best Practices

### 1. Performance
- Lazy loading untuk gambar
- Optimized API calls
- Efficient state management

### 2. UX/UI
- Consistent styling
- Clear navigation
- Intuitive interactions

### 3. Security
- Protected routes
- Input validation
- XSS prevention

### 4. Accessibility
- ARIA labels
- Keyboard navigation
- Screen reader support

## Troubleshooting

### Common Issues

#### 1. Tombol Aksi Tidak Berfungsi
**Penyebab**: Missing API endpoints atau error handling
**Solusi**: 
- Periksa console untuk error
- Pastikan API endpoint tersedia
- Cek network tab untuk request/response

#### 2. Data Tidak Muncul
**Penyebab**: Database kosong atau API error
**Solusi**:
- Periksa file `db.json`
- Cek API response
- Refresh halaman

#### 3. Form Tidak Bisa Submit
**Penyebab**: Validation error atau missing fields
**Solusi**:
- Periksa required fields
- Cek console untuk validation errors
- Pastikan semua field terisi

### Debug Tips
1. **Console Logs**: Periksa browser console untuk error
2. **Network Tab**: Monitor API requests/responses
3. **React DevTools**: Inspect component state
4. **Database**: Periksa file `db.json` langsung

## Future Enhancements

### Planned Features
1. **Bulk Operations**: Select multiple items untuk operasi batch
2. **Advanced Filtering**: Filter berdasarkan tanggal, harga, dll
3. **Image Upload**: Upload dan crop gambar
4. **Data Import**: Import data dari CSV/Excel
5. **Audit Trail**: Log perubahan data
6. **Search History**: Simpan riwayat pencarian

### Technical Improvements
1. **Caching**: Implement client-side caching
2. **Pagination**: Handle large datasets
3. **Real-time Updates**: WebSocket untuk live updates
4. **Offline Support**: Service worker untuk offline mode
