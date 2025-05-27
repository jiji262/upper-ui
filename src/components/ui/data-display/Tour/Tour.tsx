// src/components/ui/data-display/Tour/Tour.tsx
import React, { useState, useEffect, useRef } from 'react';
import Button from '../../general/Button/Button'; // Assuming Button is available
import Icon from '../../general/Icon/Icon';   // Assuming Icon is available
import './Tour.css';

export interface TourStep {
  target?: () => HTMLElement | null | Element | undefined | string; // Selector string or function returning element
  title: React.ReactNode;
  description: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center'; // Simplified placement for popover
  // cover?: React.ReactNode; // Image/video for the step
  // nextButtonProps?: ButtonProps;
  // prevButtonProps?: ButtonProps;
  // arrow?: boolean | { pointAtCenter?: boolean };
  // mask?: boolean | { style?: React.CSSProperties; color?: string; };
  // type?: 'default' | 'primary'; // For popover style
}

interface TourProps {
  steps: TourStep[];
  open?: boolean; // Controlled visibility of the tour
  current?: number; // Controlled current step index
  defaultCurrent?: number;
  onChange?: (current: number) => void; // When step changes
  onClose?: () => void; // When tour is closed
  onFinish?: () => void; // When last step is completed
  // type?: 'default' | 'primary'; // Overall tour style
  // placement?: PopoverPlacement; // Default placement for all steps
  // mask?: boolean | { style?: React.CSSProperties; color?: string; };
  // arrow?: boolean | { pointAtCenter?: boolean };
  // closeIcon?: React.ReactNode;

  className?: string;
  style?: React.CSSProperties; // Style for the popover card
}

