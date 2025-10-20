# 📋 LEMBAR TESTING EVENTBMS (DOLAN BANYUMAS)

## 📝 Informasi Umum
- **Nama Aplikasi**: EventBMS (Dolan Banyumas)
- **Platform**: Web Application (Next.js)
- **URL Testing**: `http://localhost:3000` (development) atau URL production
- **Tanggal Testing**: _______________
- **Tester**: _______________
- **Browser**: _______________

---

## 🎯 DAFTAR FITUR UTAMA YANG PERLU DITEST

### 1. **Halaman Utama (Homepage)**
### 2. **Sistem Autentikasi (Login/Register)**
### 3. **Manajemen Destinasi Wisata**
### 4. **Sistem Kuliner**
### 5. **Sistem Penginapan**
### 6. **Sistem Oleh-oleh**
### 7. **Sistem Desa Wisata**
### 8. **Sistem Biro Perjalanan**
### 9. **Sistem Event Management**
### 10. **Sistem Pembayaran**
### 11. **Panel Admin**
### 12. **Responsive Design**

---

## 🧪 SKENARIO TESTING DETAIL

### 📱 **1. HOMEPAGE TESTING**

#### **Test Case 1.1: Load Halaman Utama**
- **Tujuan**: Memastikan halaman utama dapat dimuat dengan benar
- **Langkah**:
  1. Buka browser dan akses URL aplikasi
  2. Tunggu halaman loading selesai
- **Expected Result**: 
  - ✅ Halaman utama tampil dengan hero section
  - ✅ Menu navigasi terlihat
  - ✅ Section fitur unggulan tampil
  - ✅ Footer terlihat
- **Status**: ⬜ Pass ⬜ Fail
- **Catatan**: _______________

#### **Test Case 1.2: Navigasi Menu**
- **Tujuan**: Memastikan semua menu navigasi berfungsi
- **Langkah**:
  1. Klik menu "Destinasi"
  2. Klik menu "Kuliner"
  3. Klik menu "Penginapan"
  4. Klik menu "Oleh-oleh"
  5. Klik menu "Event"
- **Expected Result**: 
  - ✅ Semua menu dapat diklik dan mengarah ke halaman yang benar
  - ✅ Tidak ada error 404
- **Status**: ⬜ Pass ⬜ Fail
- **Catatan**: _______________

#### **Test Case 1.3: Search Functionality**
- **Tujuan**: Memastikan fitur pencarian berfungsi
- **Langkah**:
  1. Ketik kata kunci di search bar (contoh: "gunung")
  2. Tekan Enter atau klik tombol search
- **Expected Result**: 
  - ✅ Hasil pencarian tampil
  - ✅ Data yang relevan ditampilkan
- **Status**: ⬜ Pass ⬜ Fail
- **Catatan**: _______________

---

### 🔐 **2. SISTEM AUTENTIKASI**

#### **Test Case 2.1: Registrasi User Baru**
- **Tujuan**: Memastikan user dapat mendaftar akun baru
- **Langkah**:
  1. Klik tombol "Register" atau "Daftar"
  2. Isi form registrasi:
     - Nama lengkap
     - Email
     - Password
     - Konfirmasi password
  3. Klik tombol "Daftar"
- **Expected Result**: 
  - ✅ Form validasi berfungsi
  - ✅ User berhasil terdaftar
  - ✅ Email verifikasi dikirim (jika ada)
- **Status**: ⬜ Pass ⬜ Fail
- **Catatan**: _______________

#### **Test Case 2.2: Login User**
- **Tujuan**: Memastikan user dapat login
- **Langkah**:
  1. Klik tombol "Login"
  2. Masukkan email dan password
  3. Klik tombol "Login"
- **Expected Result**: 
  - ✅ Login berhasil
  - ✅ User diarahkan ke dashboard atau halaman utama
  - ✅ Session tersimpan
- **Status**: ⬜ Pass ⬜ Fail
- **Catatan**: _______________

#### **Test Case 2.3: Logout**
- **Tujuan**: Memastikan user dapat logout
- **Langkah**:
  1. Setelah login, klik menu profil
  2. Klik tombol "Logout"
- **Expected Result**: 
  - ✅ User berhasil logout
  - ✅ Session dihapus
  - ✅ Diarahkan ke halaman login atau homepage
- **Status**: ⬜ Pass ⬜ Fail
- **Catatan**: _______________

---

