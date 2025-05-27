// src/components/ui/data-entry/TimePicker/TimePicker.tsx
import React, { useState, useEffect, useRef } from 'react';
import Input, { InputProps } from '../Input/Input'; // Assuming Input is available
import Icon from '../../general/Icon'; // Assuming Icon is available
import './TimePicker.css';

// Basic time formatting (HH:mm or HH:mm:ss)
const formatTime = (date: Date | null, formatStr: string = 'HH:mm'): string => {
  if (!date) return '';
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  
  if (formatStr.includes('ss')) {
    return `${hours}:${minutes}:${seconds}`;
  }
  return `${hours}:${minutes}`;
};

// Basic time parsing (HH:mm or HH:mm:ss from string to Date object with today's date)
const parseTime = (timeStr: string, formatStr: string = 'HH:mm'): Date | null => {
  if (!timeStr) return null;
  const parts = timeStr.split(':');
  const today = new Date(); // Use today's date as base

  if (parts.length >= 2) {
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = (formatStr.includes('ss') && parts.length >= 3) ? parseInt(parts[2], 10) : 0;

    if (
      !isNaN(hours) && hours >= 0 && hours <= 23 &&
      !isNaN(minutes) && minutes >= 0 && minutes <= 59 &&
      !isNaN(seconds) && seconds >= 0 && seconds <= 59
    ) {
      today.setHours(hours, minutes, seconds, 0);
      return today;
    }
  }
  return null;
};


interface TimePickerProps extends Omit<InputProps, 'value' | 'onChange' | 'type'> {
  value?: Date | null; // Controlled value (Date object representing time)
  defaultValue?: Date | null;
  onChange?: (time: Date | null, timeString: string) => void;
  format?: 'HH:mm' | 'HH:mm:ss'; // Simplified format options
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  use12Hours?: boolean; // AM/PM mode (not fully implemented in this simplified version)
  hourStep?: number;
  minuteStep?: number;
  secondStep?: number;
  disabledHours?: () => number[]; // Functions to disable specific time units
  disabledMinutes?: (selectedHour: number | undefined) => number[];
  disabledSeconds?: (selectedHour: number | undefined, selectedMinute: number | undefined) => number[];
  // hideDisabledOptions?: boolean;
  // renderExtraFooter?: () => React.ReactNode;
  open?: boolean; // Controlled open state for time panel
  onOpenChange?: (open: boolean) => void;
  // inputReadOnly?: boolean; // Default false, allow typing
  // popupClassName?: string;
  // popupStyle?: React.CSSProperties;
  // placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';
}

