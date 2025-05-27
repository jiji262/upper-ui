// src/components/ui/feedback/Modal/Modal.tsx
import React from 'react';
import './Modal.css';

export interface ModalProps {
  title?: React.ReactNode;
  open?: boolean;
  centered?: boolean;
  width?: number | string;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  onOk?: () => void;
  onCancel?: () => void;
  okText?: React.ReactNode;
  cancelText?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Modal: React.FC<ModalProps> = ({
  title = 'Modal',
  open = false,
  centered = false,
  width = 520,
  footer,
  children,
  onOk,
  onCancel,
  okText = 'OK',
  cancelText = 'Cancel',
  className = '',
  style,
}) => {
  if (!open) return null;

  const handleOk = () => {
    if (onOk) onOk();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  const renderFooter = () => {
    if (footer === null) return null;
    
    if (footer) {
      return <div className="upper-modal-footer">{footer}</div>;
    }
    
    return (
      <div className="upper-modal-footer">
        <button className="upper-btn upper-btn-default" onClick={handleCancel}>
          {cancelText}
        </button>
        <button className="upper-btn upper-btn-primary" onClick={handleOk}>
          {okText}
        </button>
      </div>
    );
  };

  const modalStyles = {
    width: typeof width === 'string' ? width : `${width}px`,
    ...style,
  };

  const modalClasses = [
    'upper-modal',
    centered ? 'upper-modal-centered' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className="upper-modal-root">
      <div className="upper-modal-backdrop" onClick={handleBackdropClick}></div>
      <div className={modalClasses} style={modalStyles}>
        <div className="upper-modal-content">
          <div className="upper-modal-header">
            <div className="upper-modal-title">{title}</div>
            <button className="upper-modal-close" onClick={handleCancel}>
              &times;
            </button>
          </div>
          <div className="upper-modal-body">{children}</div>
          {renderFooter()}
        </div>
      </div>
    </div>
  );
};

export default Modal;
