import React from 'react';
import './Checkbox.css';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  indeterminate?: boolean;
  children?: React.ReactNode;
}

const Checkbox: React.FC<CheckboxProps> = ({
  indeterminate = false,
  className,
  checked,
  disabled,
  children,
  ...rest
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const classNames = [
    'upper-checkbox-wrapper',
    disabled ? 'upper-checkbox-wrapper-disabled' : '',
    className || '',
  ].filter(Boolean).join(' ');

  const checkboxClassNames = [
    'upper-checkbox',
    checked ? 'upper-checkbox-checked' : '',
    indeterminate ? 'upper-checkbox-indeterminate' : '',
    disabled ? 'upper-checkbox-disabled' : '',
  ].filter(Boolean).join(' ');

  return (
    <label className={classNames}>
      <span className={checkboxClassNames}>
        <input
          ref={inputRef}
          type="checkbox"
          className="upper-checkbox-input"
          checked={checked}
          disabled={disabled}
          {...rest}
        />
        <span className="upper-checkbox-inner"></span>
      </span>
      {children && <span className="upper-checkbox-label">{children}</span>}
    </label>
  );
};

export default Checkbox; 