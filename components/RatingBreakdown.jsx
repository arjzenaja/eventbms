"use client";

import { BiStar } from "react-icons/bi";

const RatingBreakdown = ({ reviews = [] }) => {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  // Calculate rating distribution
  const ratingDistribution = [0, 0, 0, 0, 0]; // 1-5 stars
  let totalRating = 0;

  reviews.forEach(review => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingDistribution[review.rating - 1]++;
      totalRating += review.rating;
    }
  });

  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <BiStar 
          key={i} 
          className={`w-4 h-4 ${
            i < rating 
              ? 'text-yellow-400 fill-current' 
              : 'text-gray-300 dark:text-gray-600'
          }`} 
        />
      );
    }
    return stars;
  };

  const getRatingText = (rating) => {
    if (rating >= 4.5) return "Sangat Baik";
    if (rating >= 4.0) return "Baik";
    if (rating >= 3.0) return "Cukup";
    if (rating >= 2.0) return "Kurang";
    return "Buruk";
  };

  return (
    <div className="space-y-4">
      {/* Overall Rating */}
      <div className="text-center py-4 border-b border-gray-200 dark:border-gray-600">
        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {averageRating.toFixed(1)}
        </div>
        <div className="flex items-center justify-center gap-1 mb-2">
          {renderStars(Math.round(averageRating))}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {getRatingText(averageRating)} • Berdasarkan {reviews.length} ulasan
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = ratingDistribution[star - 1];
          const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
          
          return (
            <div key={star} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-16">
                <span className="text-sm text-gray-600 dark:text-gray-400">{star}</span>
                <BiStar className="w-3 h-3 text-yellow-400 fill-current" />
              </div>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 w-8 text-right">
                {count}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RatingBreakdown;