### 🏔️ **3. MANAJEMEN DESTINASI WISATA**

#### **Test Case 3.1: Lihat Daftar Destinasi**
- **Tujuan**: Memastikan daftar destinasi dapat dilihat
- **Langkah**:
  1. Klik menu "Destinasi" atau "Objek Wisata"
  2. Scroll untuk melihat semua destinasi
- **Expected Result**: 
  - ✅ Daftar destinasi tampil
  - ✅ Gambar destinasi terlihat
  - ✅ Informasi dasar destinasi tampil
- **Status**: ⬜ Pass ⬜ Fail
- **Catatan**: _______________

#### **Test Case 3.2: Detail Destinasi**
- **Tujuan**: Memastikan detail destinasi dapat dilihat
- **Langkah**:
  1. Klik salah satu destinasi dari daftar
  2. Lihat halaman detail destinasi
- **Expected Result**: 
  - ✅ Gambar destinasi tampil
  - ✅ Deskripsi lengkap tampil
  - ✅ Informasi lokasi tampil
  - ✅ Rating dan review tampil
- **Status**: ⬜ Pass ⬜ Fail
- **Catatan**: _______________

#### **Test Case 3.3: Filter Destinasi**
- **Tujuan**: Memastikan filter destinasi berfungsi
- **Langkah**:
  1. Gunakan filter berdasarkan kategori (alam, budaya, sejarah)
  2. Gunakan filter berdasarkan lokasi
  3. Gunakan filter berdasarkan rating
- **Expected Result**: 
  - ✅ Filter berfungsi dengan benar
  - ✅ Hasil sesuai dengan filter yang dipilih
- **Status**: ⬜ Pass ⬜ Fail
- **Catatan**: _______________

---

### 🍽️ **4. SISTEM KULINER**

#### **Test Case 4.1: Lihat Menu Kuliner**
- **Tujuan**: Memastikan menu kuliner dapat dilihat
- **Langkah**:
  1. Klik menu "Kuliner"
  2. Lihat daftar menu kuliner
- **Expected Result**: 
  - ✅ Daftar menu kuliner tampil
  - ✅ Gambar makanan terlihat
  - ✅ Harga dan deskripsi tampil
- **Status**: ⬜ Pass ⬜ Fail
- **Catatan**: _______________

#### **Test Case 4.2: Order Menu Kuliner**
- **Tujuan**: Memastikan user dapat memesan menu kuliner
- **Langkah**:
  1. Klik tombol "Beli Menu" pada salah satu menu
  2. Isi form pemesanan:
     - Jumlah pesanan
     - Catatan khusus (opsional)
  3. Klik tombol "Pesan"
- **Expected Result**: 
  - ✅ Form pemesanan tampil
  - ✅ Pemesanan berhasil
  - ✅ Notifikasi konfirmasi tampil
- **Status**: ⬜ Pass ⬜ Fail
- **Catatan**: _______________

#### **Test Case 4.3: Filter Menu Kuliner**
- **Tujuan**: Memastikan filter menu kuliner berfungsi
- **Langkah**:
  1. Gunakan filter berdasarkan kategori makanan
  2. Gunakan filter berdasarkan harga
  3. Gunakan filter berdasarkan rating
- **Expected Result**: 
  - ✅ Filter berfungsi dengan benar
  - ✅ Hasil sesuai dengan filter yang dipilih
- **Status**: ⬜ Pass ⬜ Fail
- **Catatan**: _______________

---

### 🏨 **5. SISTEM PENGINAPAN**

#### **Test Case 5.1: Lihat Daftar Penginapan**
- **Tujuan**: Memastikan daftar penginapan dapat dilihat
- **Langkah**:
  1. Klik menu "Penginapan"
  2. Lihat daftar hotel, homestay, dan villa
- **Expected Result**: 
  - ✅ Daftar penginapan tampil
  - ✅ Gambar penginapan terlihat
  - ✅ Informasi fasilitas tampil
- **Status**: ⬜ Pass ⬜ Fail
- **Catatan**: _______________

#### **Test Case 5.2: Detail Penginapan**
- **Tujuan**: Memastikan detail penginapan dapat dilihat
- **Langkah**:
  1. Klik salah satu penginapan
  2. Lihat halaman detail penginapan
- **Expected Result**: 
  - ✅ Galeri foto tampil
  - ✅ Fasilitas lengkap tampil
  - ✅ Harga dan ketersediaan tampil
  - ✅ Informasi kontak tampil
