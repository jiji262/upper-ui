import React from 'react';
import './styles.css';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  error?: boolean;
  size?: 'small' | 'middle' | 'large' | number;
  status?: 'error' | 'warning';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, size, status, ...props }, ref) => {
    const sizeClass = typeof size === 'string' 
      ? `upper-input-${size}` 
      : typeof size === 'number' 
        ? `h-[${size}px]` 
        : '';
    
    const statusClass = status ? `upper-input-${status}` : error ? 'upper-input-error' : '';
    
    return (
      <input
        className={`upper-input ${sizeClass} ${statusClass} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input'; 