import * as React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          className={cn(
            "h-4 w-4 rounded border-2 border-black text-primary shadow-sm focus:ring-0 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        {label && <label className="text-sm">{label}</label>}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

// This is the Ant Design style Checkbox component
export interface CheckboxAntProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'indeterminate'> {
  label?: React.ReactNode;
  indeterminate?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CheckboxAnt = React.forwardRef<HTMLInputElement, CheckboxAntProps>(
  ({ className = '', label, indeterminate, onChange, ...props }, ref) => {
    // Use a callback ref to set indeterminate property
    const checkboxRef = React.useRef<HTMLInputElement>(null);
    
    // Use ref from props or create our own
    const inputRef = ref || checkboxRef;
    
    // Set indeterminate when the prop changes
    React.useEffect(() => {
      if (inputRef && 'current' in inputRef && inputRef.current) {
        inputRef.current.indeterminate = !!indeterminate;
      }
    }, [indeterminate, inputRef]);

  return (
      <div className="upper-checkbox-wrapper flex items-center space-x-2">
        <span className="upper-checkbox relative inline-block">
      <input
        type="checkbox"
            ref={inputRef as React.RefObject<HTMLInputElement>}
            onChange={onChange}
            className={cn(
              "peer sr-only",
              className
            )}
        {...props}
      />
          <span 
            className={cn(
              "flex h-4 w-4 items-center justify-center rounded border-2 border-black bg-white transition-all",
              "peer-checked:bg-purple-500 peer-checked:border-purple-500",
              "peer-disabled:opacity-50 peer-disabled:cursor-not-allowed",
              "after:content-['✓'] after:text-white after:text-xs after:opacity-0 peer-checked:after:opacity-100",
              "shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
              "peer-checked:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] peer-checked:translate-y-[1px] peer-checked:translate-x-[1px]",
              indeterminate && "after:content-['-'] after:opacity-100 after:text-white bg-purple-500 border-purple-500"
            )}
          />
        </span>
        {label && (
          <label className="upper-checkbox-label cursor-pointer text-sm select-none">
            {label}
    </label>
        )}
      </div>
    );
  }
  );

CheckboxAnt.displayName = "CheckboxAnt";

// Create a simpler IndeterminateCheckbox component without passing the indeterminate prop to DOM
export const IndeterminateCheckbox = ({ label }: { label: string }) => {
  const checkboxRef = React.useRef<HTMLInputElement>(null);
  
  React.useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = true;
    }
  }, []);
  
  return (
    <div className="upper-checkbox-wrapper flex items-center space-x-2">
      <span className="upper-checkbox relative inline-block">
        <input
          type="checkbox"
          ref={checkboxRef}
          className="peer sr-only"
        />
        <span 
          className={cn(
            "flex h-4 w-4 items-center justify-center rounded border-2 border-black bg-white transition-all",
            "peer-checked:bg-purple-500 peer-checked:border-purple-500",
            "peer-disabled:opacity-50 peer-disabled:cursor-not-allowed",
            "after:content-['-'] after:text-white after:text-xs after:opacity-100",
            "shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
            "bg-purple-500 border-purple-500"
          )}
        />
      </span>
      {label && (
        <label className="upper-checkbox-label cursor-pointer text-sm select-none">
          {label}
        </label>
      )}
    </div>
  );
};

export { Checkbox }; 