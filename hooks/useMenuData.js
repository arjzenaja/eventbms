import { useState, useEffect } from 'react';

const useMenuData = (destinationId, destinationSlug) => {
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (destinationId) params.append('destinationId', destinationId);
        if (destinationSlug) params.append('slug', destinationSlug);

        const response = await fetch(`/api/kuliner/menu?${params}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch menu data');
        }

        const data = await response.json();
        
        if (data.success) {
          setMenus(data.menus || []);
          setCategories(data.categories || []);
          setPriceRange(data.priceRange || { min: 0, max: 0 });
        } else {
          throw new Error(data.error || 'Failed to fetch menu data');
        }
      } catch (err) {
        console.error('Error fetching menu data:', err);
        setError(err.message);
        // Fallback to default menu data
        setMenus([
          {
            id: 1,
            name: "Nasi Goreng Spesial",
            description: "Nasi goreng dengan telur, ayam, dan sayuran segar khas Banyumas",
            price: 25000,
            image: "/placeholder.jpg",
            rating: 4.8,
            cookingTime: "10-15 menit",
            isPopular: true,
            isSpicy: false,
            category: "Nasi",
            additionalInfo: ["Halal", "Fresh"]
          },
          {
            id: 2,
            name: "Sate Banyumas",
            description: "Sate ayam dengan bumbu kacang khas Banyumas yang lezat",
            price: 35000,
            image: "/placeholder.jpg",
            rating: 4.9,
            cookingTime: "15-20 menit",
            isPopular: true,
            isSpicy: true,
            category: "Sate",
            additionalInfo: ["Halal", "Signature"]
          },
          {
            id: 3,
            name: "Soto Sokaraja",
            description: "Soto ayam dengan kuah bening dan pelengkap lengkap",
            price: 28000,
            image: "/placeholder.jpg",
            rating: 4.7,
            cookingTime: "12-18 menit",
            isPopular: false,
            isSpicy: false,
            category: "Soto",
            additionalInfo: ["Halal", "Traditional"]
          },
          {
            id: 4,
            name: "Es Cendol Banyumas",
            description: "Es cendol dengan santan dan gula merah khas Banyumas",
            price: 8000,
            image: "/placeholder.jpg",
            rating: 4.8,
            cookingTime: "5-8 menit",
            isPopular: true,
            isSpicy: false,
            category: "Minuman",
            additionalInfo: ["Halal", "Dessert"]
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuData();
  }, [destinationId, destinationSlug]);

  const submitOrder = async (orderData) => {
    try {
      const response = await fetch('/api/kuliner/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destinationId,
          menuId: orderData.menu.id,
          quantity: orderData.quantity,
          specialInstructions: orderData.specialInstructions
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit order');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error submitting order:', error);
      throw error;
    }
  };

  return {
    menus,
    isLoading,
    error,
    categories,
    priceRange,
    submitOrder,
    refetch: () => {
      setIsLoading(true);
      setError(null);
      // Trigger refetch by changing dependency
      setMenus([]);
    }
  };
};

export default useMenuData;
