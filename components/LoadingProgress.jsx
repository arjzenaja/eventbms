"use client";

import { useState, useEffect } from "react";

const LoadingProgress = ({ message = "Memuat data..." }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="text-center max-w-md mx-auto px-4">
        {/* Loading Animation */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin border-t-blue-600 dark:border-t-blue-400"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-blue-400 dark:border-t-blue-300 opacity-20"></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
            <div 
              className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Message */}
        <p className="text-slate-600 dark:text-gray-300 text-lg font-medium">
          {message}
        </p>
        
        {/* Progress Percentage */}
        <p className="text-slate-500 dark:text-gray-400 text-sm mt-2">
          {Math.round(progress)}%
        </p>

        {/* Loading Tips */}
        <div className="mt-8 text-sm text-slate-500 dark:text-gray-400">
          <p>Tips: Tekan ESC untuk kembali atau F5 untuk refresh</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingProgress;
