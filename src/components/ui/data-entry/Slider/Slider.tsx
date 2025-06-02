// src/components/ui/data-entry/Slider/Slider.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Slider.css';

interface SliderProps {
  value?: number | [number, number]; // Controlled value (single or range)
  defaultValue?: number | [number, number];
  min?: number;
  max?: number;
  step?: number | null; // Step size, null for continuous
  disabled?: boolean;
  dots?: boolean; // Show step dots
  included?: boolean; // Whether track is included between handles or from min, default true
  marks?: Record<number, React.ReactNode | { style?: React.CSSProperties; label: React.ReactNode }>;
  range?: boolean; // Dual thumb mode
  reverse?: boolean; // Reverse the direction
  vertical?: boolean;
  tooltip?: { open?: boolean; placement?: string; formatter?: ((value: number) => React.ReactNode) | null; getPopupContainer?: () => HTMLElement; }; // Simplified tooltip config
  // AntD 5.x uses `tooltip.formatter = null` to disable. `tooltip.open` to always show.
  // `tooltipPrefixCls` and `tipFormatter` were older props.

  onChange?: (value: number | [number, number]) => void;
  onAfterChange?: (value: number | [number, number]) => void; // Triggered when mouseup/touchend
  className?: string;
  style?: React.CSSProperties;
}

