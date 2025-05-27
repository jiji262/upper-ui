import React, { useState, useEffect } from 'react';
import './Textarea.css';

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  showCount?: boolean;
  maxLength?: number;
  status?: 'error' | 'warning';
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const Textarea: React.FC<TextareaProps> = ({
  className = '',
  showCount = false,
  maxLength,
  status,
  onChange,
  value,
  defaultValue,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState<string>(
    (value !== undefined ? String(value) : defaultValue !== undefined ? String(defaultValue) : '')
  );

  // Update internal value when controlled value changes
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(String(value));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    
    if (maxLength !== undefined && val.length > maxLength) {
      // If we exceed maxLength, trim the value
      e.target.value = val.slice(0, maxLength);
      setInternalValue(e.target.value);
    } else {
      setInternalValue(val);
    }
    
    if (onChange) {
      onChange(e);
    }
  };

  const getCount = () => {
    const textLength = internalValue.length;
    if (maxLength !== undefined) {
      return `${textLength}/${maxLength}`;
    }
    return textLength;
  };

  const statusClass = status ? `upper-textarea-${status}` : '';

  return (
    <div className={`upper-textarea-wrapper ${className}`}>
      <textarea
        className={`upper-textarea ${statusClass}`}
        value={value !== undefined ? value : undefined}
        defaultValue={defaultValue !== undefined ? defaultValue : undefined}
        onChange={handleChange}
        maxLength={maxLength}
        {...props}
      />
      {showCount && (
        <span className="upper-textarea-count">{getCount()}</span>
      )}
    </div>
  );
};

export default Textarea; 