// src/components/ui/navigation/Menu/MenuDivider.tsx
import React, { useContext } from 'react';
import { MenuContext, MenuTheme }  from './Menu';

export interface MenuDividerProps extends React.LiHTMLAttributes<HTMLLIElement> {
  dashed?: boolean;
  // Internal props
  theme?: MenuTheme;
}

const MenuDivider: React.FC<MenuDividerProps> = ({ 
  dashed, 
  className, 
  theme: dividerTheme, 
  ...rest 
}) => {
  const context = useContext(MenuContext);
  // Theme can be passed directly or inherited from Menu context
  const effectiveTheme = dividerTheme || context?.theme;

  const classes = [
    'ant-menu-item-divider',
    dashed ? 'ant-menu-item-divider-dashed' : '',
    // effectiveTheme === 'dark' ? 'ant-menu-item-divider-dark' : '', // If specific dark theme styles needed
    className,
  ].filter(Boolean).join(' ');

  return <li role="separator" className={classes} {...rest} />;
};

MenuDivider.displayName = 'MenuDivider';
export default MenuDivider;
