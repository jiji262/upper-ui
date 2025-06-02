// src/components/ui/data-display/Collapse/CollapsePanel.tsx
import React, { useContext } from 'react';
import Icon from '../../general/Icon/Icon'; // Assuming Icon is available
import { CollapseContext } from './Collapse'; // Assuming Collapse.tsx provides this context

export interface CollapsePanelProps {
  key: string; // Unique key for the panel
  header: React.ReactNode;
  disabled?: boolean;
  showArrow?: boolean; // Default true
  extra?: React.ReactNode; // Extra content in header
  children?: React.ReactNode;
  className?: string; // Class for the panel's li item
  style?: React.CSSProperties; // Style for the panel's li item
  // Internal props
  isActive?: boolean;
  onToggle?: (key: string) => void;
  collapsible?: 'header' | 'disabled' | 'icon'; // From Collapse prop
  expandIcon?: (props: { isActive?: boolean }) => React.ReactNode; // From Collapse prop
}

const CollapsePanel: React.FC<CollapsePanelProps> = ({
  key,
  header,
  disabled = false,
  showArrow = true,
  extra,
  children,
  className,
  style,
  // Props from context/Collapse
  isActive,
  onToggle,
  collapsible,
  expandIcon,
}) => {
  const context = useContext(CollapseContext);
  const panelIsActive = isActive !== undefined ? isActive : context?.activeKeys.includes(key);
  const panelDisabled = disabled || context?.disabled;
  const panelShowArrow = showArrow !== undefined ? showArrow : context?.showArrow;
  const panelCollapsible = collapsible || context?.collapsible;
  const panelExpandIcon = expandIcon || context?.expandIcon;


  const handleHeaderClick = () => {
    if (panelDisabled || panelCollapsible === 'disabled' || panelCollapsible === 'icon') return;
    onToggle?.(key);
    context?.onItemClick?.(key);
  };
  
  const handleIconClick = (e: React.MouseEvent) => {
    if (panelDisabled || panelCollapsible === 'disabled') return;
    if (panelCollapsible === 'icon') {
        e.stopPropagation(); // Prevent header click if only icon is collapsible
        onToggle?.(key);
        context?.onItemClick?.(key);
    }
    // If collapsible is 'header' or undefined, header click handles it.
  };


  let arrowNode: React.ReactNode = null;
  if (panelShowArrow) {
    if (typeof panelExpandIcon === 'function') {
      arrowNode = panelExpandIcon({ isActive: panelIsActive });
    } else {
      arrowNode = <Icon name="RightOutlined" className={`ant-collapse-arrow-icon ${panelIsActive ? 'ant-collapse-arrow-icon-open' : ''}`} />;
    }
  }
  
  const itemClasses = [
    'ant-collapse-item',
    panelIsActive ? 'ant-collapse-item-active' : '',
    panelDisabled ? 'ant-collapse-item-disabled' : '',
    !panelShowArrow ? 'ant-collapse-item-no-arrow' : '',
    className,
  ].filter(Boolean).join(' ');

  const headerClasses = [
    'ant-collapse-header',
    (panelCollapsible === 'icon' && !panelDisabled) ? 'ant-collapse-header-collapsible-icon' : '',
    (panelCollapsible === 'disabled' || panelDisabled) ? 'ant-collapse-header-disabled' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={itemClasses} style={style}>
      <div
        className={headerClasses}
        onClick={handleHeaderClick}
        role="button"
        tabIndex={panelDisabled ? -1 : 0}
        aria-expanded={panelIsActive}
        aria-disabled={panelDisabled}
      >
        {panelShowArrow && (
            <div className="ant-collapse-arrow" onClick={panelCollapsible === 'icon' ? handleIconClick : undefined}>
                {arrowNode}
            </div>
        )}
        <span className="ant-collapse-header-text">{header}</span>
        {extra && <div className="ant-collapse-extra">{extra}</div>}
      </div>
      {/* Basic transition: content visibility. CSS can add height transition. */}
      {panelIsActive && !panelDisabled && (
        <div className={`ant-collapse-content ${panelIsActive ? 'ant-collapse-content-active' : 'ant-collapse-content-inactive'}`}>
          <div className="ant-collapse-content-box">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

CollapsePanel.displayName = 'CollapsePanel';
export default CollapsePanel;
