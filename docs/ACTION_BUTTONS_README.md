# Tombol Aksi - Destinations Management

## Overview
Dokumentasi lengkap untuk semua tombol aksi yang tersedia di halaman manajemen destinasi wisata dan oleh-oleh.

## Tombol Aksi di Tabel

### 1. 👀 Quick View
**Fungsi**: Menampilkan informasi singkat destinasi dalam popup
**Warna**: Ungu (`text-purple-600`)
**Hover**: Background ungu muda (`hover:bg-purple-50`)

**Informasi yang Ditampilkan**:
- Nama destinasi
- Lokasi
- Tipe destinasi
- Deskripsi singkat
- Harga tiket

**Cara Penggunaan**:
```javascript
const handleQuickView = (destination) => {
  const message = `
Nama: ${destination.title}
Lokasi: ${destination.location}
Tipe: ${destination.type}
Deskripsi: ${destination.short_description || 'Tidak ada deskripsi'}
Harga: Rp ${destination.seats?.[0]?.price?.toLocaleString('id-ID') || '0'}
  `.trim();
  
  alert(message);
};
```

### 2. 👁️ Lihat Detail
**Fungsi**: Navigasi ke halaman detail destinasi
**Warna**: Biru (`text-blue-600`)
**Hover**: Background biru muda (`hover:bg-blue-50`)
**Link**: `/admin/destinations/[id]/view` atau `/admin/oleh-oleh/[id]/view`

**Fitur**:
- Tampilan lengkap semua informasi destinasi
- Gambar thumbnail dan gambar besar
- Informasi tiket dan status
- Tombol edit dan kembali

### 3. ✏️ Edit
**Fungsi**: Navigasi ke halaman edit destinasi
**Warna**: Hijau (`text-green-600`)
**Hover**: Background hijau muda (`hover:bg-green-50`)
**Link**: `/admin/destinations/[id]` atau `/admin/oleh-oleh/[id]`

**Fitur**:
- Form edit lengkap
- Upload gambar baru
- Preview gambar
- Validasi input

### 4. 📋 Duplikasi
**Fungsi**: Membuat salinan destinasi
**Warna**: Orange (`text-orange-600`)
**Hover**: Background orange muda (`hover:bg-orange-50`)

**Proses**:
1. Konfirmasi duplikasi
2. Ambil data destinasi dari API
3. Buat FormData dengan data yang sama
4. Tambahkan "(Copy)" ke nama
5. Kirim ke API POST untuk membuat destinasi baru
6. Refresh data

**Cara Penggunaan**:
```javascript
const handleDuplicateDestination = async (destinationId) => {
  if (!confirm('Apakah Anda yakin ingin menduplikasi destinasi ini?')) {
    return;
  }

  try {
    // Get the original destination data
    const response = await fetch(`/api/destinations/${destinationId}`);
    const data = await response.json();
    
    if (!data.success) {
      alert('Gagal mengambil data destinasi: ' + data.message);
      return;
    }

    const originalDestination = data.destination;
    
    // Create FormData for the new destination
    const formData = new FormData();
    formData.append('title', originalDestination.title + ' (Copy)');
    // ... append other fields
    
    // Create the new destination
    const createResponse = await fetch('/api/destinations', {
      method: 'POST',
      body: formData,
    });

    const createData = await createResponse.json();

    if (createData.success) {
      alert('Destinasi berhasil diduplikasi!');
      await refreshData();
    } else {
      alert('Gagal menduplikasi destinasi: ' + createData.message);
    }
  } catch (error) {
    console.error('Error duplicating destination:', error);
    alert('Terjadi kesalahan saat menduplikasi destinasi: ' + error.message);
  }
};
```

### 5. 🗑️ Hapus
**Fungsi**: Menghapus destinasi
**Warna**: Merah (`text-red-600`)
**Hover**: Background merah muda (`hover:bg-red-50`)

**Proses**:
1. Konfirmasi penghapusan
2. Kirim request DELETE ke API
3. Update state lokal
4. Tampilkan notifikasi sukses/error

## Tombol Aksi di Halaman Oleh-Oleh

### Tombol Aksi Khusus Oleh-Oleh
Halaman oleh-oleh memiliki tombol aksi yang sama dengan destinasi, namun dengan beberapa penyesuaian:

#### Quick View untuk Oleh-Oleh
```javascript
const handleQuickView = (item) => {
  const message = `
