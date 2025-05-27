import React, { useState, useRef, useEffect } from 'react';
import './Select.css';

export interface SelectOption {
  label: React.ReactNode;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string | number | (string | number)[];
  defaultValue?: string | number | (string | number)[];
  placeholder?: string;
  disabled?: boolean;
  mode?: 'multiple' | 'tags';
  onChange?: (value: string | number | (string | number)[]) => void;
  className?: string;
  style?: React.CSSProperties;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  defaultValue,
  placeholder = 'Please select',
  disabled = false,
  mode,
  onChange,
  className = '',
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string | number | (string | number)[]>(
    value !== undefined ? value : defaultValue !== undefined ? defaultValue : mode ? [] : ''
  );
  const selectRef = useRef<HTMLDivElement>(null);

  // Update internal value when controlled value changes
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;

    let newValue: string | number | (string | number)[];

    if (mode === 'multiple' || mode === 'tags') {
      const valueArray = Array.isArray(internalValue) ? internalValue : [];
      const optionIndex = valueArray.indexOf(option.value);
      
      if (optionIndex > -1) {
        // Remove option if already selected (in multiple mode)
        newValue = [...valueArray.slice(0, optionIndex), ...valueArray.slice(optionIndex + 1)];
      } else {
        // Add option
        newValue = [...valueArray, option.value];
      }
    } else {
      // Single selection mode
      newValue = option.value;
      setIsOpen(false); // Close dropdown in single mode
    }

    setInternalValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const getSelectedLabel = () => {
    if (mode === 'multiple' || mode === 'tags') {
      if (!Array.isArray(internalValue) || internalValue.length === 0) {
        return placeholder;
      }

      return `${internalValue.length} selected`;
    }

    const selectedOption = options.find(opt => opt.value === internalValue);
    return selectedOption ? selectedOption.label : placeholder;
  };

  const isOptionSelected = (optionValue: string | number) => {
    if (mode === 'multiple' || mode === 'tags') {
      return Array.isArray(internalValue) && internalValue.includes(optionValue);
    }
    return internalValue === optionValue;
  };

  return (
    <div 
      ref={selectRef} 
      className={`upper-select ${isOpen ? 'upper-select-open' : ''} ${disabled ? 'upper-select-disabled' : ''} ${className}`}
      style={style}
    >
      <div 
        className="upper-select-selector"
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className="upper-select-selection-item">
          {getSelectedLabel()}
        </span>
        <span className="upper-select-arrow">▼</span>
      </div>

      {isOpen && (
        <div className="upper-select-dropdown">
          <div className="upper-select-dropdown-content">
            {options.map((option, index) => (
              <div
                key={index}
                className={`upper-select-item ${isOptionSelected(option.value) ? 'upper-select-item-selected' : ''} ${option.disabled ? 'upper-select-item-disabled' : ''}`}
                onClick={() => handleSelect(option)}
              >
                {option.label}
                {isOptionSelected(option.value) && mode !== 'multiple' && (
                  <span className="upper-select-item-selected-icon">✓</span>
                )}
                {isOptionSelected(option.value) && (mode === 'multiple' || mode === 'tags') && (
                  <span className="upper-select-item-selected-icon">✓</span>
                )}
              </div>
            ))}
            {options.length === 0 && (
              <div className="upper-select-empty">No options</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Select; 