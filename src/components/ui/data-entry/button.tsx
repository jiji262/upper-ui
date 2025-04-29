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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants }; 
 