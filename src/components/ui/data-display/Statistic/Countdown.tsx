// src/components/ui/data-display/Statistic/Countdown.tsx
import React, { useState, useEffect, useRef } from 'react';
import Statistic from './Statistic'; // Import main Statistic for formatting

// Helper to format time from milliseconds
// Example: format="HH:mm:ss" or "DD HH:mm:ss SSS" (AntD supports these)
// This is a very simplified version, focusing on HH:mm:ss.
const formatCountdownTime = (ms: number, formatStr: string = 'HH:mm:ss'): string => {
  if (ms <= 0) {
    return formatStr.replace(/[HhDdMmSs]/g, '0'); // All zeros if time is up
  }

  let seconds = Math.floor((ms / 1000) % 60);
  let minutes = Math.floor((ms / (1000 * 60)) % 60);
  let hours = Math.floor((ms / (1000 * 60 * 60)) % 24); // Assuming less than 24 hours for simplicity
  // Days (DD) and milliseconds (SSS) not handled in this simplified formatter

  const H = hours.toString().padStart(2, '0');
  const m = minutes.toString().padStart(2, '0');
  const s = seconds.toString().padStart(2, '0');
  
  // Basic replacement
  return formatStr.replace('HH', H).replace('mm', m).replace('ss', s);
};


export interface CountdownProps {
  value: number | string; // Target time (timestamp as number or string parsable by Date.parse())
  format?: string; // Default 'HH:mm:ss'
  onFinish?: () => void;
  onChange?: (value: number) => void; // Current remaining time in ms
  
  title?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  valueStyle?: React.CSSProperties;
  className?: string;
  style?: React.CSSProperties;
}

const Countdown: React.FC<CountdownProps> = ({
  value, // Target timestamp
  format = 'HH:mm:ss',
  onFinish,
  onChange,
  ...restStatisticProps // Pass other props like title, prefix, suffix, valueStyle to Statistic
}) => {
  const targetTime = typeof value === 'string' ? Date.parse(value) : value;
  const [remainingTime, setRemainingTime] = useState(Math.max(0, targetTime - Date.now()));
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setRemainingTime(Math.max(0, targetTime - Date.now())); // Update if targetTime prop changes

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (targetTime > Date.now()) {
      intervalRef.current = setInterval(() => {
        const newRemaining = Math.max(0, targetTime - Date.now());
        setRemainingTime(newRemaining);
        onChange?.(newRemaining);

        if (newRemaining === 0) {
          onFinish?.();
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      }, 1000); // Update every second
    } else {
        // If targetTime is already passed or invalid, ensure remainingTime is 0
        setRemainingTime(0); 
        // onFinish might have been called if it was previously > 0 and just hit 0
        // If it starts as <=0, call onFinish if it hasn't been called.
        if (targetTime <= Date.now() && remainingTime > 0) { // Check if it *just* passed
            onFinish?.();
        }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [targetTime, onFinish, onChange]); // Re-run effect if targetTime, onFinish, or onChange changes

  const formattedTime = formatCountdownTime(remainingTime, format);

  return (
    <Statistic
      {...restStatisticProps}
      value={formattedTime} // Pass formatted string as value to Statistic
      // Formatter prop of Statistic is not used here, as Countdown provides the direct string value
    />
  );
};

export default Countdown;
