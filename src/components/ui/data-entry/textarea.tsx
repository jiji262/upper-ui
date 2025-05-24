import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error = false, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-lg border-2 border-black bg-white px-3 py-2 text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-gray-500 focus:outline-none focus:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&:not(:focus)]:hover:translate-y-0.5 [&:not(:focus)]:hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:text-sm",
          error && "border-red-500 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] hover:shadow-[2px_2px_0px_0px_rgba(239,68,68,1)]",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea }; 