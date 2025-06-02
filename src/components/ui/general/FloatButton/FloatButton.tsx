// src/components/ui/general/FloatButton/FloatButton.tsx
import React from 'react';
import './FloatButton.css';

interface FloatButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  type?: 'default' | 'primary';
  shape?: 'circle' | 'square';
  href?: string;
  target?: string;
  description?: React.ReactNode;
  tooltip?: React.ReactNode;
}

const FloatButton: React.FC<FloatButtonProps> = ({
  icon,
  type = 'default',
  shape = 'circle',
  href,
  target,
  description,
  tooltip,
  children,
  ...rest
}) => {
  const buttonContent = (
    <>
      {icon && <span className="float-button-icon">{icon}</span>}
      {description && <span className="float-button-description">{description}</span>}
      {children}
    </>
  );

  const buttonClasses = `
    float-button
    float-button-${type}
    float-button-${shape}
    ${rest.className || ''}
  `;

  const buttonElement = href ? (
    <a
      href={href}
      target={target}
      className={buttonClasses}
      title={typeof tooltip === 'string' ? tooltip : undefined}
      {...(typeof tooltip !== 'string' && tooltip ? { 'data-tooltip': tooltip } : {})}
    >
      {buttonContent}
    </a>
  ) : (
    <button
      type="button"
      className={buttonClasses}
      title={typeof tooltip === 'string' ? tooltip : undefined}
      {...(typeof tooltip !== 'string' && tooltip ? { 'data-tooltip': tooltip } : {})}
      {...rest}
    >
      {buttonContent}
    </button>
  );

  if (tooltip && typeof tooltip !== 'string') {
    return (
      <div className="float-button-tooltip-wrapper">
        {buttonElement}
        <span className="float-button-tooltip">{tooltip}</span>
      </div>
    );
  }

  return buttonElement;
};

export default FloatButton;
