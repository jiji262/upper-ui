import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  size?: 'default' | 'sm' | 'lg';
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const variantClasses = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/80 dark:bg-violet-600 dark:text-white',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/80 dark:bg-red-900/90 dark:text-white',
      outline: 'text-foreground border border-border hover:bg-accent hover:text-accent-foreground dark:border-gray-600 dark:hover:bg-gray-800',
    } as const;

    const sizeClasses = {
      default: 'h-6 px-2.5 py-0.5 text-xs',
      sm: 'h-5 px-2 py-0 text-xs',
      lg: 'h-7 px-3 py-1 text-sm',
    } as const;

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 dark:focus:ring-offset-gray-900',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge'; 