// src/components/ui/data-entry/AutoComplete/AutoComplete.tsx
import React, { useState, useEffect, useRef } from 'react';
import Input, { InputProps } from '../Input/Input'; // Assuming Input component is available
import './AutoComplete.css';

export interface AutoCompleteOption {
  value: string;
  label?: React.ReactNode; // If label is not provided, value is used
  [key: string]: any; // Allow other properties on option object
}

interface AutoCompleteProps extends Omit<InputProps, 'onChange' | 'value' | 'onSelect'> {
  options: AutoCompleteOption[];
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  filterOption?: boolean | ((inputValue: string, option: AutoCompleteOption) => boolean);
  onSearch?: (value: string) => void;
  onSelect?: (value: string, option: AutoCompleteOption) => void;
  onChange?: (value: string) => void; // Triggered when input value changes or an option is selected
  placeholder?: string;
  notFoundContent?: React.ReactNode;
  allowClear?: boolean;
  autoFocus?: boolean;
  backfill?: boolean; // Fill input with selected option's value on hover/arrow key
  defaultActiveFirstOption?: boolean;
  dropdownClassName?: string;
  dropdownMatchSelectWidth?: boolean | number; // Default true
  dropdownStyle?: React.CSSProperties;
  status?: 'error' | 'warning';
  open?: boolean; // Controlled open state
  onDropdownVisibleChange?: (open: boolean) => void;
}

const AutoComplete: React.FC<AutoCompleteProps> = ({
  options = [],
  value: controlledValue,
  defaultValue = '',
  disabled = false,
  filterOption = true, // Default true: basic case-insensitive filtering
  onSearch,
  onSelect,
  onChange,
  placeholder,
  notFoundContent = 'Not Found',
  allowClear,
  autoFocus,
  backfill = false,
  defaultActiveFirstOption = true,
  dropdownClassName,
  dropdownMatchSelectWidth = true,
  dropdownStyle,
  status,
  open: controlledOpen,
  onDropdownVisibleChange,
  style,
  className,
  ...restInputProps
}) => {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<AutoCompleteOption[]>(options);
  const [activeIndex, setActiveIndex] = useState<number | null>(null); // For keyboard navigation

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (controlledValue !== undefined) {
      setInputValue(controlledValue);
    }
  }, [controlledValue]);

  useEffect(() => {
    if (controlledOpen !== undefined) {
      setIsDropdownVisible(controlledOpen);
    }
  }, [controlledOpen]);

  useEffect(() => {
    if (onDropdownVisibleChange) {
        onDropdownVisibleChange(isDropdownVisible);
    }
    if (isDropdownVisible && defaultActiveFirstOption && filteredOptions.length > 0) {
        setActiveIndex(0);
    } else if (!isDropdownVisible) {
        setActiveIndex(null);
    }
  }, [isDropdownVisible, onDropdownVisibleChange, defaultActiveFirstOption, filteredOptions]);


  useEffect(() => {
    // Filter options based on inputValue
    let newFilteredOptions: AutoCompleteOption[];
    if (filterOption === true) {
      newFilteredOptions = options.filter(opt =>
        opt.value.toLowerCase().includes(inputValue.toLowerCase())
      );
    } else if (typeof filterOption === 'function') {
      newFilteredOptions = options.filter(opt => filterOption(inputValue, opt));
    } else {
      newFilteredOptions = options; // No filtering or custom filtering handled by onSearch
    }
    setFilteredOptions(newFilteredOptions);

    if (inputValue && !isDropdownVisible && controlledOpen === undefined) {
        setIsDropdownVisible(true);
    }
    if (inputValue === '' && controlledOpen === undefined) {
        setIsDropdownVisible(false);
    }

  }, [inputValue, options, filterOption, isDropdownVisible, controlledOpen]);
  
  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && !inputRef.current.contains(event.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node)
      ) {
        if (controlledOpen === undefined) setIsDropdownVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [controlledOpen]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (controlledValue === undefined) {
      setInputValue(newValue);
    }
    onSearch?.(newValue);
    onChange?.(newValue); // General onChange for input
    if (controlledOpen === undefined) setIsDropdownVisible(true);
  };

  const handleOptionClick = (option: AutoCompleteOption) => {
    if (controlledValue === undefined) {
      setInputValue(option.value);
    }
    onSelect?.(option.value, option);
    onChange?.(option.value); // General onChange for selection
    if (controlledOpen === undefined) setIsDropdownVisible(false);
    inputRef.current?.focus();
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownVisible || filteredOptions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => (prev === null || prev >= filteredOptions.length - 1 ? 0 : prev + 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => (prev === null || prev <= 0 ? filteredOptions.length - 1 : prev - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex !== null && filteredOptions[activeIndex]) {
          handleOptionClick(filteredOptions[activeIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        if (controlledOpen === undefined) setIsDropdownVisible(false);
        break;
    }
  };
  
  useEffect(() => {
    if (backfill && activeIndex !== null && filteredOptions[activeIndex] && isDropdownVisible) {
      // Temporarily set input value for backfill effect, but don't trigger onChange
      // This is a simplified backfill. Real AntD might preserve original inputValue until selection.
      // setInputValue(filteredOptions[activeIndex].value); // This would trigger filtering again.
      // Better to handle this directly in Input's display if possible, or manage a separate displayValue state.
    }
  }, [activeIndex, backfill, filteredOptions, isDropdownVisible]);


  const containerClasses = ['ant-autocomplete', className].filter(Boolean).join(' ');
  const dropdownClasses = [
    'ant-autocomplete-dropdown',
    dropdownClassName,
    // Add theme or status classes if applicable from a shared context or props
  ].filter(Boolean).join(' ');
  
  const composedDropdownStyle: React.CSSProperties = { ...dropdownStyle };
  if (dropdownMatchSelectWidth && inputRef.current) {
    composedDropdownStyle.width = typeof dropdownMatchSelectWidth === 'number' 
        ? dropdownMatchSelectWidth 
        : inputRef.current.offsetWidth;
  }


  return (
    <div className={containerClasses} style={style}>
      <Input
        ref={inputRef}
        {...restInputProps}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => { if (controlledOpen === undefined && !disabled) setIsDropdownVisible(true); }}
        // onBlur={() => { if (controlledOpen === undefined && !dropdownRef.current?.contains(document.activeElement)) setIsDropdownVisible(false); }} // Complex due to option clicks
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        status={status}
        autoFocus={autoFocus}
        allowClear={allowClear}
        // AntD Input's clear button logic needs to be handled if allowClear is true
        // This might require Input to expose a way to clear or AutoComplete to wrap Input more closely
        // For simplicity, assuming Input's own allowClear works, or a custom clear button is added here.
      />
      {isDropdownVisible && (
        <div
          ref={dropdownRef}
          className={dropdownClasses}
          style={composedDropdownStyle}
          tabIndex={-1} // Make it focusable for some interactions if needed, but usually not directly
        >
          {filteredOptions.length > 0 ? (
            <ul className="ant-autocomplete-options-list">
              {filteredOptions.map((option, index) => (
                <li
                  key={option.value} // Assuming value is unique, or use a unique ID if available
                  className={`ant-autocomplete-option-item ${activeIndex === index ? 'ant-autocomplete-option-item-active' : ''}`}
                  onClick={() => handleOptionClick(option)}
                  onMouseEnter={() => { if(backfill) setActiveIndex(index); }}
                >
                  {option.label || option.value}
                </li>
              ))}
            </ul>
          ) : (
            <div className="ant-autocomplete-not-found">
              {notFoundContent}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AutoComplete;
