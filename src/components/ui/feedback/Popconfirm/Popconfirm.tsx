// src/components/ui/feedback/Popconfirm/Popconfirm.tsx
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import Button, { ButtonProps } from '../../general/Button/Button'; // Assuming Button is available
import Icon from '../../general/Icon/Icon';   // Assuming Icon is available
import './Popconfirm.css'; // Shares some styles with Popover, but can have specifics

type PopconfirmPlacement = 
  | 'top' | 'left' | 'right' | 'bottom'
  | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom';

type PopconfirmTrigger = 'hover' | 'focus' | 'click' | 'contextMenu'; // Usually 'click' for Popconfirm

interface PopconfirmProps {
  title: React.ReactNode;
  description?: React.ReactNode; // New in AntD 5.x for Popconfirm
  onConfirm?: (e?: React.MouseEvent<HTMLElement>) => void;
  onCancel?: (e?: React.MouseEvent<HTMLElement>) => void;
  onPopupOpenChange?: (open: boolean) => void; // Renamed from onVisibleChange

  okText?: React.ReactNode; // Default 'OK'
  okType?: ButtonProps['type']; // Default 'primary'
  okButtonProps?: ButtonProps;
  cancelText?: React.ReactNode; // Default 'Cancel'
  cancelButtonProps?: ButtonProps;
  
  disabled?: boolean; // Disable trigger interaction
  open?: boolean; // Controlled open state
  placement?: PopconfirmPlacement; // Default 'top'
  trigger?: PopconfirmTrigger | PopconfirmTrigger[]; // Default 'click' for Popconfirm
  
  icon?: React.ReactNode; // Icon next to title, default ExclamationCircleFilled
  showCancel?: boolean; // Default true

  children: React.ReactElement; // Single trigger element
  
  mouseEnterDelay?: number; // For hover trigger
  mouseLeaveDelay?: number;

  overlayClassName?: string;
  overlayStyle?: React.CSSProperties;
  overlayInnerStyle?: React.CSSProperties;

  // getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
}

