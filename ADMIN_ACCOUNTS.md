# Akun Test Admin EventBMS

Berikut adalah akun test yang dapat digunakan untuk mengakses panel admin:

## Akun 1 (Super Admin)
- **Email:** admin@test.com
- **Password:** admin123
- **Nama:** Admin Test
- **Role:** super_admin
- **Akses:** Semua fitur admin

## Akun 2 (Admin)
- **Email:** admin@eventbms.com
- **Password:** password123
- **Nama:** Event BMS Admin
- **Role:** admin
- **Akses:** Fitur admin standar

## Cara Login

1. Buka halaman `/admin/login`
2. Masukkan email dan password dari salah satu akun di atas
3. Klik tombol "Login"
4. Setelah berhasil, Anda akan diarahkan ke dashboard admin

## Fitur yang Tersedia

### Dashboard Admin (`/admin/dashboard`)
- Overview statistik event
- Navigasi ke fitur admin lainnya
- Tombol logout

### Kelola Events (`/admin/events`)
- Lihat daftar semua event
- Tambah event baru
- Edit event yang ada
- Hapus event

### Create New Event (`/admin/events/new`)
- Form untuk membuat event baru
- Upload gambar event
- Set tanggal, waktu, lokasi
- Set harga tiket dan kapasitas

## Keamanan

- Semua halaman admin dilindungi dengan autentikasi
- Session admin disimpan di localStorage
- Redirect otomatis ke login jika belum terautentikasi
- Logout akan menghapus session dan redirect ke login

## Catatan Penting

⚠️ **PERINGATAN:** Akun ini hanya untuk testing dan development. Jangan gunakan password yang sama di production!

- Password disimpan dalam plain text di `db.json` (hanya untuk development)
- Untuk production, gunakan hashing password dan database yang aman
- Ganti password default setelah setup pertama kali
