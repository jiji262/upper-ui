import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 active:translate-y-0.5",
  {
    variants: {
      variant: {
        default: "border-2 border-black bg-[#e6d5ff] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#d4b5ff] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]",
        destructive: "border-2 border-black bg-red-200 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-red-300 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]",
        outline: "border-2 border-black bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]",
        secondary: "border-2 border-black bg-gray-100 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-200 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-6",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants }; 
 