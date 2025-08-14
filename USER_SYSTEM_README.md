# Sistem User Dolan Banyumas

Dokumentasi lengkap untuk sistem user yang telah diimplementasikan di aplikasi Dolan Banyumas.

## Fitur yang Tersedia

### 1. Registrasi User
- **Endpoint:** `POST /api/users`
- **Halaman:** `/register`
- **Fitur:**
  - Form registrasi dengan validasi
  - Validasi email format
  - Validasi password minimal 6 karakter
  - Konfirmasi password
  - Auto login setelah registrasi berhasil

### 2. Login User
- **Endpoint:** `POST /api/users/login`
- **Halaman:** `/login`
- **Fitur:**
  - Form login dengan validasi
  - Toggle show/hide password
  - Remember session di localStorage
  - Redirect ke beranda setelah login

### 3. Profile User
- **Endpoint:** `GET /api/users/[id]` dan `PUT /api/users/[id]`
- **Halaman:** `/profile`
- **Fitur:**
  - Tampilan profile user
  - Edit profile (nama, email, telepon, alamat)
  - Avatar dengan inisial nama
  - Tanggal bergabung
  - Logout

### 4. Admin Management
- **Halaman:** `/admin/users`
- **Fitur:**
  - Daftar semua user
  - Statistik user (total, aktif, baru, admin)
  - Tabel dengan informasi lengkap user
  - Filter dan pencarian (dalam pengembangan)

## Struktur Data User

```json
{
  "id": "1",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "0812-3456-7890",
  "address": "Jl. Contoh No. 123",
  "role": "user",
  "is_active": true,
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:00:00Z"
}
```

## API Endpoints

### 1. Registrasi User
```http
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "0812-3456-7890",
  "address": "Jl. Contoh No. 123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "user": {
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "0812-3456-7890",
    "address": "Jl. Contoh No. 123",
    "role": "user",
    "is_active": true,
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  }
}
```

### 2. Login User
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login berhasil",
  "user": {
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "0812-3456-7890",
    "address": "Jl. Contoh No. 123",
    "role": "user",
    "is_active": true,
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  }
}
```

### 3. Get All Users (Admin)
```http
GET /api/users
```

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": "1",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "0812-3456-7890",
      "address": "Jl. Contoh No. 123",
      "role": "user",
      "is_active": true,
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### 4. Get User by ID
```http
GET /api/users/[id]
```

### 5. Update User
```http
PUT /api/users/[id]
Content-Type: application/json

{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "phone": "0812-3456-7890",
  "address": "Jl. Contoh No. 456"
}
```

## Context dan State Management

### UserContext
File: `context/UserContext.jsx`

**Fitur:**
- State management untuk user
- Auto login dari localStorage
- Functions: login, logout, updateProfile, updatePreferences
- Helper functions: isAuthenticated, hasRole

**Usage:**
```javascript
import { useUser } from '@/context/UserContext';

const { user, login, logout, isAuthenticated } = useUser();
```

## Komponen UI

### 1. Header Component
- Menampilkan status login user
- Tombol login/register untuk user belum login
- Avatar dan nama user untuk user yang sudah login
- Link ke profile page

### 2. Login Form
- Form login dengan validasi
- Toggle show/hide password
- Error handling
- Loading state

### 3. Register Form
- Form registrasi lengkap
- Validasi real-time
- Konfirmasi password
- Auto login setelah registrasi

### 4. Profile Page
- Tampilan profile user
- Mode edit dan view
- Avatar dengan inisial
- Form edit profile

## Keamanan

### 1. Password Storage
- **Development:** Password disimpan dalam plain text di `db.json`
- **Production:** Password harus di-hash menggunakan bcrypt atau library serupa

### 2. Session Management
- Session disimpan di localStorage
- Auto logout jika data tidak valid
- Clear session saat logout

### 3. Validation
- Email format validation
- Password strength validation
- Required field validation
- Duplicate email check

## Integrasi dengan Admin System

### 1. Dashboard Admin
- Card statistik user di dashboard
- Link ke halaman management user

### 2. User Management
- Halaman khusus untuk admin melihat semua user
- Statistik user (total, aktif, baru, admin)
- Tabel dengan informasi lengkap

## File Structure

```
app/
├── api/
│   └── users/
│       ├── route.js              # Registrasi dan GET all users
│       ├── login/
│       │   └── route.js          # Login user
│       └── [id]/
│           └── route.js          # GET dan PUT user by ID
├── login/
│   └── page.jsx                  # Halaman login user
├── register/
│   └── page.jsx                  # Halaman registrasi user
├── profile/
│   └── page.jsx                  # Halaman profile user
└── admin/
    └── users/
        └── page.jsx              # Halaman admin management user

context/
└── UserContext.jsx               # Context untuk user state management

components/
└── Header.jsx                    # Header dengan status user
```

## Cara Penggunaan

### 1. Untuk User Baru
1. Buka halaman `/register`
2. Isi form registrasi
3. Klik "Daftar Sekarang"
4. Otomatis login dan redirect ke beranda

### 2. Untuk User yang Sudah Ada
1. Buka halaman `/login`
2. Masukkan email dan password
3. Klik "Masuk"
4. Redirect ke beranda

### 3. Untuk Admin
1. Login sebagai admin di `/admin/login`
2. Akses dashboard admin
3. Klik card "Users" untuk melihat daftar user
4. Atau langsung ke `/admin/users`

## Testing

### Akun Test User
- **Email:** user@test.com
- **Password:** user123

### Akun Test Admin
- **Email:** admin@test.com
- **Password:** admin123

## Catatan Penting

1. **Password Security:** Untuk production, implementasikan password hashing
2. **Email Verification:** Tambahkan fitur verifikasi email
3. **Password Reset:** Implementasikan fitur lupa password
4. **Role Management:** Tambahkan role-based access control yang lebih detail
5. **User Activity:** Tambahkan tracking aktivitas user
6. **Data Export:** Tambahkan fitur export data user untuk admin

## Troubleshooting

### 1. User tidak bisa login
- Periksa email dan password
- Pastikan user sudah terdaftar
- Cek status `is_active` user

### 2. Registrasi gagal
- Periksa format email
- Pastikan password minimal 6 karakter
- Cek apakah email sudah terdaftar

### 3. Profile tidak tersimpan
- Periksa koneksi internet
- Pastikan user sudah login
- Cek response dari API

## Update Terbaru

- ✅ Sistem registrasi user
- ✅ Sistem login user
- ✅ Profile management
- ✅ Admin user management
- ✅ Integrasi dengan dashboard admin
- ✅ UI/UX yang responsif dan modern
- ✅ Validasi form yang lengkap
- ✅ Error handling yang baik
