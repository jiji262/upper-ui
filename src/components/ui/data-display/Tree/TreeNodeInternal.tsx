// src/components/ui/data-display/Tree/TreeNodeInternal.tsx
import React from 'react';
import Icon from '../../general/Icon/Icon'; // Assuming Icon is available
import { TreeDataType, FieldNames } from './Tree'; // Main Tree types

interface TreeNodeInternalProps {
  node: TreeDataType;
  level: number;
  fieldNames: Required<FieldNames>; // Ensure all field names are present
  
  isExpanded: boolean;
  onToggleExpand: (key: string | number) => void;
  
  isSelected: boolean;
  onSelectNode: (node: TreeDataType) => void; // For single select behavior
  
  isDraggable?: boolean; // From Tree prop
  onDragStart?: (e: React.DragEvent, node: TreeDataType) => void;
  onDragEnter?: (e: React.DragEvent, node: TreeDataType) => void; // For highlighting drop target
  onDragOver?: (e: React.DragEvent) => void; // Necessary to allow drop
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, node: TreeDataType) => void;
  onDragEnd?: (e: React.DragEvent) => void;

  showLine?: boolean;
  showIcon?: boolean; // Show default icons or custom icon from node
  icon?: React.ReactNode | ((props: any) => React.ReactNode); // From Tree prop or node.icon
  switcherIcon?: React.ReactNode | ((props: any) => React.ReactNode); // From Tree prop
  
  // For checkable tree (not fully implemented in this simplified version)
  // isChecked?: boolean;
  // isHalfChecked?: boolean;
  // onCheckNode?: (node: TreeDataType, checked: boolean) => void;
  
  className?: string; // Custom class for the node from treeData item
  style?: React.CSSProperties; // Custom style for the node from treeData item
}

const TreeNodeInternal: React.FC<TreeNodeInternalProps> = ({
  node,
  level,
  fieldNames,
  isExpanded,
  onToggleExpand,
  isSelected,
  onSelectNode,
  isDraggable,
  onDragStart,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  showLine,
  showIcon = true, // Default to show icons if provided
  icon: treeIconProp, // Icon from Tree prop (global)
  switcherIcon: treeSwitcherIconProp, // Switcher from Tree prop (global)
  className,
  style,
}) => {
  const { title, key, children, disabled, isLeaf: nodeIsLeaf, icon: nodeIcon, switcherIcon: nodeSwitcherIcon } = fieldNames;

  const hasChildren = node[children] && (node[children] as TreeDataType[]).length > 0;
  const isLeaf = node[nodeIsLeaf] === undefined ? !hasChildren : node[nodeIsLeaf];

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLeaf) {
      onToggleExpand(node[key]);
    }
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node[disabled]) return;
    onSelectNode(node);
  };
  
  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent) => {
    if (node[disabled] || !isDraggable) { e.preventDefault(); return; }
    e.stopPropagation();
    e.dataTransfer.effectAllowed = 'move';
    // e.dataTransfer.setData('text/plain', node[key]); // Set data for dnd
    onDragStart?.(e, node);
  };
  const handleDragEnter = (e: React.DragEvent) => {
    if (node[disabled] || !isDraggable) return;
    e.preventDefault(); e.stopPropagation();
    onDragEnter?.(e, node);
  };
  const handleDragOver = (e: React.DragEvent) => {
    if (!isDraggable) return; // Allow drop only if tree is draggable
    e.preventDefault(); e.stopPropagation(); // Necessary to allow onDrop
    onDragOver?.(e);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    if (!isDraggable) return;
    e.stopPropagation();
    onDragLeave?.(e);
  };
  const handleDrop = (e: React.DragEvent) => {
    if (node[disabled] || !isDraggable) return; // Don't allow dropping on disabled or if not draggable
    e.preventDefault(); e.stopPropagation();
    onDrop?.(e, node);
  };
   const handleDragEnd = (e: React.DragEvent) => {
    if (!isDraggable) return;
    e.stopPropagation();
    onDragEnd?.(e);
  };


  // Determine switcher icon
  let currentSwitcherIcon: React.ReactNode = null;
  const switcherProps = { node, isLeaf, isExpanded, level }; // Props for custom switcher
  if (!isLeaf) {
    if (node[nodeSwitcherIcon]) { // Icon specified on node data
        currentSwitcherIcon = typeof node[nodeSwitcherIcon] === 'function' ? (node[nodeSwitcherIcon] as Function)(switcherProps) : node[nodeSwitcherIcon];
    } else if (treeSwitcherIconProp) { // Global tree switcher icon
        currentSwitcherIcon = typeof treeSwitcherIconProp === 'function' ? treeSwitcherIconProp(switcherProps) : treeSwitcherIconProp;
    } else { // Default AntD-like icon
        currentSwitcherIcon = <Icon name={isExpanded ? "CaretDownOutlined" : "CaretRightOutlined"} className="ant-tree-switcher-icon" />;
    }
  }

  // Determine node icon
  let currentNodeIcon: React.ReactNode = null;
  const nodeIconPropsForRender = { node, isLeaf, isExpanded, level }; // Props for custom node icon
  if (showIcon) {
    if (node[nodeIcon]) { // Icon specified on node data
        currentNodeIcon = typeof node[nodeIcon] === 'function' ? (node[nodeIcon] as Function)(nodeIconPropsForRender) : node[nodeIcon];
    } else if (treeIconProp) { // Global tree icon from Tree prop
        currentNodeIcon = typeof treeIconProp === 'function' ? treeIconProp(nodeIconPropsForRender) : treeIconProp;
    } else if (!isLeaf) { // Default folder icons if no custom icon
        // currentNodeIcon = <Icon name={isExpanded ? "FolderOpenFilled" : "FolderFilled"} />;
    } else {
        // currentNodeIcon = <Icon name="FileOutlined" />; // Default file icon
    }
  }
  
  const nodeClasses = [
    'ant-tree-treenode',
    className, // Custom class from treeData item
    node[disabled] ? 'ant-tree-treenode-disabled' : '',
    isSelected ? 'ant-tree-treenode-selected' : '',
    // Add classes for drag state if needed (e.g., 'ant-tree-treenode-drag-over')
  ].filter(Boolean).join(' ');
  
  const titleClasses = [
    'ant-tree-title',
    // Add class if node is draggable and being dragged over (for styling drop target)
  ].filter(Boolean).join(' ');

  return (
    <div
      className={nodeClasses}
      style={style} // Custom style from treeData item
      onClick={handleSelect}
      draggable={isDraggable && !node[disabled]}
      onDragStart={handleDragStart}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
      role="treeitem"
      aria-expanded={!isLeaf ? isExpanded : undefined}
      aria-selected={isSelected}
      aria-disabled={node[disabled]}
      // aria-level, aria-posinset for accessibility if needed
    >
      <span style={{ paddingLeft: `${level * 18}px` }} className="ant-tree-indent" />
      <span
        className={`ant-tree-switcher ${isLeaf ? 'ant-tree-switcher-leaf' : ''} ${isExpanded ? 'ant-tree-switcher-open' : 'ant-tree-switcher-close'}`}
        onClick={!isLeaf ? handleToggle : undefined}
      >
        {currentSwitcherIcon}
      </span>
      {/* Checkbox would go here for checkable tree */}
      {currentNodeIcon && <span className="ant-tree-node-icon">{currentNodeIcon}</span>}
      <span className={titleClasses} title={typeof node[title] === 'string' ? node[title] as string : undefined}>
        {node[title]}
      </span>
    </div>
  );
};

export default TreeNodeInternal;
