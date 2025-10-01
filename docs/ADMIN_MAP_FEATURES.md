# 🗺️ Admin Map Features - EventBMS

## 🎯 Overview

Fitur peta cerdas untuk halaman admin form objek wisata yang memungkinkan admin untuk:
- Memilih lokasi dengan input teks
- Mendapatkan koordinat GPS otomatis
- Menggunakan GPS untuk lokasi saat ini
- Preview koordinat yang dipilih
- Integrasi dengan Google Maps

## ✨ Fitur Utama

### 1. **Input Lokasi Cerdas**
- **Auto-geocoding**: Otomatis mengkonversi alamat ke koordinat GPS
- **Fallback coordinates**: Koordinat default untuk lokasi umum di Banyumas
- **Real-time validation**: Validasi input lokasi secara real-time

### 2. **GPS Integration**
- **Current Location**: Tombol GPS untuk menggunakan lokasi saat ini
- **Geolocation API**: Menggunakan browser geolocation
- **Permission handling**: Handle permission untuk akses lokasi

### 3. **Coordinate Management**
- **Manual Input**: Input manual untuk latitude dan longitude
- **Coordinate Preview**: Tampilan koordinat dalam format yang mudah dibaca
- **Validation**: Validasi format koordinat

### 4. **Map Preview**
- **Toggle Map**: Tampilkan/sembunyikan preview peta
- **Google Maps Integration**: Preview dengan Google Maps (jika API key tersedia)
- **Fallback UI**: UI yang menarik ketika peta tidak tersedia

## 🏗️ Komponen

### **AdminMapSelector.jsx**
Komponen utama yang menggantikan input lokasi biasa dengan fitur peta lengkap.

#### Props
```javascript
{
  location: string,                    // Lokasi saat ini
  onLocationChange: function,          // Callback saat lokasi berubah
  onCoordinatesChange: function,       // Callback saat koordinat berubah
  initialCoordinates: object           // Koordinat awal (untuk edit)
}
```

#### State
```javascript
{
  coordinates: { lat: number, lng: number },  // Koordinat GPS
  isMapVisible: boolean,                      // Status visibility peta
  isLoading: boolean,                         // Loading state
  error: string                               // Error message
}
```

## 🔧 Cara Kerja

### **1. Auto-Geocoding**
```javascript
const getCoordinatesFromAddress = async (address) => {
  if (!apiKey) {
    // Fallback ke koordinat default
    const defaultCoords = getDefaultCoordinates(address);
    setCoordinates(defaultCoords);
    return;
  }

  // Gunakan Google Geocoding API
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
  );
  
  const data = await response.json();
  if (data.status === 'OK') {
    const { lat, lng } = data.results[0].geometry.location;
    setCoordinates({ lat, lng });
  }
};
```

### **2. GPS Integration**
```javascript
const getCurrentLocation = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const newCoordinates = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      setCoordinates(newCoordinates);
      onCoordinatesChange(newCoordinates);
    },
    (error) => {
      setError('Gagal mendapatkan lokasi saat ini');
    }
  );
};
```

### **3. Fallback Coordinates**
```javascript
const getDefaultCoordinates = (locationName) => {
  const loc = locationName.toLowerCase();
  if (loc.includes('baturraden')) {
    return { lat: -7.3056, lng: 109.2194 };
  } else if (loc.includes('purwokerto')) {
    return { lat: -7.4211, lng: 109.2344 };
  }
  // ... more locations
  return { lat: -7.4211, lng: 109.2344 }; // Default to Purwokerto
};
```

## 📱 User Interface

### **Location Input Section**
- Input teks untuk lokasi dengan placeholder yang informatif
- Tombol GPS untuk menggunakan lokasi saat ini
- Auto-complete dan geocoding otomatis

### **Coordinates Display**
- Grid 2 kolom untuk latitude dan longitude
- Preview koordinat dalam format yang mudah dibaca
- Tombol "Buka di Maps" untuk verifikasi

### **Map Preview Toggle**
- Toggle button untuk menampilkan/menyembunyikan peta
- Status indicator untuk koordinat yang tersimpan
- Responsive design untuk mobile dan desktop

### **Error Handling**
- Warning messages untuk geocoding failures
- Tips untuk setup API key
- Graceful degradation tanpa API key

## 🔑 API Integration

### **Google Maps API**
- **Geocoding API**: Konversi alamat ke koordinat
- **Maps JavaScript API**: Preview peta interaktif
- **Places API**: Auto-complete dan suggestions

