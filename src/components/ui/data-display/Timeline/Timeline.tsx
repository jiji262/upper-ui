// src/components/ui/data-display/Timeline/Timeline.tsx
import React, { Children, isValidElement, cloneElement } from 'react';
import TimelineItem, { TimelineItemProps } from './TimelineItem';
import Icon from '../../general/Icon/Icon'; // Assuming Icon is available
import './Timeline.css';

type TimelineMode = 'left' | 'alternate' | 'right';

interface TimelineProps {
  pending?: React.ReactNode | boolean; // Default false. If true, shows a ghost node. If ReactNode, shows that content.
  pendingDot?: React.ReactNode; // Custom pending dot
  reverse?: boolean; // Default false. Reverse order of items.
  mode?: TimelineMode; // Default 'left' (or 'alternate' if children > 1 and no mode specified, AntD logic can be complex)
  
  children?: React.ReactNode; // Should be Timeline.Item components
  items?: Array<Omit<TimelineItemProps, 'isLast' | 'position' | 'pending'>>; // Alternative to children
  
  className?: string;
  style?: React.CSSProperties;
  // onClick?: (e: React.MouseEvent<HTMLDivElement>) => void; // Not a standard AntD prop for Timeline itself
}

const Timeline: React.FC<TimelineProps> = ({
  pending = false,
  pendingDot = <Icon name="LoadingOutlined" />,
  reverse = false,
  mode = 'left', // Simplified default, AntD might infer 'alternate'
  children,
  items,
  className,
  style,
}) => {

  const renderTimelineItems = () => {
    let itemSource = items 
        ? items.map((itemProps, index) => <TimelineItem key={`timeline-item-prop-${index}`} {...itemProps} />)
        : Children.toArray(children);

    if (reverse) {
      itemSource = itemSource.reverse();
    }

    const itemCount = itemSource.length;
    
    return Children.map(itemSource, (child, index) => {
      if (!isValidElement(child) || (child.type as React.ComponentType)?.displayName !== 'TimelineItem') {
        console.warn('Timeline children should be of type Timeline.Item');
        return null;
      }
      
      const itemProps = child.props as TimelineItemProps;
      let itemPosition: 'left' | 'right' | undefined = undefined;

      if (mode === 'alternate') {
        itemPosition = index % 2 === 0 ? 'left' : 'right';
      } else if (mode === 'left' || mode === 'right') {
        // In explicit left/right mode, all items are on that side, or label is on other.
        // The 'position' prop on Item itself might be used for label placement.
        // For now, this simplified version uses mode for dot alignment relative to content.
        // If mode is 'left', content is on right. If mode is 'right', content is on left.
        // This is slightly different from AntD's 'label' prop behavior.
      }

      return cloneElement(child as React.ReactElement<TimelineItemProps>, {
        isLast: !pending && index === itemCount - 1,
        position: itemPosition,
        // pending: false, // Individual items are not pending unless it's THE pending item
      });
    });
  };

  const pendingItem = pending ? (
    <TimelineItem
      key="ant-timeline-item-pending"
      dot={pendingDot}
      pending // Special prop to indicate this is the pending placeholder
      // isLast={true} // The pending item is always effectively the last visual element
    >
      {pending === true ? null : pending /* Render content if pending is a ReactNode */}
    </TimelineItem>
  ) : null;
  
  const timelineClasses = [
    'ant-timeline',
    mode !== 'left' ? `ant-timeline-${mode}` : '', // 'left' is default, no class needed
    pending ? 'ant-timeline-pending' : '',
    // If mode is 'right' and has labels, or 'alternate' and has labels, different classes might apply in AntD for label side
    // e.g. ant-timeline-label (when labels are present and mode is not default left)
    className,
  ].filter(Boolean).join(' ');
  

  return (
    <ul className={timelineClasses} style={style}>
      {renderTimelineItems()}
      {pendingItem}
    </ul>
  );
};

// Assign TimelineItem as a static property for Timeline.Item usage
(Timeline as any).Item = TimelineItem;

export default Timeline;
