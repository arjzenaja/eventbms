"use client";
import { memo } from 'react';

const OptimizedSkeleton = memo(({ className = "", ...props }) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
      {...props}
    />
  );
});

OptimizedSkeleton.displayName = 'OptimizedSkeleton';

export const ImageSkeleton = memo(() => (
  <div className="relative w-full h-[400px] rounded-[2rem] overflow-hidden">
    <OptimizedSkeleton className="w-full h-full" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
  </div>
));

ImageSkeleton.displayName = 'ImageSkeleton';

export const ThumbnailSkeleton = memo(() => (
  <div className="flex gap-3 overflow-x-auto pb-2">
    {Array.from({ length: 4 }).map((_, index) => (
      <OptimizedSkeleton
        key={index}
        className="w-24 h-20 rounded-xl flex-shrink-0"
      />
    ))}
  </div>
));

ThumbnailSkeleton.displayName = 'ThumbnailSkeleton';

export const ContentSkeleton = memo(() => (
  <div className="space-y-6">
    <OptimizedSkeleton className="w-32 h-8 rounded-full" />
    
    <div className="space-y-4">
      <OptimizedSkeleton className="w-full h-6 rounded" />
      <OptimizedSkeleton className="w-3/4 h-6 rounded" />
      <OptimizedSkeleton className="w-1/2 h-6 rounded" />
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 p-4 rounded-xl">
          <OptimizedSkeleton className="w-12 h-12 rounded-xl" />
          <div className="flex-1 space-y-2">
            <OptimizedSkeleton className="w-20 h-4 rounded" />
            <OptimizedSkeleton className="w-32 h-6 rounded" />
          </div>
        </div>
      ))}
    </div>
  </div>
));

ContentSkeleton.displayName = 'ContentSkeleton';

export default OptimizedSkeleton;
