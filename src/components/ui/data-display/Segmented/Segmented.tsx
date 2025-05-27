// src/components/ui/data-display/Segmented/Segmented.tsx
import React, { useState, useEffect, useRef } from 'react';
import './Segmented.css';

export interface SegmentedOptionObject {
  label: React.ReactNode;
  value: string | number;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string; // Custom class for the item
}

export type SegmentedOption = string | number | SegmentedOptionObject;

interface SegmentedProps {
  options: SegmentedOption[];
  value?: string | number; // Controlled selected value
  defaultValue?: string | number;
  onChange?: (value: string | number) => void;
  disabled?: boolean; // Disable all segments
  size?: 'large' | 'middle' | 'small'; // Default 'middle'
  block?: boolean; // Whether the segmented control takes up the full width of its parent
  
  className?: string;
  style?: React.CSSProperties;
}

const Segmented: React.FC<SegmentedProps> = ({
  options = [],
  value: controlledValue,
  defaultValue,
  onChange,
  disabled = false,
  size = 'middle',
  block = false,
  className,
  style,
}) => {
  const [internalValue, setInternalValue] = useState<string | number | undefined>(
    defaultValue !== undefined ? defaultValue : (options.length > 0 ? (typeof options[0] === 'object' ? options[0].value : options[0]) : undefined)
  );
  const [thumbStyle, setThumbStyle] = useState<React.CSSProperties>({});
  const itemsRef = useRef<(HTMLLabelElement | null)[]>([]);
  const segmentedRef = useRef<HTMLDivElement>(null);

  const currentValue = controlledValue !== undefined ? controlledValue : internalValue;

  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue); // Sync internal if controlled changes
    }
  }, [controlledValue]);

  useEffect(() => {
    const selectedItemIndex = options.findIndex(option => 
      (typeof option === 'object' ? option.value : option) === currentValue
    );
    
    if (selectedItemIndex !== -1 && itemsRef.current[selectedItemIndex]) {
      const selectedItemElement = itemsRef.current[selectedItemIndex]!;
      setThumbStyle({
        left: `${selectedItemElement.offsetLeft}px`,
        width: `${selectedItemElement.offsetWidth}px`,
      });
    } else if (options.length > 0 && itemsRef.current[0] && currentValue === undefined) {
        // If no value is selected (e.g. initially or after clearing),
        // and we want to default thumb to first item if defaultValue wasn't set.
        // This behavior might need adjustment based on desired UX when no item is active.
        // For now, if currentValue is undefined, thumb might not show or default to first.
        // Let's assume if currentValue is undefined, no thumb is actively positioned initially.
        // If a default selection is always desired, ensure `defaultValue` or `value` is set.
        setThumbStyle({}); // Clear thumb if no item is selected
    }
  }, [currentValue, options, itemsRef, block]); // Rerun when options or block state changes for sizing


  const handleSelect = (val: string | number, itemDisabled?: boolean) => {
    if (disabled || itemDisabled) return;

    if (controlledValue === undefined) {
      setInternalValue(val);
    }
    onChange?.(val);
  };
  
  const segmentedClasses = [
    'ant-segmented',
    `ant-segmented-${size}`,
    disabled ? 'ant-segmented-disabled' : '',
    block ? 'ant-segmented-block' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div ref={segmentedRef} className={segmentedClasses} style={style}>
      <div className="ant-segmented-group">
        {options.map((option, index) => {
          const optionObj: SegmentedOptionObject = typeof option === 'object' 
            ? option 
            : { label: String(option), value: option };
          
          const itemDisabled = disabled || optionObj.disabled;
          const isSelected = currentValue === optionObj.value;

          const itemClasses = [
            'ant-segmented-item',
            isSelected ? 'ant-segmented-item-selected' : '',
            itemDisabled ? 'ant-segmented-item-disabled' : '',
            optionObj.className,
          ].filter(Boolean).join(' ');

          return (
            <label
              key={optionObj.value}
              ref={el => itemsRef.current[index] = el}
              className={itemClasses}
              onClick={() => handleSelect(optionObj.value, optionObj.disabled)}
            >
              <input
                type="radio"
                className="ant-segmented-item-input"
                value={optionObj.value}
                checked={isSelected}
                disabled={itemDisabled}
                onChange={() => {}} // onClick on label handles selection
              />
              <div className="ant-segmented-item-label" title={typeof optionObj.label === 'string' ? optionObj.label : undefined}>
                {optionObj.icon && <span className="ant-segmented-item-icon">{optionObj.icon}</span>}
                {optionObj.label}
              </div>
            </label>
          );
        })}
        {/* Thumb for selected item (if there's a current value) */}
        {currentValue !== undefined && options.some(opt => (typeof opt === 'object' ? opt.value : opt) === currentValue) && (
             <div className="ant-segmented-thumb" style={thumbStyle}>
                {/* Optionally, render selected item's content again in thumb for text color change, or rely on CSS */}
                {(() => {
                    const selectedOptionObj = options.find(opt => (typeof opt === 'object' ? opt.value : opt) === currentValue);
                    if (selectedOptionObj) {
                        const item = typeof selectedOptionObj === 'object' ? selectedOptionObj : {label: String(selectedOptionObj), value: selectedOptionObj};
                        return (
                            <div className="ant-segmented-item-label">
                                {item.icon && <span className="ant-segmented-item-icon">{item.icon}</span>}
                                {item.label}
                            </div>
                        );
                    }
                    return null;
                })()}
             </div>
        )}
      </div>
    </div>
  );
};

export default Segmented;
