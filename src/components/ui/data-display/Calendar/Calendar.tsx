// src/components/ui/data-display/Calendar/Calendar.tsx
import React, { useState, useEffect } from 'react';
import Button from '../../general/Button/Button'; // Assuming Button is available
import Icon from '../../general/Icon/Icon';   // Assuming Icon is available
import './Calendar.css';

// Helper to get days in a month
const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

// Helper to get the first day of the month (0 for Sunday, 1 for Monday, etc.)
const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

// Month names for header
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Day names for header (short)
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];


interface CalendarProps {
  value?: Date; // Controlled selected date
  defaultValue?: Date; // Default selected date
  onChange?: (date: Date) => void; // Callback when a date is selected
  onPanelChange?: (date: Date, mode: 'month' | 'year') => void; // When month/year changes through UI
  
  mode?: 'month' | 'year'; // Current view mode (simplified: only month view implemented)
  // fullscreen?: boolean; // Default true, false for card style (not fully implemented here)
  // validRange?: [Date, Date]; // Dates outside this range are disabled
  // disabledDate?: (current: Date) => boolean; // Function to disable specific dates
  // dateCellRender?: (date: Date) => React.ReactNode; // Custom content for date cells
  // monthCellRender?: (date: Date) => React.ReactNode; // Custom content for month cells (in year view)
  // headerRender?: (props: { value: Date; type: string; onChange: (date: Date) => void; onTypeChange: (type: string) => void; }) => React.ReactNode;

  className?: string;
  style?: React.CSSProperties;
  // locale?: object; // For internationalization, not implemented
}

const Calendar: React.FC<CalendarProps> = ({
  value: controlledValue,
  defaultValue,
  onChange,
  onPanelChange,
  mode = 'month', // Focus on month mode
  // fullscreen = true,
  className,
  style,
}) => {
  const [currentDisplayDate, setCurrentDisplayDate] = useState(defaultValue || controlledValue || new Date());
  const [selectedValue, setSelectedValue] = useState<Date | undefined>(defaultValue || controlledValue);

  useEffect(() => {
    if (controlledValue !== undefined) {
      setSelectedValue(controlledValue);
      // If controlled value changes, update display month if different
      if (controlledValue && (controlledValue.getFullYear() !== currentDisplayDate.getFullYear() || controlledValue.getMonth() !== currentDisplayDate.getMonth())) {
        setCurrentDisplayDate(new Date(controlledValue));
      }
    }
  }, [controlledValue, currentDisplayDate]);


  const year = currentDisplayDate.getFullYear();
  const month = currentDisplayDate.getMonth(); // 0-indexed

  const daysInCurrentMonth = getDaysInMonth(year, month);
  const firstDayOfCurrentMonth = getFirstDayOfMonth(year, month);

  const handlePrevMonth = () => {
    const newDisplayDate = new Date(year, month - 1, 1);
    setCurrentDisplayDate(newDisplayDate);
    onPanelChange?.(newDisplayDate, 'month');
  };

  const handleNextMonth = () => {
    const newDisplayDate = new Date(year, month + 1, 1);
    setCurrentDisplayDate(newDisplayDate);
    onPanelChange?.(newDisplayDate, 'month');
  };
  
  const handleToday = () => {
    const today = new Date();
    setCurrentDisplayDate(today);
    // If today is different from selected, update selected as well
    if (selectedValue?.toDateString() !== today.toDateString()) {
        if (controlledValue === undefined) {
            setSelectedValue(today);
        }
        onChange?.(today);
    }
    onPanelChange?.(today, 'month');
  };

  const handleDateSelect = (day: number) => {
    const newSelectedDate = new Date(year, month, day);
    if (controlledValue === undefined) {
      setSelectedValue(newSelectedDate);
    }
    onChange?.(newSelectedDate);
  };

  const renderDays = () => {
    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfCurrentMonth; i++) {
      days.push(<td key={`empty-prev-${i}`} className="ant-picker-cell ant-picker-cell-disabled"></td>);
    }

    // Add cells for each day in the month
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const currentDate = new Date(year, month, day);
      const isSelected = selectedValue?.toDateString() === currentDate.toDateString();
      const isToday = new Date().toDateString() === currentDate.toDateString();
      
      const cellClasses = [
        'ant-picker-cell',
        'ant-picker-cell-in-view', // All cells in current month are in view
        isSelected ? 'ant-picker-cell-selected' : '',
        isToday ? 'ant-picker-cell-today' : '',
        // Add disabled class if disabledDate prop is implemented
      ].filter(Boolean).join(' ');

      days.push(
        <td
          key={day}
          className={cellClasses}
          title={currentDate.toLocaleDateString()}
          onClick={() => handleDateSelect(day)}
        >
          <div className="ant-picker-cell-inner ant-calendar-date">
            <div className="ant-calendar-date-value">{day}</div>
            <div className="ant-calendar-date-content">
              {/* Custom content via dateCellRender would go here */}
            </div>
          </div>
        </td>
      );
    }
    
    // Group days into weeks (rows)
    const rows = [];
    let cells: React.ReactNode[] = [];
    days.forEach((dayCell, index) => {
      cells.push(dayCell);
      if ((index + 1) % 7 === 0 || index === days.length - 1) {
        // Fill remaining cells if last week is not full
        if (index === days.length - 1 && cells.length < 7) {
            for (let i = cells.length; i < 7; i++) {
                cells.push(<td key={`empty-next-${i}`} className="ant-picker-cell ant-picker-cell-disabled"></td>);
            }
        }
        rows.push(<tr key={`week-${rows.length}`}>{cells}</tr>);
        cells = [];
      }
    });
    return rows;
  };
  
  // Simplified header, AntD has more controls (Year/Month select, mode switch)
  const calendarHeader = (
    <div className="ant-picker-header ant-calendar-header">
        <div className="ant-picker-header-view">
            {monthNames[month]} {year}
        </div>
        <div className="ant-calendar-header-controls">
            <Button size="small" onClick={handlePrevMonth} icon={<Icon name="LeftOutlined" />} />
            <Button size="small" onClick={handleToday} style={{ margin: '0 8px' }}>Today</Button>
            <Button size="small" onClick={handleNextMonth} icon={<Icon name="RightOutlined" />} />
        </div>
    </div>
  );

  const containerClasses = [
    'ant-picker-panel', // Use common picker panel class
    'ant-calendar',
    // fullscreen ? 'ant-calendar-fullscreen' : 'ant-calendar-card',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} style={style}>
      {calendarHeader}
      <div className="ant-picker-body">
        <table className="ant-picker-content">
          <thead>
            <tr>
              {dayNames.map(day => <th key={day}>{day}</th>)}
            </tr>
          </thead>
          <tbody>
            {renderDays()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Calendar;