const Tour: React.FC<TourProps> = ({
  steps = [],
  open: controlledOpen,
  current: controlledCurrent,
  defaultCurrent = 0,
  onChange,
  onClose,
  onFinish,
  // type = 'default',
  className,
  style,
}) => {
  const [internalCurrent, setInternalCurrent] = useState(defaultCurrent);
  const [internalOpen, setInternalOpen] = useState(true); // Open by default if not controlled
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const popoverRef = useRef<HTMLDivElement>(null);
  
  const currentStepIndex = controlledCurrent !== undefined ? controlledCurrent : internalCurrent;
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const currentStepConfig = steps[currentStepIndex];

  useEffect(() => {
    if (controlledCurrent !== undefined) {
      setInternalCurrent(controlledCurrent);
    }
  }, [controlledCurrent]);

  useEffect(() => {
    if (controlledOpen !== undefined) {
      setInternalOpen(controlledOpen);
    }
  }, [controlledOpen]);
  
  // Update targetRect when current step or open state changes
  useEffect(() => {
    if (isOpen && currentStepConfig) {
      let targetEl: HTMLElement | null | Element | undefined = null;
      if (typeof currentStepConfig.target === 'string') {
        targetEl = document.querySelector(currentStepConfig.target);
      } else if (typeof currentStepConfig.target === 'function') {
        targetEl = currentStepConfig.target();
      }

      if (targetEl instanceof HTMLElement) {
        // Add a class to highlight the target (optional)
        targetEl.classList.add('ant-tour-target-highlight');
        setTargetRect(targetEl.getBoundingClientRect());
      } else {
        setTargetRect(null); // No target, position center or default
      }
      
      // Cleanup highlight class
      return () => {
        if (targetEl instanceof HTMLElement) {
          targetEl.classList.remove('ant-tour-target-highlight');
        }
      };
    } else {
      setTargetRect(null); // Clear rect if tour is not open or no step
    }
  }, [isOpen, currentStepConfig]);


  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextStep = currentStepIndex + 1;
      if (controlledCurrent === undefined) setInternalCurrent(nextStep);
      onChange?.(nextStep);
    } else {
      onFinish?.();
      if (controlledOpen === undefined) setInternalOpen(false); // Close on finish if not controlled
      onClose?.(); // Also call onClose as tour is effectively closed
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevStep = currentStepIndex - 1;
      if (controlledCurrent === undefined) setInternalCurrent(prevStep);
      onChange?.(prevStep);
    }
  };

  const handleClose = () => {
    if (controlledOpen === undefined) setInternalOpen(false);
    onClose?.();
  };
  
  // Basic popover positioning (simplified)
  const getPopoverPosition = (): React.CSSProperties => {
    if (!targetRect) { // No target, position in center of screen (simplified)
        return {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1060, // AntD Tour z-index
        };
    }
    
    // Simplified placement logic relative to targetRect
    // A robust solution would use Popper.js or similar and consider viewport collision
    const placement = currentStepConfig?.placement || 'bottom';
    const popoverHeightEstimate = 150; // Estimate, real calculation needed
    const popoverWidthEstimate = 250;  // Estimate
    const gap = 10; // Gap between target and popover

    let top = 0, left = 0;
    switch (placement) {
        case 'top':
            top = targetRect.top - popoverHeightEstimate - gap;
            left = targetRect.left + (targetRect.width / 2) - (popoverWidthEstimate / 2);
            break;
        case 'bottom':
            top = targetRect.bottom + gap;
            left = targetRect.left + (targetRect.width / 2) - (popoverWidthEstimate / 2);
            break;
        case 'left':
            top = targetRect.top + (targetRect.height / 2) - (popoverHeightEstimate / 2);
            left = targetRect.left - popoverWidthEstimate - gap;
            break;
        case 'right':
            top = targetRect.top + (targetRect.height / 2) - (popoverHeightEstimate / 2);
            left = targetRect.right + gap;
            break;
        default: // bottom
            top = targetRect.bottom + gap;
            left = targetRect.left + (targetRect.width / 2) - (popoverWidthEstimate / 2);
    }

    return {
        position: 'fixed', // Use fixed to position relative to viewport after getting rect
        top: `${Math.max(0, top)}px`, // Ensure it's not off-screen top
        left: `${Math.max(0, left)}px`, // Ensure it's not off-screen left
        zIndex: 1060,
        ...style, // Allow overriding with prop style
    };
  };


  if (!isOpen || !currentStepConfig || steps.length === 0) {
    return null;
  }
  
  const tourClasses = [
    'ant-tour',
    // `ant-tour-type-${type}`, // If type prop is added
    // `ant-tour-placement-${currentStepConfig.placement || placement}`,
    className,
  ].filter(Boolean).join(' ');

  // Mask (simplified: full screen overlay, no cutout for target)
  const maskElement = (
    <div className="ant-tour-mask" />
  );

  // Highlighted element indicator (simplified: just a border or outline)
  // A real AntD tour uses SVG masks or complex overlays for highlighting.
  // This is a very basic visual cue.
  const targetHighlightElement = targetRect && (
    <div className="ant-tour-target-placeholder" style={{
        position: 'fixed',
        top: targetRect.top,
        left: targetRect.left,
        width: targetRect.width,
        height: targetRect.height,
        // border: '2px dashed #1677ff', // Example highlight
        // boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)', // "Spotlight" effect
        pointerEvents: 'none', // Allow interaction with target if needed
        zIndex: 1059, // Below popover, above mask
    }} />
  );


  return (
    <>
      {maskElement}
      {targetHighlightElement}
      <div ref={popoverRef} className={tourClasses} style={getPopoverPosition()}>
        <div className="ant-tour-arrow" /> {/* CSS for arrow needed */}
        <div className="ant-tour-inner">
          <button type="button" className="ant-tour-close" onClick={handleClose}>
            <Icon name="CloseOutlined" />
          </button>
          <div className="ant-tour-header">
            <div className="ant-tour-title">{currentStepConfig.title}</div>
          </div>
          <div className="ant-tour-description">{currentStepConfig.description}</div>
          <div className="ant-tour-footer">
            <div className="ant-tour-steps-progress">
                {currentStepIndex + 1} / {steps.length}
            </div>
            <div className="ant-tour-buttons">
              {currentStepIndex > 0 && (
                <Button size="small" onClick={handlePrev}>Prev</Button>
              )}
              <Button type="primary" size="small" onClick={handleNext}>
                {currentStepIndex === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tour;