- **Status**: ⬜ Pass ⬜ Fail
- **Catatan**: _______________

#### **Test Case 5.3: Booking Penginapan**
- **Tujuan**: Memastikan user dapat booking penginapan
- **Langkah**:
  1. Klik tombol "Booking" pada penginapan
  2. Isi form booking:
     - Tanggal check-in
     - Tanggal check-out
     - Jumlah kamar
     - Jumlah tamu
  3. Klik tombol "Konfirmasi Booking"
- **Expected Result**: 
  - ✅ Form booking tampil
  - ✅ Booking berhasil
  - ✅ Konfirmasi booking tampil
- **Status**: ⬜ Pass ⬜ Fail
- **Catatan**: _______________

---

### 🛍️ **6. SISTEM OLEH-OLEH**

#### **Test Case 6.1: Lihat Daftar Oleh-oleh**
- **Tujuan**: Memastikan daftar oleh-oleh dapat dilihat
- **Langkah**:
  1. Klik menu "Oleh-oleh"
  2. Lihat daftar souvenir dan makanan khas
- **Expected Result**: 
  - ✅ Daftar oleh-oleh tampil
  - ✅ Gambar produk terlihat
  - ✅ Harga dan deskripsi tampil
- **Status**: ⬜ Pass ⬜ Fail
- **Catatan**: _______________

#### **Test Case 6.2: Beli Oleh-oleh**
- **Tujuan**: Memastikan user dapat membeli oleh-oleh
- **Langkah**:
  1. Klik tombol "Beli" pada salah satu produk
  2. Isi form pembelian:
     - Jumlah barang
     - Alamat pengiriman
  3. Klik tombol "Beli Sekarang"
- **Expected Result**: 
  - ✅ Form pembelian tampil
  - ✅ Pembelian berhasil
  - ✅ Konfirmasi pembelian tampil
- **Status**: ⬜ Pass ⬜ Fail
- **Catatan**: _______________

---

### 🏘️ **7. SISTEM DESA WISATA**

#### **Test Case 7.1: Lihat Daftar Desa Wisata**
- **Tujuan**: Memastikan daftar desa wisata dapat dilihat
- **Langkah**:
  1. Klik menu "Desa Wisata"
  2. Lihat daftar desa wisata
- **Expected Result**: 
  - ✅ Daftar desa wisata tampil
  - ✅ Informasi desa tampil
  - ✅ Aktivitas wisata tampil
- **Status**: ⬜ Pass ⬜ Fail
- **Catatan**: _______________

#### **Test Case 7.2: Detail Desa Wisata**
- **Tujuan**: Memastikan detail desa wisata dapat dilihat
- **Langkah**:
  1. Klik salah satu desa wisata
  2. Lihat halaman detail desa wisata
- **Expected Result**: 
  - ✅ Informasi lengkap desa tampil
  - ✅ Aktivitas wisata tampil
  - ✅ Paket wisata tampil
  - ✅ Informasi kontak tampil
- **Status**: ⬜ Pass ⬜ Fail
- **Catatan**: _______________

---

### 🚌 **8. SISTEM BIRO PERJALANAN**

#### **Test Case 8.1: Lihat Daftar Biro Perjalanan**
- **Tujuan**: Memastikan daftar biro perjalanan dapat dilihat
- **Langkah**:
  1. Klik menu "Biro Perjalanan"
  2. Lihat daftar biro perjalanan
- **Expected Result**: 
  - ✅ Daftar biro perjalanan tampil
  - ✅ Informasi biro tampil
  - ✅ Paket wisata tampil
- **Status**: ⬜ Pass ⬜ Fail
- **Catatan**: _______________

#### **Test Case 8.2: Detail Biro Perjalanan**
- **Tujuan**: Memastikan detail biro perjalanan dapat dilihat
- **Langkah**:
  1. Klik salah satu biro perjalanan
  2. Lihat halaman detail biro perjalanan
- **Expected Result**: 
  - ✅ Informasi lengkap biro tampil
  - ✅ Paket wisata lengkap tampil
  - ✅ Harga dan fasilitas tampil
  - ✅ Informasi kontak tampil
- **Status**: ⬜ Pass ⬜ Fail
- **Catatan**: _______________

---

### 🎉 **9. SISTEM EVENT MANAGEMENT**

#### **Test Case 9.1: Lihat Daftar Event**
- **Tujuan**: Memastikan daftar event dapat dilihat
- **Langkah**:
  1. Klik menu "Event"
  2. Lihat daftar event yang tersedia
