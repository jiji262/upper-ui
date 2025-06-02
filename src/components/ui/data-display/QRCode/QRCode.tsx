// src/components/ui/data-display/QRCode/QRCode.tsx
import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../general/Icon/Icon'; // Assuming Icon is available
import './QRCode.css';

// Dynamically try to import qrcode.react
let QRCodeCanvas: React.ComponentType<any> | null = null;
let QRCodeSVG: React.ComponentType<any> | null = null;

// Use a try-catch block for environments where dynamic import might not be supported as expected
try {
  import('qrcode.react').then(qr => {
    QRCodeCanvas = qr.QRCodeCanvas;
    QRCodeSVG = qr.QRCodeSVG;
  }).catch(() => {
    console.warn("qrcode.react could not be loaded. QRCode component will show a placeholder.");
  });
} catch (error) {
  console.warn("Dynamic import of qrcode.react failed. QRCode component will show a placeholder.", error);
}


interface QRCodeProps {
  value: string; // Value to encode
  type?: 'canvas' | 'svg'; // Default 'canvas'
  icon?: string; // URL of icon to display in the middle
  size?: number; // Size of the QR code, default 160
  iconSize?: number; // Default size/10
  color?: string; // QR code color, default '#000000'
  bgColor?: string; // Background color, default '#FFFFFF'
  level?: 'L' | 'M' | 'Q' | 'H'; // Error correction level, default 'M'
  status?: 'active' | 'expired' | 'loading' | 'scanned'; // Status of QR code
  bordered?: boolean; // Default true
  onRefresh?: () => void; // Callback for refresh button when status is 'expired'
  
  className?: string;
  style?: React.CSSProperties;
  // errorLevel?: 'L' | 'M' | 'Q' | 'H'; // AntD uses 'level'
}

const QRCode: React.FC<QRCodeProps> = ({
  value,
  type = 'canvas',
  icon,
  size = 160,
  iconSize: customIconSize,
  color = '#000000',
  bgColor = '#FFFFFF',
  level = 'M',
  status = 'active',
  bordered = true,
  onRefresh,
  className,
  style,
}) => {
  const [qrCodeComponentLoaded, setQrCodeComponentLoaded] = useState(false);
  const iconSize = customIconSize || size / 5; // Default icon size is 1/5th of QR code size


  useEffect(() => {
    // Check if QRCodeCanvas/SVG are loaded after dynamic import attempt
    if (QRCodeCanvas || QRCodeSVG) {
      setQrCodeComponentLoaded(true);
    }
    // If they are still null after a short delay, it means import failed or is slow
    const timer = setTimeout(() => {
        if (!QRCodeCanvas && !QRCodeSVG) {
            console.warn("qrcode.react components not available after delay.");
        }
         // Attempt to force re-render if components load late
        if ((QRCodeCanvas || QRCodeSVG) && !qrCodeComponentLoaded) {
            setQrCodeComponentLoaded(true);
        }
    }, 1000); // Check after 1 second
    return () => clearTimeout(timer);
  }, [qrCodeComponentLoaded]);


  const qrCodeProps = {
    value,
    size,
    fgColor: color,
    bgColor,
    level,
    imageSettings: icon ? {
      src: icon,
      height: iconSize,
      width: iconSize,
      excavate: true, // Punch a hole for the icon
    } : undefined,
  };

  const renderQRCode = () => {
    if (!qrCodeComponentLoaded || (!QRCodeCanvas && !QRCodeSVG)) {
      return <div className="ant-qrcode-placeholder-text">QR Library Error</div>;
    }
    if (type === 'svg' && QRCodeSVG) {
      return <QRCodeSVG {...qrCodeProps} />;
    }
    if (QRCodeCanvas) { // Default to canvas or if svg not available
      return <QRCodeCanvas {...qrCodeProps} />;
    }
    return <div className="ant-qrcode-placeholder-text">QR Error</div>; // Should not reach here if loaded
  };
  
  const containerClasses = [
    'ant-qrcode',
    bordered ? 'ant-qrcode-bordered' : '',
    `ant-qrcode-status-${status}`,
    className,
  ].filter(Boolean).join(' ');

  const overlayContent = () => {
    switch (status) {
      case 'expired':
        return (
          <div className="ant-qrcode-overlay-content">
            <Icon name="ExclamationCircleFilled" />
            <p>Expired</p>
            {onRefresh && <Button type="primary" size="small" onClick={onRefresh}>Refresh</Button>}
          </div>
        );
      case 'loading':
        return (
          <div className="ant-qrcode-overlay-content">
            <Icon name="LoadingOutlined" spin />
            <p>Loading...</p>
          </div>
        );
      case 'scanned': // Example custom status
         return (
          <div className="ant-qrcode-overlay-content">
            <Icon name="CheckCircleFilled" />
            <p>Scanned</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={containerClasses} style={{ ...style, width: size, height: size }}>
      <div className="ant-qrcode-canvas-container" style={{width: size, height: size}}>
        {status === 'active' || status === 'scanned' ? renderQRCode() : <div className="ant-qrcode-placeholder-inactive">{renderQRCode()}</div> /* Render dimmed QR for inactive states */}
      </div>
      {(status === 'expired' || status === 'loading' || status === 'scanned') && (
        <div className="ant-qrcode-overlay">
          {overlayContent()}
        </div>
      )}
    </div>
  );
};

export default QRCode;
