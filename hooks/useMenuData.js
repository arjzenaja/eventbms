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
        // Don't use fallback data - show empty state instead
        setMenus([]);
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
