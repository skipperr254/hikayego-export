import React from 'react';
import StoryCardSkeleton from './StoryCardSkeleton';

const StoriesGridSkeleton = ({ count = 6, isMobile = false }) => {
  if (isMobile) {
    return (
      <div className="space-y-8 -mx-4 sm:-mx-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse px-4 sm:px-6" />
            <div className="flex space-x-4 overflow-x-hidden pb-4 px-4 sm:px-6">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="h-full w-40 sm:w-48 flex-shrink-0">
                  <div className="aspect-[3/4] bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <StoryCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default StoriesGridSkeleton;