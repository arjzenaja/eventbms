# Komponen Alert Modern untuk EventBMS

Komponen alert modern yang dapat menggantikan alert bawaan browser dengan desain yang lebih menarik, responsif, dan user-friendly.

## 🚀 Fitur Utama

- **4 Jenis Alert**: Info, Success, Warning, Error
- **Toast Notification**: Notifikasi non-blocking yang muncul di pojok layar
- **Confirm Dialog**: Dialog konfirmasi yang dapat menggantikan `confirm()`
- **Auto-close**: Dapat diatur untuk menutup otomatis
- **Animasi Smooth**: Transisi dan animasi yang halus
- **Responsive Design**: Mendukung berbagai ukuran layar
- **Customizable**: Mudah disesuaikan dengan kebutuhan

## 📁 Struktur File

```
components/ui/
├── alert.jsx          # Komponen Alert dan Toast utama
├── ConfirmDialog.jsx  # Dialog konfirmasi
└── AlertDemo.jsx      # Demo penggunaan komponen

hooks/
└── useAlert.js        # Hook untuk mengelola alert

ALERT_COMPONENTS_README.md  # Dokumentasi ini
```

## 🎯 Cara Penggunaan

### 1. Alert Modal (Menggantikan `alert()`)

```jsx
import { Alert } from '@/components/ui/alert';

// Alert sederhana
<Alert
  type="info"
  title="Informasi"
  message="Total culinary items: 0, Filtered: 0"
  show={showAlert}
  onClose={() => setShowAlert(false)}
/>

// Alert dengan auto-close
<Alert
  type="success"
  title="Berhasil!"
  message="Data telah berhasil disimpan"
  show={showAlert}
  onClose={() => setShowAlert(false)}
  autoClose={true}
  autoCloseDelay={4000}
/>
```

### 2. Toast Notification

```jsx
import { Toast } from '@/components/ui/alert';

<Toast
  type="info"
  title="Notifikasi"
  message="Ini adalah toast notification"
  show={showToast}
  onClose={() => setShowToast(false)}
  position="top-right" // top-right, top-left, bottom-right, bottom-left, top-center, bottom-center
  autoClose={true}
  autoCloseDelay={4000}
/>
```

### 3. Confirm Dialog (Menggantikan `confirm()`)

```jsx
import { ConfirmDialog, useConfirmDialog } from '@/components/ui/ConfirmDialog';

const { dialog, showConfirm } = useConfirmDialog();

// Tampilkan dialog konfirmasi
const handleDelete = async () => {
  const confirmed = await showConfirm({
    type: 'warning',
    title: 'Konfirmasi Hapus',
    message: 'Apakah Anda yakin ingin menghapus item ini?',
    confirmText: 'Hapus',
    cancelText: 'Batal',
  });

  if (confirmed) {
    // User mengklik Hapus
    console.log('Item dihapus');
  }
};

// Render dialog
<ConfirmDialog
  type={dialog.type}
  title={dialog.title}
  message={dialog.message}
  confirmText={dialog.confirmText}
  cancelText={dialog.cancelText}
  show={dialog.show}
  onConfirm={dialog.onConfirm}
  onCancel={dialog.onCancel}
/>
```

### 4. Hook useAlert

```jsx
import { useAlert } from '@/hooks/useAlert';

const { showSuccess, showError, showWarning, showInfo } = useAlert();

// Penggunaan sederhana
showSuccess('Berhasil!', 'Data telah disimpan');
showError('Error!', 'Terjadi kesalahan');
showWarning('Peringatan!', 'Data tidak lengkap');
showInfo('Info', 'Ini adalah informasi');

// Dengan opsi tambahan
showSuccess('Berhasil!', 'Data telah disimpan', {
  autoClose: true,
  autoCloseDelay: 3000
});
```

## 🎨 Jenis Alert yang Tersedia

### Info Alert
- **Warna**: Biru
- **Icon**: Info
- **Kegunaan**: Informasi umum, tips, atau pengumuman

### Success Alert
- **Warna**: Hijau
- **Icon**: Check Circle
- **Kegunaan**: Konfirmasi berhasil, data tersimpan, operasi selesai

### Warning Alert
- **Warna**: Kuning
- **Icon**: Alert Triangle
- **Kegunaan**: Peringatan, data tidak lengkap, konfirmasi sebelum aksi

### Error Alert
- **Warna**: Merah
- **Icon**: Alert Circle
- **Kegunaan**: Error, kesalahan sistem, validasi gagal

## ⚙️ Props yang Tersedia

### Alert Component
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | string | 'info' | Jenis alert (info, success, warning, error) |
| `title` | string | - | Judul alert |
| `message` | string | - | Pesan alert |
| `show` | boolean | false | Menampilkan/menyembunyikan alert |
| `onClose` | function | - | Callback saat alert ditutup |
| `autoClose` | boolean | false | Otomatis menutup alert |
| `autoCloseDelay` | number | 5000 | Delay auto-close dalam milidetik |
| `className` | string | - | CSS class tambahan |

