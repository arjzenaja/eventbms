'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorHandler from '@/components/ErrorHandler';

export default function EditAccommodation() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'penginapan',
    location: '',
    date: '',
    description: '',
    price: '',
    img_sm: '',
    img_lg: '',
    amenities: [],
    recommended: false,
    // Management team fields
    manager: '',
    phone: '',
    whatsapp: '',
    email: '',
    website: '',
    // Location coordinates
    coordinates: { lat: '', lng: '' },

    opening_hours: '',
    slug: '',
    category: 'Penginapan'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Room type form state
  const [roomForm, setRoomForm] = useState({
    name: '',
    capacity: '',
    size: '',
    description: '',
    bedType: '',
    price: '',
    facilities: [],
    isPopular: false,
    available: true
  });

  const accommodationTypes = [
    { value: 'penginapan', label: 'Penginapan' },
    { value: 'hotel', label: 'Hotel' },
    { value: 'villa', label: 'Villa' },
    { value: 'guesthouse', label: 'Guesthouse' },
    { value: 'homestay', label: 'Homestay' }
  ];

  const availableAmenities = [
    'WiFi', 'AC', 'Parking', 'Restaurant', 'Pool', 'Gym', 'Spa', 'Kitchen', 'Garden', 'Beach Access'
  ];

  const roomFacilities = [
    'AC', 'TV', 'WiFi', 'Kamar Mandi Dalam', 'Air Panas', 'Balkon', 'Ruang Tamu', 'Mini Bar', 'Safe Deposit', 'Coffee Maker'
  ];

  const bedTypes = [
    '1 Single Bed',
    '1 Queen Bed', 
    '1 King Bed',
    '2 Single Beds',
    '2 Queen Beds',
    '1 Queen + 1 Single',
    '1 King + 1 Single',
    'Bunk Bed'
  ];

  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        const response = await fetch(`/api/penginapan/${id}`);
        const data = await response.json();
        
        if (data.success) {
          setFormData({
            title: data.penginapan.title || '',
            type: data.penginapan.type || 'penginapan',
            location: data.penginapan.location || '',
            date: data.penginapan.date || '',
            description: data.penginapan.description || '',
            price: data.penginapan.price || '',
            img_sm: data.penginapan.img_sm || '',
            img_lg: data.penginapan.img_lg || '',
            amenities: data.penginapan.amenities || [],
            recommended: data.penginapan.recommended || false,
            // Management team fields
            manager: data.penginapan.manager || '',
            phone: data.penginapan.phone || '',
            whatsapp: data.penginapan.whatsapp || '',
            email: data.penginapan.email || '',
            website: data.penginapan.website || '',
            // Location coordinates
            coordinates: data.penginapan.coordinates || { lat: '', lng: '' },

            opening_hours: data.penginapan.opening_hours || '',
            slug: data.penginapan.slug || '',
            category: data.penginapan.category || 'Penginapan'
          });
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error('Error fetching accommodation:', error);
        setError('Terjadi kesalahan saat mengambil data penginapan');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchAccommodation();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleCoordinateChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      coordinates: {
        ...prev.coordinates,
        [field]: value
      }
    }));
  };

  // Room type handlers
  const handleRoomInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRoomForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRoomFacilityChange = (facility) => {
    setRoomForm(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const addRoom = () => {
    if (!roomForm.name || !roomForm.price) {
      alert('Nama kamar dan harga harus diisi');
      return;
    }

    const newRoom = {
      id: Date.now().toString(),
      ...roomForm,
      price: parseInt(roomForm.price)
    };

    setFormData(prev => ({
      ...prev,
      rooms: [...prev.rooms, newRoom]
    }));

    // Reset room form
    setRoomForm({
      name: '',
      capacity: '',
      size: '',
      description: '',
      bedType: '',
      price: '',
      facilities: [],
      isPopular: false,
      available: true
    });
  };

  const removeRoom = (roomId) => {
    setFormData(prev => ({
      ...prev,
      rooms: prev.rooms.filter(room => room.id !== roomId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/penginapan/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert('Penginapan berhasil diperbarui!');
        router.push('/admin/accommodation');
      } else {
        alert('Gagal memperbarui penginapan: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating accommodation:', error);
      alert('Terjadi kesalahan saat memperbarui penginapan');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <LoadingSpinner message="Memuat data penginapan..." />
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <ErrorHandler 
          error={error} 
          onRetry={() => window.location.reload()}
          message="Gagal memuat data penginapan"
        />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-3xl font-bold text-gray-900">Edit Penginapan</h1>
              <Link 
                href="/admin/accommodation" 
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              >
                Kembali
              </Link>
            </div>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow sm:rounded-lg">
              <form onSubmit={handleSubmit} className="space-y-6 p-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Nama Penginapan *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan nama penginapan"
                  />
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Tipe Penginapan *
                  </label>
                  <select
                    id="type"
                    name="type"
                    required
                    value={formData.type}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {accommodationTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Lokasi *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan lokasi"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Deskripsi *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan deskripsi penginapan"
                  />
                </div>

                {/* Management Team */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Tim Pengelola</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="manager" className="block text-sm font-medium text-gray-700">
                        Nama Manager
                      </label>
                      <input
                        type="text"
                        id="manager"
                        name="manager"
                        value={formData.manager}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nama manager penginapan"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Nomor Telepon
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="08123456789"
                      />
                    </div>

                    <div>
                      <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">
                        WhatsApp
                      </label>
                      <input
                        type="tel"
                        id="whatsapp"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="08123456789"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="manager@penginapan.com"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                        Website
                      </label>
                      <input
                        type="url"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://www.penginapan.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Location Coordinates */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Koordinat Lokasi</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="lat" className="block text-sm font-medium text-gray-700">
                        Latitude
                      </label>
                      <input
                        type="text"
                        id="lat"
                        name="lat"
                        value={formData.coordinates.lat}
                        onChange={(e) => handleCoordinateChange('lat', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="-7.123456"
                      />
                      <p className="text-xs text-gray-500 mt-1">Contoh: -7.123456</p>
                    </div>

                    <div>
                      <label htmlFor="lng" className="block text-sm font-medium text-gray-700">
                        Longitude
                      </label>
                      <input
                        type="text"
                        id="lng"
                        name="lng"
                        value={formData.coordinates.lng}
                        onChange={(e) => handleCoordinateChange('lng', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="109.123456"
                      />
                      <p className="text-xs text-gray-500 mt-1">Contoh: 109.123456</p>
                    </div>
                  </div>
                </div>

                {/* Room Types Management */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Tipe Kamar Tersedia</h3>
                  
                  {/* Add Room Form */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Tambah Tipe Kamar Baru</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="roomName" className="block text-sm font-medium text-gray-700">
                          Nama Tipe Kamar *
                        </label>
                        <input
                          type="text"
                          id="roomName"
                          name="name"
                          value={roomForm.name}
                          onChange={handleRoomInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Standard Room"
                        />
                      </div>

                      <div>
                        <label htmlFor="roomCapacity" className="block text-sm font-medium text-gray-700">
                          Kapasitas (orang)
                        </label>
                        <input
                          type="number"
                          id="roomCapacity"
                          name="capacity"
                          value={roomForm.capacity}
                          onChange={handleRoomInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="2"
                        />
                      </div>

                      <div>
                        <label htmlFor="roomSize" className="block text-sm font-medium text-gray-700">
                          Ukuran (m²)
                        </label>
                        <input
                          type="text"
                          id="roomSize"
                          name="size"
                          value={roomForm.size}
                          onChange={handleRoomInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="24m²"
                        />
                      </div>

                      <div>
                        <label htmlFor="roomPrice" className="block text-sm font-medium text-gray-700">
                          Harga per Malam (Rp) *
                        </label>
                        <input
                          type="number"
                          id="roomPrice"
                          name="price"
                          value={roomForm.price}
                          onChange={handleRoomInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="150000"
                        />
                      </div>

                      <div>
                        <label htmlFor="roomBedType" className="block text-sm font-medium text-gray-700">
                          Tipe Tempat Tidur
                        </label>
                        <select
                          id="roomBedType"
                          name="bedType"
                          value={roomForm.bedType}
                          onChange={handleRoomInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Pilih tipe tempat tidur</option>
                          {bedTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="roomDescription" className="block text-sm font-medium text-gray-700">
                          Deskripsi Kamar
                        </label>
                        <textarea
                          id="roomDescription"
                          name="description"
                          rows={2}
                          value={roomForm.description}
                          onChange={handleRoomInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Deskripsi singkat tentang kamar"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fasilitas Kamar
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {roomFacilities.map(facility => (
                          <label key={facility} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={roomForm.facilities.includes(facility)}
                              onChange={() => handleRoomFacilityChange(facility)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-900">{facility}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="isPopular"
                          checked={roomForm.isPopular}
                          onChange={handleRoomInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-900">Kamar Populer</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="available"
                          checked={roomForm.available}
                          onChange={handleRoomInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-900">Tersedia</span>
                      </label>
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={addRoom}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                      >
                        + Tambah Tipe Kamar
                      </button>
                    </div>
                  </div>

                  {/* Room List */}
                  {formData.rooms.length > 0 && (
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-4">Tipe Kamar yang Ditambahkan</h4>
                      <div className="space-y-3">
                        {formData.rooms.map((room, index) => (
                          <div key={room.id} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h5 className="font-medium text-gray-900">{room.name}</h5>
                                  {room.isPopular && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                      POPULAR
                                    </span>
                                  )}
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                    room.available 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {room.available ? 'Tersedia' : 'Tidak Tersedia'}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{room.description}</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-500">
                                  <div>Kapasitas: {room.capacity} orang</div>
                                  <div>Ukuran: {room.size}</div>
                                  <div>Tipe Bed: {room.bedType}</div>
                                  <div>Harga: Rp {room.price?.toLocaleString()}</div>
                                </div>
                                {room.facilities.length > 0 && (
                                  <div className="mt-2">
                                    <span className="text-sm text-gray-500">Fasilitas: </span>
                                    <span className="text-sm text-gray-700">{room.facilities.join(', ')}</span>
                                  </div>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => removeRoom(room.id)}
                                className="text-red-600 hover:text-red-800 ml-4"
                              >
                                Hapus
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Biaya Masuk (Rp) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    required
                    min="0"
                    value={formData.price || 0}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="img_sm" className="block text-sm font-medium text-gray-700">
                      Gambar Kecil
                    </label>
                    <input
                      type="text"
                      id="img_sm"
                      name="img_sm"
                      value={formData.img_sm}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="URL gambar kecil"
                    />
                  </div>

                  <div>
                    <label htmlFor="img_lg" className="block text-sm font-medium text-gray-700">
                      Gambar Besar
                    </label>
                    <input
                      type="text"
                      id="img_lg"
                      name="img_lg"
                      value={formData.img_lg}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="URL gambar besar"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fasilitas
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availableAmenities.map(amenity => (
                      <label key={amenity} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(amenity)}
                          onChange={() => handleAmenityChange(amenity)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-900">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="recommended"
                    name="recommended"
                    checked={formData.recommended}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="recommended" className="ml-2 block text-sm text-gray-900">
                    Rekomendasikan penginapan ini
                  </label>
                </div>

                <div className="flex justify-end space-x-3">
                  <Link
                    href="/admin/accommodation"
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                  >
                    Batal
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md"
                  >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}










