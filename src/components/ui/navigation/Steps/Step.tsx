// src/components/ui/navigation/Steps/Step.tsx
import React from 'react';
import Icon from '../../general/Icon'; // Assuming Icon component is available

export type StepStatus = 'wait' | 'process' | 'finish' | 'error';

export interface StepProps {
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  status?: StepStatus;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;

  // Internal props, passed by Steps component
  stepNumber?: number;
  current?: number; // Current active step index (0-based) from Steps
  isLast?: boolean;
  direction?: 'horizontal' | 'vertical';
  progressDot?: boolean | ((iconDot: any, info: { index: number; status: StepStatus; title: React.ReactNode; description: React.ReactNode }) => React.ReactNode);
  labelPlacement?: 'horizontal' | 'vertical';
  percent?: number; // For progress dot type 'process'
}

const Step: React.FC<StepProps> = ({
  title,
  subTitle,
  description,
  icon,
  status: customStatus, // Status passed directly to Step
  disabled,
  className,
  style,
  onClick,
  stepNumber, // Injected by Steps (1-based for display)
  current = 0, // Injected by Steps (0-based)
  isLast,
  direction = 'horizontal',
  progressDot,
  labelPlacement = 'horizontal',
  percent,
}) => {
  const stepIndex = (stepNumber || 1) - 1; // Convert to 0-based index for logic

  // Determine status
  let status: StepStatus = 'wait';
  if (customStatus) {
    status = customStatus;
  } else if (stepIndex < current) {
    status = 'finish';
  } else if (stepIndex === current) {
    status = 'process';
  } else {
    status = 'wait';
  }
  if (disabled) {
    status = 'wait'; // Or a specific 'disabled' status if design requires
  }


  const stepClasses = [
    'ant-steps-item',
    `ant-steps-item-${status}`,
    disabled ? 'ant-steps-item-disabled' : '',
    isLast ? 'ant-steps-item-last' : '',
    icon ? 'ant-steps-item-custom' : '',
    progressDot ? 'ant-steps-item-progress-dot' : '',
    className,
  ].filter(Boolean).join(' ');

  const handleStepClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    onClick?.(e);
    // Potentially, Steps component could also handle click via context to change current step
  };

  const renderIconNode = () => {
    if (progressDot) {
      if (typeof progressDot === 'function') {
        return (
          <span className="ant-steps-icon-dot">
            {progressDot({}, { index: stepIndex, status, title, description })}
          </span>
        );
      }
      // Default progress dot
      let dotElement = <span className="ant-steps-icon-dot-inner" />;
      if (status === 'process' && typeof percent === 'number') {
        // Simplified progress display, AntD uses a more complex SVG for this
        dotElement = (
            <span className="ant-steps-icon-dot-inner ant-steps-icon-dot-progress" style={{width: `${percent}%`}} />
        );
      }

      return <span className="ant-steps-icon-dot">{dotElement}</span>;
    }

    let iconNode: React.ReactNode;
    if (icon) {
      iconNode = icon;
    } else {
      switch (status) {
        case 'finish':
          iconNode = <Icon name="CheckOutlined" />;
          break;
        case 'error':
          iconNode = <Icon name="CloseOutlined" />;
          break;
        case 'process':
        case 'wait':
        default:
          iconNode = <span className="ant-steps-icon-number">{stepNumber}</span>;
          break;
      }
    }
    return <div className="ant-steps-icon">{iconNode}</div>;
  };

  return (
    <div className={stepClasses} style={style} onClick={handleStepClick}>
      <div className="ant-steps-item-container">
        <div className={`ant-steps-item-icon ${progressDot ? 'ant-steps-icon-dot-container' : ''}`}>
          {renderIconNode()}
        </div>
        <div className="ant-steps-item-content">
          <div className="ant-steps-item-title">
            {title}
            {subTitle && <div className="ant-steps-item-subtitle">{subTitle}</div>}
          </div>
          {description && <div className="ant-steps-item-description">{description}</div>}
        </div>
        {!isLast && <div className="ant-steps-item-tail" />}
      </div>
    </div>
  );
};

Step.displayName = 'Step';
export default Step;
