// src/components/ui/data-display/Collapse/Collapse.tsx
import React, { useState, useEffect, Children, isValidElement, cloneElement, createContext } from 'react';
import CollapsePanel, { CollapsePanelProps } from './CollapsePanel';
import './Collapse.css';

type Accordion = boolean;
type ActiveKey = string | string[];

interface CollapseProps {
  activeKey?: ActiveKey;
  defaultActiveKey?: ActiveKey;
  accordion?: Accordion; // If true, only one panel can be active at a time
  onChange?: (key: ActiveKey) => void; // Callback with new active key(s)
  
  bordered?: boolean; // Default true
  collapsible?: 'header' | 'disabled' | 'icon'; // Area that can trigger collapse
  destroyInactivePanel?: boolean; // Default false (content is hidden with CSS, not unmounted)
  expandIcon?: (props: { isActive?: boolean; disabled?: boolean; }) => React.ReactNode;
  expandIconPosition?: 'left' | 'right'; // Default 'left' in AntD 4.x, 'start'/'end' in 5.x
  ghost?: boolean; // Make collapse panels transparent
  
  children?: React.ReactNode; // Should be Collapse.Panel components
  items?: Array<Omit<CollapsePanelProps, 'isActive' | 'onToggle' | 'collapsible' | 'expandIcon'>>; // Alternative to children
  
  className?: string;
  style?: React.CSSProperties;
  // Internal context props, not for public API directly on Collapse
  disabled?: boolean; // To pass down to panels if Collapse itself is disabled (not standard AntD prop)
  showArrow?: boolean; // To pass down (not standard AntD prop for Collapse, but for Panel)
}

interface CollapseContextProps {
  activeKeys: string[];
  onItemClick: (key: string) => void;
  bordered?: boolean;
  collapsible?: 'header' | 'disabled' | 'icon';
  expandIcon?: (props: { isActive?: boolean; disabled?: boolean; }) => React.ReactNode;
  expandIconPosition?: 'left' | 'right';
  ghost?: boolean;
  disabled?: boolean; // Overall disabled state for all panels
  showArrow?: boolean; // Global showArrow for all panels
}

export const CollapseContext = createContext<CollapseContextProps | null>(null);

const Collapse: React.FC<CollapseProps> = ({
  activeKey: controlledActiveKey,
  defaultActiveKey,
  accordion = false,
  onChange,
  bordered = true,
  collapsible,
  destroyInactivePanel = false, // Not fully implemented in this simplified version's rendering
  expandIcon,
  expandIconPosition = 'left', // AntD 4.x default
  ghost = false,
  children,
  items,
  className,
  style,
  disabled, // Prop to disable all panels
  showArrow, // Prop to control arrow for all panels
}) => {
  const getInitialActiveKeys = (): string[] => {
    let keys = defaultActiveKey || [];
    if (typeof keys === 'string') keys = [keys];
    if (accordion && keys.length > 1) keys = [keys[0]]; // Only first key if accordion
    return keys;
  };

  const [internalActiveKeys, setInternalActiveKeys] = useState<string[]>(getInitialActiveKeys());

  const activeKeys = controlledActiveKey !== undefined
    ? (Array.isArray(controlledActiveKey) ? controlledActiveKey : [controlledActiveKey])
    : internalActiveKeys;

  useEffect(() => {
    if (controlledActiveKey !== undefined) {
      setInternalActiveKeys(Array.isArray(controlledActiveKey) ? controlledActiveKey : [controlledActiveKey]);
    }
  }, [controlledActiveKey]);


  const handleItemClick = (key: string) => {
    let newActiveKeys = [...activeKeys];
    if (accordion) {
      newActiveKeys = newActiveKeys.includes(key) ? [] : [key];
    } else {
      if (newActiveKeys.includes(key)) {
        newActiveKeys = newActiveKeys.filter(k => k !== key);
      } else {
        newActiveKeys.push(key);
      }
    }

    if (controlledActiveKey === undefined) {
      setInternalActiveKeys(newActiveKeys);
    }
    onChange?.(accordion ? (newActiveKeys[0] || '') : newActiveKeys); // Return single key string if accordion and one active, else array or empty
  };

  const contextValue: CollapseContextProps = {
    activeKeys,
    onItemClick: handleItemClick,
    bordered,
    collapsible,
    expandIcon,
    expandIconPosition,
    ghost,
    disabled, // Pass disabled to context
    showArrow, // Pass showArrow to context
  };

  const collapseClasses = [
    'ant-collapse',
    bordered ? 'ant-collapse-bordered' : '',
    ghost ? 'ant-collapse-ghost' : '',
    `ant-collapse-icon-position-${expandIconPosition === 'right' ? 'end' : 'start'}`, // Map to start/end for 5.x like class
    className,
  ].filter(Boolean).join(' ');
  
  const renderItems = () => {
    const itemSource = items 
        ? items.map(item => <CollapsePanel {...item} />) // If using items prop
        : Children.toArray(children); // If using children prop

    return Children.map(itemSource, (child) => {
        if (!isValidElement(child) || (child.type as React.ComponentType)?.displayName !== 'CollapsePanel') {
            console.warn('Collapse children should be of type Collapse.Panel');
            return null;
        }
        const panelProps = child.props as CollapsePanelProps;
        // Pass down relevant props from Collapse to Panel if not already on Panel
        // isActive and onToggle are core for panel behavior within context
        return cloneElement(child as React.ReactElement<CollapsePanelProps>, {
            isActive: activeKeys.includes(panelProps.key),
            onToggle: handleItemClick, // Panel uses this to notify Collapse
            // Pass context-derived props if panel shouldn't read context directly or needs override
            collapsible: panelProps.collapsible !== undefined ? panelProps.collapsible : collapsible,
            expandIcon: panelProps.expandIcon !== undefined ? panelProps.expandIcon : expandIcon,
            // disabled: panelProps.disabled !== undefined ? panelProps.disabled : disabled, // Panel should prefer its own prop
            // showArrow: panelProps.showArrow !== undefined ? panelProps.showArrow : showArrow,
        });
    });
  };


  return (
    <CollapseContext.Provider value={contextValue}>
      <div className={collapseClasses} style={style} role={accordion ? "tablist" : undefined}>
        {renderItems()}
      </div>
    </CollapseContext.Provider>
  );
};

// Assign CollapsePanel as a static property for Collapse.Panel usage
(Collapse as any).Panel = CollapsePanel;

export default Collapse;
