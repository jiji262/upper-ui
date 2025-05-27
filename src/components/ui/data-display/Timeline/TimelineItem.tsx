// src/components/ui/data-display/Timeline/TimelineItem.tsx
import React from 'react';

// Predefined Ant Design colors for Timeline item dots
const PRESET_COLORS = ['blue', 'green', 'red', 'yellow', 'gray']; // AntD also has 'processing' which is blue with animation

export interface TimelineItemProps {
  color?: string; // Predefined color or custom hex/rgb string
  dot?: React.ReactNode; // Custom dot element
  label?: React.ReactNode; // Label displayed on the opposite side in 'alternate' or 'left'/'right' mode if specified
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  // Internal props, passed by Timeline component
  isLast?: boolean;
  position?: 'left' | 'right'; // For 'alternate' mode
  pending?: boolean; // If this is the pending item
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  color = 'blue', // Default color
  dot,
  label,
  children,
  className,
  style,
  // Internal props
  isLast,
  position, // 'left' or 'right' for alternate mode
  pending,  // If this item is the loading/pending item
}) => {
  const isPresetColor = PRESET_COLORS.includes(color);

  const itemClasses = [
    'ant-timeline-item',
    isLast && !pending ? 'ant-timeline-item-last' : '',
    pending ? 'ant-timeline-item-pending' : '',
    position ? `ant-timeline-item-${position}` : '', // For alternate mode alignment
    className,
  ].filter(Boolean).join(' ');

  const dotClasses = [
    'ant-timeline-item-head',
    isPresetColor ? `ant-timeline-item-head-${color}` : '',
    dot ? 'ant-timeline-item-head-custom' : '',
  ].filter(Boolean).join(' ');

  const dotStyle: React.CSSProperties = {};
  if (color && !isPresetColor) {
    dotStyle.borderColor = color;
    // For custom color dot, if it's not a custom ReactNode, it might need background color too
    if (!dot) {
        dotStyle.backgroundColor = color; // Or a lighter shade if border is the main color
    }
  }
  
  // If dot is a custom ReactNode, it overrides default dot styling (color, etc.)

  return (
    <li className={itemClasses} style={style}>
      {label && <div className="ant-timeline-item-label">{label}</div>}
      <div className="ant-timeline-item-tail" />
      <div className={dotClasses} style={dotStyle}>
        {dot}
      </div>
      <div className="ant-timeline-item-content">
        {children}
      </div>
    </li>
  );
};

TimelineItem.displayName = 'TimelineItem';
export default TimelineItem;
