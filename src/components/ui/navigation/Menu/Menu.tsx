// src/components/ui/navigation/Menu/Menu.tsx
import React, { useState, useEffect, useCallback } from 'react';
import MenuItem, { MenuItemProps } from './MenuItem';
import SubMenu, { SubMenuProps } from './SubMenu';
import ItemGroup, { ItemGroupProps } from './ItemGroup';
import MenuDivider, { MenuDividerProps } from './MenuDivider';
import './Menu.css';

export type MenuMode = 'vertical' | 'horizontal' | 'inline';
export type MenuTheme = 'light' | 'dark';

export interface MenuProps extends Omit<React.HTMLAttributes<HTMLUListElement>, 'onClick' | 'onSelect'> {
  mode?: MenuMode;
  theme?: MenuTheme;
  selectedKeys?: string[];
  defaultSelectedKeys?: string[];
  openKeys?: string[]; // Controlled open keys for SubMenu
  defaultOpenKeys?: string[];
  inlineCollapsed?: boolean; // For inline mode
  inlineIndent?: number; // Default 24
  selectable?: boolean; // Default true
  multiple?: boolean; // Allow multiple selections, default false
  expandIcon?: React.ReactNode | ((props: { isOpen: boolean; isSubMenu: boolean }) => React.ReactNode); // Custom expand icon for SubMenu

  onClick?: (info: { key: string; keyPath: string[]; domEvent: React.MouseEvent<HTMLElement> }) => void;
  onSelect?: (info: { key: string; keyPath: string[]; selectedKeys: string[]; domEvent: React.MouseEvent<HTMLElement> }) => void;
  onDeselect?: (info: { key: string; keyPath: string[]; selectedKeys: string[]; domEvent: React.MouseEvent<HTMLElement> }) => void;
  onOpenChange?: (openKeys: string[]) => void; // Called when SubMenu is opened or closed

  items?: Array<MenuItemProps | SubMenuProps | ItemGroupProps | MenuDividerProps | null>; // Alternative to children
  children?: React.ReactNode;
}

export interface MenuContextProps {
  mode: MenuMode;
  theme: MenuTheme;
  selectedKeys: string[];
  openKeys: string[];
  inlineCollapsed?: boolean;
  inlineIndent: number;
  onSelect: (info: { key: string; keyPath: string[]; domEvent: React.MouseEvent<HTMLElement> }) => void;
  onOpenChange: (key: string) // Pass the key of the SubMenu being toggled
    => void; 
  // TODO: Add more context if needed, e.g. expandIcon
}

export const MenuContext = React.createContext<MenuContextProps | null>(null);


