import React, { useState } from 'react';
import './Select.css';

export interface SelectOption {
  label: React.ReactNode;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps {
  options?: SelectOption[];
  defaultValue?: string | number | (string | number)[];
  value?: string | number | (string | number)[];
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  mode?: 'multiple' | 'tags';
  showSearch?: boolean;
  style?: React.CSSProperties;
  className?: string;
  onChange?: (value: string | number | (string | number)[]) => void;
}

const Select: React.FC<SelectProps> = ({
  options = [],
  defaultValue,
  value,
  placeholder = 'Please select',
  disabled = false,
  loading = false,
  mode,
  showSearch = false,
  style,
  className,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | number | (string | number)[]>(
    value || defaultValue || (mode ? [] : '')
  );

  const handleSelectClick = () => {
    if (!disabled && !loading) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (optionValue: string | number) => {
    let newValue: string | number | (string | number)[];
    
    if (mode === 'multiple' || mode === 'tags') {
      // For multiple selection
      const valueArray = Array.isArray(selectedValue) ? selectedValue : [];
      if (valueArray.includes(optionValue)) {
        newValue = valueArray.filter(v => v !== optionValue);
      } else {
        newValue = [...valueArray, optionValue];
      }
    } else {
      // For single selection
      newValue = optionValue;
      setIsOpen(false);
    }
    
    setSelectedValue(newValue);
    onChange?.(newValue);
  };

  const getSelectedLabel = () => {
    if (mode === 'multiple' || mode === 'tags') {
      if (Array.isArray(selectedValue) && selectedValue.length > 0) {
        return selectedValue.map(v => {
          const option = options.find(o => o.value === v);
          return option?.label || v;
        }).join(', ');
      }
      return placeholder;
    } else {
      const option = options.find(o => o.value === selectedValue);
      return option?.label || placeholder;
    }
  };

  const selectClassName = [
    'upper-select',
    isOpen ? 'upper-select-open' : '',
    disabled ? 'upper-select-disabled' : '',
    loading ? 'upper-select-loading' : '',
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <div className={selectClassName} style={style}>
      <div className="upper-select-selector" onClick={handleSelectClick}>
        <span className="upper-select-selection-item">{getSelectedLabel()}</span>
        <span className="upper-select-arrow"></span>
      </div>
      
      {isOpen && (
        <div className="upper-select-dropdown">
          <div className="upper-select-dropdown-content">
            {options.map((option) => {
              const isSelected = mode === 'multiple' || mode === 'tags' 
                ? Array.isArray(selectedValue) && selectedValue.includes(option.value)
                : selectedValue === option.value;
                
              return (
                <div
                  key={option.value}
                  className={`upper-select-item ${isSelected ? 'upper-select-item-selected' : ''} ${option.disabled ? 'upper-select-item-disabled' : ''}`}
                  onClick={() => !option.disabled && handleOptionClick(option.value)}
                >
                  {option.label}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Select; 