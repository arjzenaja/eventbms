import { useState, useEffect } from 'react';

// Hook untuk mengambil dan mengelola data oleh-oleh
const useSouvenirData = (destinationId, destinationSlug) => {
  const [souvenirs, setSouvenirs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSouvenirs = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Ambil data dari api/souvenirs/packages
        const response = await fetch(`/api/souvenirs/packages`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Cek apakah response adalah JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response bukan JSON, kemungkinan halaman HTML');
        }
        
        // Parse data JSON
        const data = await response.json();
        const list = data.packages || data.oleh_oleh || data.destinations || data.souvenirs || [];

        // Jika kosong, jangan lempar error. Tetap tampilkan state kosong di UI.
        if (!Array.isArray(list) || list.length === 0) {
          setSouvenirs([]);
          return;
        }

        // Ubah format data agar cocok dengan komponen UI
        let normalized = list.map((item, index) => ({
          id: item.id || index + 1,
          name: item.name || item.title || 'Oleh-oleh',
          description: item.description || item.short_description || '',
          price: item.price || 0,
          image: item.image || item.img_sm || item.img_lg || '/placeholder.jpg',
          rating: item.rating ? Number(item.rating) : undefined,
          isPopular: Boolean(item.recommended || item.available),
          isSpicy: false,
          category: item.category || item.type || 'Souvenir',
          additionalInfo: item.features || [],
          raw: item,
        }));

        // Filter by specific destination/store if provided
        if (destinationId) {
          const targetId = String(destinationId);
          normalized = normalized.filter(n => {
            const raw = n.raw || {};
            return String(raw.souvenirId || raw.destinationId || '') === targetId;
          });
        }

        setSouvenirs(normalized);
        
      } catch (err) {
        console.error('Error mengambil data oleh-oleh:', err);
        setError(err.message);
        setSouvenirs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSouvenirs();
  }, [destinationId, destinationSlug]);

  return { souvenirs, isLoading, error };
};

export default useSouvenirData;
