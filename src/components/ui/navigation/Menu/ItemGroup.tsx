// src/components/ui/navigation/Menu/ItemGroup.tsx
import React, { useContext } from 'react';
import { MenuContext, MenuTheme } from './Menu'; // Assuming Menu.tsx provides this context

export interface ItemGroupProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, 'title'> {
  title?: React.ReactNode;
  children?: React.ReactNode;
  // Internal props
  level?: number; // ItemGroup itself doesn't usually indent based on level in the same way as items/submenus
  parentKeyPath?: string[];
  theme?: MenuTheme;
}

const ItemGroup: React.FC<ItemGroupProps> = ({
  title,
  children,
  className,
  level = 1, // Default level, though styling might not depend on it directly
  parentKeyPath = [],
  theme: groupTheme,
  ...rest
}) => {
  const context = useContext(MenuContext);
  if (!context) {
    console.error('ItemGroup must be used within a Menu component');
    return null;
  }
  const { theme: menuTheme, mode } = context;
  const effectiveTheme = groupTheme || menuTheme;


  const groupClasses = ['ant-menu-item-group', className].filter(Boolean).join(' ');
  
  // ItemGroup title style might differ slightly depending on mode (e.g., inline)
  const titleStyle: React.CSSProperties = {};
  if (mode === 'inline') {
      // AntD ItemGroup titles in 'inline' mode might have padding similar to items at their effective level
      // This is a simplification; actual AntD styling might involve specific selectors.
      // titleStyle.paddingLeft = `${level * 24 - 10}px`; // Example: 24px per level, minus some for group title
  }


  return (
    <li role="presentation" className={groupClasses} {...rest}>
      {title && (
        <div className="ant-menu-item-group-title" style={titleStyle} title={typeof title === 'string' ? title : undefined}>
          {title}
        </div>
      )}
      <ul className="ant-menu-item-group-list">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            // Pass down level, parentKeyPath, and theme to children
            // For children of ItemGroup, the level passed might be relative to the group's context
            // or continue from the parent SubMenu/Menu. AntD typically continues.
            return React.cloneElement(child as React.ReactElement<any>, {
              level: level, // Or level + 1 if group children should be further indented
              parentKeyPath: parentKeyPath, // ItemGroup doesn't add its own key to path for children
              theme: effectiveTheme,
            });
          }
          return child;
        })}
      </ul>
    </li>
  );
};

ItemGroup.displayName = 'ItemGroup';
export default ItemGroup;