const Slider: React.FC<SliderProps> = ({
  value: controlledValue,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  dots = false,
  included = true,
  marks,
  range = false,
  reverse = false,
  vertical = false,
  tooltip,
  onChange,
  onAfterChange,
  className,
  style,
}) => {
  const isRange = range;
  const initialValue = defaultValue !== undefined 
    ? defaultValue 
    : isRange ? [min, min + (max - min) / 4] : min; // Default range or single value

  const [currentValue, setCurrentValue] = useState<number | [number, number]>(initialValue);
  const [isDragging, setIsDragging] = useState<false | 'min' | 'max'>(false); // Which handle is dragging
  const [showTooltipFor, setShowTooltipFor] = useState<false | 'min' | 'max'>(false);


  const sliderRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const handleMinRef = useRef<HTMLDivElement>(null);
  const handleMaxRef = useRef<HTMLDivElement>(null); // Only for range

  useEffect(() => {
    if (controlledValue !== undefined) {
      setCurrentValue(controlledValue);
    }
  }, [controlledValue]);

  const getPercentage = useCallback((val: number) => {
    const percent = ((val - min) / (max - min)) * 100;
    return reverse ? 100 - percent : percent;
  }, [min, max, reverse]);

  const getValueFromPosition = useCallback((position: number) => {
    const percentage = vertical
      ? (position / sliderRef.current!.offsetHeight) * 100
      : (position / sliderRef.current!.offsetWidth) * 100;
    
    let value = min + ((reverse ? 100 - percentage : percentage) / 100) * (max - min);

    if (step !== null) {
      value = Math.round(value / step) * step;
    }
    value = Math.max(min, Math.min(max, value));
    return parseFloat(value.toFixed(String(step).includes('.') ? String(step).split('.')[1].length : 0)); // Handle precision from step
  }, [min, max, step, vertical, reverse]);


  const handleInteractionStart = (handleType: 'min' | 'max') => (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(handleType);
    setShowTooltipFor(handleType); // Show tooltip on drag start
    
    const moveEvent = 'touches' in e ? 'touchmove' : 'mousemove';
    const endEvent = 'touches' in e ? 'touchend' : 'mouseup';

    document.addEventListener(moveEvent, handleInteractionMove);
    document.addEventListener(endEvent, handleInteractionEnd);
  };
  
  const handleInteractionMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging || !sliderRef.current) return;

    const { left, top, width, height } = sliderRef.current.getBoundingClientRect();
    const position = vertical
      ? ('touches' in e ? e.touches[0].clientY : e.clientY) - top
      : ('touches' in e ? e.touches[0].clientX : e.clientX) - left;
    
    const newValue = getValueFromPosition(position);

    setCurrentValue(prev => {
      let updatedValue;
      if (isRange) {
        const [prevMin, prevMax] = prev as [number, number];
        if (isDragging === 'min') {
          updatedValue = [Math.min(newValue, prevMax), prevMax] as [number, number];
        } else { // 'max'
          updatedValue = [prevMin, Math.max(newValue, prevMin)] as [number, number];
        }
      } else {
        updatedValue = newValue;
      }
      onChange?.(updatedValue);
      return updatedValue;
    });
  }, [isDragging, getValueFromPosition, isRange, vertical, onChange]);

  const handleInteractionEnd = useCallback(() => {
    if (!isDragging) return;
    onAfterChange?.(currentValue);
    setIsDragging(false);
    setShowTooltipFor(false); // Hide tooltip on drag end unless always open

    document.removeEventListener('mousemove', handleInteractionMove);
    document.removeEventListener('mouseup', handleInteractionEnd);
    document.removeEventListener('touchmove', handleInteractionMove);
    document.removeEventListener('touchend', handleInteractionEnd);
  }, [isDragging, currentValue, onAfterChange, handleInteractionMove]); // Added handleInteractionMove to dependencies
  
  const handleRailClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || isDragging) return; // Don't change value if currently dragging a handle
    
    const { left, top } = sliderRef.current!.getBoundingClientRect();
    const position = vertical ? e.clientY - top : e.clientX - left;
    const clickedValue = getValueFromPosition(position);

    setCurrentValue(prev => {
        let updatedValue;
        if (isRange) {
            const [valMin, valMax] = prev as [number, number];
            // Determine which handle is closer to the click
            if (Math.abs(valMin - clickedValue) < Math.abs(valMax - clickedValue)) {
                updatedValue = [clickedValue, valMax] as [number,number];
            } else {
                updatedValue = [valMin, clickedValue] as [number,number];
            }
            // Ensure min <= max
            if (updatedValue[0] > updatedValue[1]) updatedValue.reverse();
        } else {
            updatedValue = clickedValue;
        }
        onChange?.(updatedValue);
        onAfterChange?.(updatedValue); // Trigger onAfterChange on rail click too
        return updatedValue;
    });
  };


  const renderHandle = (type: 'min' | 'max') => {
    const val = isRange ? (currentValue as [number,number])[type === 'min' ? 0 : 1] : (currentValue as number);
    const percent = getPercentage(val);
    const styleProp = vertical ? (reverse ? { top: `${percent}%` } : { bottom: `${percent}%` }) : (reverse ? { right: `${percent}%` } : { left: `${percent}%` });
    
    const showCurrentTooltip = tooltip?.open || showTooltipFor === type;
    const tooltipFormatter = tooltip?.formatter === null ? undefined : tooltip?.formatter;
    const tooltipContent = tooltipFormatter ? tooltipFormatter(val) : val;

    return (
      <div
        ref={type === 'min' ? handleMinRef : handleMaxRef}
        className={`ant-slider-handle ant-slider-handle-${type}`}
        style={styleProp}
        onMouseDown={handleInteractionStart(type)}
        onTouchStart={handleInteractionStart(type)}
        onMouseEnter={() => !disabled && !isDragging && setShowTooltipFor(type)}
        onMouseLeave={() => !disabled && !isDragging && setShowTooltipFor(false)}
        role="slider"
        aria-valuenow={val}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-disabled={disabled}
        aria-orientation={vertical ? 'vertical' : 'horizontal'}
        tabIndex={disabled ? -1 : 0}
        // Add onKeyDown for keyboard interaction
      >
        {showCurrentTooltip && tooltipFormatter !== null && (
          <div className="ant-slider-tooltip" 
            // Simple positioning, real tooltip needs Popper.js or similar for placement
            style={ vertical ? { right: '100%', marginRight: '5px'} : {top: '-100%', marginTop: '-5px'}}
          >
            {tooltipContent}
          </div>
        )}
      </div>
    );
  };

  const trackStyle: React.CSSProperties = {};
  if (isRange) {
    const [valMin, valMax] = currentValue as [number, number];
    const minPercent = getPercentage(valMin);
    const maxPercent = getPercentage(valMax);
    const offset = Math.min(minPercent, maxPercent);
    const length = Math.abs(maxPercent - minPercent);
    if (vertical) {
      trackStyle[reverse ? 'top' : 'bottom'] = `${offset}%`;
      trackStyle.height = `${length}%`;
    } else {
      trackStyle[reverse ? 'right' : 'left'] = `${offset}%`;
      trackStyle.width = `${length}%`;
    }
  } else { // Single value
    const percent = getPercentage(currentValue as number);
    if (included) {
        if (vertical) {
            trackStyle[reverse ? 'top' : 'bottom'] = reverse ? `${percent}%` : '0%';
            trackStyle.height = reverse ? `${100 - percent}%` : `${percent}%`;
        } else {
            trackStyle[reverse ? 'right' : 'left'] = reverse ? `${percent}%` : '0%';
            trackStyle.width = reverse ? `${100 - percent}%` : `${percent}%`;
        }
    } else {
        // If not included, track is full width/height or not shown depending on design
        // For simplicity, let's assume track is full if not included
        if (vertical) trackStyle.height = '100%'; else trackStyle.width = '100%';
    }
  }


  const sliderClasses = [
    'ant-slider',
    vertical ? 'ant-slider-vertical' : 'ant-slider-horizontal',
    disabled ? 'ant-slider-disabled' : '',
    marks ? 'ant-slider-with-marks' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div ref={sliderRef} className={sliderClasses} style={style} onClick={handleRailClick}>
      <div className="ant-slider-rail" />
      {included && <div className="ant-slider-track" style={trackStyle} />}
      
      {dots && step !== null && Array.from({ length: (max - min) / step + 1 }).map((_, i) => {
        const dotValue = min + i * step;
        if (dotValue > max) return null; // Ensure dot is within max bound
        const percent = getPercentage(dotValue);
        const dotActive = included && (isRange 
            ? dotValue >= (currentValue as [number,number])[0] && dotValue <= (currentValue as [number,number])[1]
            : dotValue <= (currentValue as number)
        );
        const dotStyle = vertical ? (reverse ? {top: `${percent}%`} : {bottom: `${percent}%`}) : (reverse ? {right: `${percent}%`} : {left: `${percent}%`});
        return <span key={i} className={`ant-slider-dot ${dotActive ? 'ant-slider-dot-active' : ''}`} style={dotStyle} />;
      })}

      {marks && Object.entries(marks).map(([markValueStr, markLabel]) => {
        const markValue = parseFloat(markValueStr);
        const percent = getPercentage(markValue);
        const markStyle = vertical ? (reverse ? {top: `${percent}%`} : {bottom: `${percent}%`}) : (reverse ? {right: `${percent}%`} : {left: `${percent}%`});
        const isActive = included && (isRange 
            ? markValue >= (currentValue as [number,number])[0] && markValue <= (currentValue as [number,number])[1]
            : markValue <= (currentValue as number)
        );
        let labelNode = markLabel;
        let customLabelStyle = {};
        if (typeof markLabel === 'object' && markLabel !== null && 'label' in markLabel) {
            labelNode = (markLabel as {label: React.ReactNode}).label;
            customLabelStyle = (markLabel as {style?: React.CSSProperties}).style || {};
        }

        return (
          <span key={markValue} className={`ant-slider-mark-text ${isActive ? 'ant-slider-mark-text-active' : ''}`} style={{...markStyle, ...customLabelStyle}}>
            {labelNode}
          </span>
        );
      })}

      {renderHandle('min')}
      {isRange && renderHandle('max')}
    </div>
  );
};

export default Slider;
