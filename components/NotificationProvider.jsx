'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { SimpleToast } from './ui/SimpleToast';
import { getValidFlashToast } from '@/lib/utils';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  // Add notification
  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'success',
      autoClose: true,
      autoCloseDelay: 3000,
      position: 'top-right',
      ...notification
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto remove after delay
    if (newNotification.autoClose) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.autoCloseDelay);
    }
    
    return id;
  };

  // Remove notification
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
  };

  // Listen for localStorage changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'flashToast' && e.newValue) {
        try {
          const flashData = JSON.parse(e.newValue);
          if (flashData && flashData.title && flashData.message) {
            addNotification({
              type: flashData.type || 'success',
              title: flashData.title,
              message: flashData.message
            });
            
            // Clear from localStorage
            localStorage.removeItem('flashToast');
          }
        } catch (error) {
          console.warn('Error parsing flash toast:', error);
        }
      }
    };

    // Check for existing flash toast on mount
    const existingFlash = getValidFlashToast();
    if (existingFlash) {
      addNotification({
        type: existingFlash.type || 'success',
        title: existingFlash.title,
        message: existingFlash.message
      });
      localStorage.removeItem('flashToast');
    }

    // Listen for storage events
    window.addEventListener('storage', handleStorageChange);

    // Also check periodically for same-tab changes
    const interval = setInterval(() => {
      const flashData = getValidFlashToast();
      if (flashData) {
        addNotification({
          type: flashData.type || 'success',
          title: flashData.title,
          message: flashData.message
        });
        localStorage.removeItem('flashToast');
      }
    }, 100);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const value = {
    addNotification,
    removeNotification,
    clearAll,
    notifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Render notifications */}
      {notifications.map((notification) => (
        <SimpleToast
          key={notification.id}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          show={true}
          onClose={() => removeNotification(notification.id)}
          autoClose={notification.autoClose}
          autoCloseDelay={notification.autoCloseDelay}
          position={notification.position}
        />
      ))}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}
