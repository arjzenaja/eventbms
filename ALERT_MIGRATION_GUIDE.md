# Panduan Migrasi Alert - Dari Browser Bawaan ke Alert Modern

## 🎯 Tujuan
Menggantikan semua `alert()` dan `confirm()` bawaan browser dengan komponen alert modern yang lebih menarik dan user-friendly.

## 📍 Lokasi Alert yang Perlu Diganti

Berdasarkan `ACTION_BUTTONS_README.md`, berikut adalah alert yang perlu diganti:

### 1. Quick View Alert (Line 108)
**Sebelum:**
```javascript
const handleQuickView = (destination) => {
  const message = `
Nama: ${destination.title}
Lokasi: ${destination.location}
Tipe: ${destination.type}
Deskripsi: ${destination.short_description || 'Tidak ada deskripsi'}
Harga: Rp ${destination.seats?.[0]?.price?.toLocaleString('id-ID') || '0'}
  `.trim();
  
  alert(message); // ❌ ALERT LAMA
};
```

**Sesudah:**
```jsx
import { Alert } from '@/components/ui/alert';

const [showQuickView, setShowQuickView] = useState(false);
const [quickViewData, setQuickViewData] = useState(null);

const handleQuickView = (destination) => {
  const data = {
    title: destination.title,
    location: destination.location,
    type: destination.type,
    description: destination.short_description || 'Tidak ada deskripsi',
    price: destination.seats?.[0]?.price?.toLocaleString('id-ID') || '0'
  };
  
  setQuickViewData(data);
  setShowQuickView(true); // ✅ ALERT MODERN
};

// Render di JSX
{showQuickView && quickViewData && (
  <Alert
    type="info"
    title="Informasi Destinasi"
    message={`
Nama: ${quickViewData.title}
Lokasi: ${quickViewData.location}
Tipe: ${quickViewData.type}
Deskripsi: ${quickViewData.description}
Harga: Rp ${quickViewData.price}
    `.trim()}
    show={showQuickView}
    onClose={() => setShowQuickView(false)}
    autoClose={false}
  />
)}
```

### 2. Duplicate Confirmation (Line 108)
**Sebelum:**
```javascript
const handleDuplicateDestination = async (destinationId) => {
  if (!confirm('Apakah Anda yakin ingin menduplikasi objek wisata ini?')) { // ❌ CONFIRM LAMA
    return;
  }

  try {
    // ... API calls ...
    
    if (createData.success) {
      alert('Objek wisata berhasil diduplikasi!'); // ❌ ALERT LAMA
      await refreshData();
    } else {
      alert('Gagal menduplikasi objek wisata: ' + createData.message); // ❌ ALERT LAMA
    }
  } catch (error) {
    alert('Terjadi kesalahan saat menduplikasi objek wisata.'); // ❌ ALERT LAMA
  }
};
```

**Sesudah:**
```jsx
import { ConfirmDialog, useConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useAlert } from '@/hooks/useAlert';

const { showConfirm } = useConfirmDialog();
const { showSuccess, showError } = useAlert();

const handleDuplicateDestination = async (destinationId) => {
  const confirmed = await showConfirm({ // ✅ CONFIRM MODERN
    type: 'info',
    title: 'Konfirmasi Duplikasi',
    message: 'Apakah Anda yakin ingin menduplikasi objek wisata ini?',
    confirmText: 'Duplikasi',
    cancelText: 'Batal',
  });

  if (confirmed) {
    try {
      // ... API calls ...
      
      if (createData.success) {
        showSuccess('Berhasil!', 'Objek wisata berhasil diduplikasi!'); // ✅ ALERT MODERN
        await refreshData();
      } else {
        showError('Error!', 'Gagal menduplikasi objek wisata: ' + createData.message); // ✅ ALERT MODERN
      }
    } catch (error) {
      showError('Error!', 'Terjadi kesalahan saat menduplikasi objek wisata.'); // ✅ ALERT MODERN
    }
  }
};
```

### 3. Delete Confirmation (Line 108)
**Sebelum:**
```javascript
const handleDeleteDestination = async (destinationId) => {
  if (!confirm('Apakah Anda yakin ingin menghapus objek wisata ini?')) { // ❌ CONFIRM LAMA
    return;
  }

  try {
    // ... API calls ...
    
    if (data.success) {
      alert('Objek wisata berhasil dihapus!'); // ❌ ALERT LAMA
      await refreshData();
    } else {
      alert('Gagal menghapus objek wisata: ' + data.message); // ❌ ALERT LAMA
      await refreshData();
    }
  } catch (error) {
    alert('Terjadi kesalahan saat menghapus objek wisata. Silakan coba lagi.'); // ❌ ALERT LAMA
  }
};
```

