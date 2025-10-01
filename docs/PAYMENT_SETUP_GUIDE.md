# Panduan Setup Sistem Pembayaran EventBMS

## Instalasi dan Konfigurasi

### 1. Persiapan Environment

Pastikan aplikasi sudah berjalan dengan baik:
```bash
npm install
npm run dev
```

### 2. Inisialisasi Data Pembayaran

Jalankan script untuk menambahkan data pembayaran ke database:
```bash
node scripts/init-payment-data.js
```

### 3. Testing Sistem

Jalankan test untuk memastikan sistem berfungsi:
```bash
node test-payment-system.js
```

## Struktur File yang Dibuat

### Context
- `context/PaymentContext.jsx` - State management untuk pembayaran

### Komponen
- `components/PaymentMethod.jsx` - Pilihan metode pembayaran
- `components/PaymentForm.jsx` - Form pembayaran
- `components/PaymentCheckout.jsx` - Halaman checkout
- `components/PaymentStatus.jsx` - Status pembayaran
- `components/PaymentInstructions.jsx` - Instruksi pembayaran
- `components/PaymentHistory.jsx` - Riwayat pembayaran

### API Endpoints
- `app/api/payments/route.js` - CRUD pembayaran
- `app/api/payments/[id]/route.js` - Pembayaran spesifik
- `app/api/payments/verify/route.js` - Verifikasi pembayaran

### Halaman
- `app/checkout/page.jsx` - Halaman checkout
- `app/payment-status/[id]/page.jsx` - Status pembayaran
- `app/payment-instructions/[id]/page.jsx` - Instruksi pembayaran
- `app/payment-history/page.jsx` - Riwayat pembayaran
- `app/admin/payments/page.jsx` - Admin panel

### Konfigurasi
- `config/payment.js` - Konfigurasi sistem pembayaran

## Cara Menggunakan

### 1. Integrasi dengan Komponen Tiket

Sistem pembayaran sudah terintegrasi dengan `BuyTicket` component. Ketika user klik "Beli Sekarang", akan redirect ke halaman checkout.

### 2. Menggunakan PaymentContext

```jsx
import { useContext } from 'react';
import { PaymentContext } from '@/context/PaymentContext';

function MyComponent() {
  const {
    selectedPaymentMethod,
    paymentMethods,
    selectPaymentMethod,
    processPayment
  } = useContext(PaymentContext);
  
  // Gunakan fungsi dan state dari context
}
```

### 3. Menggunakan Komponen Pembayaran

```jsx
import PaymentCheckout from '@/components/PaymentCheckout';

function CheckoutPage() {
  return (
    <PaymentProvider>
      <PaymentCheckout onBack={handleBack} onSuccess={handleSuccess} />
    </PaymentProvider>
  );
}
```

## Metode Pembayaran yang Didukung

1. **Bank Transfer** (BCA, BNI, BRI, Mandiri)
2. **E-Wallet** (DANA, OVO, GoPay, ShopeePay)
3. **Kartu Kredit** (Visa, Mastercard, JCB)
4. **QRIS** (Scan QR Code)
5. **Tunai** (Bayar di lokasi)

## Status Pembayaran

- `pending` - Menunggu pembayaran
- `completed` - Pembayaran berhasil
- `failed` - Pembayaran gagal
- `cancelled` - Pembayaran dibatalkan

## Admin Panel

Akses admin panel di `/admin/payments` untuk:
- Melihat semua pembayaran
- Verifikasi pembayaran
- Update status pembayaran
- Filter dan pencarian

## Troubleshooting

### Error: Payment tidak tersimpan
- Periksa koneksi database
- Pastikan API endpoint berfungsi

### Error: Form validation
- Pastikan semua field required diisi
- Periksa format email dan nomor telepon

### Error: Payment status tidak update
- Periksa API endpoint
- Pastikan data valid

## Testing

### Manual Testing
1. Buka halaman event
2. Pilih tiket dan klik "Beli Sekarang"
3. Pilih metode pembayaran
4. Isi form pembayaran
5. Verifikasi pembayaran

### API Testing
Gunakan file `test-payment-system.js` untuk testing API endpoints.

## Keamanan

- Validasi input di client dan server
- Rate limiting untuk API
- Logging transaksi
- Enkripsi data sensitif

## Performance

- Lazy loading komponen
- Code splitting
- Optimized images
- Caching data

## Dependencies

- React 19.0.0
- Next.js 15.1.0
- React Icons 5.5.0
- Tailwind CSS 3.4.1

## Support

Untuk bantuan lebih lanjut, hubungi:
- Email: support@eventbms.com
- Dokumentasi: `PAYMENT_SYSTEM_README.md`
- Demo: `PAYMENT_DEMO.md`