- **Expected Result**: 
  - ✅ Daftar event tampil
  - ✅ Informasi event tampil
  - ✅ Tanggal dan lokasi event tampil
- **Status**: ⬜ Pass ⬜ Fail
- **Catatan**: _______________

#### **Test Case 9.2: Detail Event**
- **Tujuan**: Memastikan detail event dapat dilihat
- **Langkah**:
  1. Klik salah satu event
  2. Lihat halaman detail event
- **Expected Result**: 
  - ✅ Informasi lengkap event tampil
  - ✅ Deskripsi event tampil
  - ✅ Jadwal event tampil
  - ✅ Lokasi event tampil
- **Status**: ⬜ Pass ⬜ Fail
- **Catatan**: _______________

#### **Test Case 9.3: Beli Tiket Event**
- **Tujuan**: Memastikan user dapat membeli tiket event
- **Langkah**:
  1. Klik tombol "Beli Tiket" pada event
  2. Pilih jenis tiket dan jumlah
  3. Isi data pembeli
  4. Klik tombol "Beli Tiket"
- **Expected Result**: 
  - ✅ Form pembelian tiket tampil
  - ✅ Pembelian tiket berhasil
  - ✅ Konfirmasi pembelian tampil
- **Status**: ⬜ Pass ⬜ Fail
- **Catatan**: _______________

---

### 💳 **10. SISTEM PEMBAYARAN**

#### **Test Case 10.1: Proses Pembayaran**
- **Tujuan**: Memastikan sistem pembayaran berfungsi
- **Langkah**:
  1. Lakukan pembelian (tiket event, kuliner, atau oleh-oleh)
  2. Pilih metode pembayaran
  3. Isi data pembayaran
  4. Konfirmasi pembayaran
- **Expected Result**: 
  - ✅ Form pembayaran tampil
  - ✅ Pembayaran berhasil diproses
  - ✅ Konfirmasi pembayaran tampil
- **Status**: ⬜ Pass ⬜ Fail
- **Catatan**: _______________

#### **Test Case 10.2: Riwayat Pembayaran**
- **Tujuan**: Memastikan user dapat melihat riwayat pembayaran
- **Langkah**:
  1. Login sebagai user
  2. Klik menu "Riwayat Pembayaran"
  3. Lihat daftar transaksi
- **Expected Result**: 
  - ✅ Riwayat pembayaran tampil
  - ✅ Detail transaksi tampil
  - ✅ Status pembayaran tampil
- **Status**: ⬜ Pass ⬜ Fail
- **Catatan**: _______________

---

### 👨‍💼 **11. PANEL ADMIN**

#### **Test Case 11.1: Login Admin**
- **Tujuan**: Memastikan admin dapat login
- **Langkah**:
  1. Akses `/admin/login`
  2. Masukkan kredensial admin
  3. Klik tombol "Login"
- **Expected Result**: 
  - ✅ Login admin berhasil
  - ✅ Diarahkan ke dashboard admin
- **Status**: ⬜ Pass ⬜ Fail
- **Catatan**: _______________

#### **Test Case 11.2: Dashboard Admin**
- **Tujuan**: Memastikan dashboard admin berfungsi
- **Langkah**:
  1. Setelah login admin, lihat dashboard
  2. Cek statistik dan data
- **Expected Result**: 
  - ✅ Dashboard admin tampil
  - ✅ Statistik data tampil
  - ✅ Menu navigasi admin tampil
- **Status**: ⬜ Pass ⬜ Fail
- **Catatan**: _______________

#### **Test Case 11.3: CRUD Destinasi Wisata**
- **Tujuan**: Memastikan admin dapat mengelola destinasi wisata
- **Langkah**:
  1. Klik menu "Objek Wisata" di admin
  2. Test tambah destinasi baru
  3. Test edit destinasi yang ada
  4. Test hapus destinasi
- **Expected Result**: 
  - ✅ CRUD destinasi wisata berfungsi
  - ✅ Data tersimpan dengan benar
- **Status**: ⬜ Pass ⬜ Fail
- **Catatan**: _______________

#### **Test Case 11.4: CRUD Kuliner**
- **Tujuan**: Memastikan admin dapat mengelola menu kuliner
- **Langkah**:
  1. Klik menu "Kuliner" di admin
  2. Test tambah menu baru
  3. Test edit menu yang ada
  4. Test hapus menu