const TimePicker: React.FC<TimePickerProps> = ({
  value: controlledValue,
  defaultValue,
  onChange,
  format = 'HH:mm',
  placeholder = 'Select time',
  disabled = false,
  allowClear = true,
  use12Hours = false, // Basic support, mainly affects display if implemented
  hourStep = 1,
  minuteStep = 1,
  secondStep = 1, // Only relevant if format includes seconds
  disabledHours,
  disabledMinutes,
  disabledSeconds,
  open: controlledOpen,
  onOpenChange,
  // inputReadOnly = false,
  className,
  style,
  size, // from InputProps
  status, // from InputProps
  ...restInputProps
}) => {
  const [selectedTime, setSelectedTime] = useState<Date | null>(defaultValue || null);
  const [inputValue, setInputValue] = useState(formatTime(defaultValue || null, format));
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  
  // For panel internal state
  const [panelHour, setPanelHour] = useState<number | undefined>(selectedTime?.getHours());
  const [panelMinute, setPanelMinute] = useState<number | undefined>(selectedTime?.getMinutes());
  const [panelSecond, setPanelSecond] = useState<number | undefined>(selectedTime?.getSeconds());


  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (controlledValue !== undefined) {
      setSelectedTime(controlledValue);
      setInputValue(formatTime(controlledValue, format));
      setPanelHour(controlledValue?.getHours());
      setPanelMinute(controlledValue?.getMinutes());
      setPanelSecond(controlledValue?.getSeconds());
    }
  }, [controlledValue, format]);
  
  useEffect(() => {
    if (controlledOpen !== undefined) {
        setIsPanelVisible(controlledOpen);
    }
  }, [controlledOpen]);

  useEffect(() => {
    onOpenChange?.(isPanelVisible);
    if (isPanelVisible) { // When panel opens, sync panel with current selected time
        setPanelHour(selectedTime?.getHours());
        setPanelMinute(selectedTime?.getMinutes());
        setPanelSecond(selectedTime?.getSeconds());
    }
  }, [isPanelVisible, onOpenChange, selectedTime]);


  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current && !containerRef.current.contains(event.target as Node) &&
        panelRef.current && !panelRef.current.contains(event.target as Node)
      ) {
         if (controlledOpen === undefined) setIsPanelVisible(false);
      }
    };
    if (isPanelVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPanelVisible, controlledOpen]);


  const handleTimeChange = (time: Date | null, timeString: string) => {
    if (controlledValue === undefined) {
      setSelectedTime(time);
      setInputValue(timeString);
    }
    onChange?.(time, timeString);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const strValue = e.target.value;
    setInputValue(strValue);
    const parsed = parseTime(strValue, format);
    if (parsed) {
        if (selectedTime?.getTime() !== parsed.getTime()) {
            handleTimeChange(parsed, formatTime(parsed, format));
        }
    } else if (strValue === '') {
        handleTimeChange(null, '');
    }
  };

  const handleInputBlur = () => {
    const parsed = parseTime(inputValue, format);
    if (parsed) {
      const formatted = formatTime(parsed, format);
      if (inputValue !== formatted) setInputValue(formatted);
      if(selectedTime?.getTime() !== parsed.getTime()) {
         handleTimeChange(parsed, formatted);
      }
    } else if (inputValue !== '') {
      setInputValue(formatTime(selectedTime, format)); // Revert to last valid
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleTimeChange(null, '');
    if (controlledOpen === undefined && isPanelVisible) setIsPanelVisible(false);
  };
  
  const selectTimeFromPanel = (type: 'hour' | 'minute' | 'second', value: number) => {
    let newTime = selectedTime ? new Date(selectedTime.getTime()) : new Date();
    if (!selectedTime) { // If no time selected, default to 00:00:00 then set part
        newTime.setHours(0,0,0,0);
    }

    if (type === 'hour') newTime.setHours(value);
    else if (type === 'minute') newTime.setMinutes(value);
    else if (type === 'second') newTime.setSeconds(value);
    
    // Update panel state immediately for responsiveness
    if (type === 'hour') setPanelHour(value);
    if (type === 'minute') setPanelMinute(value);
    if (type === 'second') setPanelSecond(value);

    // For this simplified picker, selecting any unit will update the main value.
    // A real AntD picker might wait for an "Ok" button or selecting all relevant units.
    handleTimeChange(newTime, formatTime(newTime, format));
    
    // Optionally close panel after selection, or wait for "Ok" button if implemented
    // if (controlledOpen === undefined) setIsPanelVisible(false); 
  };
  
  const renderTimeColumn = (unit: 'hour' | 'minute' | 'second', max: number, step: number, disabledCheck?: (val: number) => boolean, currentUnitValue?: number) => {
    const items = [];
    for (let i = 0; i < max; i += step) {
      const isDisabled = disabledCheck ? disabledCheck(i) : false;
      items.push(
        <li
          key={`${unit}-${i}`}
          className={`ant-picker-time-panel-cell ${isDisabled ? 'ant-picker-time-panel-cell-disabled' : ''} ${currentUnitValue === i ? 'ant-picker-time-panel-cell-selected' : ''}`}
          onClick={() => !isDisabled && selectTimeFromPanel(unit, i)}
        >
          <div className="ant-picker-time-panel-cell-inner">{i.toString().padStart(2, '0')}</div>
        </li>
      );
    }
    return <ul className={`ant-picker-time-panel-column ant-picker-time-panel-column-${unit}`}>{items}</ul>;
  };
  
  // Simplified panel (no scrolling to selected, no complex disabling logic based on other units)
  const timeSelectionPanel = (
    <div className="ant-picker-time-panel-body">
        {renderTimeColumn('hour', use12Hours ? 12 : 24, hourStep, disabledHours ? () => disabledHours().includes(panelHour!) : undefined, panelHour)}
        {renderTimeColumn('minute', 60, minuteStep, disabledMinutes ? () => disabledMinutes(panelHour).includes(panelMinute!) : undefined, panelMinute)}
        {format.includes('ss') && renderTimeColumn('second', 60, secondStep, disabledSeconds ? () => disabledSeconds(panelHour, panelMinute).includes(panelSecond!) : undefined, panelSecond)}
        {/* AM/PM selector would go here if use12Hours */}
    </div>
  );

  const panel = (
    <div className="ant-picker-panel">
      <div className="ant-picker-header">
        <div className="ant-picker-header-view">Select Time</div>
      </div>
      <div className="ant-picker-body">
         {timeSelectionPanel}
      </div>
      {/* Optional: Footer with "Now" and "Ok" buttons */}
      {/* <div className="ant-picker-footer">
        <button type="button" onClick={() => { handleTimeChange(new Date(), formatTime(new Date(), format)); setIsPanelVisible(false);}}>Now</button>
        <button type="button" className="ant-picker-ok-btn" onClick={() => setIsPanelVisible(false)}>Ok</button>
      </div> */}
    </div>
  );

  const inputSuffix = (
    <>
      {allowClear && inputValue && !disabled && (
        <Icon name="CloseCircleFilled" className="ant-picker-clear" onClick={handleClear} />
      )}
      <Icon name="ClockCircleOutlined" className="ant-picker-suffix" />
    </>
  );

  const containerClasses = [
    'ant-picker ant-picker-time', // Common class for all pickers, specific for time
    `ant-picker-size-${size || 'middle'}`,
    disabled ? 'ant-picker-disabled' : '',
    status ? `ant-picker-status-${status}` : '',
    isPanelVisible ? 'ant-picker-open' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div ref={containerRef} className={containerClasses} style={style}>
      <Input
        {...restInputProps}
        // readOnly={inputReadOnly}
        value={inputValue}
        placeholder={placeholder}
        disabled={disabled}
        size={size}
        status={status}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onClick={() => !disabled && (controlledOpen === undefined ? setIsPanelVisible(!isPanelVisible) : onOpenChange?.(!isPanelVisible))}
        suffix={inputSuffix}
      />
      {isPanelVisible && !disabled && (
        <div ref={panelRef} className="ant-picker-dropdown">
            {panel}
        </div>
      )}
    </div>
  );
};

export default TimePicker;
