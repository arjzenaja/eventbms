'use client';

import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: {
    container: 'bg-green-50 border-green-200',
    icon: 'text-green-500',
    button: 'bg-green-600 hover:bg-green-700 text-white',
    buttonSecondary: 'bg-green-100 hover:bg-green-200 text-green-700',
  },
  error: {
    container: 'bg-red-50 border-red-200',
    icon: 'text-red-500',
    button: 'bg-red-600 hover:bg-red-700 text-white',
    buttonSecondary: 'bg-red-100 hover:bg-red-200 text-red-700',
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200',
    icon: 'text-yellow-500',
    button: 'bg-yellow-600 hover:bg-yellow-700 text-white',
    buttonSecondary: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700',
  },
  info: {
    container: 'bg-blue-50 border-blue-200',
    icon: 'text-blue-500',
    button: 'bg-blue-600 hover:bg-blue-700 text-white',
    buttonSecondary: 'bg-blue-100 hover:bg-blue-200 text-blue-700',
  },
};

export function ConfirmDialog({
  type = 'info',
  title,
  message,
  confirmText = 'OK',
  cancelText = 'Cancel',
  showCancel = true,
  onConfirm,
  onCancel,
  show = false,
  onClose,
  className,
  ...props
}) {
  const [isVisible, setIsVisible] = useState(show);
  const [isAnimating, setIsAnimating] = useState(false);

  const IconComponent = iconMap[type];
  const colors = colorMap[type];

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setIsAnimating(false);
    }
  }, [show]);

  const handleConfirm = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
      onConfirm?.();
      onClose?.();
    }, 200);
  };

  const handleCancel = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
      onCancel?.();
      onClose?.();
    }, 200);
  };

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 200);
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'relative w-full max-w-md mx-4 transform transition-all duration-300',
          isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        )}
      >
        <div
          className={cn(
            'relative bg-white rounded-2xl shadow-2xl border overflow-hidden',
            colors.container
          )}
        >
          {/* Header */}
          <div className="flex items-center gap-3 p-6 pb-4">
            <IconComponent className={cn('w-6 h-6', colors.icon)} />
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>

          {/* Content */}
          <div className="px-6 pb-6">
            <p className="text-sm leading-relaxed text-gray-700">{message}</p>
          </div>

          {/* Footer */}
          <div className="flex gap-3 px-6 pb-6">
            {showCancel && (
              <button
                onClick={handleCancel}
                className={cn(
                  'flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 active:scale-95',
                  colors.buttonSecondary
                )}
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={handleConfirm}
              className={cn(
                'flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 active:scale-95',
                colors.button
              )}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook untuk menggunakan confirm dialog
export const useConfirmDialog = () => {
  const [dialog, setDialog] = useState({
    show: false,
    type: 'info',
    title: '',
    message: '',
    confirmText: 'OK',
    cancelText: 'Cancel',
    showCancel: true,
    onConfirm: null,
    onCancel: null,
  });

  const showConfirm = useCallback(({
    type = 'info',
    title,
    message,
    confirmText = 'OK',
    cancelText = 'Cancel',
    showCancel = true,
    onConfirm,
    onCancel,
  }) => {
    return new Promise((resolve) => {
      setDialog({
        show: true,
        type,
        title,
        message,
        confirmText,
        cancelText,
        showCancel,
        onConfirm: () => {
          setDialog(prev => ({ ...prev, show: false }));
          resolve(true);
          onConfirm?.();
        },
        onCancel: () => {
          setDialog(prev => ({ ...prev, show: false }));
          resolve(false);
          onCancel?.();
        },
      });
    });
  }, []);

  const hideDialog = useCallback(() => {
    setDialog(prev => ({ ...prev, show: false }));
  }, []);

  return {
    dialog,
    showConfirm,
    hideDialog,
  };
};
