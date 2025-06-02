// src/components/ui/general/Icon/Icon.tsx
import React from 'react';
import './Icon.css';

// 简单的图标组件，可以根据需要扩展
export interface IconProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}

const Icon: React.FC<IconProps> = ({ name, className = '', style }) => {
  // 这里可以实现基于 name 的图标渲染
  // 简化实现，仅为了展示
  const renderIcon = () => {
    switch (name) {
      case 'UploadOutlined':
        return <span>↑</span>;
      case 'LeftOutlined':
        return <span>←</span>;
      case 'RightOutlined':
        return <span>→</span>;
      default:
        return <span>{name}</span>;
    }
  };

  return (
    <span className={`upper-icon ${className}`} style={style}>
      {renderIcon()}
    </span>
  );
};

export default Icon;
