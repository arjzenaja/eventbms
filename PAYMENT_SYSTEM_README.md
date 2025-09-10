# Sistem Pembayaran EventBMS

Sistem pembayaran lengkap untuk aplikasi EventBMS yang mendukung berbagai metode pembayaran dan manajemen transaksi.

## Fitur Utama

### 1. Metode Pembayaran
- **Bank Transfer**: BCA, BNI, BRI, Mandiri
- **E-Wallet**: DANA, OVO, GoPay, ShopeePay
- **Kartu Kredit**: Visa, Mastercard, JCB
- **QRIS**: Scan QR Code untuk pembayaran
- **Tunai**: Pembayaran di lokasi acara

### 2. Komponen Utama

#### PaymentContext (`context/PaymentContext.jsx`)
- State management untuk sistem pembayaran
- Validasi form pembayaran
- Proses pembayaran
- Riwayat pembayaran

#### PaymentMethod (`components/PaymentMethod.jsx`)
- Tampilan pilihan metode pembayaran
- Informasi biaya admin
- Status ketersediaan

#### PaymentForm (`components/PaymentForm.jsx`)
- Form pembayaran berdasarkan metode yang dipilih
- Validasi input pelanggan
- Instruksi pembayaran spesifik

#### PaymentCheckout (`components/PaymentCheckout.jsx`)
- Halaman checkout lengkap
- Ringkasan pesanan
- Proses pembayaran step-by-step

#### PaymentStatus (`components/PaymentStatus.jsx`)
- Status pembayaran real-time
- Detail transaksi
- Instruksi pembayaran

#### PaymentInstructions (`components/PaymentInstructions.jsx`)
- Instruksi pembayaran detail
- Copy-to-clipboard functionality
- Panduan step-by-step

#### PaymentHistory (`components/PaymentHistory.jsx`)
- Riwayat pembayaran pengguna
- Filter dan pencarian
- Status pembayaran

### 3. API Endpoints

#### `/api/payments`
- `GET`: Ambil semua pembayaran atau filter
- `POST`: Buat pembayaran baru
- `PUT`: Update status pembayaran
- `DELETE`: Hapus pembayaran

#### `/api/payments/[id]`
- `GET`: Ambil pembayaran spesifik
- `PUT`: Update pembayaran spesifik
- `DELETE`: Hapus pembayaran spesifik

#### `/api/payments/verify`
- `POST`: Verifikasi pembayaran (admin)
- `GET`: Status verifikasi

### 4. Halaman

#### `/checkout`
- Halaman checkout utama
- Integrasi dengan sistem tiket
- Proses pembayaran lengkap

#### `/payment-status/[id]`
- Status pembayaran individual
- Detail transaksi
- Instruksi pembayaran

#### `/payment-instructions/[id]`
- Instruksi pembayaran detail
- Copy-to-clipboard
- Panduan visual

#### `/payment-history`
- Riwayat pembayaran pengguna
- Filter dan pencarian

#### `/admin/payments`
- Manajemen pembayaran admin
- Verifikasi pembayaran
- Update status

## Cara Penggunaan

### 1. Integrasi dengan Sistem Tiket

```jsx
import { PaymentProvider } from "@/context/PaymentContext";
import { TicketProvider } from "@/context/TicketContext";

function App() {
  return (
    <TicketProvider>
      <PaymentProvider>
        {/* Komponen aplikasi */}
      </PaymentProvider>
    </TicketProvider>
  );
}
```

### 2. Menggunakan Komponen Pembayaran

```jsx
import PaymentCheckout from "@/components/PaymentCheckout";

function CheckoutPage() {
  const handleBack = () => {
    window.history.back();
  };

  const handleSuccess = (result) => {
    console.log("Payment successful:", result);
  };

  return (
    <PaymentCheckout onBack={handleBack} onSuccess={handleSuccess} />
  );
}
```

### 3. Menggunakan PaymentContext

```jsx
import { useContext } from "react";
import { PaymentContext } from "@/context/PaymentContext";

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

## Struktur Data

### Payment Object
```javascript
{
  id: "PAY-1234567890-abc123",
  userId: "user123",
  orderData: {
    eventId: "event123",
    eventName: "Event Name",
    ticketType: "vip",
    ticketPrice: 100000,
    amount: 2,
    totalPrice: 200000
  },
  paymentMethod: {
    id: "bank_transfer",
    name: "Bank Transfer",
    icon: "🏦",
    fee: 0
  },
  paymentForm: {
    customerName: "John Doe",
    customerEmail: "john@example.com",
    customerPhone: "081234567890",
    bankCode: "BCA",
    // ... field lainnya
  },
  amount: 200000,
  fee: 0,
  totalAmount: 200000,
  status: "pending", // pending, completed, failed, cancelled
  createdAt: "2024-01-01T00:00:00.000Z",
  expiresAt: "2024-01-02T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

## Validasi Form

### Validasi Umum
- Nama lengkap: Required
- Email: Format email valid
- Nomor telepon: Format nomor valid

### Validasi Spesifik Metode
- **Bank Transfer**: Pilih bank tujuan
- **E-Wallet**: Pilih e-wallet
- **Kartu Kredit**: Data kartu lengkap
- **QRIS**: Tidak ada validasi tambahan
- **Tunai**: Tidak ada validasi tambahan

## Status Pembayaran

- **pending**: Menunggu pembayaran
- **completed**: Pembayaran berhasil
- **failed**: Pembayaran gagal
- **cancelled**: Pembayaran dibatalkan

## Biaya Admin

- Bank Transfer: Rp 0
- E-Wallet: Rp 2.500
- Kartu Kredit: Rp 3.000
- QRIS: Rp 0
- Tunai: Rp 0

## Keamanan

- Validasi input di client dan server
- Enkripsi data sensitif
- Rate limiting untuk API
- Logging transaksi

## Testing

### Manual Testing
1. Pilih event dan tiket
2. Klik "Beli Sekarang"
3. Pilih metode pembayaran
4. Isi form pembayaran
5. Verifikasi pembayaran

### API Testing
```bash
# Test create payment
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{"orderData": {...}, "paymentMethod": {...}}'

# Test get payments
curl http://localhost:3000/api/payments

# Test update payment
curl -X PUT http://localhost:3000/api/payments/PAY-123 \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

## Troubleshooting

### Common Issues

1. **Payment tidak tersimpan**
   - Periksa koneksi database
   - Pastikan API endpoint berfungsi

2. **Form validation error**
   - Periksa format input
   - Pastikan field required diisi

3. **Payment status tidak update**
   - Periksa API endpoint
   - Pastikan data valid

### Debug Mode

Aktifkan debug mode dengan menambahkan:
```javascript
const DEBUG = process.env.NODE_ENV === 'development';
```

## Dependencies

- React 19.0.0
- Next.js 15.1.0
- React Icons 5.5.0
- Tailwind CSS 3.4.1

## Future Enhancements

- [ ] Integrasi payment gateway (Midtrans, Xendit)
- [ ] Notifikasi email/SMS
- [ ] Refund system
- [ ] Payment analytics
- [ ] Mobile app integration
- [ ] Multi-currency support
- [ ] Subscription payments
- [ ] Payment scheduling
