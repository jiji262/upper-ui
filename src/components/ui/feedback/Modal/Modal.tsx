// src/components/ui/feedback/Modal/Modal.tsx
import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom'; // For Portal
import Button, { ButtonProps } from '../../general/Button/Button'; // Assuming Button is available
import Icon from '../../general/Icon/Icon';   // Assuming Icon is available
import './Modal.css';

// For confirm modal static methods
// type ModalFunc = (props: ModalProps) => { destroy: () => void; update: (newConfig: ModalProps) => void; };
// interface ModalStaticFunctions { success?: ModalFunc; error?: ModalFunc; warning?: ModalFunc; info?: ModalFunc; confirm?: ModalFunc; }


interface ModalProps {
  open?: boolean;
  onOk?: (e: React.MouseEvent<HTMLElement>) => void;
  onCancel?: (e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLDivElement>) => void; // Allow keyboard event for Esc
  
  title?: React.ReactNode;
  children?: React.ReactNode; // Modal content
  footer?: React.ReactNode | null; // null to hide footer, undefined for default
  
  okText?: React.ReactNode; // Default 'OK'
  okType?: ButtonProps['type']; // Default 'primary'
  okButtonProps?: ButtonProps;
  cancelText?: React.ReactNode; // Default 'Cancel'
  cancelButtonProps?: ButtonProps;
  
  width?: string | number; // Default 520
  centered?: boolean; // Vertically center modal
  closable?: boolean; // Show 'x' icon, default true
  closeIcon?: React.ReactNode;
  mask?: boolean; // Show mask, default true
  maskClosable?: boolean; // Click mask to close, default true
  // maskStyle?: React.CSSProperties; // Not implemented here
  
  // keyboard?: boolean; // Close with Esc key, default true (handled by useEffect)
  // zIndex?: number; // Default 1000
  // bodyStyle?: React.CSSProperties;
  // confirmLoading?: boolean; // Loading state for OK button
  // destroyOnClose?: boolean; // Unmount children on close (default false)

  className?: string; // Applied to the root modal element (.ant-modal)
  wrapClassName?: string; // Applied to the wrapper (.ant-modal-wrap)
  style?: React.CSSProperties; // Applied to the dialog (.ant-modal-dialog)
  // getContainer?: string | HTMLElement | (() => HTMLElement) | false; // Default document.body
}


const Modal: React.FC<ModalProps> /* & ModalStaticFunctions */ = ({ // Static functions not implemented here
  open = false,
  onOk,
  onCancel,
  title,
  children,
  footer,
  okText = 'OK',
  okType = 'primary',
  okButtonProps,
  cancelText = 'Cancel',
  cancelButtonProps,
  width = 520,
  centered = false,
  closable = true,
  closeIcon = <Icon name="CloseOutlined" />,
  mask = true,
  maskClosable = true,
  // keyboard = true,
  className,
  wrapClassName,
  style,
  // getContainer = () => document.body,
}) => {
  const modalRef = useRef<HTMLDivElement>(null); // Ref for the dialog itself
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    setPortalContainer(el);
    return () => {
      document.body.removeChild(el);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onCancel?.(e as any); // Cast to any if type mismatch, ensure onCancel handles KeyboardEvent
      }
    };
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      // Focus management (focus first focusable element or modal itself)
      // For simplicity, not implemented here. AntD does this.
      // modalRef.current?.focus(); 
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onCancel]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);


  const handleMaskClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (maskClosable && e.target === e.currentTarget) {
      onCancel?.(e);
    }
  };

  if (!portalContainer) {
    return null;
  }

  const defaultFooter = (
    <>
      <Button onClick={onCancel} {...cancelButtonProps}>{cancelText}</Button>
      <Button type={okType} onClick={onOk} {...okButtonProps}>{okText}</Button>
    </>
  );
  const footerNode = footer === undefined ? defaultFooter : footer; // If footer is null, it's hidden

  const modalRootClasses = [
    'ant-modal-root', // For portal root if needed
    className, // User class on the very root
  ].filter(Boolean).join(' ');

  const modalWrapClasses = [
    'ant-modal-wrap',
    centered ? 'ant-modal-wrap-centered' : '',
    wrapClassName,
  ].filter(Boolean).join(' ');
  
  const modalClasses = [
    'ant-modal',
    // className, // AntD applies className to .ant-modal, not the root. Let's follow that if possible.
  ].filter(Boolean).join(' ');


  const dialogStyle: React.CSSProperties = {
    width,
    // transformOrigin: 'center', // For animations
    ...style, // User-provided style for the dialog .ant-modal
  };
  if (!centered) { // If not centered, position from top (AntD default is 100px)
    dialogStyle.top = '100px';
  }


  const modalContent = (
    <div className={modalWrapClasses} onClick={handleMaskClick}>
      <div
        ref={modalRef}
        className={modalClasses}
        style={dialogStyle}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'ant-modal-title' : undefined}
        // onKeyDown={handleKeyDown} // If keydown listener is on modal dialog itself
        // tabIndex={-1} // Make it focusable
      >
        <div className="ant-modal-content">
          {closable && (
            <button type="button" className="ant-modal-close" onClick={onCancel} aria-label="Close">
              <span className="ant-modal-close-x">{closeIcon}</span>
            </button>
          )}
          {title && (
            <div className="ant-modal-header">
              <div className="ant-modal-title" id="ant-modal-title">{title}</div>
            </div>
          )}
          <div className="ant-modal-body">
            {children}
          </div>
          {footerNode && (
            <div className="ant-modal-footer">
              {footerNode}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return open ? ReactDOM.createPortal(
    <div className={modalRootClasses}> {/* This outer div is for portal and potential global class */}
        {mask && <div className="ant-modal-mask" />}
        {modalContent}
    </div>,
    portalContainer
  ) : null;
};

// TODO: Implement static methods like Modal.success(), Modal.confirm()
// These typically involve creating a new Modal instance programmatically.
// (Modal as any).success = (props: ModalProps) => { /* ... */ };
// ...

export default Modal;
