"use client";

import React, { useState, useEffect } from 'react';
import { useNotifications } from './NotificationProvider';

const LoadingNotification = ({ 
  isLoading, 
  message = "Memuat konten...", 
  successMessage = "Konten berhasil dimuat!",
  onComplete 
}) => {
  const { addNotification, removeNotification } = useNotifications();
  const [notificationId, setNotificationId] = useState(null);

  useEffect(() => {
    if (isLoading) {
      // Show loading notification
      const id = addNotification({
        type: 'info',
        title: 'Memuat...',
        message: message,
        autoClose: false, // Don't auto close loading notifications
        position: 'top-right'
      });
      setNotificationId(id);
    } else if (notificationId && !isLoading) {
      // Remove loading notification and show success
      removeNotification(notificationId);
      
      // Show success notification
      addNotification({
        type: 'success',
        title: 'Berhasil!',
        message: successMessage,
        autoClose: true,
        autoCloseDelay: 2000,
        position: 'top-right'
      });
      
      setNotificationId(null);
      onComplete?.();
    }
  }, [isLoading, message, successMessage, notificationId, addNotification, removeNotification, onComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (notificationId) {
        removeNotification(notificationId);
      }
    };
  }, [notificationId, removeNotification]);

  return null; // This component doesn't render anything
};

export default LoadingNotification;
