import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const SettingsSkeleton = () => {
  return (
    <Card className="w-full transition-all duration-300 border-border/50">
      <CardHeader className="space-y-2 border-b border-border/10 pb-6">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
          <Skeleton className="h-7 w-48 rounded-lg" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between p-4 border border-border/30 rounded-xl">
            <div className="flex items-start space-x-4 w-full">
              <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
              <div className="space-y-2 w-full mt-1">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
            <Skeleton className="h-6 w-11 rounded-full shrink-0 ml-4" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SettingsSkeleton;