// src/components/ui/layout/Grid/Row.tsx
import React, { createContext, useContext } from 'react';
import './Grid.css';

type Gutter = number | [number, number] | Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl', number | [number, number]>>;

interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'top' | 'middle' | 'bottom' | 'stretch';
  justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly';
  gutter?: Gutter; // number for horizontal, [horizontal, vertical] for both
  wrap?: boolean;
}

// Context to pass gutter to Col
interface RowContextState {
  gutter?: [number, number]; // [horizontal, vertical]
}
export const RowContext = createContext<RowContextState>({});


const Row: React.FC<RowProps> = ({
  align,
  justify,
  gutter = 0,
  wrap = true,
  className,
  style,
  children,
  ...rest
}) => {
  const classes = ['ant-row'];
  if (align) classes.push(`ant-row-${align}`);
  if (justify) classes.push(`ant-row-${justify}`);
  if (!wrap) classes.push('ant-row-no-wrap');
  if (className) classes.push(className);

  const [horizontalGutter, verticalGutter] = Array.isArray(gutter)
    ? gutter
    : [gutter, 0] as [number, number];

  const rowStyle: React.CSSProperties = { ...style };
  if (horizontalGutter > 0) {
    rowStyle.marginLeft = -horizontalGutter / 2;
    rowStyle.marginRight = -horizontalGutter / 2;
  }
  if (verticalGutter > 0) {
    rowStyle.rowGap = verticalGutter;
  }
  
  // Note: AntD applies negative margins to Row and padding to Col for gutters.
  // For simplicity in this implementation, direct rowGap can be used if flexbox gap is acceptable.
  // Otherwise, Col components would need to be aware of the gutter.

  return (
    <RowContext.Provider value={{ gutter: [horizontalGutter, verticalGutter] }}>
      <div className={classes.join(' ')} style={rowStyle} {...rest}>
        {children}
      </div>
    </RowContext.Provider>
  );
};

export default Row;
