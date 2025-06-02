import React from 'react';
import { cn } from '@/lib/utils';

interface SwitchProps extends React.HTMLAttributes<HTMLButtonElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked, onCheckedChange = () => {}, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={cn(
          'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
          checked 
            ? 'bg-primary dark:bg-violet-600' 
            : 'bg-input dark:bg-gray-600',
          className
        )}
        data-state={checked ? 'checked' : 'unchecked'}
        onClick={() => onCheckedChange(!checked)}
        {...props}
      >
        <span
          className={cn(
            'pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform dark:bg-white',
            checked ? 'translate-x-4' : 'translate-x-0'
          )}
          data-state={checked ? 'checked' : 'unchecked'}
        />
      </button>
    );
  }
);

Switch.displayName = 'Switch'; 