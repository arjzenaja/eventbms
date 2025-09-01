'use client';

import { useState } from 'react';
import { BiStar } from 'react-icons/bi';

const Rating = ({ destinationId, initialRating = 0, initialReviews = [] }) => {
  const [rating, setRating] = useState(initialRating);
  const [reviews, setReviews] = useState(initialReviews);
  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    comment: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const review = {
        ...newReview,
        id: Date.now().toString(),
        date: new Date().toISOString(),
        destinationId
      };

      // Add to local state
      const updatedReviews = [...reviews, review];
      setReviews(updatedReviews);
      
      // Calculate new average rating
      const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = totalRating / updatedReviews.length;
      setRating(Math.round(avgRating * 10) / 10);

      // Reset form
      setNewReview({ name: '', rating: 5, comment: '' });
      setShowForm(false);
      
      alert('Ulasan berhasil ditambahkan!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Gagal menambahkan ulasan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating, size = 'text-xl') => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <BiStar key={i} className={`${size} text-yellow-400 fill-current`} />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <BiStar className={`${size} text-gray-300`} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <BiStar className={`${size} text-yellow-400 fill-current`} />
            </div>
          </div>
        );
      } else {
        stars.push(
          <BiStar key={i} className={`${size} text-gray-300`} />
        );
      }
    }
    return stars;
  };

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 border border-white/50 dark:border-gray-700/50 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
          <BiStar className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Rating & Ulasan</h3>
      </div>

      {/* Rating Summary */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
            {rating.toFixed(1)}
          </div>
          <div className="flex items-center justify-center gap-1 mt-1">
            {renderStars(rating, 'text-lg')}
          </div>
        </div>
        <div className="flex-1">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Berdasarkan {reviews.length} ulasan
          </div>
          <div className="text-lg font-semibold text-gray-800 dark:text-white">
            {rating >= 4.5 ? 'Sangat Baik' : rating >= 4 ? 'Baik' : rating >= 3 ? 'Cukup' : rating >= 2 ? 'Kurang' : 'Buruk'}
          </div>
        </div>
      </div>

      {/* Add Review Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          {showForm ? 'Tutup Form' : 'Tulis Ulasan'}
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nama
              </label>
              <input
                type="text"
                required
                value={newReview.name}
                onChange={(e) => setNewReview(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nama Anda"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rating
              </label>
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5 - Sangat Baik)</option>
                <option value={4}>⭐⭐⭐⭐ (4 - Baik)</option>
                <option value={3}>⭐⭐⭐ (3 - Cukup)</option>
                <option value={2}>⭐⭐ (2 - Kurang)</option>
                <option value={1}>⭐ (1 - Buruk)</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ulasan
            </label>
            <textarea
              required
              rows={4}
              value={newReview.comment}
              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tulis ulasan Anda tentang desa wisata ini..."
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <BiStar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Belum ada ulasan. Jadilah yang pertama memberikan ulasan!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 dark:border-gray-600 pb-4 last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {review.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 dark:text-white">
                      {review.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {renderStars(review.rating, 'text-sm')}
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(review.date).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 ml-13">
                {review.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Rating;
