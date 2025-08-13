'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const alertIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const alertStyles = {
  success: {
    container: 'bg-green-50 border-green-200 text-green-800',
    icon: 'text-green-500',
    button: 'bg-green-100 hover:bg-green-200 text-green-700',
  },
  error: {
    container: 'bg-red-50 border-red-200 text-red-800',
    icon: 'text-red-500',
    button: 'bg-red-100 hover:bg-red-200 text-red-700',
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    icon: 'text-yellow-500',
    button: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700',
  },
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: 'text-blue-500',
    button: 'bg-blue-100 hover:bg-blue-200 text-blue-700',
  },
};

export function Alert({
  type = 'info',
  title,
  message,
  onClose,
  show = true,
  autoClose = false,
  autoCloseDelay = 5000,
  className,
  ...props
}) {
  const [isVisible, setIsVisible] = useState(show);
  const [isAnimating, setIsAnimating] = useState(false);

  const IconComponent = alertIcons[type];
  const styles = alertStyles[type];

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

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm',
        isAnimating && 'animate-fadeOut',
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
            styles.container
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4">
            <div className="flex items-center gap-3">
              <IconComponent className={cn('w-6 h-6', styles.icon)} />
              <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            <button
              onClick={handleClose}
              className={cn(
                'p-2 rounded-full transition-colors duration-200',
                styles.button
              )}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 pb-6">
            <p className="text-sm leading-relaxed">{message}</p>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6">
            <button
              onClick={handleClose}
              className={cn(
                'w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 active:scale-95',
                styles.button
              )}
            >
              OK
            </button>
          </div>

          {/* Progress bar for auto-close */}
          {autoClose && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
              <div
                className={cn(
                  'h-full transition-all duration-300 ease-linear',
                  styles.icon.replace('text-', 'bg-')
                )}
                style={{
                  width: '100%',
                  animation: `shrink ${autoCloseDelay}ms linear forwards`,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Toast variant for non-blocking notifications
export function Toast({
  type = 'info',
  title,
  message,
  onClose,
  show = true,
  autoClose = true,
  autoCloseDelay = 4000,
  position = 'top-right',
  className,
  ...props
}) {
  const [isVisible, setIsVisible] = useState(show);
  const [isAnimating, setIsAnimating] = useState(false);

  const IconComponent = alertIcons[type];
  const styles = alertStyles[type];

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
      className={cn(
        'fixed z-50 transition-all duration-300',
        positionClasses[position],
        isAnimating ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'w-80 bg-white rounded-xl shadow-lg border overflow-hidden',
          styles.container
        )}
      >
        <div className="flex items-start gap-3 p-4">
          <IconComponent className={cn('w-5 h-5 mt-0.5 flex-shrink-0', styles.icon)} />
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm">{title}</h4>
            {message && <p className="text-xs mt-1 opacity-90">{message}</p>}
          </div>
          <button
            onClick={handleClose}
            className={cn(
              'p-1 rounded-full transition-colors duration-200 flex-shrink-0',
              styles.button
            )}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
        
        {/* Progress bar */}
        {autoClose && (
          <div className="h-1 bg-gray-200">
            <div
              className={cn(
                'h-full transition-all duration-300 ease-linear',
                styles.icon.replace('text-', 'bg-')
              )}
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

// Add custom animations to globals.css
const style = document.createElement('style');
style.textContent = `
  @keyframes shrink {
    from { width: 100%; }
    to { width: 0%; }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;
document.head.appendChild(style);