Nama: ${item.title}
Lokasi: ${item.location}
Tipe: ${item.type}
Kategori: ${item.category || 'Oleh-oleh'}
Deskripsi: ${item.short_description || 'Tidak ada deskripsi'}
Biaya: ${item.price_range || 'Tidak ada'}
Kontak: ${item.contact || 'Tidak ada'}
  `.trim();
  
  alert(message);
};
```

#### Duplikasi untuk Oleh-Oleh
```javascript
const handleDuplicateOlehOleh = async (itemId) => {
  if (!confirm('Apakah Anda yakin ingin menduplikasi item oleh-oleh ini?')) {
    return;
  }

  try {
    // Get the original item data
    const response = await fetch(`/api/oleh_oleh/${itemId}`);
    const data = await response.json();
    
    if (!data.success) {
      alert('Gagal mengambil data oleh-oleh: ' + data.message);
      return;
    }

    const originalItem = data.oleh_oleh;
    
    // Create FormData for the new item
    const formData = new FormData();
    formData.append('title', originalItem.title + ' (Copy)');
    formData.append('type', originalItem.type);
    formData.append('location', originalItem.location);
    formData.append('category', originalItem.category);
    formData.append('short_description', originalItem.short_description);
    formData.append('description', originalItem.description);
    formData.append('price_range', originalItem.price_range);
    formData.append('contact', originalItem.contact);
    formData.append('address', originalItem.address);
    formData.append('features', originalItem.features ? originalItem.features.join(',') : '');
    formData.append('recommended', originalItem.recommended ? 'true' : 'false');
    formData.append('img_sm', originalItem.img_sm);
    formData.append('img_lg', originalItem.img_lg);

    // Create the new item
    const createResponse = await fetch('/api/oleh_oleh', {
      method: 'POST',
      body: formData,
    });

    const createData = await createResponse.json();

    if (createData.success) {
      alert('Oleh-oleh berhasil diduplikasi!');
      await refreshData();
    } else {
      alert('Gagal menduplikasi oleh-oleh: ' + createData.message);
    }
  } catch (error) {
    console.error('Error duplicating oleh-oleh:', error);
    alert('Terjadi kesalahan saat menduplikasi oleh-oleh: ' + error.message);
  }
};
```

## Tombol Aksi di Header/Toolbar

### 🔄 Refresh
**Fungsi**: Memuat ulang data dari server
**Warna**: Hijau (`bg-green-600`)
**Hover**: Hijau gelap (`hover:bg-green-700`)

### 🔧 Fix IDs
**Fungsi**: Memperbaiki ID yang tidak valid atau hilang
**Warna**: Kuning (`bg-yellow-600`)
**Hover**: Kuning gelap (`hover:bg-yellow-700`)
**API Endpoint**: `/api/oleh_oleh/fix-ids` (POST)

### 📊 Export
**Fungsi**: Export data ke format CSV
**Warna**: Biru (`bg-blue-600`)
**Hover**: Biru gelap (`hover:bg-blue-700`)
**API Endpoint**: `/api/destinations/export?format=csv&category=oleh_oleh`

### + Add New
**Fungsi**: Navigasi ke halaman tambah data baru
**Warna**: Biru (`bg-blue-600`)
**Hover**: Biru gelap (`hover:bg-blue-700`)
**Link**: `/admin/oleh-oleh/new` atau `/admin/destinations/new`

## Struktur File yang Diperlukan

### Halaman Oleh-Oleh
```
app/admin/oleh-oleh/
├── page.jsx                    # Halaman utama dengan tabel
├── new/
│   └── page.jsx               # Form tambah baru
└── [id]/
    ├── page.jsx               # Form edit
    └── view/
        └── page.jsx           # Halaman detail
```

### API Endpoints
```
app/api/oleh_oleh/
├── route.js                   # GET (list), POST (create)
├── fix-ids/
│   └── route.js              # POST (fix IDs)
└── [id]/
    └── route.js              # GET, PUT, DELETE
```

## Error Handling

Semua tombol aksi memiliki error handling yang konsisten:

1. **Try-Catch Block**: Semua operasi async dibungkus dengan try-catch
2. **User Feedback**: Alert untuk sukses dan error
3. **Loading States**: Disabled state saat loading
4. **Confirmation**: Konfirmasi untuk operasi destruktif (delete, duplicate)

## Best Practices

1. **Consistent Styling**: Gunakan class Tailwind yang konsisten
2. **Accessibility**: Tambahkan title attribute untuk tooltip
3. **Responsive Design**: Tombol responsif untuk mobile
4. **State Management**: Update state lokal setelah operasi berhasil
5. **API Error Handling**: Handle berbagai jenis error dari API
