import { useState, useCallback } from 'react';

export const useAlert = () => {
  const [alert, setAlert] = useState({
    show: false,
    type: 'info',
    title: '',
    message: '',
    autoClose: false,
    autoCloseDelay: 2000,
  });

  const showAlert = useCallback(({ type = 'info', title, message, autoClose = false, autoCloseDelay = 2000 }) => {
    setAlert({
      show: true,
      type,
      title,
      message,
      autoClose,
      autoCloseDelay,
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert(prev => ({ ...prev, show: false }));
  }, []);

  const showSuccess = useCallback((title, message, options = {}) => {
    showAlert({ type: 'success', title, message, ...options });
  }, [showAlert]);

  const showError = useCallback((title, message, options = {}) => {
    showAlert({ type: 'error', title, message, ...options });
  }, [showAlert]);

  const showWarning = useCallback((title, message, options = {}) => {
    showAlert({ type: 'warning', title, message, ...options });
  }, [showAlert]);

  const showInfo = useCallback((title, message, options = {}) => {
    showAlert({ type: 'info', title, message, ...options });
  }, [showAlert]);

  return {
    alert,
    showAlert,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
