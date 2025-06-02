import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error = false, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border-2 border-black bg-white px-3 py-2 text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-gray-500 focus:outline-none focus:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&:not(:focus)]:hover:translate-y-0.5 [&:not(:focus)]:hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
          error && "border-red-500 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] hover:shadow-[2px_2px_0px_0px_rgba(239,68,68,1)]",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

// This is the Ant Design style Input component
export interface InputAntProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  error?: boolean;
  size?: 'small' | 'middle' | 'large';
  status?: 'error' | 'warning';
}

export const InputAnt = React.forwardRef<HTMLInputElement, InputAntProps>(
  ({ className = '', error, size, status, ...props }, ref) => {
    const sizeClass = size === 'small' 
      ? 'h-6 px-2 text-sm' 
      : size === 'large' 
        ? 'h-10 px-3 text-base' 
        : 'h-9 px-3 text-sm';
    
    const statusClass = error || status === 'error' 
      ? 'border-red-500 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] hover:shadow-[2px_2px_0px_0px_rgba(239,68,68,1)]' 
      : status === 'warning' 
        ? 'border-yellow-500 shadow-[4px_4px_0px_0px_rgba(250,173,20,1)] hover:shadow-[2px_2px_0px_0px_rgba(250,173,20,1)]' 
        : '';
    
    return (
      <input
        className={cn(
          "flex w-full rounded-lg border-2 border-black bg-white text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-gray-500 focus:outline-none focus:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&:not(:focus)]:hover:translate-y-0.5 [&:not(:focus)]:hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
          sizeClass,
          statusClass,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

InputAnt.displayName = "InputAnt";

export { Input }; 

// Styles to be added via global CSS or Tailwind
// .upper-input {
//   @apply w-full px-3 py-2 border-2 border-black rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all;
// }
// .upper-input:focus, .upper-input:hover {
//   @apply outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-y-0.5;
// } 