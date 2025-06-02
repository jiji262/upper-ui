// src/components/ui/data-entry/DatePicker/DatePicker.tsx
import React, { useState, useEffect, useRef } from 'react';
import Input from '../Input/Input'; // Assuming Input component is available
import Icon from '../../general/Icon'; // Assuming Icon component is available
import './DatePicker.css';

// Basic date formatting (YYYY-MM-DD)
const formatDate = (date: Date | null, formatStr: string = 'YYYY-MM-DD'): string => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  // Super basic replace, a library like date-fns or moment would be better for robust formatting
  return formatStr
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day);
};

// Basic date parsing (YYYY-MM-DD)
const parseDate = (dateStr: string, formatStr: string = 'YYYY-MM-DD'): Date | null => {
  if (!dateStr) return null;
  // Basic parsing, assumes YYYY-MM-DD format primarily
  // For more robust parsing, a library is essential
  const parts = dateStr.split('-');
  if (formatStr === 'YYYY-MM-DD' && parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
    const day = parseInt(parts[2], 10);
    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      const d = new Date(year, month, day);
      // Check if date is valid (e.g. not Feb 30)
      if (d.getFullYear() === year && d.getMonth() === month && d.getDate() === day) {
        return d;
      }
    }
  }
  return null; // Invalid format or date
};


