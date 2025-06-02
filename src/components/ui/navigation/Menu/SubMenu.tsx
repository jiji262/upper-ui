// src/components/ui/navigation/Menu/SubMenu.tsx
import React, { useContext, useState, useEffect } from 'react';
import { MenuContext, MenuTheme } from './Menu';
import Icon from '../../general/Icon'; // Assuming Icon component is available

export interface SubMenuProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, 'onClick' | 'title'> {
  key: string;
  title: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  children?: React.ReactNode;
  onTitleClick?: (info: { key: string; domEvent: React.MouseEvent<HTMLDivElement> }) => void;
  // Internal props
  level?: number;
  parentKeyPath?: string[];
  theme?: MenuTheme;
}

const SubMenu: React.FC<SubMenuProps> = ({
  key,
  title,
  icon,
  disabled,
  children,
  className,
  onTitleClick,
  level = 1,
  parentKeyPath = [],
  theme: subMenuTheme,
  ...rest
}) => {
  const context = useContext(MenuContext);
  if (!context) {
    console.error('SubMenu must be used within a Menu component');
    return null;
  }

  const {
    mode,
    openKeys = [],
    onOpenChange,
    selectedKeys = [],
    inlineCollapsed,
    theme: menuTheme,
  } = context;

  const currentKeyPath = [...parentKeyPath, key];
  const effectiveTheme = subMenuTheme || menuTheme;

  // Determine if this submenu is open
  const isOpen = openKeys.includes(key);

  const handleTitleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    onOpenChange(key); // Toggle open state
    onTitleClick?.({ key, domEvent: e });
  };

  const subMenuClasses = [
    'ant-menu-submenu',
    `ant-menu-submenu-${mode}`, // e.g., ant-menu-submenu-vertical
    isOpen ? 'ant-menu-submenu-open' : '',
    disabled ? 'ant-menu-submenu-disabled' : '',
    // Check if any child MenuItem is selected
    // This is a simplified check. AntD's logic might be more robust.
    React.Children.toArray(children).some(child => 
        React.isValidElement(child) && 
        child.props.key && 
        selectedKeys.includes(child.props.key)
    ) && mode !== 'inline' ? 'ant-menu-submenu-selected' : '', // Selected state on submenu title (not for inline)
    className,
  ].filter(Boolean).join(' ');

  const titleClasses = [
    'ant-menu-submenu-title',
    disabled ? 'ant-menu-submenu-title-disabled' : '',
    // If any child of this submenu is selected, and it's not inline mode, the title might get a selected style.
    // This is a simplification.
  ].filter(Boolean).join(' ');
  
  const titleStyle: React.CSSProperties = {};
   if (mode === 'inline') {
    titleStyle.paddingLeft = `${level * 24}px`;
  }


  const renderChildren = () => {
    if (mode === 'horizontal' && !isOpen && !inlineCollapsed) return null; // In horizontal, hide children if not open
    if (mode === 'vertical' && !isOpen && !inlineCollapsed) return null; // In vertical (popup from horizontal), hide if not open
    if (inlineCollapsed && level > 1) return null; // For inline collapsed, only show first level submenu titles

    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        // Pass down level, parentKeyPath, and theme to children (MenuItem, SubMenu, ItemGroup, Divider)
        return React.cloneElement(child as React.ReactElement<any>, {
          level: level + 1,
          parentKeyPath: currentKeyPath,
          theme: effectiveTheme, // Pass effective theme down
        });
      }
      return child;
    });
  };
  
  const arrowIconName = mode === 'horizontal' || (mode === 'vertical' && level > 1) || (mode === 'inline' && inlineCollapsed)
    ? 'DownOutlined' // For horizontal top-level, or vertical fly-out, or inline-collapsed submenus
    : isOpen ? 'UpOutlined' : 'DownOutlined'; // For inline/vertical main menu


  return (
    <li
      role="menuitem" // Submenu acts like a menuitem that can expand
      aria-haspopup={true}
      aria-expanded={isOpen}
      aria-disabled={disabled}
      className={subMenuClasses}
      {...rest}
    >
      <div
        className={titleClasses}
        style={titleStyle}
        onClick={handleTitleClick}
        title={typeof title === 'string' ? title : undefined}
      >
        {icon && <span className="ant-menu-item-icon">{icon}</span>}
        <span className="ant-menu-title-content">{title}</span>
        {!inlineCollapsed && (mode === 'vertical' || mode === 'inline' || (mode === 'horizontal' && level > 1)) && (
            <Icon name={arrowIconName} className="ant-menu-submenu-arrow" />
        )}
      </div>
      {(!inlineCollapsed || level === 1) && ( // In inlineCollapsed, only render children for first level if open
        <ul
          role="menu"
          className={`ant-menu ant-menu-sub ant-menu-${mode === 'inline' ? 'inline' : 'vertical'} ${isOpen ? 'ant-menu-sub-open' : ''} ant-menu-sub-hidden-${!isOpen}`}
          style={{ display: isOpen ? 'block' : 'none' }} // Simple show/hide, AntD uses CSS transitions
        >
          {renderChildren()}
        </ul>
      )}
    </li>
  );
};

SubMenu.displayName = 'SubMenu';
export default SubMenu;
