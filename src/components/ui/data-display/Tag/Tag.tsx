// src/components/ui/data-display/Tag/Tag.tsx
import React, { useState } from 'react';
import Icon from '../../general/Icon/Icon'; // Assuming Icon is available
import './Tag.css';

// Predefined Ant Design colors for tags
const PRESET_COLORS = [
  'magenta', 'red', 'volcano', 'orange', 'gold',
  'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple',
];

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: string; // Predefined color string or custom hex/rgb string
  closable?: boolean;
  onClose?: (event: React.MouseEvent<HTMLElement>) => void;
  icon?: React.ReactNode;
  bordered?: boolean; // Default true in AntD 5.x
  children?: React.ReactNode;
  // visible?: boolean; // Controlled visibility (deprecated in AntD 5.x, use conditional rendering)
  // AfterClose is for animation, not implemented here
}

const Tag: React.FC<TagProps> = ({
  color,
  closable = false,
  onClose,
  icon,
  bordered = true, // AntD 5.x default
  children,
  className,
  style,
  ...restProps
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation(); // Prevent click event on tag itself if closable icon is clicked
    if (onClose) {
      onClose(e);
    }
    // If onClose doesn't prevent default or handle visibility, hide it
    if (e.defaultPrevented) return;
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  const isPresetColor = color && PRESET_COLORS.includes(color);
  const isCustomColor = color && !isPresetColor;

  const tagClasses = [
    'ant-tag',
    isPresetColor ? `ant-tag-${color}` : '',
    // Custom color tags might have a specific class if not handled by inline style alone
    isCustomColor ? `ant-tag-has-color` : '', // General class for custom colored tags
    !bordered ? 'ant-tag-borderless' : '',
    className,
  ].filter(Boolean).join(' ');

  const tagStyle: React.CSSProperties = { ...style };
  if (isCustomColor) {
    tagStyle.backgroundColor = color; // Or border color depending on AntD theme for custom
    // AntD logic for custom color tags:
    // If it's a "light" looking color, text is dark. If "dark", text is light.
    // This requires a color contrast calculation, simplified here.
    // For simplicity, we assume custom colors might need manual text color adjustment or a default.
    // A common approach is to have a class like `ant-tag-custom-color` and let CSS handle text color
    // or use a utility to determine if the background is light or dark.
    // For now, let's assume custom colors are backgrounds and text is default or handled by user via className/style.
    // AntD also sets border-color to transparent for custom colors unless bordered is explicitly true and custom color is not a background.
    // If bordered is true and it's a custom color, AntD sets border-color to the color itself and background to a lighter shade.
    // This is complex, so this simplified version will primarily set backgroundColor for custom colors.
    if (bordered) {
        tagStyle.borderColor = color;
        // For a true AntD feel with custom colors and borders, one might set:
        // tagStyle.color = color;
        // tagStyle.backgroundColor = 'transparent'; // or a very light shade of the color
        // But this example will use the color as background by default for simplicity.
    } else {
        tagStyle.borderColor = 'transparent';
    }
  }


  return (
    <span {...restProps} className={tagClasses} style={tagStyle}>
      {icon && <span className="ant-tag-icon">{icon}</span>}
      {children}
      {closable && (
        <span className="ant-tag-close-icon" onClick={handleClose}>
          <Icon name="CloseOutlined" />
        </span>
      )}
    </span>
  );
};

export default Tag;
