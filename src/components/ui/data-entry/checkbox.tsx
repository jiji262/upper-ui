import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  indeterminate?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  indeterminate = false,
  className = '',
  ...props
}) => {
  const checkboxClasses = [
    'w-4 h-4',
    'rounded',
    'border border-gray-300',
    'focus:ring-2 focus:ring-blue-500',
    'text-blue-600',
    className
  ].filter(Boolean).join(' ');

  return (
    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        className={checkboxClasses}
        ref={(input) => {
          if (input) {
            input.indeterminate = indeterminate;
          }
        }}
        {...props}
      />
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </label>
  );
}; 