- **Expected Result**: 
  - ✅ CRUD kuliner berfungsi
  - ✅ Upload gambar menu berfungsi
- **Status**: ⬜ Pass ⬜ Fail
- **Catatan**: _______________

#### **Test Case 11.5: CRUD Event**
- **Tujuan**: Memastikan admin dapat mengelola event
- **Langkah**:
  1. Klik menu "Event" di admin
  2. Test tambah event baru
  3. Test edit event yang ada
  4. Test hapus event
- **Expected Result**: 
  - ✅ CRUD event berfungsi
  - ✅ Paket tiket event berfungsi
- **Status**: ⬜ Pass ⬜ Fail
- **Catatan**: _______________

---

### 📱 **12. RESPONSIVE DESIGN**

#### **Test Case 12.1: Mobile View**
- **Tujuan**: Memastikan aplikasi responsive di mobile
- **Langkah**:
  1. Buka aplikasi di browser mobile atau gunakan developer tools
  2. Test navigasi dan fitur utama
- **Expected Result**: 
  - ✅ Layout responsive di mobile
  - ✅ Menu navigasi mobile berfungsi
  - ✅ Form dan tombol mudah digunakan
- **Status**: ⬜ Pass ⬜ Fail
- **Catatan**: _______________

#### **Test Case 12.2: Tablet View**
- **Tujuan**: Memastikan aplikasi responsive di tablet
- **Langkah**:
  1. Buka aplikasi di browser tablet atau gunakan developer tools
  2. Test navigasi dan fitur utama
- **Expected Result**: 
  - ✅ Layout responsive di tablet
  - ✅ Grid layout menyesuaikan
  - ✅ Touch interaction berfungsi
- **Status**: ⬜ Pass ⬜ Fail
- **Catatan**: _______________

---

## 📊 **RINGKASAN TESTING**

### **Total Test Cases**: 35
### **Passed**: ___ / 35
### **Failed**: ___ / 35
### **Pass Rate**: ___%

---

## 🐛 **BUG REPORT**

### **Bug #1**
- **Fitur**: _______________
- **Deskripsi**: _______________
- **Steps to Reproduce**: _______________
- **Expected Result**: _______________
- **Actual Result**: _______________
- **Severity**: ⬜ Critical ⬜ High ⬜ Medium ⬜ Low
- **Screenshot**: _______________

### **Bug #2**
- **Fitur**: _______________
- **Deskripsi**: _______________
- **Steps to Reproduce**: _______________
- **Expected Result**: _______________
- **Actual Result**: _______________
- **Severity**: ⬜ Critical ⬜ High ⬜ Medium ⬜ Low
- **Screenshot**: _______________

### **Bug #3**
- **Fitur**: _______________
- **Deskripsi**: _______________
- **Steps to Reproduce**: _______________
- **Expected Result**: _______________
- **Actual Result**: _______________
- **Severity**: ⬜ Critical ⬜ High ⬜ Medium ⬜ Low
- **Screenshot**: _______________

---

## 💡 **SUGGESTIONS & IMPROVEMENTS**

1. _______________
2. _______________
3. _______________
4. _______________
5. _______________

---

## ✅ **CONCLUSION**

**Overall Assessment**: ⬜ Excellent ⬜ Good ⬜ Fair ⬜ Poor

**Recommendation**: _______________

**Tester Signature**: _______________
**Date**: _______________

---

## 📋 **CHECKLIST QUICK TESTING**

### **Critical Features** (Must Work)
- ⬜ Homepage loads correctly
- ⬜ User registration/login works
- ⬜ Destinasi wisata dapat dilihat
- ⬜ Kuliner dapat dipesan
- ⬜ Event dapat dilihat dan tiket dibeli
- ⬜ Admin panel dapat diakses
- ⬜ Mobile responsive

### **Important Features** (Should Work)
- ⬜ Search functionality
- ⬜ Filter dan sorting
- ⬜ Payment system
- ⬜ User profile management
- ⬜ Admin CRUD operations

### **Nice to Have Features** (Could Work)
- ⬜ Advanced filtering
- ⬜ Social sharing
- ⬜ Email notifications
- ⬜ Advanced admin features

---

**Catatan**: Gunakan lembar ini untuk testing menyeluruh aplikasi EventBMS. Centang ⬜ untuk setiap test case yang berhasil, dan isi catatan untuk setiap bug atau issue yang ditemukan.
