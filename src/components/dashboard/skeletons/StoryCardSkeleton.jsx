import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const StoryCardSkeleton = () => (
  <Card className="h-full overflow-hidden bg-card/50">
    <CardHeader className="p-0">
      <Skeleton className="w-full h-48" />
    </CardHeader>
    <CardContent className="p-6">
      <Skeleton className="h-6 w-3/4 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-4" />
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-5 w-1/3" />
      </div>
      <Skeleton className="h-10 w-full" />
    </CardContent>
  </Card>
);

export default StoryCardSkeleton;