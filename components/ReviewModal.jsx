"use client";

import { useState } from "react";
import { BiStar, BiX, BiSend } from "react-icons/bi";

const ReviewModal = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Silakan berikan rating terlebih dahulu.");
      return;
    }
    if (!review.trim()) {
      setError("Silakan tulis ulasan Anda.");
      return;
    }
    setError("");
    
    // Simulate submission
    onSubmit({
      rating,
      review: review.trim(),
      name: name.trim() || "Anonymous",
      email: email.trim(),
      date: new Date().toISOString()
    });
    
    // Reset form
    setRating(0);
    setReview("");
    setName("");
    setEmail("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
              <BiStar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tulis Ulasan</h2>
              <p className="text-gray-600 dark:text-gray-400">Bagikan pengalaman Anda</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
          >
            <BiX className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Banner */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 rounded-xl">
              {error}
            </div>
          )}
          {/* Rating Section */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Berikan Rating *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    star <= rating
                      ? 'bg-yellow-400 text-white shadow-lg transform scale-110'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <BiStar className={`w-6 h-6 ${star <= rating ? 'fill-current' : ''}`} />
                </button>
              ))}
            </div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {rating === 0 && "Pilih rating dari 1-5 bintang"}
              {rating === 1 && "⭐ Buruk"}
              {rating === 2 && "⭐⭐ Kurang"}
              {rating === 3 && "⭐⭐⭐ Cukup"}
              {rating === 4 && "⭐⭐⭐⭐ Baik"}
              {rating === 5 && "⭐⭐⭐⭐⭐ Sangat Baik"}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Ulasan Anda *
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Ceritakan pengalaman Anda di tempat ini..."
              className="w-full h-32 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              maxLength={500}
            />
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400 text-right">
              {review.length}/500 karakter
            </div>
          </div>

          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nama (Opsional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Anda"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email (Opsional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={rating === 0 || !review.trim()}
              className={`flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 ${
                rating === 0 || !review.trim() ? 'opacity-60 cursor-not-allowed hover:scale-100' : ''
              }`}
            >
              <BiSend className="w-4 h-4" />
              Kirim Ulasan
            </button>
          </div>
        </form>

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
          <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">💡 Tips Menulis Ulasan yang Baik:</h4>
          <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
            <li>• Jelaskan pengalaman spesifik yang Anda alami</li>
            <li>• Sebutkan hal-hal yang Anda suka atau tidak suka</li>
            <li>• Berikan saran untuk perbaikan jika ada</li>
            <li>• Gunakan bahasa yang sopan dan konstruktif</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
