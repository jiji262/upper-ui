// src/components/ui/data-display/Statistic/Statistic.tsx
import React, { isValidElement } from 'react';
import Icon from '../../general/Icon/Icon'; // Assuming Icon is available for loading state
import Countdown, { CountdownProps } from './Countdown'; // Import Countdown
import './Statistic.css';

type ValueType = number | string;

interface StatisticProps {
  title?: React.ReactNode;
  value?: ValueType;
  formatter?: (value: ValueType) => React.ReactNode;
  precision?: number;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  loading?: boolean; // Default false
  
  valueStyle?: React.CSSProperties; // Style for the value area
  decimalSeparator?: string; // Default '.'
  groupSeparator?: string; // Default ','
  
  className?: string;
  style?: React.CSSProperties;
  // AntD also has `onFinish` for countdown, and `onChange` when value differs from target for countdown
}

const Statistic: React.FC<StatisticProps> = ({
  title,
  value,
  formatter,
  precision,
  prefix,
  suffix,
  loading = false,
  valueStyle,
  decimalSeparator = '.',
  groupSeparator = ',',
  className,
  style,
}) => {

  const formatValue = (val?: ValueType): React.ReactNode => {
    if (val === undefined || val === null) return '-'; // AntD displays '-' for undefined/null

    let displayVal: string | React.ReactNode = String(val);

    if (typeof val === 'number') {
      let numStr = String(val);
      if (precision !== undefined) {
        numStr = val.toFixed(precision);
      }
      const parts = numStr.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator);
      displayVal = parts.join(decimalSeparator);
    }
    
    // If formatter is provided, it takes precedence
    if (formatter) {
      return formatter(val); // Formatter receives original value
    }

    return displayVal;
  };

  const formattedValue = loading ? (
    <Icon name="LoadingOutlined" spin />
  ) : (
    formatValue(value)
  );

  const statisticClasses = [
    'ant-statistic',
    loading ? 'ant-statistic-loading' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={statisticClasses} style={style}>
      {title && <div className="ant-statistic-title">{title}</div>}
      <div className="ant-statistic-content" style={valueStyle}>
        {prefix && <span className="ant-statistic-content-prefix">{prefix}</span>}
        <span className="ant-statistic-content-value">{formattedValue}</span>
        {suffix && <span className="ant-statistic-content-suffix">{suffix}</span>}
      </div>
    </div>
  );
};

// Assign Countdown as a static property
(Statistic as any).Countdown = Countdown;

export default Statistic;
