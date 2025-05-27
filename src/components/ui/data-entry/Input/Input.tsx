import React from 'react';
import './Input.css';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  size?: 'large' | 'middle' | 'small';
  addonBefore?: React.ReactNode;
  addonAfter?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  allowClear?: boolean;
  status?: 'error' | 'warning';
}

const Input: React.FC<InputProps> = ({
  size = 'middle',
  addonBefore,
  addonAfter,
  prefix,
  suffix,
  allowClear,
  status,
  className,
  ...rest
}) => {
  const classNames = [
    'upper-input',
    `upper-input-${size}`,
    status ? `upper-input-${status}` : '',
    className || '',
  ].filter(Boolean).join(' ');

  const handleClear = () => {
    // Implement clear logic here
  };

  const renderInput = () => (
    <input className={classNames} {...rest} />
  );

  const renderWithWrapper = () => {
    const wrapperClass = [
      'upper-input-wrapper',
      addonBefore || addonAfter ? 'upper-input-group-wrapper' : '',
      `upper-input-group-wrapper-${size}`,
    ].filter(Boolean).join(' ');

    const groupClass = [
      'upper-input-group',
      `upper-input-group-${size}`,
    ].filter(Boolean).join(' ');

    return (
      <span className={wrapperClass}>
        <span className={groupClass}>
          {addonBefore && <span className="upper-input-group-addon">{addonBefore}</span>}
          <span className="upper-input-affix-wrapper">
            {prefix && <span className="upper-input-prefix">{prefix}</span>}
            {renderInput()}
            {(suffix || allowClear) && (
              <span className="upper-input-suffix">
                {allowClear && <span className="upper-input-clear-icon" onClick={handleClear}></span>}
                {suffix}
              </span>
            )}
          </span>
          {addonAfter && <span className="upper-input-group-addon">{addonAfter}</span>}
        </span>
      </span>
    );
  };

  if (addonBefore || addonAfter || prefix || suffix || allowClear) {
    return renderWithWrapper();
  }

  return renderInput();
};

export default Input; 