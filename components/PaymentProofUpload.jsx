"use client";
import React, { useState, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { BiCloudUpload, BiImage, BiX, BiCheck } from "react-icons/bi";

const PaymentProofUpload = ({ onImageChange, isDark, isLight }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setIsUploading(true);
      
      // Simulate upload delay
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedImage(file);
          setPreviewUrl(e.target.result);
          setIsUploading(false);
          if (onImageChange) {
            onImageChange(file, e.target.result);
          }
        };
        reader.readAsDataURL(file);
      }, 1000);
    } else {
      alert('Mohon pilih file gambar yang valid (JPG, PNG, GIF)');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    if (onImageChange) {
      onImageChange(null, null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <label className={`text-sm font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-blue-200' : 'text-blue-600'}`}>
        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
        Upload Bukti Pembayaran *
      </label>
      
      {!previewUrl ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClickUpload}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 group hover:scale-[1.02] ${
            isDragOver
              ? isDark
                ? 'border-blue-400/60 bg-blue-600/10 shadow-lg shadow-blue-500/20'
                : 'border-blue-500/60 bg-blue-100/80 shadow-lg shadow-blue-500/20'
              : isDark
                ? 'border-white/30 hover:border-blue-400/50 hover:bg-white/5'
                : 'border-gray-300/60 hover:border-blue-500/60 hover:bg-gray-50/80'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
          
          <div className="space-y-4">
            <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center transition-all duration-300 ${
              isDragOver
                ? 'bg-gradient-to-br from-blue-500 to-indigo-600 scale-110'
                : isDark
                  ? 'bg-white/10 group-hover:bg-blue-500/20'
                  : 'bg-gray-100 group-hover:bg-blue-500/20'
            }`}>
              {isUploading ? (
                <div className="animate-spin">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : (
                <BiCloudUpload className={`text-2xl transition-all duration-300 ${
                  isDragOver
                    ? 'text-white'
                    : isDark
                      ? 'text-blue-300 group-hover:text-white'
                      : 'text-blue-500 group-hover:text-white'
                }`} />
              )}
            </div>
            
            <div>
              <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {isUploading ? 'Mengupload...' : 'Upload Bukti Pembayaran'}
              </h3>
              <p className={`text-sm ${isDark ? 'text-blue-200' : 'text-gray-600'}`}>
                {isUploading 
                  ? 'Mohon tunggu sebentar...'
                  : 'Drag & drop gambar atau klik untuk memilih file'
                }
              </p>
              <p className={`text-xs mt-2 ${isDark ? 'text-blue-300' : 'text-gray-500'}`}>
                Format: JPG, PNG, GIF (Max 5MB)
              </p>
            </div>
          </div>
          
          {/* Animated background */}
          {!isUploading && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>
          )}
        </div>
      ) : (
        <div className={`relative rounded-2xl border shadow-lg overflow-hidden group ${
          isDark 
            ? 'bg-white/10 border-white/20' 
            : 'bg-white/90 border-gray-200/40'
        }`}>
          <div className="relative">
            <img
              src={previewUrl}
              alt="Payment proof preview"
              className="w-full h-64 object-cover"
            />
            
            {/* Overlay with remove button */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button
                onClick={handleRemoveImage}
                className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg"
              >
                <BiX className="text-xl" />
              </button>
            </div>
            
            {/* Success indicator */}
            <div className="absolute top-4 right-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <BiCheck className="text-white text-lg" />
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {selectedImage?.name || 'Bukti Pembayaran'}
                </h4>
                <p className={`text-sm ${isDark ? 'text-blue-200' : 'text-gray-600'}`}>
                  {(selectedImage?.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              
              <button
                onClick={handleClickUpload}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isDark
                    ? 'bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-400/30'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300'
                }`}
              >
                Ganti Gambar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Instructions */}
      <div className={`rounded-xl p-4 border ${
        isDark 
          ? 'bg-blue-600/10 border-blue-400/20' 
          : 'bg-blue-50/80 border-blue-300/40'
      }`}>
        <div className="flex items-start gap-3">
          <BiImage className={`text-lg mt-0.5 ${isDark ? 'text-blue-300' : 'text-blue-600'}`} />
          <div>
            <h5 className={`font-semibold text-sm mb-1 ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>
              Cara Upload Bukti Pembayaran:
            </h5>
            <ul className={`text-xs space-y-1 ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
              <li>• Screenshot bukti transfer dari aplikasi bank/e-wallet</li>
              <li>• Pastikan nominal dan nama penerima terlihat jelas</li>
              <li>• Format gambar: JPG, PNG, atau GIF</li>
              <li>• Ukuran maksimal: 5MB</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentProofUpload;
