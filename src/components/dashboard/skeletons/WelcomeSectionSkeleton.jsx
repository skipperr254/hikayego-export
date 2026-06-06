import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const WelcomeSectionSkeleton = () => (
  <div className="mb-4 p-6 md:p-10 flex flex-col items-center text-center">
    <Skeleton className="h-6 w-32 mb-4" />
    <Skeleton className="h-12 w-3/4 md:w-1/2 mb-4" />
    <Skeleton className="h-7 w-full max-w-md mb-6" />
    <div className="relative w-full max-w-3xl">
      <Skeleton className="h-16 w-full rounded-2xl" />
    </div>
    <div className="w-full max-w-4xl mt-8 flex items-center gap-2">
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="h-8 w-28 rounded-full" />
        <Skeleton className="h-8 w-32 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
    </div>
  </div>
);

export default WelcomeSectionSkeleton;