const Popconfirm: React.FC<PopconfirmProps> = ({
  title,
  description,
  onConfirm,
  onCancel,
  onPopupOpenChange,
  okText = 'Yes', // AntD often uses Yes/No for Popconfirm
  okType = 'primary',
  okButtonProps,
  cancelText = 'No',
  cancelButtonProps,
  disabled = false,
  open: controlledOpen,
  placement = 'top',
  trigger = 'click',
  icon = <Icon name="ExclamationCircleFilled" style={{ color: '#faad14' /* AntD warning yellow */}} />,
  showCancel = true,
  children,
  mouseEnterDelay = 0.1,
  mouseLeaveDelay = 0.1,
  overlayClassName,
  overlayStyle,
  overlayInnerStyle,
  // getPopupContainer,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);
  const popconfirmRef = useRef<HTMLDivElement>(null);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  let enterTimer: NodeJS.Timeout | null = null;
  let leaveTimer: NodeJS.Timeout | null = null;

  const actualVisible = controlledOpen !== undefined ? controlledOpen : isVisible;

  useEffect(() => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    setPortalContainer(el);
    return () => {
        if (el.parentNode) document.body.removeChild(el);
    };
  }, []);


  const setVisibility = (newVisible: boolean, event?: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    if (controlledOpen === undefined) {
      setIsVisible(newVisible);
    }
    onPopupOpenChange?.(newVisible);
    if (!newVisible && event && event.type === 'click' && onCancel) { // If closed by clicking away or trigger
        // This logic is tricky: onCancel should usually be called by the Cancel button.
        // AntD Popconfirm's onCancel is specifically for the cancel button or Esc.
        // Closing by clicking outside doesn't trigger onCancel.
    }
  };

  const clearTimers = () => {
    if (enterTimer) clearTimeout(enterTimer);
    if (leaveTimer) clearTimeout(leaveTimer);
  };

  const triggerIncludes = (triggerType: PopconfirmTrigger): boolean => {
    return Array.isArray(trigger) ? trigger.includes(triggerType) : trigger === triggerType;
  };
  
  const handleMouseEnter = () => {
    if (disabled || !triggerIncludes('hover')) return;
    clearTimers();
    enterTimer = setTimeout(() => setVisibility(true), mouseEnterDelay * 1000);
  };

  const handleMouseLeave = () => {
    if (disabled || !triggerIncludes('hover')) return;
    clearTimers();
    leaveTimer = setTimeout(() => setVisibility(false), mouseLeaveDelay * 1000);
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled || !triggerIncludes('click')) return;
    // If the click is on the trigger element itself, toggle visibility
    if (triggerRef.current && triggerRef.current.contains(e.target as Node)) {
        setVisibility(!actualVisible, e);
    }
  };
  
  const handleConfirm = (e: React.MouseEvent<HTMLElement>) => {
    onConfirm?.(e);
    setVisibility(false, e);
  };

  const handleCancel = (e: React.MouseEvent<HTMLElement>) => {
    onCancel?.(e);
    setVisibility(false, e);
  };
  
  // Click outside to close (for click/contextMenu triggers)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current && !triggerRef.current.contains(event.target as Node) &&
        popconfirmRef.current && !popconfirmRef.current.contains(event.target as Node)
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


  const triggerElement = React.cloneElement(children, {
    ref: (node: HTMLElement) => {
      // @ts-ignore
      triggerRef.current = node;
      const { ref } = children as any;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node;
    },
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onClick: handleClick, // Click on trigger toggles visibility
    // Add other trigger handlers (focus, contextMenu) if needed
  });


  // Basic positioning (same as Popover, simplified)
  const [positionStyle, setPositionStyle] = useState<React.CSSProperties>({});
  useEffect(() => {
    if (actualVisible && triggerRef.current && popconfirmRef.current && portalContainer) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popoverRect = popconfirmRef.current.getBoundingClientRect();
      const container = portalContainer; //getPopupContainer ? getPopupContainer(triggerRef.current) : document.body;
      const containerRect = container === document.body ? { top: 0, left: 0 } : container.getBoundingClientRect();
      
      const scrollTop = container === document.body ? window.pageYOffset : container.scrollTop;
      const scrollLeft = container === document.body ? window.pageXOffset : container.scrollLeft;

      let top = 0, left = 0;
      const arrowSize = 8;

      const relTop = triggerRect.top - containerRect.top + scrollTop;
      const relLeft = triggerRect.left - containerRect.left + scrollLeft;

      switch (placement) {
        case 'top': top = relTop - popoverRect.height - arrowSize; left = relLeft + (triggerRect.width / 2) - (popoverRect.width / 2); break;
        case 'bottom': top = relTop + triggerRect.height + arrowSize; left = relLeft + (triggerRect.width / 2) - (popoverRect.width / 2); break;
        case 'left': top = relTop + (triggerRect.height / 2) - (popoverRect.height / 2); left = relLeft - popoverRect.width - arrowSize; break;
        case 'right': top = relTop + (triggerRect.height / 2) - (popoverRect.height / 2); left = relLeft + triggerRect.width + arrowSize; break;
        case 'topLeft': top = relTop - popoverRect.height - arrowSize; left = relLeft; break;
        case 'topRight': top = relTop - popoverRect.height - arrowSize; left = relLeft + triggerRect.width - popoverRect.width; break;
        case 'bottomLeft': top = relTop + triggerRect.height + arrowSize; left = relLeft; break;
        case 'bottomRight': top = relTop + triggerRect.height + arrowSize; left = relLeft + triggerRect.width - popoverRect.width; break;
        default: top = relTop - popoverRect.height - arrowSize; left = relLeft + (triggerRect.width / 2) - (popoverRect.width / 2);
      }
      setPositionStyle({ top: `${top}px`, left: `${left}px`, position: 'absolute' });
    }
  }, [actualVisible, placement, portalContainer]);


  const popconfirmClasses = [
    'ant-popover', // Reuse popover styles for the card itself
    'ant-popconfirm', // Specific class for popconfirm variants
    `ant-popover-placement-${placement}`, // Reuse popover placement styles
    overlayClassName,
  ].filter(Boolean).join(' ');

  const popconfirmContent = (
    <div
      ref={popconfirmRef}
      className={popconfirmClasses}
      style={{ ...overlayStyle, ...positionStyle, visibility: actualVisible ? 'visible' : 'hidden' }}
      onMouseEnter={handleMouseEnter} // Keep open if mouse moves to popconfirm
      onMouseLeave={handleMouseLeave}
      role="tooltip" // Or "dialog"
    >
      <div className="ant-popover-arrow" />
      <div className="ant-popover-inner" style={overlayInnerStyle}>
        <div className="ant-popconfirm-message">
          {icon && <span className="ant-popconfirm-message-icon">{icon}</span>}
          <div className="ant-popconfirm-message-title">{title}</div>
        </div>
        {description && <div className="ant-popconfirm-description">{description}</div>}
        <div className="ant-popconfirm-buttons">
          {showCancel && (
            <Button size="small" onClick={handleCancel} {...cancelButtonProps}>
              {cancelText}
            </Button>
          )}
          <Button size="small" type={okType} onClick={handleConfirm} {...okButtonProps}>
            {okText}
          </Button>
        </div>
      </div>
    </div>
  );

  if (!portalContainer) return <>{triggerElement}</>; // Render only trigger if portal not ready

  return (
    <>
      {triggerElement}
      {actualVisible && ReactDOM.createPortal(popconfirmContent, portalContainer)}
    </>
  );
};

export default Popconfirm;
