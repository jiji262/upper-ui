// src/components/ui/data-entry/InputNumber/InputNumber.tsx
import React, { useState, useEffect, useRef } from 'react';
import Input, { InputProps } from '../Input/Input'; // Assuming Input is available
import Icon from '../../general/Icon'; // Assuming Icon is available
import './InputNumber.css';

// Helper to parse string to number, respecting precision
const parseNumber = (str: string, precision?: number): number | null => {
  if (str === '' || str === '-') return null; // Allow empty or just minus for typing
  const num = parseFloat(str);
  if (isNaN(num)) return null;
  if (precision !== undefined) {
    return parseFloat(num.toFixed(precision));
  }
  return num;
};

// Helper to format number to string, respecting precision
const formatNumber = (num: number | null, precision?: number): string => {
  if (num === null) return '';
  if (precision !== undefined) {
    return num.toFixed(precision);
  }
  return String(num);
};

interface InputNumberProps extends Omit<InputProps, 'onChange' | 'value' | 'type' | 'prefix' | 'suffix'> {
  value?: number | null;
  defaultValue?: number | null;
  onChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  precision?: number; // Number of decimal places
  disabled?: boolean;
  controls?: boolean | { upIcon?: React.ReactNode; downIcon?: React.ReactNode }; // Show +/- controls
  formatter?: (value: number | string | undefined) => string; // Format display value
  parser?: (displayValue: string | undefined) => number | string; // Parse display value back to number/string
  keyboard?: boolean; // Enable keyboard up/down arrows, default true
  stringMode?: boolean; // Value type is string, useful for high precision numbers
  // `prefix` from InputProps can be used for currency/unit
  // `addonBefore`, `addonAfter` from InputProps can also be used
  decimalSeparator?: string; // Not fully implemented in this simplified version
}

