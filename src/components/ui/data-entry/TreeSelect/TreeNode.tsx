// src/components/ui/data-entry/TreeSelect/TreeNode.tsx
import React from 'react';
import Icon from '../../general/Icon'; // Assuming Icon is available
import { TreeSelectOption } from './TreeSelect'; // Main TreeSelectOption type

interface TreeNodeProps {
  node: TreeSelectOption;
  level: number;
  onSelect: (node: TreeSelectOption) => void;
  isExpanded: boolean;
  onToggleExpand: (nodeValue: string | number) => void;
  isSelected: boolean;
  fieldNames: { title: string; value: string; children: string };
  searchValue?: string; // For highlighting search matches
  expandIcon?: React.ReactNode | ((props: {isExpanded: boolean; isLeaf: boolean}) => React.ReactNode);
  // showLine?: boolean; // For tree lines, not implemented in this simplified version
}

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  level,
  onSelect,
  isExpanded,
  onToggleExpand,
  isSelected,
  fieldNames,
  searchValue,
  expandIcon,
  // showLine,
}) => {
  const hasChildren = node[fieldNames.children] && node[fieldNames.children].length > 0;
  const isLeaf = node.isLeaf === undefined ? !hasChildren : node.isLeaf;

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling to parent nodes if nested
    if (node.disabled) return;
    onSelect(node);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLeaf) {
      onToggleExpand(node[fieldNames.value]);
    }
  };
  
  const renderTitle = () => {
    const titleNode = node[fieldNames.title];
    if (searchValue && typeof titleNode === 'string') {
        const index = titleNode.toLowerCase().indexOf(searchValue.toLowerCase());
        if (index !== -1) {
            return (
                <>
                    {titleNode.substring(0, index)}
                    <span className="ant-tree-select-tree-title-highlight">
                        {titleNode.substring(index, index + searchValue.length)}
                    </span>
                    {titleNode.substring(index + searchValue.length)}
                </>
            );
        }
    }
    return titleNode;
  };

  let currentExpandIcon: React.ReactNode = null;
  if (!isLeaf) {
      if (typeof expandIcon === 'function') {
          currentExpandIcon = expandIcon({isExpanded, isLeaf});
      } else if (expandIcon) {
          currentExpandIcon = expandIcon;
      } else {
          currentExpandIcon = <Icon name={isExpanded ? "MinusSquareOutlined" : "PlusSquareOutlined"} />;
      }
  }


  return (
    <div
      className={`ant-tree-select-tree-node ${isSelected ? 'ant-tree-select-tree-node-selected' : ''} ${node.disabled ? 'ant-tree-select-tree-node-disabled' : ''}`}
      style={{ paddingLeft: `${level * 18}px` }} // Indentation for level
      onClick={handleSelect} // Select node on click of the whole node area
    >
      <span
        className={`ant-tree-select-tree-switcher ${isLeaf ? 'ant-tree-select-tree-switcher-leaf' : ''} ${isExpanded ? 'ant-tree-select-tree-switcher-open' : 'ant-tree-select-tree-switcher-close'}`}
        onClick={!isLeaf ? handleToggle : undefined} // Toggle only if not leaf
      >
        {!isLeaf && currentExpandIcon}
      </span>
      {/* Checkbox would go here for multiple selection mode */}
      <span className="ant-tree-select-tree-title" title={typeof node[fieldNames.title] === 'string' ? node[fieldNames.title] as string : undefined}>
        {renderTitle()}
      </span>
    </div>
  );
};

export default TreeNode;
