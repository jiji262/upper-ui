// src/components/ui/data-display/Descriptions/Descriptions.tsx
import React, { Children, isValidElement } from 'react';
import DescriptionsItem, { DescriptionsItemProps } from './DescriptionsItem';
import './Descriptions.css';

type DescriptionsLayout = 'horizontal' | 'vertical';
type DescriptionsSize = 'default' | 'middle' | 'small';

interface DescriptionsProps {
  title?: React.ReactNode;
  extra?: React.ReactNode;
  bordered?: boolean;
  column?: number | Partial<Record<'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs', number>>; // Responsive columns
  size?: DescriptionsSize;
  layout?: DescriptionsLayout; // Default 'horizontal'
  colon?: boolean; // Show colon after label, default true for horizontal
  labelStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  
  children?: React.ReactNode; // Should be Descriptions.Item components
  items?: Array<Omit<DescriptionsItemProps, 'children'> & { children: React.ReactNode; key?: string | number }>; // Alternative to children

  className?: string;
  style?: React.CSSProperties;
}

// Helper to determine column count based on screen size (simplified)
// In a real app, use window.matchMedia or a resize observer for responsiveness
const getColumnCount = (columnProp: DescriptionsProps['column']): number => {
  if (typeof columnProp === 'number') return columnProp;
  if (typeof columnProp === 'object') {
    // Simplified: just take the first available value or a default
    // A real implementation would check screen width against breakpoints
    if (columnProp.lg) return columnProp.lg;
    if (columnProp.md) return columnProp.md;
    if (columnProp.sm) return columnProp.sm;
    if (columnProp.xs) return columnProp.xs;
    return 3; // Default if no specific responsive prop matches
  }
  return 3; // Default columns
};


const Descriptions: React.FC<DescriptionsProps> = ({
  title,
  extra,
  bordered = false,
  column = 3,
  size = 'default',
  layout = 'horizontal',
  colon = true,
  labelStyle: globalLabelStyle,
  contentStyle: globalContentStyle,
  children,
  items,
  className,
  style,
}) => {
  const currentColumnCount = getColumnCount(column);

  const renderItems = () => {
    const itemElements = items 
        ? items.map((item, index) => ({ // Convert `items` prop to elements similar to children
            key: item.key || `desc-item-${index}`,
            props: item,
            // children: item.children, // Handled by item.children in props
          }))
        : Children.toArray(children).filter(child => isValidElement(child) && (child.type as React.ComponentType)?.displayName === 'DescriptionsItem');

    const rows: React.ReactNode[][] = [];
    let currentRow: React.ReactNode[] = [];
    let currentColSpan = 0;

    itemElements.forEach((element: any, index: number) => {
      const itemProps = element.props as DescriptionsItemProps;
      const itemSpan = Math.min(itemProps.span || 1, currentColumnCount);
      
      if (currentColSpan + itemSpan > currentColumnCount) {
        // Fill remaining cells in current row if it's not empty and we are starting a new row
        if (currentColSpan < currentColumnCount && currentRow.length > 0) {
             for (let i = currentColSpan; i < currentColumnCount; i++) {
                if (layout === 'horizontal') {
                    currentRow.push(<td key={`empty-label-${rows.length}-${i}`} className="upper-descriptions-item-label"></td>);
                    currentRow.push(<td key={`empty-content-${rows.length}-${i}`} className="upper-descriptions-item-content"></td>);
                } else { // vertical
                     currentRow.push(<td key={`empty-vertical-${rows.length}-${i}`} colSpan={1}></td>);
                }
            }
        }
        rows.push(currentRow);
        currentRow = [];
        currentColSpan = 0;
      }

      const label = itemProps.label;
      const content = itemProps.children; // Children of Descriptions.Item is the content
      const itemLabelStyle = { ...globalLabelStyle, ...itemProps.labelStyle };
      const itemContentStyle = { ...globalContentStyle, ...itemProps.contentStyle };
      
      const effectiveColon = colon && layout === 'horizontal'; // Colon only for horizontal layout

      if (layout === 'vertical') {
        currentRow.push(
          <td key={`v-label-${index}`} colSpan={itemSpan} className="upper-descriptions-item">
            <div className="upper-descriptions-item-container">
              <span className="upper-descriptions-item-label" style={itemLabelStyle}>
                {label}{effectiveColon ? ':' : ''}
              </span>
              <span className="upper-descriptions-item-content" style={itemContentStyle}>
                {content}
              </span>
            </div>
          </td>
        );
      } else { // Horizontal layout
        currentRow.push(
          <th key={`h-label-${index}`} className="upper-descriptions-item-label" style={itemLabelStyle} colSpan={1}>
            {label}{effectiveColon ? ':' : ''}
          </th>
        );
        currentRow.push(
          <td key={`h-content-${index}`} className="upper-descriptions-item-content" style={itemContentStyle} colSpan={Math.max(1, itemSpan * 2 - 1)}>
            {content}
          </td>
        );
      }
      currentColSpan += itemSpan;
    });

    // Add the last row
    if (currentRow.length > 0) {
        // Fill remaining cells in the last row
        if (currentColSpan < currentColumnCount) {
            for (let i = currentColSpan; i < currentColumnCount; i++) {
                 if (layout === 'horizontal') {
                    currentRow.push(<th key={`empty-label-last-${i}`} className="upper-descriptions-item-label"></th>);
                    currentRow.push(<td key={`empty-content-last-${i}`} className="upper-descriptions-item-content"></td>);
                } else { // vertical
                     currentRow.push(<td key={`empty-vertical-last-${i}`} colSpan={1}></td>);
                }
            }
        }
        rows.push(currentRow);
    }
    
    // For horizontal layout, each "item" (label+content) takes 2 effective columns in the table if not spanning
    // For vertical layout, each item takes 1 effective column in the table
    const tableColSpan = layout === 'horizontal' ? currentColumnCount * 2 : currentColumnCount;


    return rows.map((row, rowIndex) => (
      <tr key={`row-${rowIndex}`} className="upper-descriptions-row">
        {row}
      </tr>
    ));
  };


  const containerClasses = [
    'upper-descriptions',
    `upper-descriptions-${size}`,
    bordered ? 'upper-descriptions-bordered' : '',
    // layout class is applied to table or view div
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} style={style}>
      {(title || extra) && (
        <div className="upper-descriptions-header">
          {title && <div className="upper-descriptions-title">{title}</div>}
          {extra && <div className="upper-descriptions-extra">{extra}</div>}
        </div>
      )}
      <div className={`upper-descriptions-view upper-descriptions-layout-${layout}`}>
        <table>
          <tbody>
            {renderItems()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Assign DescriptionsItem as a static property
(Descriptions as any).Item = DescriptionsItem;

export default Descriptions;