const InputNumber: React.FC<InputNumberProps> = ({
  value: controlledValue,
  defaultValue,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  precision,
  disabled = false,
  controls = true,
  formatter,
  parser,
  keyboard = true,
  stringMode = false, // If true, onChange returns string, value is string
  decimalSeparator = '.', // Basic support
  className,
  style,
  size, // from InputProps
  status, // from InputProps
  ...restInputProps // other InputProps like placeholder, autoFocus, prefix, addonBefore/After
}) => {
  const [currentValue, setCurrentValue] = useState<number | null>(
    defaultValue !== undefined ? defaultValue : null
  );
  const [displayValue, setDisplayValue] = useState<string>(
    defaultValue !== undefined ? formatNumber(defaultValue, precision) : ''
  );
  const inputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if (controlledValue !== undefined) {
      setCurrentValue(controlledValue);
      setDisplayValue(formatter ? formatter(controlledValue) : formatNumber(controlledValue, precision));
    }
  }, [controlledValue, formatter, precision]);

  const updateValue = (num: number | null, inputStr?: string) => {
    let finalNum = num;
    if (finalNum !== null) {
      if (finalNum < min) finalNum = min;
      if (finalNum > max) finalNum = max;
      if (precision !== undefined) finalNum = parseFloat(finalNum.toFixed(precision));
    }
    
    const finalDisplayStr = inputStr !== undefined 
        ? inputStr 
        : (formatter ? formatter(finalNum) : formatNumber(finalNum, precision));

    if (controlledValue === undefined) {
      setCurrentValue(finalNum);
      setDisplayValue(finalDisplayStr);
    }
    
    // For stringMode, onChange expects string, otherwise number or null
    if (stringMode) {
        onChange?.(finalNum === null ? null : (formatNumber(finalNum, precision) as any)); // Cast to any if stringMode expects string always
    } else {
        onChange?.(finalNum);
    }
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valStr = e.target.value;
    if (decimalSeparator !== '.') {
        valStr = valStr.replace(decimalSeparator, '.'); // Internal representation uses '.'
    }

    const parsedNumStr = parser ? String(parser(valStr)) : valStr;
    
    // Allow some flexibility for typing (e.g. "1.", "-", empty)
    if (parsedNumStr === '' || parsedNumStr === '-' || (parsedNumStr.endsWith('.') && !isNaN(parseFloat(parsedNumStr)))) {
        setDisplayValue(e.target.value); // Show what user typed
        // If it's empty or just a minus, treat as null for now or wait for blur/enter
        if (parsedNumStr === '' || parsedNumStr === '-') {
             if (currentValue !== null) onChange?.(null); // Notify if it becomes null
        }
    } else {
        const num = parseNumber(parsedNumStr, precision); // Use original precision for parsing attempt
        // Don't update value immediately on every keystroke if it's potentially incomplete
        // Instead, update display and validate on blur or step change
        setDisplayValue(e.target.value); // Show user's input
    }
  };
  
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let valStr = e.target.value;
    if (decimalSeparator !== '.') {
        valStr = valStr.replace(decimalSeparator, '.');
    }
    const parsedVal = parser ? parser(valStr) : valStr;
    const num = parseNumber(String(parsedVal)); // No precision here, apply it in updateValue
    updateValue(num, e.target.value); // Pass user's raw input for formatter if needed
    restInputProps.onBlur?.(e);
  };


  const stepValue = (direction: 'up' | 'down') => {
    if (disabled) return;
    let num = currentValue !== null ? currentValue : (parseNumber(displayValue) || 0); // Start from displayValue if current is null
    num = direction === 'up' ? num + step : num - step;
    updateValue(num);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (keyboard && !disabled) {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        stepValue('up');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        stepValue('down');
      }
    }
    restInputProps.onKeyDown?.(e);
  };
  
  const displayedFormattedValue = formatter && currentValue !== null
    ? formatter(currentValue)
    : (decimalSeparator !== '.' ? displayValue.replace('.', decimalSeparator) : displayValue);


  const hasControls = controls === true || typeof controls === 'object';
  const upIcon = (typeof controls === 'object' && controls.upIcon) ? controls.upIcon : <Icon name="UpOutlined" />;
  const downIcon = (typeof controls === 'object' && controls.downIcon) ? controls.downIcon : <Icon name="DownOutlined" />;

  const inputNumberCls = [
    'ant-input-number',
    size ? `ant-input-number-${size}` : '',
    status ? `ant-input-number-status-${status}` : '',
    disabled ? 'ant-input-number-disabled' : '',
    hasControls ? 'ant-input-number-with-controls' : '',
    className,
  ].filter(Boolean).join(' ');
  
  const inputElement = (
     <Input
        {...restInputProps}
        ref={inputRef}
        type="text" // Use text type to allow custom formatting and parsing
        inputMode="decimal" // Hint for mobile keyboards
        value={displayedFormattedValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        size={size}
        status={status}
        className="ant-input-number-input" // Specific class for direct input styling
     />
  );

  if (!hasControls) {
    return <div className={inputNumberCls} style={style}>{inputElement}</div>;
  }

  return (
    <div className={inputNumberCls} style={style}>
      {inputElement}
      <div className="ant-input-number-handler-wrap">
        <span
          role="button"
          aria-label="Increase Value"
          aria-disabled={disabled || (currentValue !== null && currentValue >= max)}
          className={`ant-input-number-handler ant-input-number-handler-up ${disabled || (currentValue !== null && currentValue >= max) ? 'ant-input-number-handler-disabled' : ''}`}
          onClick={() => stepValue('up')}
          onMouseDown={(e) => e.preventDefault()} // Prevent input blur on click
        >
          {upIcon}
        </span>
        <span
          role="button"
          aria-label="Decrease Value"
          aria-disabled={disabled || (currentValue !== null && currentValue <= min)}
          className={`ant-input-number-handler ant-input-number-handler-down ${disabled || (currentValue !== null && currentValue <= min) ? 'ant-input-number-handler-disabled' : ''}`}
          onClick={() => stepValue('down')}
          onMouseDown={(e) => e.preventDefault()}
        >
          {downIcon}
        </span>
      </div>
    </div>
  );
};

export default InputNumber;
