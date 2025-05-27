// src/components/ui/layout/Grid/Col.tsx
import React, { useContext } from 'react';
import { RowContext } from './Row'; // Assuming Row.tsx is in the same directory
import './Grid.css';

interface ColSize {
  span?: number;
  order?: number;
  offset?: number;
  push?: number;
  pull?: number;
}

interface ColProps extends React.HTMLAttributes<HTMLDivElement>, ColSize {
  xs?: number | ColSize;
  sm?: number | ColSize;
  md?: number | ColSize;
  lg?: number | ColSize;
  xl?: number | ColSize;
  xxl?: number | ColSize;
  flex?: string | number;
}

const Col: React.FC<ColProps> = ({
  span,
  order,
  offset,
  push,
  pull,
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
  flex,
  className,
  style,
  children,
  ...rest
}) => {
  const { gutter } = useContext(RowContext);
  const classes = ['ant-col'];

  if (span) classes.push(`ant-col-${span}`);
  if (order) classes.push(`ant-col-order-${order}`);
  if (offset) classes.push(`ant-col-offset-${offset}`);
  if (push) classes.push(`ant-col-push-${push}`);
  if (pull) classes.push(`ant-col-pull-${pull}`);

  // Responsive classes
  const responsiveSizes: { [key: string]: number | ColSize | undefined } = { xs, sm, md, lg, xl, xxl };
  for (const sizeKey in responsiveSizes) {
    const sizeValue = responsiveSizes[sizeKey];
    if (typeof sizeValue === 'number') {
      classes.push(`ant-col-${sizeKey}-${sizeValue}`);
    } else if (typeof sizeValue === 'object') {
      if (sizeValue.span) classes.push(`ant-col-${sizeKey}-${sizeValue.span}`);
      if (sizeValue.order) classes.push(`ant-col-${sizeKey}-order-${sizeValue.order}`);
      if (sizeValue.offset) classes.push(`ant-col-${sizeKey}-offset-${sizeValue.offset}`);
      if (sizeValue.push) classes.push(`ant-col-${sizeKey}-push-${sizeValue.push}`);
      if (sizeValue.pull) classes.push(`ant-col-${sizeKey}-pull-${sizeValue.pull}`);
    }
  }

  if (className) classes.push(className);

  const colStyle: React.CSSProperties = { ...style };
  if (flex) {
    colStyle.flex = typeof flex === 'number' ? `${flex} ${flex} auto` : flex;
  }

  // Apply gutter padding
  if (gutter) {
    const [horizontalGutter, verticalGutter] = gutter;
    if (horizontalGutter > 0) {
      colStyle.paddingLeft = horizontalGutter / 2;
      colStyle.paddingRight = horizontalGutter / 2;
    }
    // verticalGutter is typically applied via row-gap on the Row for simplicity here.
    // If Row doesn't use row-gap, then Col would need:
    // if (verticalGutter > 0) {
    //   colStyle.paddingTop = verticalGutter / 2;
    //   colStyle.paddingBottom = verticalGutter / 2;
    // }
  }


  return (
    <div className={classes.join(' ')} style={colStyle} {...rest}>
      {children}
    </div>
  );
};

export default Col;
