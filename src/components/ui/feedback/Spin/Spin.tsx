// src/components/ui/feedback/Spin/Spin.tsx
import React from 'react';
import Icon from '../../general/Icon/Icon'; // Assuming Icon is available
import './Spin.css';

interface SpinProps {
  spinning?: boolean; // Default true
  size?: 'small' | 'default' | 'large'; // Default 'default'
  tip?: React.ReactNode; // Text below spinner
  indicator?: React.ReactNode; // Custom spinning indicator
  wrapperClassName?: string; // Class for wrapper when spinning over content
  children?: React.ReactNode; // Content to be wrapped
  
  className?: string; // Class for the spin element itself
  style?: React.CSSProperties;
  // delay?: number; // Delay in ms before showing spinner (not implemented here)
}

const Spin: React.FC<SpinProps> = ({
  spinning = true,
  size = 'default',
  tip,
  indicator,
  wrapperClassName,
  children,
  className,
  style,
}) => {
  const defaultIndicator = <Icon name="LoadingOutlined" spin />; // Default AntD loading icon

  const spinIndicator = indicator || defaultIndicator;

  const spinElement = (
    <div
      className={`ant-spin ant-spin-spinning ant-spin-size-${size} ${className || ''}`}
      style={style}
      aria-live="polite"
      aria-busy={spinning}
    >
      <span className="ant-spin-dot ant-spin-dot-spin">
        {/* AntD uses 4 i elements for its default CSS animation if not using custom indicator */}
        {/* For custom indicator (like an Icon), it replaces this structure. */}
        {/* If indicator is an Icon, it might already have its own spinning animation. */}
        {/* This simplified version will just render the indicator. */}
        {spinIndicator}
      </span>
      {tip && <div className="ant-spin-tip">{tip}</div>}
    </div>
  );

  if (children) {
    return (
      <div className={`ant-spin-nested-loading ${wrapperClassName || ''}`}>
        {spinning && (
          <div className="ant-spin-container-mask"> {/* Mask for content */}
            {spinElement}
          </div>
        )}
        <div className={`ant-spin-container ${spinning ? 'ant-spin-blur' : ''}`}>
          {children}
        </div>
      </div>
    );
  }

  return spinning ? spinElement : null; // If no children, only show spinner if spinning is true
};

export default Spin;
