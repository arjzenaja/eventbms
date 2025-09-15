'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CulinaryCartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(
        item => item.menuId === action.payload.menuId && 
        item.drinkType === action.payload.drinkType &&
        item.selectedFlavor === action.payload.selectedFlavor
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.menuId === action.payload.menuId && 
            item.drinkType === action.payload.drinkType &&
            item.selectedFlavor === action.payload.selectedFlavor
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      }

      return {
        ...state,
        items: [...state.items, action.payload]
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };

    case 'SET_DESTINATION':
      return {
        ...state,
        destination: action.payload
      };

    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items || [],
        destination: action.payload.destination || null
      };

    default:
      return state;
  }
};

export const CulinaryCartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    destination: null
  });

  // Calculate totals
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('culinaryCart', JSON.stringify(state));
  }, [state]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('culinaryCart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      dispatch({ type: 'SET_CART', payload: parsedCart });
    }
  }, []);

  const addToCart = (menu, quantity, drinkType = null, selectedFlavor = null, specialInstructions = '') => {
    const cartItem = {
      id: `${menu.id}-${drinkType || 'default'}-${selectedFlavor || 'default'}-${Date.now()}`,
      menuId: menu.id,
      menuName: menu.name,
      menuImage: menu.image,
      price: drinkType === 'iced' ? menu.priceIced : drinkType === 'hot' ? menu.priceHot : menu.price,
      quantity,
      drinkType,
      selectedFlavor,
      specialInstructions,
      category: menu.category,
      cookingTime: menu.cookingTime
    };

    dispatch({ type: 'ADD_TO_CART', payload: cartItem });
  };

  const removeFromCart = (itemId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const setDestination = (destination) => {
    dispatch({ type: 'SET_DESTINATION', payload: destination });
  };

  return (
    <CulinaryCartContext.Provider
      value={{
        ...state,
        totalItems,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        setDestination
      }}
    >
      {children}
    </CulinaryCartContext.Provider>
  );
};

export const useCulinaryCart = () => {
  const context = useContext(CulinaryCartContext);
  if (!context) {
    throw new Error('useCulinaryCart must be used within a CulinaryCartProvider');
  }
  return context;
};