interface DatePickerProps {
  value?: Date | null; // Controlled value
  defaultValue?: Date | null;
  onChange?: (date: Date | null, dateString: string) => void;
  format?: string | string[] | ((value: Date) => string); // Date format string or function
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  size?: 'large' | 'middle' | 'small';
  status?: 'error' | 'warning';
  picker?: 'date' | 'week' | 'month' | 'quarter' | 'year'; // Type of picker
  // For this simplified version, we'll mainly focus on 'date' picker.
  // Other props like `disabledDate`, `renderExtraFooter`, `showTime`, `showNow`, `showToday` are more advanced.
  open?: boolean; // Controlled open state for calendar popup
  onOpenChange?: (open: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
  // A very simplified internal calendar for demo purposes
  // In a real component, this would be a full calendar implementation
  renderCalendarPopup?: (currentDate: Date | null, onSelectDate: (date: Date) => void) => React.ReactNode;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value: controlledValue,
  defaultValue,
  onChange,
  format = 'YYYY-MM-DD', // Default format
  placeholder = 'Select date',
  disabled = false,
  allowClear = true,
  size,
  status,
  picker = 'date', // Focus on 'date' picker
  open: controlledOpen,
  onOpenChange,
  className,
  style,
  renderCalendarPopup,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(defaultValue || null);
  const [inputValue, setInputValue] = useState(formatDate(defaultValue || null, typeof format === 'string' ? format : undefined));
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const displayFormat = Array.isArray(format) ? format[0] : typeof format === 'function' ? undefined : format;


  useEffect(() => {
    if (controlledValue !== undefined) {
      setSelectedDate(controlledValue);
      setInputValue(formatDate(controlledValue, displayFormat));
    }
  }, [controlledValue, displayFormat]);
  
  useEffect(() => {
    if (controlledOpen !== undefined) {
        setIsPopupVisible(controlledOpen);
    }
  }, [controlledOpen]);

  useEffect(() => {
    onOpenChange?.(isPopupVisible);
  }, [isPopupVisible, onOpenChange]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current && !containerRef.current.contains(event.target as Node) &&
        popupRef.current && !popupRef.current.contains(event.target as Node)
      ) {
         if (controlledOpen === undefined) setIsPopupVisible(false);
      }
    };
    if (isPopupVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPopupVisible, controlledOpen]);


  const handleDateChange = (date: Date | null, dateString: string) => {
    if (controlledValue === undefined) {
      setSelectedDate(date);
      setInputValue(dateString);
    }
    onChange?.(date, dateString);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const strValue = e.target.value;
    setInputValue(strValue); // Allow user to type
    
    // Try to parse when input changes (AntD might do this on blur or Enter)
    const parsed = parseDate(strValue, displayFormat);
    if (parsed) {
        if (selectedDate?.getTime() !== parsed.getTime()){ // Only update if different
            handleDateChange(parsed, formatDate(parsed, displayFormat));
        }
    } else if (strValue === '') { // If input is cleared
        handleDateChange(null, '');
    }
  };

  const handleInputBlur = () => {
    // On blur, validate and format the input value
    const parsed = parseDate(inputValue, displayFormat);
    if (parsed) {
      const formatted = formatDate(parsed, displayFormat);
      if (inputValue !== formatted) { // If user typed a valid but unformatted date
        setInputValue(formatted); 
      }
      // Ensure selectedDate is also in sync if parsing was successful
      if (selectedDate?.getTime() !== parsed.getTime()) {
        handleDateChange(parsed, formatted);
      }
    } else if (inputValue !== '') {
      // Invalid date typed, revert to last valid selectedDate's string representation
      setInputValue(formatDate(selectedDate, displayFormat));
    }
  };
  

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleDateChange(null, '');
    if (controlledOpen === undefined && isPopupVisible) setIsPopupVisible(false);
  };
  
  const handleSelectDateFromPopup = (date: Date) => {
    handleDateChange(date, formatDate(date, displayFormat));
    if (controlledOpen === undefined) setIsPopupVisible(false);
  };

  // Basic calendar popup for demo (not a full implementation)
  const defaultCalendarPopup = (
    <div className="ant-picker-panel">
      <div className="ant-picker-header">
        <div className="ant-picker-header-view">
          {selectedDate ? formatDate(selectedDate, 'MMMM YYYY') : 'Select a date'}
        </div>
      </div>
      <div className="ant-picker-body">
        <p style={{padding: '10px', textAlign: 'center'}}>
            (Simplified Calendar Popup) <br/>
            Select today to test:
        </p>
        <button 
            type="button" 
            onClick={() => handleSelectDateFromPopup(new Date())}
            style={{margin: '0 auto', display: 'block', padding: '5px 10px'}}
        >
            Today
        </button>
         {/* A real calendar would render days of month here */}
      </div>
    </div>
  );
  
  const calendarNode = renderCalendarPopup 
    ? renderCalendarPopup(selectedDate, handleSelectDateFromPopup) 
    : defaultCalendarPopup;


  const inputSuffix = (
    <>
      {allowClear && inputValue && !disabled && (
        <Icon name="CloseCircleFilled" className="ant-picker-clear" onClick={handleClear} />
      )}
      <Icon name={picker === 'time' ? "ClockCircleOutlined" : "CalendarOutlined"} className="ant-picker-suffix" />
    </>
  );

  const containerClasses = [
    'ant-picker', // Common class for all pickers
    `ant-picker-size-${size || 'middle'}`,
    disabled ? 'ant-picker-disabled' : '',
    status ? `ant-picker-status-${status}` : '',
    isPopupVisible ? 'ant-picker-open' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div ref={containerRef} className={containerClasses} style={style}>
      <Input
        readOnly // Make input readonly to force selection via picker, or allow typing
        value={inputValue}
        placeholder={placeholder}
        disabled={disabled}
        size={size}
        status={status}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onClick={() => !disabled && (controlledOpen === undefined ? setIsPopupVisible(!isPopupVisible) : onOpenChange?.(!isPopupVisible))}
        suffix={inputSuffix}
        // className for input needs to be `ant-picker-input` for some antd styles
        // This depends on how Input component handles className merging
        // For now, assuming Input component itself has `ant-input` class
      />
      {isPopupVisible && !disabled && (
        <div ref={popupRef} className="ant-picker-dropdown">
            {calendarNode}
        </div>
      )}
    </div>
  );
};

export default DatePicker;