### **Environment Variables**
```bash
# .env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### **API Endpoints**
- **POST** `/api/destinations` - Create dengan koordinat
- **PUT** `/api/destinations/[id]` - Update dengan koordinat
- **GET** `/api/destinations/[id]` - Retrieve dengan koordinat

## 📊 Data Structure

### **Form Data**
```javascript
{
  title: "Nama Destinasi",
  location: "Banyumas, Indonesia",
  coordinates: {
    lat: -7.4211,
    lng: 109.2344
  },
  // ... other fields
}
```

### **Database Schema**
```json
{
  "id": "1",
  "title": "Nama Destinasi",
  "location": "Banyumas, Indonesia",
  "coordinates": {
    "lat": -7.4211,
    "lng": 109.2344
  },
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

## 🚀 Setup & Configuration

### **1. Install Dependencies**
```bash
npm install react-icons
```

### **2. Environment Setup**
```bash
# Buat file .env.local
echo "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here" > .env.local
```

### **3. Component Integration**
```jsx
import AdminMapSelector from '@/components/AdminMapSelector';

const MyForm = () => {
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: '', lng: '' });

  return (
    <AdminMapSelector
      location={location}
      onLocationChange={setLocation}
      onCoordinatesChange={setCoordinates}
    />
  );
};
```

## 🎨 Customization

### **Styling**
- Menggunakan Tailwind CSS untuk styling
- Responsive design untuk mobile dan desktop
- Dark mode support
- Custom color schemes

### **Default Coordinates**
- Mudah dikustomisasi untuk lokasi lain
- Fallback coordinates untuk berbagai kota
- Configurable default values

### **Error Messages**
- Customizable error messages
- Multi-language support
- User-friendly error handling

## 🔍 Testing

### **Test Cases**
- [x] **Input Lokasi**: Auto-geocoding berfungsi
- [x] **GPS Integration**: Current location detection
- [x] **Coordinate Input**: Manual coordinate input
- [x] **API Integration**: Form submission dengan koordinat
- [x] **Error Handling**: Graceful degradation
- [x] **Responsive Design**: Mobile dan desktop

### **Test Scenarios**
1. **Dengan API Key**: Full functionality
2. **Tanpa API Key**: Fallback mode
3. **GPS Permission**: Allow/deny scenarios
4. **Network Errors**: Offline/error handling
5. **Form Validation**: Required fields dan validation

## 🚀 Future Enhancements

### **Phase 2**
- [ ] **Offline Maps**: Support untuk offline mode
- [ ] **Multiple Providers**: OpenStreetMap, Mapbox
- [ ] **Advanced Geocoding**: Reverse geocoding
- [ ] **Batch Processing**: Multiple locations

### **Phase 3**
- [ ] **AI Suggestions**: Smart location recommendations
- [ ] **Route Planning**: Multi-destination routing
- [ ] **3D Maps**: 3D terrain visualization
- [ ] **AR Integration**: Augmented reality features

## 📚 Usage Examples

### **Basic Integration**
```jsx
import AdminMapSelector from '@/components/AdminMapSelector';

const DestinationForm = () => {
  const [formData, setFormData] = useState({
    location: '',
    coordinates: { lat: '', lng: '' }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('location', formData.location);
    formDataToSend.append('coordinates', JSON.stringify(formData.coordinates));
    
    // Submit to API
    await fetch('/api/destinations', {
      method: 'POST',
      body: formDataToSend
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <AdminMapSelector
        location={formData.location}
        onLocationChange={(location) => setFormData(prev => ({ ...prev, location }))}
        onCoordinatesChange={(coordinates) => setFormData(prev => ({ ...prev, coordinates }))}
      />
      <button type="submit">Submit</button>
    </form>
  );
};
```

### **With Validation**
```jsx
const DestinationForm = () => {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.location) {
      newErrors.location = 'Lokasi harus diisi';
    }
    
    if (!formData.coordinates.lat || !formData.coordinates.lng) {
      newErrors.coordinates = 'Koordinat harus diisi';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Submit form
  };

  return (
    <form onSubmit={handleSubmit}>
      <AdminMapSelector
        location={formData.location}
        onLocationChange={handleLocationChange}
        onCoordinatesChange={handleCoordinatesChange}
      />
      {errors.coordinates && (
        <p className="text-red-500 text-sm">{errors.coordinates}</p>
      )}
    </form>
  );
};
```

## 🏆 Benefits

### **Untuk Admin**
- ✅ **User Experience**: Interface yang lebih intuitif
- ✅ **Accuracy**: Koordinat GPS yang akurat
- ✅ **Efficiency**: Auto-geocoding menghemat waktu
- ✅ **Validation**: Validasi lokasi secara real-time

### **Untuk User**
- ✅ **Better Navigation**: Koordinat yang tepat untuk navigasi
- ✅ **Map Integration**: Integrasi dengan Google Maps
- ✅ **Location Services**: Fitur lokasi yang lengkap
- ✅ **Professional Look**: UI yang modern dan menarik

---

**EventBMS - Admin Maps yang Cerdas dan User-Friendly! 🗺️✨**
