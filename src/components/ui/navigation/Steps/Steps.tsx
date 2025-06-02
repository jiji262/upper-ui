// src/components/ui/navigation/Steps/Steps.tsx
import React, { Children, isValidElement, cloneElement } from 'react';
import Step, { StepProps, StepStatus } from './Step';
import './Steps.css';

interface StepsProps {
  current?: number; // Current step index (0-based)
  defaultCurrent?: number;
  direction?: 'horizontal' | 'vertical';
  labelPlacement?: 'horizontal' | 'vertical'; // Default 'horizontal' for horizontal steps, 'vertical' for vertical steps
  progressDot?: boolean | ((iconDot: any, info: { index: number; status: StepStatus; title: React.ReactNode; description: React.ReactNode }) => React.ReactNode);
  size?: 'default' | 'small';
  status?: StepStatus; // Overall status for all steps, can be overridden by individual Step
  type?: 'default' | 'navigation' | 'inline'; // AntD 5.0+ has 'inline' type
  responsive?: boolean; // Auto switch to vertical on small screens, default true for horizontal
  onChange?: (current: number) => void;
  children?: React.ReactNode; // Should be Steps.Step components
  items?: StepProps[]; // Alternative to children
  className?: string;
  style?: React.CSSProperties;
  percent?: number; // For process step with progress dot
}

const Steps: React.FC<StepsProps> = ({
  current: controlledCurrent,
  defaultCurrent = 0,
  direction = 'horizontal',
  labelPlacement,
  progressDot = false,
  size = 'default',
  status: globalStatus, // Overall status
  type = 'default',
  responsive = true, // Default true for horizontal steps
  onChange,
  children,
  items,
  className,
  style,
  percent, // Pass percent to children if progressDot and status=process
}) => {
  const [internalCurrent, setInternalCurrent] = useState(defaultCurrent);
  const [isVerticalOnSmallScreen, setIsVerticalOnSmallScreen] = useState(false);


  const current = controlledCurrent !== undefined ? controlledCurrent : internalCurrent;

  useEffect(() => {
    // Handle responsive behavior
    if (direction === 'horizontal' && responsive) {
      const mediaQuery = window.matchMedia('(max-width: 576px)'); // Example breakpoint
      const handleResize = () => setIsVerticalOnSmallScreen(mediaQuery.matches);
      handleResize(); // Initial check
      mediaQuery.addEventListener('change', handleResize);
      return () => mediaQuery.removeEventListener('change', handleResize);
    } else {
        setIsVerticalOnSmallScreen(false); // Ensure it's false if not horizontal responsive
    }
  }, [direction, responsive]);

  const effectiveDirection = isVerticalOnSmallScreen ? 'vertical' : direction;
  const effectiveLabelPlacement = labelPlacement || (effectiveDirection === 'horizontal' ? 'horizontal' : 'vertical');

  const stepsClasses = [
    'ant-steps',
    `ant-steps-${effectiveDirection}`,
    `ant-steps-label-${effectiveLabelPlacement}`, // e.g. ant-steps-label-vertical
    size === 'small' ? 'ant-steps-small' : '',
    progressDot ? 'ant-steps-dot' : '',
    type === 'navigation' ? 'ant-steps-navigation' : '',
    type === 'inline' ? 'ant-steps-inline' : '',
    isVerticalOnSmallScreen ? 'ant-steps-responsive-vertical' : '',
    className,
  ].filter(Boolean).join(' ');

  const onStepClick = (index: number) => {
    if (onChange) {
      if (controlledCurrent === undefined) {
        setInternalCurrent(index);
      }
      onChange(index);
    }
  };
  
  const renderableSteps = items 
    ? items.map((itemProps, index) => (
        <Step 
            key={index} 
            {...itemProps} 
            stepNumber={index + 1} 
            current={current}
            status={globalStatus || itemProps.status} // Global status can be overridden by item's status
            direction={effectiveDirection}
            labelPlacement={effectiveLabelPlacement}
            progressDot={progressDot}
            percent={itemProps.status === 'process' || (globalStatus === 'process' && !itemProps.status) ? percent : undefined}
            isLast={index === items.length - 1}
            onClick={type === 'navigation' || type === 'inline' ? () => onStepClick(index) : itemProps.onClick}
        />
    ))
    : Children.map(children, (child, index) => {
        if (!isValidElement(child)) return null;
        // Ensure child is a Step component
        if ((child.type as React.ComponentType)?.displayName !== 'Step') {
            console.warn('Steps children should be of type Steps.Step');
            return child; // Or filter out
        }
        return cloneElement(child as React.ReactElement<StepProps>, {
          stepNumber: index + 1,
          current,
          status: globalStatus || child.props.status,
          direction: effectiveDirection,
          labelPlacement: effectiveLabelPlacement,
          progressDot,
          percent: child.props.status === 'process' || (globalStatus === 'process' && !child.props.status) ? percent : undefined,
          isLast: index === Children.count(children) - 1,
          onClick: type === 'navigation' || type === 'inline' ? () => onStepClick(index) : child.props.onClick,
        });
      });

  return (
    <div className={stepsClasses} style={style}>
      {renderableSteps}
    </div>
  );
};

// Assign Step as a static property for Steps.Step usage
(Steps as any).Step = Step;

export default Steps;
