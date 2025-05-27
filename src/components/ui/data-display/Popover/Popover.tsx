// src/components/ui/data-display/Popover/Popover.tsx
import React, { useState, useEffect, useRef } from 'react';
import './Popover.css';

type PopoverPlacement = 
  | 'top' | 'left' | 'right' | 'bottom'
  | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom';

type PopoverTrigger = 'hover' | 'focus' | 'click' | 'contextMenu' | Array<'hover' | 'focus' | 'click' | 'contextMenu'>;


interface PopoverProps {
  title?: React.ReactNode;
  content: React.ReactNode;
  trigger?: PopoverTrigger; // Default 'hover'
  placement?: PopoverPlacement; // Default 'top'
  open?: boolean; // Controlled open state
  onOpenChange?: (open: boolean) => void; // Renamed from onVisibleChange for consistency with antd 5.x
  
  children: React.ReactElement; // Must be a single ReactElement child
  
  mouseEnterDelay?: number; // Default 0.1s
  mouseLeaveDelay?: number; // Default 0.1s
  
  overlayClassName?: string;
  overlayStyle?: React.CSSProperties;
  overlayInnerStyle?: React.CSSProperties; // Style for the content part of popover

  // color?: string; // Custom background color for popover (not implemented in this simplified version)
  // arrow?: boolean | { pointAtCenter?: boolean }; // Show arrow, default true (simplified: always show basic arrow)
  
  className?: string; // Applied to the wrapper span
  style?: React.CSSProperties; // Applied to the wrapper span
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement; // Default document.body
}

