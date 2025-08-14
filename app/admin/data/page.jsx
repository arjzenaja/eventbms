'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Search, Plus, Edit, Trash2, Eye, Filter, Download, PieChart, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDataPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportType, setExportType] = useState('filtered'); // 'filtered' or 'all'
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    byCategory: {},
    byMonth: {},
    recent: 0
  });

  // Kategori yang tersedia
  const categories = [
    { value: 'semua', label: 'Semua Kategori', icon: '📊' },
    { value: 'objek-wisata', label: 'Objek Wisata', icon: '🏔️' },
    { value: 'kuliner', label: 'Kuliner', icon: '🍽️' },
    { value: 'penginapan', label: 'Penginapan', icon: '🏨' },
    { value: 'oleh-oleh', label: 'Oleh-oleh', icon: '🛍️' },
    { value: 'desa-wisata', label: 'Desa Wisata', icon: '🏘️' },
    { value: 'biro-perjalanan', label: 'Biro Perjalanan', icon: '🚌' },
    { value: 'event', label: 'Event', icon: '🎉' }
  ];

  // Data type selection moved to `/admin/data/new`

  // Fetch data dari API
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch data from all available APIs
      const [
        eventsResponse,
        destinationsResponse,
        culinaryResponse,
        accommodationResponse,
        souvenirsResponse,
        villagesResponse,
        travelAgenciesResponse
      ] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/wisata'),
        fetch('/api/kuliner'),
        fetch('/api/penginapan'),
        fetch('/api/oleh_oleh'),
        fetch('/api/desa_wisata'),
        fetch('/api/biro_perjalanan')
      ]);

      // Check if all responses are ok
      const responses = [eventsResponse, destinationsResponse, culinaryResponse, accommodationResponse, souvenirsResponse, villagesResponse, travelAgenciesResponse];
      const failedResponses = responses.filter(response => !response.ok);
      
      if (failedResponses.length > 0) {
        console.warn('Some API responses failed:', failedResponses.map(r => ({ status: r.status, statusText: r.statusText })));
      }

      // Parse all responses with error handling
      const parseResponse = async (response, apiName) => {
        try {
          if (!response.ok) {
            console.warn(`${apiName} API failed with status:`, response.status);
            return { success: false, data: [] };
          }
          const data = await response.json();
          return data;
        } catch (error) {
          console.error(`Error parsing ${apiName} response:`, error);
          return { success: false, data: [] };
        }
      };

      const eventsData = await parseResponse(eventsResponse, 'Events');
      const destinationsData = await parseResponse(destinationsResponse, 'Destinations');
      const culinaryData = await parseResponse(culinaryResponse, 'Culinary');
      const accommodationData = await parseResponse(accommodationResponse, 'Accommodation');
      const souvenirsData = await parseResponse(souvenirsResponse, 'Souvenirs');
      const villagesData = await parseResponse(villagesResponse, 'Villages');
      const travelAgenciesData = await parseResponse(travelAgenciesResponse, 'Travel Agencies');

      // Extract data arrays, handle potential errors gracefully
      const events = eventsData.success ? (eventsData.events || []) : [];
      const destinations = destinationsData.success ? (destinationsData.wisata || []) : [];
      const culinary = culinaryData.success ? (culinaryData.kuliner || []) : [];
      const accommodations = accommodationData.success ? (accommodationData.penginapan || []) : [];
      const souvenirs = souvenirsData.success ? (souvenirsData.oleh_oleh || []) : [];
      const villages = villagesData.success ? (villagesData.desa_wisata || []) : [];
      const travelAgencies = travelAgenciesData.success ? (travelAgenciesData.biro_perjalanan || []) : [];

      // Log any failed API calls for debugging
      if (!eventsData.success) console.warn('Events API failed:', eventsData);
      if (!destinationsData.success) console.warn('Destinations API failed:', destinationsData);
      if (!culinaryData.success) console.warn('Culinary API failed:', culinaryData);
      if (!accommodationData.success) console.warn('Accommodation API failed:', accommodationData);
      if (!souvenirsData.success) console.warn('Souvenirs API failed:', souvenirsData);
      if (!villagesData.success) console.warn('Villages API failed:', villagesData);
      if (!travelAgenciesData.success) console.warn('Travel Agencies API failed:', travelAgenciesData);

      // Log data counts for debugging
      console.log('Data counts:', {
        events: events.length,
        destinations: destinations.length,
        culinary: culinary.length,
        accommodations: accommodations.length,
        souvenirs: souvenirs.length,
        villages: villages.length,
        travelAgencies: travelAgencies.length
      });

      // Combine all data with category information
      const allData = [];
      const seenIds = new Set();
      
      // Add events with category info
      events.forEach(event => {
        if (!event.id) {
          console.warn('Event missing ID:', event);
          return;
        }
        const uniqueId = `events-${event.id}`;
        if (!seenIds.has(uniqueId)) {
          seenIds.add(uniqueId);
          allData.push({
            ...event,
            category: 'Event',
            categoryIcon: '🎉',
            source: 'events',
            type: event.type || 'event',
            uniqueId: uniqueId
          });
        }
      });
      
      // Add destinations with category info
      destinations.forEach(dest => {
        if (!dest.id) {
          console.warn('Destination missing ID:', dest);
          return;
        }
        const uniqueId = `destinations-${dest.id}`;
        if (!seenIds.has(uniqueId)) {
          seenIds.add(uniqueId);
          allData.push({
            ...dest,
            category: 'Objek Wisata',
            categoryIcon: '🏔️',
            source: 'destinations',
            type: dest.type || 'objek-wisata',
            uniqueId: uniqueId
          });
        }
      });
      
      // Add culinary with category info
      culinary.forEach(cul => {
        if (!cul.id) {
          console.warn('Culinary missing ID:', cul);
          return;
        }
        const uniqueId = `culinary-${cul.id}`;
        if (!seenIds.has(uniqueId)) {
          seenIds.add(uniqueId);
          allData.push({
            ...cul,
            category: 'Kuliner',
            categoryIcon: '🍽️',
            source: 'culinary',
            type: 'kuliner',
            uniqueId: uniqueId
          });
        }
      });
      
      // Add accommodations with category info
      accommodations.forEach(acc => {
        if (!acc.id) {
          console.warn('Accommodation missing ID:', acc);
          return;
        }
        const uniqueId = `accommodation-${acc.id}`;
        if (!seenIds.has(uniqueId)) {
          seenIds.add(uniqueId);
          allData.push({
            ...acc,
            category: 'Penginapan',
            categoryIcon: '🏨',
            source: 'accommodation',
            type: 'penginapan',
            uniqueId: uniqueId
          });
        }
      });
      
      // Add souvenirs with category info
      souvenirs.forEach(sou => {
        if (!sou.id) {
          console.warn('Souvenir missing ID:', sou);
          return;
        }
        const uniqueId = `souvenirs-${sou.id}`;
        if (!seenIds.has(uniqueId)) {
          seenIds.add(uniqueId);
          allData.push({
            ...sou,
            category: 'Oleh-oleh',
            categoryIcon: '🛍️',
            source: 'souvenirs',
            type: 'oleh-oleh',
            uniqueId: uniqueId
          });
        }
      });
      
      // Add villages with category info
      villages.forEach(vill => {
        if (!vill.id) {
          console.warn('Village missing ID:', vill);
          return;
        }
        const uniqueId = `villages-${vill.id}`;
        if (!seenIds.has(uniqueId)) {
          seenIds.add(uniqueId);
          allData.push({
            ...vill,
            category: 'Desa Wisata',
            categoryIcon: '🏘️',
            source: 'villages',
            type: 'desa-wisata',
            uniqueId: uniqueId
          });
        }
      });
      
      // Add travel agencies with category info
      travelAgencies.forEach(ta => {
        if (!ta.id) {
          console.warn('Travel Agency missing ID:', ta);
          return;
        }
        const uniqueId = `travel-agencies-${ta.id}`;
        if (!seenIds.has(uniqueId)) {
          seenIds.add(uniqueId);
          allData.push({
            ...ta,
            category: 'Biro Perjalanan',
            categoryIcon: '🚌',
            source: 'travel-agencies',
            type: 'biro-perjalanan',
            uniqueId: uniqueId
          });
        }
      });

      // Sort all data by creation date (if available) or use current date
      // Events with actual dates get priority, then other items
      const sortedAllData = allData.sort((a, b) => {
        const dateA = getEventCreatedAt(a);
        const dateB = getEventCreatedAt(b);
        
        // If both are events with dates, sort by date
        if (dateA && dateB && a.category === 'Event' && b.category === 'Event') {
          return new Date(dateB) - new Date(dateA);
        }
        
        // If only one is an event with date, prioritize it
        if (dateA && a.category === 'Event' && (!dateB || b.category !== 'Event')) {
          return -1;
        }
        if (dateB && b.category === 'Event' && (!dateA || a.category !== 'Event')) {
          return 1;
        }
        
        // For other items, use fallback sorting
        const fallbackDateA = dateA ? new Date(dateA) : new Date();
        const fallbackDateB = dateB ? new Date(dateB) : new Date();
        return fallbackDateB - fallbackDateA;
      });
      
      console.log('Final combined data count:', sortedAllData.length);
      console.log('Sample items:', sortedAllData.slice(0, 3));
      
      setData(sortedAllData);
      setFilteredData(sortedAllData);
      calculateStats(sortedAllData);
      
      // Show success notification
      setNotification({ 
        show: true, 
        message: `Berhasil memuat ${sortedAllData.length} data dari semua kategori!`, 
        type: 'success' 
      });
      
      // Auto hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '', type: 'success' });
      }, 3000);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Gagal memuat data: ' + error.message);
      setNotification({ 
        show: true, 
        message: 'Gagal memuat data: ' + error.message, 
        type: 'error' 
      });
      setTimeout(() => {
        setNotification({ show: false, message: '', type: 'error' });
      }, 5000);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Helper function to get creation date
  const getEventCreatedAt = (event) => {
    if (!event) return null;
    const candidate =
      event.createdAt ||
      event.created_at ||
      event.addedAt ||
      event.added_at ||
      event.dateAdded ||
      event.date_added ||
      event.timestamp ||
      event.ts;
    return candidate || event.date || null;
  };

  // Cleanup body overflow when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const calculateStats = (data) => {
    const byCategory = {};
    const byMonth = {};

    data.forEach((item) => {
      // Use the category field that we added during data combination
      const categoryKey = item.category || item.type || 'unknown';
      byCategory[categoryKey] = (byCategory[categoryKey] || 0) + 1;

      // Get date from various possible fields (only meaningful for events)
      const date = getEventCreatedAt(item);
      if (date && item.category === 'Event') {
        const dateObj = new Date(date);
        if (!isNaN(dateObj.getTime())) {
          const month = dateObj.toLocaleString('id-ID', { month: 'long' });
          byMonth[month] = (byMonth[month] || 0) + 1;
        }
      }
    });

    setStats({
      total: data.length,
      byCategory,
      byMonth,
      recent: data.filter((item) => {
        // Only count events with actual dates for recent calculation
        if (item.category !== 'Event') return false;
        
        const itemDate = getEventCreatedAt(item);
        if (!itemDate) return false;
        
        const date = new Date(itemDate);
        if (isNaN(date.getTime())) return false;
        
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30;
      }).length,
    });
  };

  // Filter dan search data
  useEffect(() => {
    let filtered = data;

    // Filter berdasarkan kategori
    if (selectedCategory !== 'semua') {
      if (selectedCategory === 'objek-wisata') {
        filtered = filtered.filter(item => item.category === 'Objek Wisata');
      } else {
        filtered = filtered.filter(item => item.category === getCategoryLabel(selectedCategory));
      }
    }

    // Filter berdasarkan search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        (item.title || item.name || '')?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.location || '')?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description || '')?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.short_description || '')?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [data, selectedCategory, searchTerm]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Handle actions
  const handleView = (id) => {
    // Navigate to detail page based on item source
    const item = data.find(item => item.id === id);
    if (!item) return;

    // Determine the correct route based on item source
    let route = '';
    switch (item.source) {
      case 'destinations':
        route = `/admin/destinations/${id}/view`;
        break;
      case 'culinary':
        route = `/admin/culinary/${id}/view`;
        break;
      case 'accommodation':
        route = `/admin/accommodation/${id}`;
        break;
      case 'souvenirs':
        route = `/admin/souvenirs/${id}`;
        break;
      case 'villages':
        route = `/admin/villages/${id}`;
        break;
      case 'travel-agencies':
        route = `/admin/travel-agencies/${id}`;
        break;
      case 'events':
        route = `/admin/events/${id}`;
        break;
      default:
        route = `/admin/events/${id}`;
    }
    
    router.push(route);
  };

  const handleEdit = (id) => {
    // Navigate to edit page based on item source
    const item = data.find(item => item.id === id);
    if (!item) return;

    // Determine the correct route based on item source
    let route = '';
    switch (item.source) {
      case 'destinations':
        route = `/admin/destinations/${id}`;
        break;
      case 'culinary':
        route = `/admin/culinary/${id}`;
        break;
      case 'accommodation':
        route = `/admin/accommodation/${id}`;
        break;
      case 'souvenirs':
        route = `/admin/souvenirs/${id}`;
        break;
      case 'villages':
        route = `/admin/villages/${id}`;
        break;
      case 'travel-agencies':
        route = `/admin/travel-agencies/${id}`;
        break;
      case 'events':
        route = `/admin/events/${id}`;
        break;
      default:
        route = `/admin/events/${id}`;
    }
    
    router.push(route);
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.')) {
      return;
    }

    setDeleteLoading(id);
    
    try {
      const item = data.find(item => item.id === id);
      if (!item) {
        throw new Error('Item tidak ditemukan');
      }

      // Determine the correct API endpoint based on item source
      let apiEndpoint = '';
      switch (item.source) {
        case 'destinations':
          apiEndpoint = `/api/destinations/${id}`;
          break;
        case 'culinary':
          apiEndpoint = `/api/kuliner/${id}`;
          break;
        case 'accommodation':
          apiEndpoint = `/api/penginapan/${id}`;
          break;
        case 'souvenirs':
          apiEndpoint = `/api/oleh_oleh/${id}`;
          break;
        case 'villages':
          apiEndpoint = `/api/desa_wisata/${id}`;
          break;
        case 'travel-agencies':
          apiEndpoint = `/api/biro_perjalanan/${id}`;
          break;
        case 'events':
          apiEndpoint = `/api/events/${id}`;
          break;
        default:
          apiEndpoint = `/api/events/${id}`;
      }

      const response = await fetch(apiEndpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus data');
      }

      // Remove item from local state
      const updatedData = data.filter(item => item.id !== id);
      setData(updatedData);
      
      // Show success message
      setNotification({ show: true, message: 'Data berhasil dihapus!', type: 'success' });
      
      // Auto hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '', type: 'success' });
      }, 3000);
      
    } catch (error) {
      console.error('Error deleting item:', error);
      setNotification({ show: true, message: 'Gagal menghapus data: ' + error.message, type: 'error' });
      
      // Auto hide notification after 5 seconds for errors
      setTimeout(() => {
        setNotification({ show: false, message: '', type: 'error' });
      }, 5000);
    } finally {
      setDeleteLoading(null);
    }
  };

  // Add-data now handled as dedicated page

  const handleExport = () => {
    setExportLoading(true);
    try {
      // Determine which data to export
      const dataToExport = exportType === 'all' ? data : filteredData;
      
      // Check if there's data to export
      if (!dataToExport || dataToExport.length === 0) {
        setNotification({ show: true, message: 'Tidak ada data untuk diexport', type: 'error' });
        setTimeout(() => {
          setNotification({ show: false, message: '', type: 'error' });
        }, 3000);
        return;
      }

      // Helper function to escape CSV values
      const escapeCSV = (value) => {
        if (value === null || value === undefined) return '""';
        const stringValue = String(value);
        // Escape quotes and wrap in quotes if contains comma, newline, or quote
        const escaped = stringValue.replace(/"/g, '""');
        if (escaped.includes(',') || escaped.includes('\n') || escaped.includes('"')) {
          return `"${escaped}"`;
        }
        return escaped;
      };

      // Create CSV content with BOM for proper UTF-8 encoding
      const showDateColumn = selectedCategory === 'semua' || selectedCategory === 'event';
      const headers = showDateColumn 
        ? ['ID', 'Nama', 'Lokasi', 'Kategori', 'Tipe', 'Tanggal', 'Deskripsi', 'Gambar']
        : ['ID', 'Nama', 'Lokasi', 'Kategori', 'Tipe', 'Deskripsi', 'Gambar'];
      
      const csvRows = [
        headers.join(','),
        ...dataToExport.map(item => {
          const baseRow = [
            escapeCSV(item.id || 'N/A'),
            escapeCSV(item.title || item.name || ''),
            escapeCSV(item.location || 'Lokasi tidak tersedia'),
            escapeCSV(item.category || getCategoryLabel(item.type)),
            escapeCSV(getTypeLabel(item.type))
          ];
          
          if (showDateColumn) {
            const date = getEventCreatedAt(item);
            const formattedDate = item.category === 'Event' 
              ? (date ? new Date(date).toLocaleDateString('id-ID') : 'Tidak ada tanggal')
              : '-';
            baseRow.push(escapeCSV(formattedDate));
          }
          
          baseRow.push(
            escapeCSV(item.description || item.short_description || 'Tidak ada deskripsi'),
            escapeCSV(item.img_sm || item.img_lg || 'Tidak ada gambar')
          );
          
          return baseRow.join(',');
        })
      ];

      // Add BOM for proper UTF-8 encoding
      const BOM = '\uFEFF';
      const csvContent = BOM + csvRows.join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { 
        type: 'text/csv;charset=utf-8;' 
      });
      
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
      const filename = `data-wisata-${timestamp}.csv`;
      
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      URL.revokeObjectURL(url);

      // Show success notification
      setNotification({ 
        show: true, 
        message: `Data berhasil diexport! (${dataToExport.length} item)`, 
        type: 'success' 
      });
      setTimeout(() => {
        setNotification({ show: false, message: '', type: 'success' });
      }, 3000);
      
    } catch (error) {
      console.error('Error exporting data:', error);
      setNotification({ 
        show: true, 
        message: 'Gagal mengexport data: ' + error.message, 
        type: 'error' 
      });
      setTimeout(() => {
        setNotification({ show: false, message: '', type: 'error' });
      }, 5000);
    } finally {
      setExportLoading(false);
    }
  };

  const getCategoryLabel = (type) => {
    // For the new unified structure, we can use the category field directly
    if (type === 'objek-wisata') {
      return 'Objek Wisata';
    }
    const category = categories.find(cat => cat.value === type);
    return category ? category.label : type;
  };

  const getCategoryIcon = (type) => {
    // For the new unified structure, we can use the categoryIcon field directly
    if (type === 'objek-wisata') {
      return '🏔️';
    }
    const category = categories.find(cat => cat.value === type);
    return category ? category.icon : '📍';
  };

  const getTypeLabel = (type) => {
    if (!type) return '-';
    
    // For the new unified structure, we can provide more specific labels
    const map = {
      'wisata-alam': 'Wisata Alam',
      'wisata-taman': 'Wisata Taman',
      'wisata-budaya': 'Wisata Budaya',
      'wisata-sejarah': 'Wisata Sejarah',
      'wisata-buatan': 'Wisata Buatan',
      'wisata-minat-khusus': 'Wisata Minat Khusus',
      'wisata-religi': 'Wisata Religi',
      'objek-wisata': 'Objek Wisata',
      'kuliner': 'Kuliner',
      'penginapan': 'Penginapan',
      'oleh-oleh': 'Oleh-oleh',
      'desa-wisata': 'Desa Wisata',
      'biro-perjalanan': 'Biro Perjalanan',
      'event': 'Event',
      'events': 'Event'
    };
    return map[type] || type;
  };

  const getSubCategory = (type) => {
    // Logic untuk menentukan sub kategori berdasarkan type
    const subCategories = {
      'wisata-alam': 'Wisata Alam',
      'wisata-taman': 'Wisata Taman',
      'wisata-budaya': 'Wisata Budaya',
      'wisata-sejarah': 'Wisata Sejarah',
      'wisata-buatan': 'Wisata Buatan',
      'wisata-minat-khusus': 'Wisata Minat Khusus',
      'wisata-religi': 'Wisata Religi',
      'objek-wisata': 'Objek Wisata',
      'kuliner': 'Restoran & Cafe',
      'penginapan': 'Hotel & Guesthouse',
      'oleh-oleh': 'Toko Oleh-oleh',
      'desa-wisata': 'Wisata Budaya',
      'biro-perjalanan': 'Travel Agent',
      'event': 'Event & Festival',
      'events': 'Event & Festival',
      'default': 'Lainnya'
    };
    return subCategories[type] || subCategories.default;
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Notification */}
        {notification.show && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
            notification.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {notification.type === 'success' ? '✅' : '❌'}
              </span>
              <span>{notification.message}</span>
              <button
                onClick={() => setNotification({ show: false, message: '', type: 'success' })}
                className="ml-2 hover:opacity-75"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <span className="text-red-500 text-lg">❌</span>
              <div className="flex-1">
                <h3 className="text-red-800 font-medium">Error</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          </div>
        )}
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Data Management</h1>
            <p className="text-gray-600 mt-1">Kelola semua data wisata dan event</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title={viewMode === 'table' ? 'Switch to Grid View' : 'Switch to Table View'}
            >
              <span className="text-xl text-gray-700">👁</span>
            </button>
            <button
              onClick={() => {
                setLoading(true);
                setError(null);
                fetchData();
              }}
              disabled={loading}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <span>🔄</span>
              )}
              {loading ? 'Memuat...' : 'Refresh Data'}
            </button>
            <button
              onClick={() => router.push('/admin/data/new')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <Plus size={20} />
              + Tambah Data
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Data</p>
                <p className="text-3xl font-bold">{stats.total}</p>
                <p className="text-blue-100 text-xs">Semua kategori</p>
              </div>
              <div className="text-3xl">📊</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Event Baru</p>
                <p className="text-3xl font-bold">{stats.recent}</p>
                <p className="text-blue-100 text-xs">Event 30 hari terakhir</p>
              </div>
              <div className="text-3xl">🎉</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Kategori</p>
                <p className="text-3xl font-bold">{Object.keys(stats.byCategory).length}</p>
                <p className="text-purple-100 text-xs">Jenis berbeda</p>
              </div>
              <div className="text-3xl">🏷️</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Filtered</p>
                <p className="text-3xl font-bold">{filteredData.length}</p>
                <p className="text-orange-100 text-xs">Hasil pencarian</p>
              </div>
              <div className="text-3xl">🔍</div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <PieChart size={20} />
              Distribusi Kategori
            </h3>
            <div className="space-y-3">
              {Object.entries(stats.byCategory).map(([category, count]) => (
                <div key={`category-${category}`} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getCategoryIcon(category) || '📍'}</span>
                    <span className="text-gray-700">{category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(count / stats.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Trend */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp size={20} />
              Trend Event Bulanan
            </h3>
            <div className="space-y-3">
              {Object.keys(stats.byMonth).length > 0 ? (
                Object.entries(stats.byMonth).map(([month, count]) => (
                  <div key={`month-${month}`} className="flex items-center justify-between">
                    <span className="text-gray-700 capitalize">{month}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(count / Math.max(...Object.values(stats.byMonth))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">Hanya event yang memiliki tanggal yang ditampilkan</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-lg border p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari semua data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

              {/* Category Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-800 min-w-[220px] cursor-pointer transition-all duration-300 ease-in-out hover:border-blue-300 hover:shadow-lg transform hover:scale-[1.02] font-medium focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400"
              >
                <div className="flex items-center gap-3">
                  <Filter className="text-gray-400" size={20} />
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{getCategoryIcon(selectedCategory)}</span>
                    <span>{getCategoryLabel(selectedCategory)}</span>
                  </span>
                </div>
                <svg 
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ml-4 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              <div 
                className={`absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden min-w-[280px] transition-all duration-200 ease-out ${
                  isDropdownOpen 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}
              >
                <div className="py-2 max-h-80 overflow-y-auto">
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => {
                        setSelectedCategory(category.value);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-200 flex items-center gap-3 ${
                        selectedCategory === category.value 
                          ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-500' 
                          : 'text-gray-700 hover:text-gray-900'
                      }`}
                    >
                      <span className="text-xl">{category.icon}</span>
                      <span className="font-medium text-sm flex-1">{category.label}</span>
                      {selectedCategory === category.value && (
                        <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Backdrop */}
              <div 
                className={`fixed inset-0 z-40 transition-opacity duration-300 ${
                  isDropdownOpen 
                    ? 'opacity-100 pointer-events-auto' 
                    : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsDropdownOpen(false)}
              />
            </div>

                         {/* Export Options */}
             <div className="flex items-center gap-2">
               <select
                 value={exportType}
                 onChange={(e) => setExportType(e.target.value)}
                 className="px-3 py-3 border border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                 disabled={exportLoading}
               >
                 <option value="filtered">Export Filtered ({filteredData.length})</option>
                 <option value="all">Export All ({data.length})</option>
               </select>
               
               {/* Export Button */}
               <button
                 onClick={handleExport}
                 disabled={exportLoading}
                 className={`px-6 py-3 rounded-xl transition-all duration-300 transform shadow-lg flex items-center gap-2 ${
                   exportLoading
                     ? 'bg-gray-400 cursor-not-allowed'
                     : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-105 text-white'
                 }`}
               >
                 {exportLoading ? (
                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                 ) : (
                   <Download size={20} />
                 )}
                 {exportLoading ? 'Mengexport...' : 'Export'}
               </button>
             </div>
          </div>
        </div>

        {/* Data Display */}
        {viewMode === 'table' ? (
          /* Table View */
          <div className="bg-white rounded-xl shadow-lg border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Data Wisata</h2>
              <p className="text-sm text-gray-500 mt-1">
                Menampilkan {filteredData.length} dari {data.length} data
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NO</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAMA</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LOKASI</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KATEGORI</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TIPE</th>
                    {(selectedCategory === 'semua' || selectedCategory === 'event') && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TANGGAL</th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AKSI</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((item, index) => (
                    <tr key={`${item.source}-${item.id}`} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                        #{item.id || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="h-12 w-12 rounded-lg object-cover mr-3 shadow-sm"
                            src={item.img_sm || item.img_lg || '/pattern_bg.png'}
                            alt={item.title || 'Image'}
                            onError={(e) => {
                              e.target.src = '/pattern_bg.png';
                            }}
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.title || item.name || 'Tidak ada judul'}</div>
                            <div className="text-sm text-gray-500">{item.short_description?.substring(0, 50) || item.description?.substring(0, 50) || 'Tidak ada deskripsi'}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <span>📍</span>
                          <span>{item.location || 'Lokasi tidak tersedia'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <span className="mr-1">{item.categoryIcon || getCategoryIcon(item.type)}</span>
                          {item.category || getCategoryLabel(item.type)}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          Sumber: {item.source || 'unknown'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getTypeLabel(item.type)}
                      </td>
                      {(selectedCategory === 'semua' || selectedCategory === 'event') && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.category === 'Event' ? (
                            (() => {
                              const date = getEventCreatedAt(item);
                              return date ? new Date(date).toLocaleDateString('id-ID') : 'Tidak ada tanggal';
                            })()
                          ) : (
                            '-'
                          )}
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleView(item.id)}
                            className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                            title="Lihat Detail"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(item.id)}
                            className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={deleteLoading === item.id}
                            className={`p-2 rounded-lg transition-colors ${
                              deleteLoading === item.id
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-red-600 hover:text-red-900 hover:bg-red-50'
                            }`}
                            title="Hapus"
                          >
                            {deleteLoading === item.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t bg-gray-50">
                <div className="flex items-center justify-between">
                                     <div className="text-sm text-black">
                     Menampilkan {indexOfFirstItem + 1} sampai {Math.min(indexOfLastItem, filteredData.length)} dari {filteredData.length} hasil
                   </div>
                   <div className="flex items-center gap-2">
                     <button
                       onClick={() => setCurrentPage(currentPage - 1)}
                       disabled={currentPage === 1}
                       className="px-3 py-2 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors text-black"
                     >
                       ← Sebelumnya
                     </button>
                     
                     {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                       <button
                         key={`page-${page}`}
                         onClick={() => setCurrentPage(page)}
                         className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                           currentPage === page
                             ? 'bg-blue-600 text-white border-blue-600'
                             : 'hover:bg-gray-100 text-black'
                         }`}
                       >
                         {page}
                       </button>
                     ))}
                     
                     <button
                       onClick={() => setCurrentPage(currentPage + 1)}
                       disabled={currentPage === totalPages}
                       className="px-3 py-2 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors text-black"
                     >
                       Selanjutnya →
                     </button>
                   </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((item) => (
              <div key={`${item.source}-${item.id}`} className="bg-white rounded-xl shadow-lg border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <img
                  className="w-full h-48 object-cover rounded-t-xl"
                  src={item.img_sm || item.img_lg || '/pattern_bg.png'}
                  alt={item.title || 'Image'}
                  onError={(e) => {
                    e.target.src = '/pattern_bg.png';
                  }}
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <span className="mr-1">{item.categoryIcon || getCategoryIcon(item.type)}</span>
                      {item.category || getCategoryLabel(item.type)}
                    </span>
                    <span className="text-xs text-gray-500">#{item.id || 'N/A'}</span>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-2">
                    Sumber: {item.source || 'unknown'}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title || item.name || 'Tidak ada judul'}</h3>
                  <p className="text-sm text-gray-600 mb-3">{item.short_description?.substring(0, 80) || item.description?.substring(0, 80) || 'Tidak ada deskripsi'}...</p>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span className="mr-2">📍</span>
                    <span>{item.location || 'Lokasi tidak tersedia'}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {(selectedCategory === 'semua' || selectedCategory === 'event') && (
                      <span className="text-sm text-gray-500">
                        {item.category === 'Event' ? (
                          (() => {
                            const date = getEventCreatedAt(item);
                            return date ? new Date(date).toLocaleDateString('id-ID') : 'Tidak ada tanggal';
                          })()
                        ) : (
                          '-'
                        )}
                      </span>
                    )}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(item.id)}
                        className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deleteLoading === item.id}
                        className={`p-2 rounded-lg transition-colors ${
                          deleteLoading === item.id
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-red-600 hover:text-red-900 hover:bg-red-50'
                        }`}
                        title="Hapus"
                      >
                        {deleteLoading === item.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada data ditemukan</h3>
            <p className="text-gray-600 mb-6">
              Coba ubah filter atau kata kunci pencarian Anda
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('semua');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Reset Filter
            </button>
          </div>
        )}

        {/* Add-data selection is now a dedicated page at `/admin/data/new` */}
      </div>
    </ProtectedRoute>
  );
}
