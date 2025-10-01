"use client";

import React, { useState, useEffect } from 'react';
import { BiCheckCircle, BiX, BiRefresh, BiMap, BiTime } from 'react-icons/bi';

/**
 * Explore Notification component similar to the reference image
 * Shows loading/processing status when content is clicked
 */
export default function ExploreNotification({
  show = false,
  title = "Memuat Konten...",
  message = "Mohon tunggu sebentar",
  type = "loading", // loading, success, error
  onClose,
  onRefresh,
  autoClose = true,
  autoCloseDelay = 3000,
  position = 'top-right',
}) {
  const [isVisible, setIsVisible] = useState(show);
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);

  // Sync internal visibility with external `show` prop
  useEffect(() => {
    setIsVisible(show);
    if (show) {
      setIsAnimating(false);
      setProgress(0);
    }
  }, [show]);

  // Progress animation
  useEffect(() => {
    if (show && type === 'loading') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [show, type]);

  // Auto close handling
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
    }, 300);
  };

  const handleRefresh = () => {
    onRefresh?.();
  };

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          borderColor: 'border-green-400/50',
          iconBg: 'bg-green-500',
          icon: <BiCheckCircle className="w-4 h-4 text-white" />,
          titleColor: 'text-green-400',
          glowColor: 'from-green-400/10 to-green-500/10'
        };
      case 'error':
        return {
          borderColor: 'border-red-400/50',
          iconBg: 'bg-red-500',
          icon: <BiX className="w-4 h-4 text-white" />,
          titleColor: 'text-red-400',
          glowColor: 'from-red-400/10 to-red-500/10'
        };
      default: // loading
        return {
          borderColor: 'border-blue-400/50',
          iconBg: 'bg-blue-500',
          icon: <BiTime className="w-4 h-4 text-white animate-spin" />,
          titleColor: 'text-blue-400',
          glowColor: 'from-blue-400/10 to-blue-500/10'
        };
    }
  };

  const styles = getTypeStyles();

  if (!isVisible) return null;

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ${positionClasses[position]} ${
        isAnimating ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      }`}
    >
      <div className="relative">
        {/* Icon - positioned outside and overlapping */}
        <div className={`absolute -left-4 -top-2 w-12 h-12 ${styles.iconBg} rounded-full flex items-center justify-center shadow-lg border-2 border-white z-10`}>
          {styles.icon}
        </div>

        {/* Main Notification */}
        <div className={`bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 pl-16 shadow-2xl border-2 ${styles.borderColor} min-w-[400px] relative overflow-hidden`}>
          {/* Glow effect */}
          <div className={`absolute inset-0 bg-gradient-to-r ${styles.glowColor} rounded-2xl`}></div>
          
          {/* Content */}
          <div className="relative z-10">
            {/* Title */}
            <div className="flex items-center gap-3 mb-2">
              <h3 className={`${styles.titleColor} font-bold text-lg`}>
                {title}
              </h3>
            </div>
            
            {/* Message */}
            <p className="text-gray-300 text-sm mb-4">
              {message}
            </p>

            {/* Progress bar for loading */}
            {type === 'loading' && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">Progress</span>
                  <span className="text-xs text-gray-400">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              {/* Action button based on type */}
              {type === 'loading' && (
                <button
                  onClick={handleRefresh}
                  className="flex items-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-blue-500/30"
                >
                  <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center">
                    <BiRefresh className="w-2.5 h-2.5 text-white" />
                  </div>
                  Refresh
                </button>
              )}

              {type === 'success' && (
                <button
                  onClick={handleRefresh}
                  className="flex items-center gap-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-green-500/30"
                >
                  <div className="w-4 h-4 bg-green-500 rounded flex items-center justify-center">
                    <BiCheckCircle className="w-2.5 h-2.5 text-white" />
                  </div>
                  Lihat Detail
                </button>
              )}

              {/* Close button */}
              <button
                onClick={handleClose}
                className="w-8 h-8 bg-gray-600/50 hover:bg-gray-500/50 rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-all duration-200 ml-auto"
                title="Tutup"
              >
                <BiX className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress bar for auto-close */}
          {autoClose && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
              <div
                className={`h-full ${styles.iconBg.replace('bg-', 'bg-')} transition-all duration-300 ease-linear`}
                style={{
                  width: '100%',
                  animation: `shrink ${autoCloseDelay}ms linear forwards`,
                }}
              />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
