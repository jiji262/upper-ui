import React from 'react';
import './Button.css';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  type?: 'primary' | 'default' | 'dashed' | 'text' | 'link';
  size?: 'large' | 'middle' | 'small';
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  danger?: boolean;
  shape?: 'default' | 'circle' | 'round';
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  type = 'default',
  size = 'middle',
  icon,
  loading = false,
  disabled = false,
  danger = false,
  shape = 'default',
  children,
  className,
  ...rest
}) => {
  const classNames = [
    'upper-btn',
    `upper-btn-${type}`,
    `upper-btn-${size}`,
    shape !== 'default' ? `upper-btn-${shape}` : '',
    danger ? 'upper-btn-dangerous' : '',
    disabled ? 'upper-btn-disabled' : '',
    loading ? 'upper-btn-loading' : '',
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classNames}
      disabled={disabled || loading}
      {...rest}
    >
      {icon && <span className="upper-btn-icon">{icon}</span>}
      {loading && <span className="upper-btn-loading-icon"></span>}
      {children && <span>{children}</span>}
    </button>
  );
};

export default Button; 