// src/components/ui/general/Icon/Icon.tsx
import React from 'react';
import * as AntDesignIcons from '@ant-design/icons';
import './Icon.css';

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: keyof typeof AntDesignIcons;
  size?: string | number;
  color?: string;
  spin?: boolean;
  rotate?: number;
  twoToneColor?: string; // For two-tone icons
}

const Icon: React.FC<IconProps> = ({
  name,
  size,
  color,
  spin,
  rotate,
  twoToneColor,
  style,
  ...rest
}) => {
  const AntIconComponent = AntDesignIcons[name] as React.ComponentType<any>;

  if (!AntIconComponent) {
    console.warn(`Icon "${name}" not found in @ant-design/icons. Rendering a default icon.`);
    // Fallback to a default icon or null if preferred
    const DefaultIcon = AntDesignIcons['QuestionCircleOutlined'];
    return (
        <span
            role="img"
            aria-label={name}
            className="ant-icon"
            style={{ fontSize: size, color, transform: rotate ? `rotate(${rotate}deg)` : undefined, ...style }}
            {...rest}
        >
            <DefaultIcon spin={spin} twoToneColor={twoToneColor} />
        </span>
    );
  }

  const iconStyle: React.CSSProperties = {
    fontSize: size,
    color: color,
    ...(rotate && { transform: `rotate(${rotate}deg)` }),
    ...style,
  };

  return (
    <span
      role="img"
      aria-label={name.replace(/([A-Z])/g, ' $1').trim().replace('Outlined', '').replace('Filled', '').replace('Two Tone', '')}
      className="ant-icon"
      style={iconStyle}
      {...rest}
    >
      <AntIconComponent spin={spin} twoToneColor={twoToneColor} />
    </span>
  );
};

export default Icon;
