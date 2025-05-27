// src/components/ui/navigation/Menu/MenuItem.tsx
import React, { useContext } from 'react';
import { MenuContext, MenuTheme } from './Menu'; // Assuming Menu.tsx provides this context

export interface MenuItemProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, 'onClick'> {
  key: string; // AntD requires key on Menu.Item
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean; // Style as a danger item
  title?: string; // Tooltip text when collapsed
  onClick?: (info: { key: string; keyPath: string[]; domEvent: React.MouseEvent<HTMLLIElement> }) => void;
  // Internal props
  level?: number;
  parentKeyPath?: string[];
  theme?: MenuTheme; // Passed from Menu or SubMenu
}

const MenuItem: React.FC<MenuItemProps> = ({
  key,
  icon,
  disabled,
  danger,
  children,
  className,
  title,
  onClick,
  level = 1,
  parentKeyPath = [],
  theme: itemTheme, // theme prop passed from Menu/SubMenu
  ...rest
}) => {
  const context = useContext(MenuContext);
  if (!context) {
    // This should not happen if MenuItem is used correctly within a Menu
    console.error('MenuItem must be used within a Menu component');
    return null;
  }

  const {
    mode,
    selectedKeys = [],
    onSelect,
    // openKeys,
    // onOpenChange,
    // inlineCollapsed,
    theme: menuTheme,
  } = context;

  const currentKeyPath = [...parentKeyPath, key];
  const effectiveTheme = itemTheme || menuTheme;

  const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
    if (disabled) return;
    onSelect({ key, keyPath: currentKeyPath, domEvent: e });
    onClick?.({ key, keyPath: currentKeyPath, domEvent: e });
  };

  const isSelected = selectedKeys.includes(key);

  const classes = [
    'ant-menu-item',
    `ant-menu-item-level-${level}`,
    isSelected ? 'ant-menu-item-selected' : '',
    disabled ? 'ant-menu-item-disabled' : '',
    danger ? 'ant-menu-item-danger' : '',
    className,
  ].filter(Boolean).join(' ');

  const itemStyle: React.CSSProperties = {};
  if (mode === 'inline') {
    itemStyle.paddingLeft = `${level * 24}px`; // antd default inline indent is 24px
  }

  return (
    <li
      role="menuitem"
      aria-selected={isSelected}
      aria-disabled={disabled}
      className={classes}
      style={itemStyle}
      title={title || (typeof children === 'string' ? children : undefined)}
      onClick={handleClick}
      {...rest}
    >
      {icon && <span className="ant-menu-item-icon">{icon}</span>}
      <span className="ant-menu-title-content">{children}</span>
    </li>
  );
};

MenuItem.displayName = 'MenuItem';
export default MenuItem;
