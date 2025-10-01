"use client";

import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

/**
 * Loading Toast component with similar UI to the reference image
 * Shows loading state with spinner and progress indication
 */
export default function LoadingToast({
  show = false,
  title = "Memuat konten...",
  message = "Mohon tunggu sebentar",
  onClose,
  autoClose = false,
  autoCloseDelay = 3000,
  position = 'top-right',
}) {
  const { isDark } = useTheme();
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
    if (show) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [show]);

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
      className={`fixed z-50 transition-all duration-300 ${positionClasses[position]} ${
        isAnimating ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      }`}
    >
      <div className={`w-80 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl border border-green-200 dark:border-green-700 overflow-hidden`}>
        {/* Header with green border */}
        <div className="bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              </div>
              <div>
                <h4 className="font-semibold text-green-800 dark:text-green-200 text-sm">
                  {title}
                </h4>
                <p className="text-xs text-green-600 dark:text-green-300">
                  {message}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className={`p-1 rounded-full ${isDark ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'} transition-colors flex-shrink-0`}
              aria-label="Tutup notifikasi"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600 dark:text-gray-400">Progress</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">{Math.round(progress)}%</span>
          </div>
          <div className={`w-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
