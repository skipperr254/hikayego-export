import React from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const LazyImage = React.memo(({ src, alt, className, width, height, ...props }) => {
  const [ref, isIntersecting] = useIntersectionObserver({
    rootMargin: '100px',
    threshold: 0.1,
  });

  return (
    <div
      ref={ref}
      className={cn('relative', className)}
      style={{ width, height }}
    >
      {isIntersecting ? (
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          {...props}
        />
      ) : (
        <Skeleton className="w-full h-full" />
      )}
    </div>
  );
});

export default LazyImage;