**Sesudah:**
```jsx
const handleDeleteDestination = async (destinationId) => {
  const confirmed = await showConfirm({ // ✅ CONFIRM MODERN
    type: 'warning',
    title: 'Konfirmasi Hapus',
    message: 'Apakah Anda yakin ingin menghapus objek wisata ini? Tindakan ini tidak dapat dibatalkan.',
    confirmText: 'Hapus',
    cancelText: 'Batal',
  });

  if (confirmed) {
    try {
      // ... API calls ...
      
      if (data.success) {
        showSuccess('Berhasil!', 'Objek wisata berhasil dihapus!'); // ✅ ALERT MODERN
        await refreshData();
      } else {
        showError('Error!', 'Gagal menghapus objek wisata: ' + data.message); // ✅ ALERT MODERN
        await refreshData();
      }
    } catch (error) {
      showError('Error!', 'Terjadi kesalahan saat menghapus objek wisata. Silakan coba lagi.'); // ✅ ALERT MODERN
    }
  }
};
```

## 🚀 Langkah Implementasi

### Step 1: Install Dependencies
```bash
# Pastikan semua komponen alert sudah tersedia
# components/ui/alert.jsx
# components/ui/ConfirmDialog.jsx
# hooks/useAlert.js
```

### Step 2: Import Components
```jsx
import { Alert, Toast } from '@/components/ui/alert';
import { ConfirmDialog, useConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useAlert } from '@/hooks/useAlert';
```

### Step 3: Setup State dan Hooks
```jsx
const [showAlert, setShowAlert] = useState(false);
const [alertData, setAlertData] = useState(null);

const { showSuccess, showError, showWarning, showInfo } = useAlert();
const { showConfirm } = useConfirmDialog();
```

### Step 4: Replace alert() dengan showSuccess/showError
```jsx
// ❌ Lama
alert('Berhasil!');

// ✅ Baru
showSuccess('Berhasil!', 'Data telah berhasil disimpan');
```

### Step 5: Replace confirm() dengan showConfirm
```jsx
// ❌ Lama
if (confirm('Hapus item?')) {
  // hapus
}

// ✅ Baru
const confirmed = await showConfirm({
  type: 'warning',
  title: 'Konfirmasi Hapus',
  message: 'Apakah Anda yakin ingin menghapus item ini?',
  confirmText: 'Hapus',
  cancelText: 'Batal',
});

if (confirmed) {
  // hapus
}
```

### Step 6: Render Components
```jsx
// Alert Component
{showAlert && (
  <Alert
    type={alertData.type}
    title={alertData.title}
    message={alertData.message}
    show={showAlert}
    onClose={() => setShowAlert(false)}
    autoClose={true}
    autoCloseDelay={4000}
  />
)}

// Confirm Dialog Component
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

## 🎨 Customization

### Mengubah Warna Alert
```jsx
// Di components/ui/alert.jsx
const alertStyles = {
  success: {
    container: 'bg-green-50 border-green-200 text-green-800', // Ubah warna
    icon: 'text-green-500',
    button: 'bg-green-100 hover:bg-green-200 text-green-700',
  },
  // ... lainnya
};
```

### Mengubah Teks Button
```jsx
// Di ConfirmDialog
<ConfirmDialog
  confirmText="Ya, Hapus" // Custom text
  cancelText="Tidak, Batal" // Custom text
  // ... props lainnya
/>
```

## 📱 Responsive Design

Semua komponen alert sudah responsive dan akan terlihat bagus di:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🔧 Troubleshooting

### Alert tidak muncul
```jsx
// Pastikan state show bernilai true
const [showAlert, setShowAlert] = useState(false);

// Trigger alert
setShowAlert(true); // ✅ Ini yang membuat alert muncul
```

### Confirm dialog tidak berfungsi
```jsx
// Pastikan menggunakan await
const confirmed = await showConfirm({...}); // ✅ Gunakan await

// Jangan lupa destructure hook
const { showConfirm } = useConfirmDialog(); // ✅ Destructure dengan benar
```

### Hook tidak berfungsi
```jsx
// Pastikan hook dipanggil di level component
const { showSuccess } = useAlert(); // ✅ Di dalam component, bukan di dalam function

// Jangan di dalam function
const handleClick = () => {
  const { showSuccess } = useAlert(); // ❌ SALAH! Hook harus di level component
};
```

## 📋 Checklist Migrasi

- [ ] Import semua komponen alert yang diperlukan
- [ ] Setup state untuk mengontrol alert
- [ ] Setup hooks useAlert dan useConfirmDialog
- [ ] Replace semua `alert()` dengan `showSuccess()`, `showError()`, dll
- [ ] Replace semua `confirm()` dengan `showConfirm()`
- [ ] Render Alert component di JSX
- [ ] Render ConfirmDialog component di JSX
- [ ] Test semua fungsi alert
- [ ] Test responsive design
- [ ] Test error handling

## 🎉 Hasil Akhir

Setelah migrasi, aplikasi akan memiliki:
- ✅ Alert yang lebih menarik dan modern
- ✅ User experience yang lebih baik
- ✅ Design yang konsisten
- ✅ Responsive di semua device
- ✅ Animasi yang smooth
- ✅ Auto-close functionality
- ✅ Customizable styling
- ✅ Better accessibility

## 📞 Bantuan

Jika ada masalah dalam implementasi, pastikan:
1. Semua import sudah benar
2. Hooks dipanggil di level component
3. State management sudah benar
4. Components sudah di-render di JSX
