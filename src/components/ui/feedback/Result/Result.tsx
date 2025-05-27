// src/components/ui/feedback/Result/Result.tsx
import React from 'react';
import Icon from '../../general/Icon/Icon'; // Assuming Icon is available
import './Result.css';

type ResultStatusType = 'success' | 'error' | 'info' | 'warning' | '403' | '404' | '500';

// Default icons for statuses
const defaultIcons: Record<ResultStatusType, React.ReactNode> = {
  success: <Icon name="CheckCircleFilled" />,
  error: <Icon name="CloseCircleFilled" />,
  info: <Icon name="InfoCircleFilled" />,
  warning: <Icon name="ExclamationCircleFilled" />,
  '403': <Icon name="ForbiddenOutlined" />, // Or a more specific 403 icon
  '404': <Icon name="QuestionCircleOutlined" />, // Or a specific 404 illustration placeholder
  '500': <Icon name="WarningFilled" />, // Or a server error illustration placeholder
};

// Default titles for statuses (can be overridden by props)
const defaultTitles: Record<ResultStatusType, string> = {
    success: 'Successfully Done!',
    error: 'Submission Failed',
    info: 'Information',
    warning: 'Warning',
    '403': '403 - Forbidden',
    '404': '404 - Not Found',
    '500': '500 - Server Error',
};


interface ResultProps {
  status?: ResultStatusType; // Default 'info'
  icon?: React.ReactNode; // Custom icon, overrides status icon
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  extra?: React.ReactNode; // Typically action buttons
  
  className?: string;
  style?: React.CSSProperties;
}

const Result: React.FC<ResultProps> = ({
  status = 'info',
  icon: customIcon,
  title: customTitle,
  subTitle,
  extra,
  className,
  style,
}) => {
  const iconNode = customIcon || defaultIcons[status];
  const titleNode = customTitle || defaultTitles[status];

  const resultClasses = [
    'ant-result',
    `ant-result-${status}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={resultClasses} style={style}>
      {iconNode && (
        <div className="ant-result-icon">
          {iconNode}
        </div>
      )}
      {titleNode && (
        <div className="ant-result-title">
          {titleNode}
        </div>
      )}
      {subTitle && (
        <div className="ant-result-subtitle">
          {subTitle}
        </div>
      )}
      {extra && (
        <div className="ant-result-extra">
          {extra}
        </div>
      )}
    </div>
  );
};

export default Result;
