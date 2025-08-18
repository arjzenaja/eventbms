'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Simple, robust toast component as fallback
 */
export function SimpleToast({
  type = 'info',
  title,
  message,
  onClose,
  show = true,
  autoClose = true,
  autoCloseDelay = 2000,
  position = 'top-right',
}) {
  const [isVisible, setIsVisible] = useState(show);
  const [isAnimating, setIsAnimating] = useState(false);

  // Validate and sanitize props
  const validType = ['success', 'error', 'warning', 'info'].includes(type) ? type : 'info';
  const validTitle = typeof title === 'string' && title.trim() ? title.trim() : 'Notifikasi';
  const validMessage = typeof message === 'string' && message.trim() ? message.trim() : '';
  const validPosition = ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'].includes(position) ? position : 'top-right';

  // Get icon and colors based on type
  const getIconAndColors = (type) => {
    switch (type) {
      case 'success':
        return { icon: '✅', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800' };
      case 'error':
        return { icon: '❌', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800' };
      case 'warning':
        return { icon: '⚠️', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800' };
      default:
        return { icon: 'ℹ️', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800' };
    }
  };

  const { icon, bg, border, text } = getIconAndColors(validType);

  useEffect(() => {
    if (autoClose && show) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [autoClose, show, autoCloseDelay]);

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 200);
  };

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ${positionClasses[validPosition]} ${
        isAnimating ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      }`}
    >
      <div className={`w-80 bg-white rounded-xl shadow-xl border overflow-hidden ${bg} ${border}`}>
        <div className="flex items-start gap-3 p-4">
          <div className="text-lg">{icon}</div>
          <div className="flex-1 min-w-0">
            <h4 className={`font-medium text-sm ${text}`}>{validTitle}</h4>
            {validMessage && <p className="text-xs mt-1 opacity-90 text-gray-700">{validMessage}</p>}
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            aria-label="Tutup notifikasi"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
        
        {/* Progress bar */}
        {autoClose && (
          <div className="h-1 bg-gray-200">
            <div
              className={`h-full transition-all duration-300 ease-linear ${bg.replace('bg-', 'bg-').replace('-50', '-500')}`}
              style={{
                width: '100%',
                animation: `shrink ${autoCloseDelay}ms linear forwards`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
