// src/components/ui/feedback/Drawer/Drawer.tsx
import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom'; // For Portal
import Icon from '../../general/Icon/Icon';   // Assuming Icon is available
import './Drawer.css';

interface DrawerProps {
  open?: boolean;
  onClose?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  title?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  
  placement?: 'top' | 'right' | 'bottom' | 'left'; // Default 'right'
  width?: string | number; // Default 378 for right/left
  height?: string | number; // Default 378 for top/bottom
  
  closable?: boolean; // Show close button, default true
  closeIcon?: React.ReactNode;
  mask?: boolean; // Show mask, default true
  maskClosable?: boolean; // Click mask to close, default true
  // maskStyle?: React.CSSProperties; // Not implemented in this simplified version
  
  // keyboard?: boolean; // Close with Esc key, default true (handled by useEffect)
  // zIndex?: number; // Default 1000
  // bodyStyle?: React.CSSProperties;
  // headerStyle?: React.CSSProperties;
  // footerStyle?: React.CSSProperties;
  // drawerStyle?: React.CSSProperties; // Style for the content wrapper (.ant-drawer-content-wrapper)

  // Extra props for content wrapper, if needed
  // contentWrapperStyle?: React.CSSProperties; // Style for .ant-drawer-content

  className?: string; // Applied to the root element of the drawer (mask or wrapper)
  style?: React.CSSProperties; // Applied to the .ant-drawer-content-wrapper
  // getContainer?: string | HTMLElement | (() => HTMLElement) | false; // Default document.body
}

const Drawer: React.FC<DrawerProps> = ({
  open = false,
  onClose,
  title,
  footer,
  children,
  placement = 'right',
  width = 378,
  height = 378,
  closable = true,
  closeIcon = <Icon name="CloseOutlined" />,
  mask = true,
  maskClosable = true,
  // keyboard = true,
  className,
  style,
  // getContainer = () => document.body,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  // Create portal container on mount or when getContainer changes
  useEffect(() => {
    // For simplicity, always append to document.body.
    // A full getContainer implementation would handle different targets.
    const el = document.createElement('div');
    document.body.appendChild(el);
    setPortalContainer(el);
    return () => {
      document.body.removeChild(el);
    };
  }, []); // Empty dependency array means this runs once on mount and cleanup on unmount.

  // Handle Esc key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose?.(e);
      }
    };
    if (open) { // Only add listener when drawer is open
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);
  
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = ''; // Ensure cleanup on unmount
    };
  }, [open]);


  const handleMaskClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (maskClosable && e.target === e.currentTarget) { // Ensure click is on mask itself
      onClose?.(e);
    }
  };

  if (!portalContainer) {
    return null; // Portal container not ready
  }

  const drawerWrapperStyle: React.CSSProperties = {
    width: (placement === 'left' || placement === 'right') ? width : '100%',
    height: (placement === 'top' || placement === 'bottom') ? height : '100%',
    ...style, // User-provided style for the wrapper
  };

  const drawerClasses = [
    'ant-drawer',
    `ant-drawer-${placement}`,
    open ? 'ant-drawer-open' : '',
    className, // User-provided class for the root (mask or wrapper if no mask)
  ].filter(Boolean).join(' ');
  
  const drawerContent = (
    <>
      {mask && <div className="ant-drawer-mask" onClick={handleMaskClick} />}
      <div
        ref={drawerRef}
        className={`ant-drawer-content-wrapper ant-drawer-content-wrapper-${placement}`}
        style={drawerWrapperStyle}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'ant-drawer-title' : undefined}
        // aria-describedby if content has an ID
      >
        <div className="ant-drawer-content">
          <div className="ant-drawer-wrapper-body">
            {title && (
              <div className="ant-drawer-header">
                <div className="ant-drawer-header-title" id="ant-drawer-title">
                  {closable && (
                    <button type="button" className="ant-drawer-close" onClick={onClose} aria-label="Close">
                      {closeIcon}
                    </button>
                  )}
                  {title}
                </div>
              </div>
            )}
            {!title && closable && ( // If no title but closable, close button might be positioned differently
                 <button type="button" className="ant-drawer-close ant-drawer-close-no-title" onClick={onClose} aria-label="Close">
                    {closeIcon}
                 </button>
            )}
            <div className="ant-drawer-body">
              {children}
            </div>
            {footer && (
              <div className="ant-drawer-footer">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  // Render into portal if open, otherwise null (or based on animation state)
  return open ? ReactDOM.createPortal(
    <div className={drawerClasses}>
        {drawerContent}
    </div>,
    portalContainer
  ) : null;
};

export default Drawer;
