import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const ActivitiesPageSkeleton = () => (
  <div className="container mx-auto py-6 px-4 md:px-6 space-y-8">
    <div className="grid md:grid-cols-3 gap-6">
        <Skeleton className="h-[220px] rounded-3xl" />
        <Skeleton className="h-[220px] rounded-3xl hidden md:block" />
        <Skeleton className="h-[220px] rounded-3xl hidden md:block" />
    </div>

    <div className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 xl:col-span-3 hidden lg:block">
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-48 mb-4" />
                </CardHeader>
                <CardContent className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-8 xl:col-span-9">
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <Skeleton className="h-8 w-48" />
                        <div className="flex gap-2 w-full md:w-auto">
                            <Skeleton className="h-10 flex-grow" />
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {[...Array(12)].map((_, i) => (
                            <Skeleton key={i} className="h-40 rounded-lg" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  </div>
);

export default ActivitiesPageSkeleton;