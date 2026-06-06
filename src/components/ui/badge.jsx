import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import React from 'react';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        success: 'border-transparent bg-green-500 text-white hover:bg-green-500/80',
        outline: 'text-foreground',
        premium: 'border-transparent bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md',
        new: 'border-transparent bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };