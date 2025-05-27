// src/components/ui/data-entry/Radio/Group.tsx
import React, { createContext, ChangeEvent } from 'react';
import Radio, { RadioProps } from './Radio'; // Import Radio to map options if needed
import './Radio.css'; // Common styles

export interface RadioGroupOption { // For options prop
  label: React.ReactNode;
  value: any;
  disabled?: boolean;
}

export interface RadioGroupProps {
  value?: any; // Selected value in the group
  defaultValue?: any;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void; // Returns native event with e.target.value
  disabled?: boolean;
  name?: string; // Name for all radio inputs in the group
  options?: Array<RadioGroupOption | string | number>; // Simplified options
  optionType?: 'default' | 'button'; // For Radio.Button style
  buttonStyle?: 'outline' | 'solid'; // Default 'outline'
  size?: 'large' | 'middle' | 'small'; // For Radio.Button style
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

interface RadioGroupContextProps {
  value: any;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  name?: string;
}

export const RadioGroupContext = createContext<RadioGroupContextProps | null>(null);

const RadioGroup: React.FC<RadioGroupProps> = ({
  value: controlledValue,
  defaultValue,
  onChange,
  disabled = false,
  name,
  options,
  optionType = 'default',
  buttonStyle = 'outline',
  size = 'middle',
  children,
  className,
  style,
}) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);

  const currentValue = controlledValue !== undefined ? controlledValue : internalValue;

  const handleGroupChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Convert back to number if original option value was number
    const selectedOption = options?.find(opt => 
        (typeof opt === 'object' ? String(opt.value) : String(opt)) === val
    );
    const targetValue = typeof selectedOption === 'object' && typeof selectedOption.value === 'number' 
        ? Number(val) 
        : val;

    if (controlledValue === undefined) {
      setInternalValue(targetValue);
    }
    onChange?.(e); // Pass original event, e.target.value will be string
  };

  const contextValue = {
    value: currentValue,
    onChange: handleGroupChange,
    disabled,
    name,
  };

  let content = children;
  if (options && options.length > 0) {
    content = options.map((option) => {
      if (typeof option === 'string' || typeof option === 'number') {
        return (
          <Radio
            key={option.toString()}
            disabled={disabled}
            value={option}
            // checked={currentValue === option} // Handled by context
          >
            {option}
          </Radio>
        );
      }
      // If option is RadioGroupOption object
      return (
        <Radio
          key={`radio-group-value-options-${option.value}`}
          disabled={option.disabled || disabled}
          value={option.value}
          // checked={currentValue === option.value} // Handled by context
        >
          {option.label}
        </Radio>
      );
    });
  }
  
  const groupClasses = [
    'ant-radio-group',
    optionType === 'button' ? `ant-radio-group-button ant-radio-group-button-${buttonStyle}` : '',
    size && optionType === 'button' ? `ant-radio-group-${size}`: '',
    className,
  ].filter(Boolean).join(' ');


  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div className={groupClasses} style={style} role="radiogroup">
        {content}
      </div>
    </RadioGroupContext.Provider>
  );
};

export default RadioGroup;
