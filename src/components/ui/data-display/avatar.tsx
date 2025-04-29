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
          'relative inline-flex items-center justify-center bg-gray-100 overflow-hidden',
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
          <span className="text-gray-600 font-medium">
            {alt?.[0]?.toUpperCase()}
          </span>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar'; 