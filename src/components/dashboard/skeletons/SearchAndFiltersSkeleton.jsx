import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const SearchAndFiltersSkeleton = () => {
  return (
    <div className="mb-8 p-4 rounded-xl bg-card border">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <Skeleton className="h-10 w-full" />
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
};

export default SearchAndFiltersSkeleton;