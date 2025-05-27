// src/components/ui/layout/Layout/Sider.tsx
import React, { useState, useEffect, useContext, useId } from 'react';
import { SiderContext } from './Layout'; // Assuming Layout.tsx provides this context
import './Layout.css'; // Common styles

interface SiderProps extends React.HTMLAttributes<HTMLElement> {
  width?: number | string;
  collapsedWidth?: number | string;
  collapsible?: boolean;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  reverseArrow?: boolean;
  trigger?: React.ReactNode; // Custom trigger element
  breakpoint?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'; // Breakpoint to trigger collapse
  theme?: 'light' | 'dark';
  onCollapse?: (collapsed: boolean, type: 'clickTrigger' | 'responsive') => void;
}

const Sider: React.FC<SiderProps> = ({
  width = 200,
  collapsedWidth = 80,
  collapsible = false,
  collapsed: controlledCollapsed, // Renamed to avoid conflict
  defaultCollapsed = false,
  reverseArrow = false,
  trigger, // If null and collapsible, a default trigger is shown
  breakpoint,
  theme = 'dark',
  onCollapse,
  className,
  style,
  children,
  ...rest
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [isBelowBreakpoint, setIsBelowBreakpoint] = useState(false);
  const siderContext = useContext(SiderContext);
  const uniqueId = useId();


  useEffect(() => {
    if (siderContext && siderContext.siderHook) {
      siderContext.siderHook.addSider(uniqueId);
      return () => {
        siderContext.siderHook.removeSider(uniqueId);
      };
    }
  }, [siderContext, uniqueId]);


  // Controlled collapse state
  useEffect(() => {
    if (controlledCollapsed !== undefined) {
      setIsCollapsed(controlledCollapsed);
    }
  }, [controlledCollapsed]);

  // Handle responsive collapse
  useEffect(() => {
    if (!breakpoint) return;

    const mediaQuery = window.matchMedia(getMediaQuery(breakpoint));
    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      const newBelowBreakpoint = e.matches;
      setIsBelowBreakpoint(newBelowBreakpoint);
      if (controlledCollapsed === undefined) { // Only control if not controlled externally
        setIsCollapsed(newBelowBreakpoint);
      }
      onCollapse?.(newBelowBreakpoint, 'responsive');
    };

    setIsBelowBreakpoint(mediaQuery.matches);
    if (controlledCollapsed === undefined) {
        setIsCollapsed(mediaQuery.matches);
    }
    
    mediaQuery.addEventListener('change', handleMediaQueryChange);
    return () => mediaQuery.removeEventListener('change', handleMediaQueryChange);
  }, [breakpoint, controlledCollapsed, onCollapse]);

  const getMediaQuery = (bp: SiderProps['breakpoint']) => {
    const breakpoints = {
      xs: '(max-width: 575px)',
      sm: '(max-width: 767px)',
      md: '(max-width: 991px)',
      lg: '(max-width: 1199px)',
      xl: '(max-width: 1599px)',
      xxl: '(min-width: 1600px)', // Note: Antd sider usually collapses *below* a breakpoint
    };
    return breakpoints[bp!] || '(max-width: 0px)'; // Fallback for safety
  };


  const currentWidth = isCollapsed ? collapsedWidth : width;

  const handleToggleCollapse = () => {
    if (controlledCollapsed === undefined) { // Only toggle if not controlled
      const newCollapsedState = !isCollapsed;
      setIsCollapsed(newCollapsedState);
      onCollapse?.(newCollapsedState, 'clickTrigger');
    } else { // If controlled, still call onCollapse as an event
        onCollapse?.(!isCollapsed, 'clickTrigger');
    }
  };

  const classes = ['ant-layout-sider'];
  if (isCollapsed) classes.push('ant-layout-sider-collapsed');
  if (collapsible && trigger === undefined && collapsedWidth === 0) {
    classes.push('ant-layout-sider-zero-width');
  }
  if (theme === 'light') classes.push('ant-layout-sider-light');
  else classes.push('ant-layout-sider-dark'); // Default to dark
  if (className) classes.push(className);

  const siderStyle: React.CSSProperties = {
    ...style,
    flex: `0 0 ${currentWidth}px`, // AntD uses pixels for width
    maxWidth: `${currentWidth}px`,
    minWidth: `${currentWidth}px`,
    width: `${currentWidth}px`,
  };

  const defaultTrigger = (
    <div className="ant-layout-sider-trigger" onClick={handleToggleCollapse}>
      {reverseArrow ? (isCollapsed ? '>' : '<') : (isCollapsed ? '<' : '>')}
    </div>
  );

  return (
    <aside className={classes.join(' ')} style={siderStyle} {...rest}>
      <div className="ant-layout-sider-children">{children}</div>
      {collapsible && trigger !== null && (trigger || defaultTrigger)}
    </aside>
  );
};

Sider.displayName = "Sider";

export default Sider;
