// src/components/ui/data-entry/Radio/Radio.tsx
import React, { useContext, ChangeEvent } from 'react';
import { RadioGroupContext } from './Group'; // Assuming Group.tsx provides this context
import './Radio.css';

export interface RadioProps {
  value?: any; // Value of the radio button
  checked?: boolean; // Controlled checked state
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  autoFocus?: boolean;
  name?: string; // For native radio group behavior if not using Radio.Group
}

const Radio: React.FC<RadioProps> = ({
  value,
  checked: controlledChecked,
  defaultChecked,
  disabled,
  onChange,
  children,
  className,
  style,
  autoFocus,
  name,
  ...restInputProps // Pass other native input props
}) => {
  const groupContext = useContext(RadioGroupContext);
  
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked || false);

  const isChecked = groupContext
    ? groupContext.value === value // Controlled by group
    : controlledChecked !== undefined ? controlledChecked : internalChecked;

  const radioDisabled = groupContext ? groupContext.disabled || disabled : disabled;
  const radioName = groupContext ? groupContext.name : name;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (groupContext) {
      groupContext.onChange?.(e); // Group handles value change
    } else {
      if (controlledChecked === undefined) {
        setInternalChecked(e.target.checked);
      }
      onChange?.(e);
    }
  };

  const wrapperClasses = [
    'ant-radio-wrapper',
    isChecked ? 'ant-radio-wrapper-checked' : '',
    radioDisabled ? 'ant-radio-wrapper-disabled' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <label className={wrapperClasses} style={style}>
      <span className={`ant-radio ${isChecked ? 'ant-radio-checked' : ''} ${radioDisabled ? 'ant-radio-disabled' : ''}`}>
        <input
          type="radio"
          className="ant-radio-input"
          value={value}
          checked={isChecked}
          disabled={radioDisabled}
          onChange={handleChange}
          autoFocus={autoFocus}
          name={radioName}
          {...restInputProps}
        />
        <span className="ant-radio-inner" />
      </span>
      {children !== undefined && <span className="ant-radio-label">{children}</span>}
    </label>
  );
};

Radio.displayName = 'Radio';
export default Radio;
