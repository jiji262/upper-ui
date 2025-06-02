// src/components/ui/layout/Layout/Layout.tsx
import React, { createContext, useState, useEffect } from 'react';
import './Layout.css';

interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  hasSider?: boolean; // Indicates that a Sider is a direct child, for styling purposes
}

interface SiderContextProps {
  siderHook: {
    addSider: (id: string) => void;
    removeSider: (id: string) => void;
  };
}

export const SiderContext = createContext<SiderContextProps | undefined>(undefined);


const Layout: React.FC<LayoutProps> = ({
  className,
  children,
  hasSider: hasSiderProp, // Renamed to avoid conflict with internal state
  ...rest
}) => {
  const [siders, setSiders] = useState<string[]>([]);

  const addSider = (id: string) => {
    setSiders((prevSiders) => [...prevSiders, id]);
  };

  const removeSider = (id: string) => {
    setSiders((prevSiders) => prevSiders.filter((siderId) => siderId !== id));
  };

  // Check if Layout has a Sider child component
  // This is a bit more complex than just a prop, as Sider might be added/removed dynamically
  // or we need to detect if Sider is a direct child for specific CSS classes.
  // The `hasSider` prop is a simpler way if controlled from outside.
  // For more robust detection, we iterate over children.
  let hasSiderChild = false;
  if (hasSiderProp !== undefined) {
    hasSiderChild = hasSiderProp;
  } else {
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child) && (child.type as any)?.displayName === 'Sider') {
            hasSiderChild = true;
        }
      });
  }
  
  // If not passed as prop, detect from state (siders array)
  const internalHasSider = siders.length > 0;
  const effectiveHasSider = hasSiderProp !== undefined ? hasSiderProp : internalHasSider;


  const classes = ['ant-layout'];
  if (effectiveHasSider) {
    classes.push('ant-layout-has-sider');
  }
  if (className) {
    classes.push(className);
  }

  return (
    <SiderContext.Provider value={{ siderHook: { addSider, removeSider } }}>
      <section className={classes.join(' ')} {...rest}>
        {children}
      </section>
    </SiderContext.Provider>
  );
};

Layout.displayName = "Layout"; // For child checking

export default Layout;
