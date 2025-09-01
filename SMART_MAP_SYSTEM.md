# 🧠 Smart Map System - EventBMS

## 🎯 Overview

Sistem peta cerdas yang secara otomatis menampilkan komponen yang tepat berdasarkan ketersediaan Google Maps API key.

## 🔄 Cara Kerja

### 1. **Auto-Detection API Key**
```javascript
// hooks/useGoogleMaps.js
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
if (!apiKey) {
  setIsHidden(true); // Component akan tersembunyi
  return;
}
```

### 2. **Smart Component Selection**
```javascript
// components/SmartMap.jsx
const SmartMap = ({ destination, onDistanceCalculated }) => {
  const { isHidden } = useGoogleMaps();

  if (isHidden) {
    return <MapFallback destination={destination} />; // Fallback tanpa API key
  }

  return <InteractiveMap destination={destination} onDistanceCalculated={onDistanceCalculated} />; // Peta interaktif dengan API key
};
```

## 📱 User Experience

### **Dengan API Key** ✅
- 🗺️ Peta interaktif Google Maps
- 📍 Marker lokasi destinasi
- 🚗 Rute dan navigasi
- 📏 Perhitungan jarak real-time
- 🎯 Street View dan kontrol penuh

### **Tanpa API Key** 🔄
- 📍 Informasi lokasi dan koordinat
- 🧭 Tombol navigasi ke apps maps
- 📋 Copy koordinat ke clipboard
- 💡 Tips setup API key
- 🎨 UI yang tetap menarik

## 🏗️ Struktur Komponen

```
SmartMap.jsx (Controller)
├── useGoogleMaps Hook
│   ├── API Key Check
│   ├── Loading State
│   └── Hidden State
├── InteractiveMap.jsx (Dengan API Key)
│   ├── Google Maps
│   ├── Real-time Features
│   └── Advanced Navigation
└── MapFallback.jsx (Tanpa API Key)
    ├── Basic Location Info
    ├── Navigation Buttons
    └── Setup Instructions
```

## 🚀 Keuntungan

### **Untuk Developer**
- ✅ **Zero Configuration** - Tidak perlu setup manual
- ✅ **Graceful Degradation** - App tetap berfungsi tanpa API key
- ✅ **Maintainable** - Satu komponen mengatur semuanya
- ✅ **Error-Free** - Tidak ada error messages yang mengganggu

### **Untuk User**
- ✅ **Seamless Experience** - Transisi otomatis antara mode
- ✅ **Always Functional** - Fitur lokasi selalu tersedia
- ✅ **Clear Guidance** - Tips setup yang jelas
- ✅ **Professional Look** - UI tetap menarik di semua kondisi

## 🔧 Setup

### **Otomatis (Recommended)**
```bash
# Tidak perlu setup apa-apa
# Component akan otomatis menyesuaikan
npm run dev
```

### **Manual Setup (Optional)**
```bash
# Buat .env.local
echo "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here" > .env.local

# Restart server
npm run dev
```

## 📊 Behavior Matrix

| Kondisi | InteractiveMap | MapFallback | User Experience |
|---------|----------------|-------------|------------------|
| **API Key Ada** ✅ | ✅ Tampil | ❌ Tersembunyi | Peta interaktif penuh |
| **API Key Kosong** ❌ | ❌ Tersembunyi | ✅ Tampil | Fallback yang informatif |
| **Loading** ⏳ | ⏳ Loading | ❌ Tersembunyi | Skeleton loading |
| **Error** 🚨 | ❌ Tersembunyi | ✅ Tampil | Fallback dengan error handling |

## 🎨 UI Components

### **InteractiveMap (Dengan API Key)**
- Peta Google Maps interaktif
- Marker kustom dengan animasi
- Info windows dan kontrol
- Rute dan navigasi real-time

### **MapFallback (Tanpa API Key)**
- Informasi lokasi dan koordinat
- Tombol navigasi ke apps maps
- Copy koordinat functionality
- Tips setup yang user-friendly

## 🔮 Future Enhancements

### **Phase 2**
- [ ] Offline maps support
- [ ] Multiple map providers
- [ ] Custom map styles
- [ ] Advanced routing

### **Phase 3**
- [ ] AR navigation
- [ ] Voice commands
- [ ] Social features
- [ ] Analytics dashboard

## 📚 Usage Examples

### **Basic Usage**
```jsx
import SmartMap from '@/components/SmartMap';

const MyPage = () => {
  return (
    <SmartMap 
      destination={destination}
      onDistanceCalculated={setDistance}
    />
  );
};
```

### **With Error Boundary**
```jsx
import ErrorBoundary from '@/components/ErrorBoundary';
import SmartMap from '@/components/SmartMap';

const MyPage = () => {
  return (
    <ErrorBoundary>
      <SmartMap destination={destination} />
    </ErrorBoundary>
  );
};
```

## 🎯 Best Practices

### **Do's**
- ✅ Gunakan `SmartMap` sebagai komponen utama
- ✅ Bungkus dengan `ErrorBoundary` untuk safety
- ✅ Biarkan auto-detection bekerja otomatis
- ✅ Test dengan dan tanpa API key

### **Don'ts**
- ❌ Jangan hardcode komponen tertentu
- ❌ Jangan tampilkan error messages manual
- ❌ Jangan abaikan fallback experience
- ❌ Jangan buat multiple map instances

## 🏆 Result

**Smart Map System memberikan:**
- 🎯 **Zero Configuration** untuk developer
- 🚀 **Seamless Experience** untuk user
- 🛡️ **Error-Free Operation** di semua kondisi
- 🎨 **Professional UI** tanpa setup manual
- 🔄 **Automatic Fallback** yang cerdas

---

**EventBMS - Smart Maps, Smarter Experience! 🗺️✨**
