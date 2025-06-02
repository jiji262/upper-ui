import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'square';
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, size = 'md', shape = 'circle', ...props }, ref) => {
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
    } as const;

    const shapeClasses = {
      circle: 'rounded-full',
      square: 'rounded-md',
    } as const;

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center bg-muted overflow-hidden border-2 border-transparent dark:bg-gray-700 dark:border-gray-600',
          sizeClasses[size],
          shapeClasses[shape],
          className
        )}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-foreground font-medium dark:text-gray-200">
            {alt?.[0]?.toUpperCase()}
          </span>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar'; 