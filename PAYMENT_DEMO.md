# Demo Sistem Pembayaran EventBMS

## Cara Menggunakan Sistem Pembayaran

### 1. Langkah-langkah Pembayaran

#### Step 1: Pilih Event dan Tiket
1. Buka halaman event (contoh: `/event/1`)
2. Pilih tipe kursi yang diinginkan
3. Atur jumlah tiket
4. Klik tombol "Beli Sekarang"

#### Step 2: Pilih Metode Pembayaran
1. Di halaman checkout (`/checkout`)
2. Pilih salah satu metode pembayaran:
   - 🏦 Bank Transfer (BCA, BNI, BRI, Mandiri)
   - 📱 E-Wallet (DANA, OVO, GoPay, ShopeePay)
   - 💳 Kartu Kredit (Visa, Mastercard, JCB)
   - 📱 QRIS (Scan QR Code)
   - 💵 Tunai (Bayar di lokasi)

#### Step 3: Isi Data Pembayaran
1. Isi informasi pelanggan:
   - Nama lengkap
   - Email
   - Nomor telepon
   - Catatan (opsional)

2. Isi data spesifik metode pembayaran:
   - **Bank Transfer**: Pilih bank tujuan
   - **E-Wallet**: Pilih e-wallet
   - **Kartu Kredit**: Data kartu lengkap
   - **QRIS**: Tidak perlu input tambahan
   - **Tunai**: Tidak perlu input tambahan

#### Step 4: Konfirmasi Pembayaran
1. Periksa ringkasan pembayaran
2. Klik "Lanjutkan Pembayaran"
3. Sistem akan memproses pembayaran
4. Dapatkan ID transaksi

#### Step 5: Selesaikan Pembayaran
1. Ikuti instruksi pembayaran yang ditampilkan
2. Untuk bank transfer/e-wallet: Transfer sesuai nominal
3. Untuk QRIS: Scan QR code
4. Untuk tunai: Bayar di lokasi acara

### 2. Halaman-halaman Penting

#### `/checkout`
- Halaman checkout utama
- Pilih metode pembayaran
- Isi form pembayaran
- Konfirmasi pembayaran

#### `/payment-status/[id]`
- Status pembayaran real-time
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

### 3. Contoh Flow Pembayaran

```
1. User memilih event dan tiket
   ↓
2. User klik "Beli Sekarang"
   ↓
3. Redirect ke /checkout
   ↓
4. User pilih metode pembayaran
   ↓
5. User isi form pembayaran
   ↓
6. User konfirmasi pembayaran
   ↓
7. Sistem generate ID transaksi
   ↓
8. User dapat instruksi pembayaran
   ↓
9. User selesaikan pembayaran
   ↓
10. Admin verifikasi pembayaran
    ↓
11. Status berubah menjadi "completed"
```

### 4. Testing Manual

#### Test Bank Transfer
1. Pilih "Bank Transfer"
2. Pilih bank (contoh: BCA)
3. Isi data pelanggan
4. Klik "Lanjutkan Pembayaran"
5. Periksa instruksi transfer
6. Simpan ID transaksi

#### Test E-Wallet
1. Pilih "E-Wallet"
2. Pilih e-wallet (contoh: DANA)
3. Isi data pelanggan
4. Klik "Lanjutkan Pembayaran"
5. Periksa instruksi transfer
6. Simpan ID transaksi

#### Test Kartu Kredit
1. Pilih "Kartu Kredit"
2. Isi data kartu (contoh: 1234 5678 9012 3456)
3. Isi data pelanggan
4. Klik "Lanjutkan Pembayaran"
5. Periksa konfirmasi

#### Test QRIS
1. Pilih "QRIS"
2. Isi data pelanggan
3. Klik "Lanjutkan Pembayaran"
4. Periksa QR code
5. Simpan ID transaksi

#### Test Tunai
1. Pilih "Tunai"
2. Isi data pelanggan
3. Klik "Lanjutkan Pembayaran"
4. Periksa instruksi
5. Simpan ID transaksi

### 5. Admin Panel

#### Verifikasi Pembayaran
1. Buka `/admin/payments`
2. Cari pembayaran yang perlu diverifikasi
3. Klik "Detail" untuk melihat detail
4. Klik "Verifikasi" untuk menyetujui
5. Atau klik "Batalkan" untuk membatalkan

#### Filter Pembayaran
- Cari berdasarkan ID, event, atau nama pelanggan
- Filter berdasarkan status
- Sort berdasarkan tanggal

### 6. API Testing

#### Test Create Payment
```bash
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "orderData": {
      "eventId": "1",
      "eventName": "Test Event",
      "ticketType": "vip",
      "ticketPrice": 100000,
      "amount": 2,
      "totalPrice": 200000
    },
    "paymentMethod": {
      "id": "bank_transfer",
      "name": "Bank Transfer",
      "icon": "🏦",
      "fee": 0
    },
    "paymentForm": {
      "customerName": "John Doe",
      "customerEmail": "john@example.com",
      "customerPhone": "081234567890",
      "bankCode": "BCA"
    },
    "amount": 200000,
    "fee": 0
  }'
```

#### Test Get Payments
```bash
curl http://localhost:3000/api/payments
```

#### Test Update Payment
```bash
curl -X PUT http://localhost:3000/api/payments/PAY-123 \
  -H "Content-Type: application/json" \
  -d '{"status": "completed", "adminNotes": "Pembayaran diverifikasi"}'
```

### 7. Troubleshooting

#### Payment tidak tersimpan
- Periksa koneksi database
- Pastikan API endpoint berfungsi
- Periksa console untuk error

#### Form validation error
- Pastikan semua field required diisi
- Periksa format email dan nomor telepon
- Pastikan metode pembayaran dipilih

#### Payment status tidak update
- Periksa API endpoint
- Pastikan data valid
- Periksa log server

### 8. Fitur Tambahan

#### Copy to Clipboard
- Klik ikon copy di samping nomor rekening
- Klik ikon copy di samping nominal
- Data akan tersalin ke clipboard

#### Responsive Design
- Tampilan optimal di desktop dan mobile
- Touch-friendly interface
- Adaptive layout

#### Real-time Updates
- Status pembayaran update real-time
- Notifikasi perubahan status
- Auto-refresh data

### 9. Security Features

- Input validation
- XSS protection
- CSRF protection
- Rate limiting
- Data encryption

### 10. Performance

- Lazy loading
- Code splitting
- Optimized images
- Caching
- Database indexing
