"use client";

import { BiError, BiRefresh, BiArrowBack } from "react-icons/bi";

const ErrorState = ({ 
  title = "Terjadi Kesalahan", 
  message = "Maaf, terjadi kesalahan saat memuat data. Silakan coba lagi.",
  onRetry,
  onBack,
  showBackButton = true,
  showRetryButton = true 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-red-900/20 dark:to-pink-900/20">
      <div className="text-center max-w-md mx-auto px-4">
        {/* Error Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <BiError className="text-4xl text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
          {title}
        </h1>
        <p className="text-slate-600 dark:text-gray-300 mb-8 leading-relaxed">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {showRetryButton && onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
              aria-label="Coba lagi"
            >
              <BiRefresh className="text-lg" />
              Coba Lagi
            </button>
          )}
          
          {showBackButton && onBack && (
            <button
              onClick={onBack}
              className="flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
              aria-label="Kembali"
            >
              <BiArrowBack className="text-lg" />
              Kembali
            </button>
          )}
        </div>

        {/* Additional Help */}
        <div className="mt-8 text-sm text-slate-500 dark:text-gray-400">
          <p>Jika masalah berlanjut, silakan hubungi tim support kami.</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