const Popover: React.FC<PopoverProps> = ({
  title,
  content,
  trigger = 'hover',
  placement = 'top',
  open: controlledOpen,
  onOpenChange,
  children,
  mouseEnterDelay = 0.1,
  mouseLeaveDelay = 0.1,
  overlayClassName,
  overlayStyle,
  overlayInnerStyle,
  className,
  style,
  getPopupContainer,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLElement>(null); // Ref for the trigger element
  const popoverRef = useRef<HTMLDivElement>(null);
  
  let enterTimer: NodeJS.Timeout | null = null;
  let leaveTimer: NodeJS.Timeout | null = null;

  const actualVisible = controlledOpen !== undefined ? controlledOpen : isVisible;

  const setVisibility = (newVisible: boolean) => {
    if (controlledOpen === undefined) {
      setIsVisible(newVisible);
    }
    onOpenChange?.(newVisible);
  };

  const clearTimers = () => {
    if (enterTimer) clearTimeout(enterTimer);
    if (leaveTimer) clearTimeout(leaveTimer);
  };

  const handleMouseEnter = () => {
    if (!triggerIncludes('hover')) return;
    clearTimers();
    enterTimer = setTimeout(() => setVisibility(true), mouseEnterDelay * 1000);
  };

  const handleMouseLeave = () => {
    if (!triggerIncludes('hover')) return;
    clearTimers();
    leaveTimer = setTimeout(() => setVisibility(false), mouseLeaveDelay * 1000);
  };

  const handleClick = () => {
    if (!triggerIncludes('click')) return;
    setVisibility(!actualVisible);
  };
  
  const handleFocus = () => {
    if (!triggerIncludes('focus')) return;
    setVisibility(true);
  };

  const handleBlur = () => { // Needs careful handling with click inside popover
    if (!triggerIncludes('focus')) return;
    // Simple blur hide, might need to check if focus moved to popover itself
    // For simplicity, direct hide.
    // setTimeout(() => { // Delay to allow click inside popover
    //     if (popoverRef.current && !popoverRef.current.contains(document.activeElement)) {
    //         setVisibility(false);
    //     }
    // }, 0);
     setVisibility(false);
  };
  
  const handleContextMenu = (e: React.MouseEvent) => {
    if (!triggerIncludes('contextMenu')) return;
    e.preventDefault();
    setVisibility(!actualVisible);
  };


  const triggerIncludes = (triggerType: 'hover' | 'focus' | 'click' | 'contextMenu'): boolean => {
    return Array.isArray(trigger) ? trigger.includes(triggerType) : trigger === triggerType;
  };

  // Attach events to the child element
  const triggerElement = React.cloneElement(children, {
    ref: (node: HTMLElement) => {
      // @ts-ignore
      triggerRef.current = node;
      // Handle original ref if it exists
      const { ref } = children as any;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref && typeof ref === 'object') {
        (ref as React.MutableRefObject<HTMLElement | null>).current = node;
      }
    },
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onClick: handleClick,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onContextMenu: handleContextMenu,
  });
  
  // Click outside to close (for click/contextMenu triggers)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current && !triggerRef.current.contains(event.target as Node) &&
        popoverRef.current && !popoverRef.current.contains(event.target as Node)
      ) {
        if (triggerIncludes('click') || triggerIncludes('contextMenu')) {
           setVisibility(false);
        }
      }
    };
    if (actualVisible && (triggerIncludes('click') || triggerIncludes('contextMenu'))) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [actualVisible, trigger]); // Re-run if trigger type changes


  // Basic positioning (not using a library like Popper.js for simplicity)
  const [positionStyle, setPositionStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (actualVisible && triggerRef.current && popoverRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();
      const container = getPopupContainer ? getPopupContainer(triggerRef.current) : document.body;
      const containerRect = container === document.body ? { top: 0, left: 0, scrollTop: document.documentElement.scrollTop, scrollLeft: document.documentElement.scrollLeft } : container.getBoundingClientRect();
      
      const scrollTop = container === document.body ? window.pageYOffset : container.scrollTop;
      const scrollLeft = container === document.body ? window.pageXOffset : container.scrollLeft;

      let top = 0, left = 0;
      const arrowSize = 8; // Approximate size of arrow for offset

      // Calculate position relative to container
      const relTop = triggerRect.top - containerRect.top + scrollTop;
      const relLeft = triggerRect.left - containerRect.left + scrollLeft;

      switch (placement) {
        case 'top':
          top = relTop - popoverRect.height - arrowSize;
          left = relLeft + (triggerRect.width / 2) - (popoverRect.width / 2);
          break;
        case 'bottom':
          top = relTop + triggerRect.height + arrowSize;
          left = relLeft + (triggerRect.width / 2) - (popoverRect.width / 2);
          break;
        case 'left':
          top = relTop + (triggerRect.height / 2) - (popoverRect.height / 2);
          left = relLeft - popoverRect.width - arrowSize;
          break;
        case 'right':
          top = relTop + (triggerRect.height / 2) - (popoverRect.height / 2);
          left = relLeft + triggerRect.width + arrowSize;
          break;
        // Simplified: topLeft, topRight, etc., would need more precise calculations
        case 'topLeft':
          top = relTop - popoverRect.height - arrowSize;
          left = relLeft;
          break;
        case 'topRight':
            top = relTop - popoverRect.height - arrowSize;
            left = relLeft + triggerRect.width - popoverRect.width;
            break;
        case 'bottomLeft':
            top = relTop + triggerRect.height + arrowSize;
            left = relLeft;
            break;
        case 'bottomRight':
            top = relTop + triggerRect.height + arrowSize;
            left = relLeft + triggerRect.width - popoverRect.width;
            break;
        default: // top
          top = relTop - popoverRect.height - arrowSize;
          left = relLeft + (triggerRect.width / 2) - (popoverRect.width / 2);
      }
      setPositionStyle({ top: `${top}px`, left: `${left}px`, position: 'absolute' });
    }
  }, [actualVisible, placement, getPopupContainer]); // Rerun on visibility or placement change

  const popoverClasses = [
    'ant-popover',
    `ant-popover-placement-${placement}`,
    overlayClassName,
    // Add theme class if applicable
  ].filter(Boolean).join(' ');

  const popoverContent = (
    <div
      ref={popoverRef}
      className={popoverClasses}
      style={{ ...overlayStyle, ...positionStyle, visibility: actualVisible ? 'visible' : 'hidden' }}
      onMouseEnter={handleMouseEnter} // Keep open if mouse moves to popover
      onMouseLeave={handleMouseLeave}
      role="tooltip" // Or "dialog" if interactive
    >
      <div className="ant-popover-arrow" />
      <div className="ant-popover-inner" style={overlayInnerStyle}>
        {title && <div className="ant-popover-title">{title}</div>}
        <div className="ant-popover-inner-content">{content}</div>
      </div>
    </div>
  );
  
  const portalContainer = getPopupContainer && triggerRef.current 
    ? getPopupContainer(triggerRef.current)
    : document.body;


  return (
    <>
      {triggerElement}
      {/* Basic portal, a library like react-portal would be better */}
      {actualVisible && ReactDOM.createPortal(popoverContent, portalContainer)}
    </>
  );
};

// Need to import ReactDOM for createPortal
let ReactDOM: any;
if (typeof window !== 'undefined') {
    import('react-dom').then(mod => ReactDOM = mod);
}


export default Popover;