const Menu: React.FC<MenuProps> = ({
  mode = 'vertical',
  theme = 'light',
  selectedKeys: controlledSelectedKeys,
  defaultSelectedKeys = [],
  openKeys: controlledOpenKeys,
  defaultOpenKeys = [],
  inlineCollapsed,
  inlineIndent = 24,
  selectable = true,
  multiple = false,
  // expandIcon,
  onClick,
  onSelect: onSelectProp,
  onDeselect: onDeselectProp,
  onOpenChange: onOpenChangeProp,
  items,
  children,
  className,
  ...rest
}) => {
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<string[]>(defaultSelectedKeys);
  const [internalOpenKeys, setInternalOpenKeys] = useState<string[]>(defaultOpenKeys);

  const selectedKeys = controlledSelectedKeys !== undefined ? controlledSelectedKeys : internalSelectedKeys;
  const openKeys = controlledOpenKeys !== undefined ? controlledOpenKeys : internalOpenKeys;
  
  // Adjust mode if inlineCollapsed is true
  const currentMode = inlineCollapsed && mode === 'inline' ? 'vertical' : mode;


  useEffect(() => {
    if (inlineCollapsed && mode === 'inline') {
      // When collapsing inline menu, typically all submenus are closed
      // This behavior might be configurable or handled differently in AntD.
      // For now, we'll clear open keys when inlineCollapsed changes.
      // setInternalOpenKeys([]); 
      // However, AntD often keeps the root open keys if they were open.
      // This needs careful consideration of expected behavior.
      // For this implementation, we'll let controlledOpenKeys or defaultOpenKeys manage this.
    }
  }, [inlineCollapsed, mode]);


  const handleSelect = ({ key, keyPath, domEvent }: { key: string; keyPath: string[]; domEvent: React.MouseEvent<HTMLElement> }) => {
    if (!selectable) return;

    let newSelectedKeys = [...selectedKeys];
    const isCurrentlySelected = newSelectedKeys.includes(key);

    if (multiple) {
      if (isCurrentlySelected) {
        newSelectedKeys = newSelectedKeys.filter(k => k !== key);
        onDeselectProp?.({ key, keyPath, selectedKeys: newSelectedKeys, domEvent });
      } else {
        newSelectedKeys.push(key);
        onSelectProp?.({ key, keyPath, selectedKeys: newSelectedKeys, domEvent });
      }
    } else {
      if (isCurrentlySelected) {
        // If not multiple and already selected, deselect if selectable allows (AntD might not deselect on click if not multiple)
        // For simplicity, let's assume re-clicking selected item does nothing unless multiple=true
        // Or, if you want to allow deselection on single-select mode:
        // newSelectedKeys = []; // or handle specific deselection logic
        // onDeselectProp?.({ key, keyPath, selectedKeys: newSelectedKeys, domEvent });
      } else {
        newSelectedKeys = [key];
        onSelectProp?.({ key, keyPath, selectedKeys: newSelectedKeys, domEvent });
      }
    }
    
    if (controlledSelectedKeys === undefined) {
      setInternalSelectedKeys(newSelectedKeys);
    }
    onClick?.({ key, keyPath, domEvent }); // General click event
  };

  const handleOpenChange = (subMenuKey: string) => {
    let newOpenKeys = [...openKeys];
    if (newOpenKeys.includes(subMenuKey)) {
      newOpenKeys = newOpenKeys.filter(k => k !== subMenuKey);
    } else {
      if (mode === 'inline') { // In inline mode, only one submenu at the same level can be open
        // This logic needs to be more sophisticated to handle different levels correctly.
        // For now, it just toggles. AntD might close other same-level submenus.
        newOpenKeys.push(subMenuKey);
      } else { // For vertical/horizontal (popup) mode, multiple can be open
        newOpenKeys.push(subMenuKey);
      }
    }
    if (controlledOpenKeys === undefined) {
      setInternalOpenKeys(newOpenKeys);
    }
    onOpenChangeProp?.(newOpenKeys);
  };
  

  const menuClasses = [
    'ant-menu',
    `ant-menu-root`,
    `ant-menu-${currentMode}`, // Use currentMode which accounts for inlineCollapsed
    `ant-menu-${theme}`,
    inlineCollapsed && mode === 'inline' ? 'ant-menu-inline-collapsed' : '',
    className,
  ].filter(Boolean).join(' ');

  const renderItems = (itemList: any[]) => {
    return itemList.map((item, index) => {
      if (!item) return null;
      // `key` should be part of item props, or use index as fallback
      const itemKey = item.key || `menu-item-${index}`;

      if (item.type === 'divider' || (item.props && item.props.role === 'separator')) { // Check for MenuDivider-like items
        return <MenuDivider key={itemKey} {...item.props} theme={theme} />;
      }
      if (item.type?.displayName === 'ItemGroup' || item.props?.title) { // Basic check for ItemGroup
        return <ItemGroup key={itemKey} {...item.props} theme={theme} level={1} parentKeyPath={[]} />;
      }
      if (item.type?.displayName === 'SubMenu' || (item.props && item.props.children) ) { // Basic check for SubMenu
         // Ensure children of SubMenu are also processed if they are in items array structure
        const subMenuChildren = item.props.children; // This could be an array of item objects or ReactNodes
        return <SubMenu key={itemKey} {...item.props} theme={theme} level={1} parentKeyPath={[]}>
            {/* Recursively render if children are also item objects, or pass as React children */}
            {/* This part needs careful handling based on `items` structure */}
        </SubMenu>;
      }
      // Default to MenuItem
      return <MenuItem key={itemKey} {...item.props} theme={theme} level={1} parentKeyPath={[]} />;
    });
  };
  
  const childrenToRender = items ? renderItems(items) : React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
        // Pass theme and other necessary props from Menu to direct children
        return React.cloneElement(child as React.ReactElement<any>, {
            theme: theme, // Pass menu's theme to children
            level: 1, // Direct children are at level 1
            parentKeyPath: [], // Direct children have no parent key path
        });
    }
    return child;
  });


  return (
    <MenuContext.Provider
      value={{
        mode: currentMode,
        theme,
        selectedKeys,
        openKeys,
        inlineCollapsed: inlineCollapsed && mode === 'inline',
        inlineIndent,
        onSelect: handleSelect,
        onOpenChange: handleOpenChange,
      }}
    >
      <ul role="menu" className={menuClasses} {...rest}>
        {childrenToRender}
      </ul>
    </MenuContext.Provider>
  );
};

// Assign sub-components for easy access (Menu.Item, Menu.SubMenu, etc.)
(Menu as any).Item = MenuItem;
(Menu as any).SubMenu = SubMenu;
(Menu as any).ItemGroup = ItemGroup;
(Menu as any).Divider = MenuDivider;

export default Menu;
