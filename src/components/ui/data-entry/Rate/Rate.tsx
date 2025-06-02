// src/components/ui/data-entry/Rate/Rate.tsx
import React, { useState, useEffect } from 'react';
import Icon from '../../general/Icon'; // Assuming Icon component is available
import './Rate.css';

interface RateProps {
  value?: number; // Controlled value
  defaultValue?: number;
  count?: number; // Total number of stars, default 5
  allowHalf?: boolean; // Allow semi-selected state
  allowClear?: boolean; // Allow clearing selection by clicking again, default true
  disabled?: boolean;
  tooltips?: string[]; // Array of tooltip text for each star
  character?: React.ReactNode | ((props: { index: number; value: number; status?: 'full' | 'half' | 'zero' }) => React.ReactNode); // Custom character
  onChange?: (value: number) => void;
  onHoverChange?: (value: number) => void; // Called when hover value changes
  className?: string;
  style?: React.CSSProperties;
  autoFocus?: boolean; // Not easily implemented without direct input focus
}

const Rate: React.FC<RateProps> = ({
  value: controlledValue,
  defaultValue = 0,
  count = 5,
  allowHalf = false,
  allowClear = true,
  disabled = false,
  tooltips,
  character = <Icon name="StarFilled" />,
  onChange,
  onHoverChange,
  className,
  style,
  // autoFocus, // autoFocus is tricky for a set of spans/icons
}) => {
  const [currentValue, setCurrentValue] = useState(defaultValue);
  const [hoverValue, setHoverValue] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (controlledValue !== undefined) {
      setCurrentValue(controlledValue);
    }
  }, [controlledValue]);

  const getStarValue = (index: number, eventX: number, starElement: HTMLLIElement): number => {
    if (allowHalf) {
      const rect = starElement.getBoundingClientRect();
      const starWidth = rect.width;
      if (eventX - rect.left < starWidth / 2) {
        return index + 0.5;
      }
    }
    return index + 1;
  };

  const handleClick = (index: number, event: React.MouseEvent<HTMLLIElement>) => {
    if (disabled) return;

    const starElement = event.currentTarget;
    const newValue = getStarValue(index, event.clientX, starElement);

    let finalValue = newValue;
    if (allowClear && currentValue === newValue) {
      finalValue = 0; // Clear selection
    }
    
    if (controlledValue === undefined) {
      setCurrentValue(finalValue);
    }
    onChange?.(finalValue);
  };

  const handleHover = (index: number, event?: React.MouseEvent<HTMLLIElement>) => {
    if (disabled || !event) {
      setHoverValue(undefined); // Clear hover if disabled or event is missing
      onHoverChange?.(0); // Or current actual value if preferred
      return;
    }
    const starElement = event.currentTarget;
    const currentHoverVal = getStarValue(index, event.clientX, starElement);
    setHoverValue(currentHoverVal);
    onHoverChange?.(currentHoverVal);
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    setHoverValue(undefined);
    onHoverChange?.(0); // Or current actual value
  };
  
  const displayValue = hoverValue !== undefined ? hoverValue : currentValue;

  const renderStar = (index: number) => {
    let status: 'full' | 'half' | 'zero' = 'zero';
    if (displayValue >= index + 1) {
      status = 'full';
    } else if (allowHalf && displayValue >= index + 0.5) {
      status = 'half';
    }

    let starCharacter: React.ReactNode;
    if (typeof character === 'function') {
        starCharacter = character({ index, value: displayValue, status });
    } else {
        starCharacter = character;
    }

    const starClasses = [
      'ant-rate-star',
      status === 'full' ? 'ant-rate-star-full' : '',
      status === 'half' ? 'ant-rate-star-half' : '',
      status === 'zero' ? 'ant-rate-star-zero' : '',
      // Add focus class if implementing keyboard navigation
    ].filter(Boolean).join(' ');
    
    const tooltipText = tooltips && tooltips[index] ? tooltips[index] : undefined;

    return (
      <li
        key={index}
        className={starClasses}
        title={tooltipText}
        onClick={(e) => handleClick(index, e)}
        onMouseMove={(e) => handleHover(index, e)} // Use onMouseMove for better half-star precision
        // onMouseEnter={(e) => handleHover(index, e)} // Simpler hover if not using half-star precision from mouse
      >
        <div className="ant-rate-star-first">{starCharacter}</div> {/* For half star (background) */}
        <div className="ant-rate-star-second">{starCharacter}</div> {/* For full star (foreground) */}
      </li>
    );
  };

  const rateClasses = [
    'ant-rate',
    disabled ? 'ant-rate-disabled' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <ul
      className={rateClasses}
      style={style}
      onMouseLeave={handleMouseLeave}
      role="radiogroup" // Semantically similar to a radio group
      tabIndex={disabled ? -1 : 0} // Basic focus for keyboard nav start
      // onKeyDown for keyboard navigation would be added here
    >
      {Array.from({ length: count }, (_, i) => renderStar(i))}
    </ul>
  );
};

export default Rate;