### Toast Component
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | string | 'info' | Jenis toast |
| `title` | string | - | Judul toast |
| `message` | string | - | Pesan toast |
| `show` | boolean | false | Menampilkan/menyembunyikan toast |
| `onClose` | function | - | Callback saat toast ditutup |
| `position` | string | 'top-right' | Posisi toast |
| `autoClose` | boolean | true | Otomatis menutup toast |
| `autoCloseDelay` | number | 4000 | Delay auto-close dalam milidetik |

### ConfirmDialog Component
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | string | 'info' | Jenis dialog |
| `title` | string | - | Judul dialog |
| `message` | string | - | Pesan dialog |
| `confirmText` | string | 'OK' | Teks tombol konfirmasi |
| `cancelText` | string | 'Cancel' | Teks tombol batal |
| `showCancel` | boolean | true | Menampilkan tombol batal |
| `show` | boolean | false | Menampilkan/menyembunyikan dialog |
| `onConfirm` | function | - | Callback saat dikonfirmasi |
| `onCancel` | function | - | Callback saat dibatalkan |

## 🔄 Migrasi dari Alert Bawaan Browser

### Sebelum (Alert Bawaan)
```javascript
// Alert sederhana
alert('Total culinary items: 0, Filtered: 0');

// Confirm dialog
if (confirm('Apakah Anda yakin ingin menghapus item ini?')) {
  // Hapus item
}
```

### Sesudah (Alert Modern)
```jsx
// Alert modern
const [showAlert, setShowAlert] = useState(false);

<Alert
  type="info"
  title="Informasi"
  message="Total culinary items: 0, Filtered: 0"
  show={showAlert}
  onClose={() => setShowAlert(false)}
/>

// Confirm dialog modern
const { showConfirm } = useConfirmDialog();

const handleDelete = async () => {
  const confirmed = await showConfirm({
    type: 'warning',
    title: 'Konfirmasi Hapus',
    message: 'Apakah Anda yakin ingin menghapus item ini?',
    confirmText: 'Hapus',
    cancelText: 'Batal',
  });

  if (confirmed) {
    // Hapus item
  }
};
```

## 🎭 Contoh Penggunaan Praktis

### 1. Notifikasi Berhasil Simpan
```jsx
const handleSave = () => {
  // Simpan data
  saveData();
  
  // Tampilkan notifikasi
  showSuccess('Berhasil!', 'Data telah berhasil disimpan ke database');
};
```

### 2. Konfirmasi Hapus
```jsx
const handleDelete = async (id) => {
  const confirmed = await showConfirm({
    type: 'warning',
    title: 'Konfirmasi Hapus',
    message: 'Apakah Anda yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan.',
    confirmText: 'Hapus',
    cancelText: 'Batal',
  });

  if (confirmed) {
    try {
      await deleteItem(id);
      showSuccess('Berhasil!', 'Item telah berhasil dihapus');
    } catch (error) {
      showError('Error!', 'Gagal menghapus item');
    }
  }
};
```

### 3. Validasi Form
```jsx
const handleSubmit = () => {
  if (!formData.name) {
    showWarning('Peringatan!', 'Nama harus diisi');
    return;
  }

  if (!formData.email) {
    showWarning('Peringatan!', 'Email harus diisi');
    return;
  }

  // Submit form
  submitForm();
  showSuccess('Berhasil!', 'Form telah berhasil dikirim');
};
```

## 🎨 Kustomisasi

### Mengubah Warna
Anda dapat mengubah warna dengan memodifikasi `alertStyles` di file `alert.jsx`:

```jsx
const alertStyles = {
  success: {
    container: 'bg-green-50 border-green-200 text-green-800', // Ubah warna hijau
    icon: 'text-green-500',
    button: 'bg-green-100 hover:bg-green-200 text-green-700',
  },
  // ... lainnya
};
```

### Mengubah Animasi
Animasi dapat disesuaikan dengan mengubah CSS classes dan duration:

```jsx
// Di alert.jsx
className={cn(
  'transform transition-all duration-300', // Ubah duration
  isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
)}
```

## 🚀 Keuntungan

1. **User Experience**: Desain yang lebih menarik dan modern
2. **Responsif**: Mendukung berbagai ukuran layar
3. **Konsisten**: Desain yang seragam di seluruh aplikasi
4. **Accessible**: Mendukung keyboard navigation dan screen reader
5. **Customizable**: Mudah disesuaikan dengan brand guidelines
6. **Performance**: Tidak memblokir UI thread seperti alert bawaan
7. **Mobile Friendly**: Optimized untuk perangkat mobile

## 🔧 Troubleshooting

### Alert tidak muncul
- Pastikan prop `show` bernilai `true`
- Periksa z-index CSS
- Pastikan komponen di-render di dalam DOM

### Toast tidak di posisi yang benar
- Periksa prop `position`
- Pastikan tidak ada CSS yang mengoverride positioning

### Auto-close tidak berfungsi
- Pastikan prop `autoClose` bernilai `true`
- Periksa nilai `autoCloseDelay`
- Pastikan tidak ada error JavaScript yang menghentikan timer

## 📱 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🤝 Kontribusi

Jika Anda ingin berkontribusi untuk meningkatkan komponen ini:

1. Fork repository
2. Buat feature branch
3. Commit perubahan
4. Push ke branch
5. Buat Pull Request

## 📄 License

Komponen ini dibuat untuk EventBMS dan dapat digunakan secara bebas dalam proyek ini.
