// src/components/ui/layout/Divider/Divider.tsx
import React from 'react';
import './Divider.css';

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'horizontal' | 'vertical';
  orientation?: 'left' | 'right' | 'center';
  dashed?: boolean;
  plain?: boolean; // If true, text will be unstyled (plain)
}

const Divider: React.FC<DividerProps> = ({
  type = 'horizontal',
  orientation = 'center',
  dashed,
  plain,
  children,
  className,
  ...rest
}) => {
  const hasChildren = !!children;
  const orientationClass = hasChildren ? `ant-divider-with-text-${orientation}` : '';
  const classes = [
    'ant-divider',
    `ant-divider-${type}`,
    dashed ? 'ant-divider-dashed' : '',
    plain ? 'ant-divider-plain' : '',
    hasChildren ? 'ant-divider-with-text' : '',
    orientationClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div role="separator" className={classes} {...rest}>
      {children && <span className="ant-divider-inner-text">{children}</span>}
    </div>
  );
};

export default Divider;
