import React from 'react';

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'column';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap?: number;
  children?: React.ReactNode;
}

export const Flex: React.FC<FlexProps> = ({
  direction = 'row',
  justify = 'start',
  align = 'start',
  wrap = 'nowrap',
  gap = 0,
  children,
  className = '',
  ...props
}) => {
  const flexClasses = [
    'flex',
    `flex-${direction}`,
    `justify-${justify}`,
    `items-${align}`,
    `flex-${wrap}`,
    `gap-${gap}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={flexClasses} {...props}>
      {children}
    </div>
  );
}; 