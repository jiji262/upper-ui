// src/components/ui/layout/Space/Space.tsx
import React from 'react';
import './Space.css';

type SpaceSize = 'small' | 'middle' | 'large' | number;

interface SpaceProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'end' | 'center' | 'baseline';
  direction?: 'horizontal' | 'vertical';
  size?: SpaceSize | [SpaceSize, SpaceSize]; // [horizontal, vertical]
  wrap?: boolean;
  split?: React.ReactNode; // Divider element
}

const Space: React.FC<SpaceProps> = ({
  align,
  direction = 'horizontal',
  size = 'small',
  wrap = false,
  split,
  className,
  style,
  children,
  ...rest
}) => {
  const classes = ['ant-space', `ant-space-${direction}`];
  if (align) {
    classes.push(`ant-space-align-${align}`);
  }
  if (wrap && direction === 'horizontal') { // Wrap is only effective for horizontal space
    classes.push('ant-space-wrap');
  }
  if (className) {
    classes.push(className);
  }

  const getGap = (s: SpaceSize): string => {
    if (typeof s === 'number') return `${s}px`;
    switch (s) {
      case 'small': return '8px';
      case 'middle': return '16px';
      case 'large': return '24px';
      default: return '8px';
    }
  };

  const [horizontalSize, verticalSize] = Array.isArray(size) ? size : [size, size];

  const spaceStyle: React.CSSProperties = {
    ...style,
    gap: `${getGap(verticalSize)} ${getGap(horizontalSize)}`, // CSS gap property (row-gap column-gap)
  };
  
  // If align is 'baseline' and direction is 'horizontal', items should be wrapped in inline-flex containers
  // This is a simplification; AntD has more complex handling for baseline alignment with items of varying heights.

  const items = React.Children.toArray(children).filter(child => child !== null && child !== undefined);
  const itemCount = items.length;

  return (
    <div className={classes.join(' ')} style={spaceStyle} {...rest}>
      {items.map((child, index) => {
        const itemClassName = `ant-space-item`;
        const isLastItem = index === itemCount - 1;
        
        // Special handling for baseline alignment in horizontal direction
        const itemStyle: React.CSSProperties = {};
        if (direction === 'horizontal' && align === 'baseline') {
            // itemStyle.display = 'inline-flex'; // This helps with baseline but might affect other layouts
            // itemStyle.alignItems = 'baseline';
        }


        return (
          <React.Fragment key={index}>
            <div className={itemClassName} style={itemStyle}>
              {child}
            </div>
            {split && !isLastItem && <span className="ant-space-item-split">{split}</span>}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Space;
