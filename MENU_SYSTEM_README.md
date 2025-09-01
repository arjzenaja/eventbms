# Menu Card dan Sistem Pembelian Kuliner

## Overview

Sistem menu card dan pembelian telah berhasil diimplementasikan untuk halaman kuliner di aplikasi Dolan Banyumas. Sistem ini memungkinkan pengguna untuk melihat menu, memfilter berdasarkan kategori, dan melakukan pemesanan dengan mudah.

## Fitur yang Diimplementasikan

### 1. Menu Card Component (`MenuCard.jsx`)
- **Tampilan Visual**: Card yang menarik dengan gambar menu, nama, deskripsi, dan harga
- **Informasi Lengkap**: Rating, waktu memasak, kategori, dan informasi tambahan
- **Badge Khusus**: Badge untuk menu populer dan menu pedas
- **Action Buttons**: Tombol "Beli Menu" dan "WhatsApp"
- **Responsive Design**: Tampilan yang responsif untuk berbagai ukuran layar

### 2. Purchase Modal (`BuyMenuModal.jsx`)
- **Detail Menu**: Menampilkan informasi lengkap menu yang dipilih
- **Quantity Selection**: Pemilih jumlah pesanan dengan batasan 1-10
- **Special Instructions**: Field untuk catatan khusus
- **Order Summary**: Ringkasan pesanan dengan total harga
- **Payment Options**: Opsi pembayaran via aplikasi atau WhatsApp
- **Loading States**: Indikator loading saat memproses pesanan

### 3. Menu Section (`SimpleMenuSection.jsx`)
- **Dynamic Data**: Menggunakan hook `useMenuData` untuk data dinamis
- **Category Filtering**: Filter menu berdasarkan kategori (Semua, Populer, Utama, Minuman)
- **Loading States**: Loading spinner saat memuat data
- **Error Handling**: Penanganan error dengan fallback data
- **Order Process**: Integrasi dengan API untuk pemesanan

### 4. API Integration (`/api/kuliner/menu`)
- **GET Endpoint**: Mengambil data menu berdasarkan destination ID/slug
- **POST Endpoint**: Memproses pesanan baru
- **Sample Data**: Data menu contoh untuk berbagai jenis kuliner
- **Error Handling**: Penanganan error yang robust

### 5. Custom Hook (`useMenuData.js`)
- **Data Fetching**: Mengambil data menu dari API
- **State Management**: Mengelola loading, error, dan data states
- **Order Submission**: Fungsi untuk mengirim pesanan
- **Fallback Data**: Data default jika API gagal

## Struktur Data Menu

```javascript
{
  id: 1,
  name: "Nasi Goreng Spesial",
  description: "Nasi goreng dengan telur, ayam, dan sayuran segar khas Banyumas",
  price: 25000,
  image: "/placeholder.jpg",
  rating: 4.8,
  cookingTime: "10-15 menit",
  isPopular: true,
  isSpicy: false,
  category: "Nasi",
  additionalInfo: ["Halal", "Fresh"]
}
```

## Cara Penggunaan

### 1. Menampilkan Menu
```jsx
<SimpleMenuSection 
  destinationTitle="Nama Kuliner"
  destinationId="1"
  destinationSlug="nama-kuliner"
/>
```

### 2. Menggunakan Menu Card
```jsx
<MenuCard 
  menu={menuData}
  onBuyClick={(menu) => handleBuyClick(menu)}
/>
```

### 3. Menggunakan Purchase Modal
```jsx
<BuyMenuModal
  menu={selectedMenu}
  isOpen={isModalOpen}
  onClose={handleModalClose}
  onConfirm={handleOrderConfirm}
/>
```

## API Endpoints

### GET `/api/kuliner/menu`
**Query Parameters:**
- `destinationId`: ID destinasi kuliner
- `slug`: Slug destinasi kuliner

**Response:**
```json
{
  "success": true,
  "menus": [...],
  "total": 12,
  "categories": ["Nasi", "Sate", "Soto", "Minuman"],
  "priceRange": {
    "min": 3000,
    "max": 55000
  }
}
```

### POST `/api/kuliner/menu`
**Request Body:**
```json
{
  "destinationId": "1",
  "menuId": 1,
  "quantity": 2,
  "specialInstructions": "Tidak pedas"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order received successfully",
  "orderId": "ORD-1234567890",
  "estimatedTime": "15-20 menit"
}
```

## Fitur Khusus

### 1. Category Filtering
- **Semua Menu**: Menampilkan semua menu yang tersedia
- **Menu Populer**: Hanya menu dengan flag `isPopular: true`
- **Menu Utama**: Menu makanan utama (bukan minuman)
- **Minuman**: Menu minuman dan es

### 2. Visual Indicators
- **Popular Badge**: ⭐ untuk menu populer
- **Spicy Badge**: 🔥 untuk menu pedas
- **Rating Display**: Rating dengan bintang
- **Price Formatting**: Format harga dalam Rupiah

### 3. User Experience
- **Hover Effects**: Animasi hover pada card
- **Loading States**: Indikator loading yang smooth
- **Error Handling**: Pesan error yang informatif
- **Responsive Design**: Tampilan yang optimal di semua device

## Integrasi dengan Halaman Kuliner

Sistem menu telah terintegrasi dengan halaman detail kuliner di:
`/dolan-banyumas/kuliner/[id]`

Menu section akan muncul di bagian bawah halaman setelah informasi destinasi, galeri foto, dan peta.

## Customization

### 1. Menambah Menu Baru
Edit file `/api/kuliner/menu/route.js` dan tambahkan data menu baru ke dalam `menuData`.

### 2. Mengubah Styling
Modifikasi class Tailwind CSS di komponen untuk mengubah tampilan.

### 3. Menambah Fitur
- Filter berdasarkan harga
- Search functionality
- Wishlist/favorites
- Review system

## Dependencies

- **React**: Untuk komponen UI
- **Next.js**: Untuk routing dan API
- **Tailwind CSS**: Untuk styling
- **React Icons**: Untuk icon (BiIcons, FaIcons)

## Testing

Untuk menguji sistem menu:

1. Buka halaman kuliner: `http://localhost:3000/dolan-banyumas/kuliner/1`
2. Scroll ke bagian "Menu Kuliner"
3. Coba filter berdasarkan kategori
4. Klik "Beli Menu" pada salah satu menu
5. Isi form pemesanan dan konfirmasi

## Future Enhancements

1. **Database Integration**: Menyimpan menu di database
2. **Payment Gateway**: Integrasi dengan payment gateway
3. **Order Tracking**: Sistem tracking pesanan
4. **User Reviews**: Sistem review dan rating
5. **Recommendations**: Rekomendasi menu berdasarkan preferensi
6. **Inventory Management**: Manajemen stok menu
7. **Analytics**: Dashboard analitik untuk pemilik kuliner

## Troubleshooting

### Menu Tidak Muncul
- Periksa koneksi internet
- Periksa console browser untuk error
- Pastikan API endpoint berfungsi

### Error Saat Order
- Periksa format data yang dikirim
- Pastikan semua field required terisi
- Periksa response dari API

### Styling Issues
- Periksa class Tailwind CSS
- Pastikan dark mode berfungsi dengan baik
- Test di berbagai ukuran layar

## Support

Untuk bantuan teknis atau pertanyaan tentang implementasi sistem menu, silakan hubungi tim development.
