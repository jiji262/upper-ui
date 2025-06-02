// src/components/ui/data-entry/TreeSelect/TreeSelect.tsx
import React, { useState, useEffect, useRef } from 'react';
import Input from '../Input/Input'; // Assuming Input is available
import Icon from '../../general/Icon'; // Assuming Icon is available
import TreeNode from './TreeNode'; // The TreeNode component
import './TreeSelect.css';

export interface TreeSelectOption {
  value: string | number;
  title: React.ReactNode;
  children?: TreeSelectOption[];
  disabled?: boolean;
  isLeaf?: boolean;
  [key: string]: any; // Allow other properties
}

interface TreeSelectProps {
  treeData: TreeSelectOption[];
  value?: string | number | Array<string | number>; // Controlled value (single or multiple)
  defaultValue?: string | number | Array<string | number>;
  onChange?: (value: any, labelList: React.ReactNode[], extra: any) => void; // More complex onChange than typical select
  
  allowClear?: boolean;
  disabled?: boolean;
  placeholder?: string;
  treeCheckable?: boolean; // Multiple selection with checkboxes (not fully implemented in this simplified version)
  treeDefaultExpandAll?: boolean;
  treeExpandedKeys?: Array<string | number>; // Controlled expanded keys
  onTreeExpand?: (expandedKeys: Array<string | number>) => void;
  treeDefaultExpandedKeys?: Array<string | number>;
  
  showSearch?: boolean; // Enable search input in dropdown (basic filter by title)
  filterTreeNode?: boolean | ((inputValue: string, treeNode: TreeSelectOption) => boolean);
  treeNodeFilterProp?: string; // Prop to filter on, default 'value' or 'title'
  
  treeLine?: boolean | { showLeafIcon?: boolean }; // Show tree lines (visual only here)
  treeIcon?: React.ReactNode | ((props: any) => React.ReactNode); // Custom icon for tree nodes (not switcher)
  treeNodeLabelProp?: string; // Which prop to display in input, default 'title'
  
  dropdownClassName?: string;
  dropdownStyle?: React.CSSProperties;
  dropdownMatchSelectWidth?: boolean | number;
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';
  open?: boolean; // Controlled open state
  onDropdownVisibleChange?: (open: boolean) => void;
  
  size?: 'large' | 'middle' | 'small';
  status?: 'error' | 'warning';
  fieldNames?: { title?: string; value?: string; children?: string; label?: string }; // label for display in input
  
  loadData?: (node: TreeSelectOption) => Promise<void>; // Dynamic data loading
  // multiple?: boolean; // Implied by treeCheckable or if value is array
  // maxTagCount?: number | 'responsive'; // For multiple selection display
  // maxTagPlaceholder?: React.ReactNode | ((omittedValues: any[]) => React.ReactNode);
  // treeCheckStrictly?: boolean; // For checkable mode

  style?: React.CSSProperties;
  className?: string;
}

const defaultFieldNames = { title: 'title', value: 'value', children: 'children', label: 'title' }; // 'label' for display

const TreeSelect: React.FC<TreeSelectProps> = ({
  treeData = [],
  value: controlledValue,
  defaultValue,
  onChange,
  allowClear = false,
  disabled = false,
  placeholder = 'Please select',
  treeCheckable = false, // Simplified: focus on single select for now
  treeDefaultExpandAll = false,
  treeExpandedKeys: controlledExpandedKeys,
  onTreeExpand,
  treeDefaultExpandedKeys = [],
  showSearch = false,
  filterTreeNode = (inputValue, treeNode) => {
    const title = treeNode[finalFieldNames.title] as string;
    return title.toLowerCase().includes(inputValue.toLowerCase());
  },
  treeNodeFilterProp, // Not fully used in this simplified filter
  treeLine, // Visual, not implemented functionally beyond basic CSS if any
  treeIcon, // Not implemented in TreeNode for this version
  treeNodeLabelProp, // Prop to use for display in input, uses fieldNames.label by default
  dropdownClassName,
  dropdownStyle,
  dropdownMatchSelectWidth = true,
  placement = 'bottomLeft',
  open: controlledOpen,
  onDropdownVisibleChange,
  size,
  status,
  fieldNames: customFieldNames,
  loadData, // Not implemented in this simplified version
  style,
  className,
}) => {
  const finalFieldNames = { ...defaultFieldNames, ...customFieldNames, label: treeNodeLabelProp || customFieldNames?.label || defaultFieldNames.label };

  const [selectedValue, setSelectedValue] = useState<any>(defaultValue);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<Array<string|number>>(
    treeDefaultExpandAll ? getAllKeys(treeData, finalFieldNames) : treeDefaultExpandedKeys
  );
  const [searchValue, setSearchValue] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null); // Assuming Input component exposes ref

  // Helper to get all keys for treeDefaultExpandAll
  function getAllKeys(nodes: TreeSelectOption[], fNames: any): (string|number)[] {
    let keys: (string|number)[] = [];
    for (const node of nodes) {
      keys.push(node[fNames.value]);
      if (node[fNames.children]) {
        keys = keys.concat(getAllKeys(node[fNames.children], fNames));
      }
    }
    return keys;
  }

  useEffect(() => {
    if (controlledValue !== undefined) {
      setSelectedValue(controlledValue);
    }
  }, [controlledValue]);

  useEffect(() => {
    if (controlledExpandedKeys !== undefined) {
      setExpandedKeys(controlledExpandedKeys);
    }
  }, [controlledExpandedKeys]);
  
  useEffect(() => {
    if (controlledOpen !== undefined) {
        setIsDropdownVisible(controlledOpen);
    }
  }, [controlledOpen]);

  useEffect(() => {
    onDropdownVisibleChange?.(isDropdownVisible);
    if (!isDropdownVisible) setSearchValue(''); // Clear search on close
  }, [isDropdownVisible, onDropdownVisibleChange]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current && !containerRef.current.contains(event.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node)
      ) {
        if (controlledOpen === undefined) setIsDropdownVisible(false);
      }
    };
    if (isDropdownVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownVisible, controlledOpen]);


  const findNode = (valueToFind: any, nodes: TreeSelectOption[]): TreeSelectOption | null => {
    for (const node of nodes) {
      if (node[finalFieldNames.value] === valueToFind) return node;
      if (node[finalFieldNames.children]) {
        const found = findNode(valueToFind, node[finalFieldNames.children]);
        if (found) return found;
      }
    }
    return null;
  };
  
  const getPathToNode = (valueToFind: any, nodes: TreeSelectOption[], path: TreeSelectOption[] = []): TreeSelectOption[] | null => {
    for (const node of nodes) {
        const currentPath = [...path, node];
        if (node[finalFieldNames.value] === valueToFind) return currentPath;
        if (node[finalFieldNames.children]) {
            const foundPath = getPathToNode(valueToFind, node[finalFieldNames.children], currentPath);
            if (foundPath) return foundPath;
        }
    }
    return null;
  };


  const handleSelectNode = (node: TreeSelectOption) => {
    if (node.disabled) return;
    
    // For single select mode (treeCheckable=false)
    if (!treeCheckable) {
      if (controlledValue === undefined) {
        setSelectedValue(node[finalFieldNames.value]);
      }
      // Find path for labels
      const path = getPathToNode(node[finalFieldNames.value], treeData, [], ) || [];
      const labels = path.map(p => p[finalFieldNames.label]);
      onChange?.(node[finalFieldNames.value], labels, { triggerNode: node, selectedNodes: [node] }); // Simplified extra
      if (controlledOpen === undefined) setIsDropdownVisible(false);
      setSearchValue(''); // Clear search on select
    } else {
      // TODO: Implement multi-select logic with treeCheckable
      // This would involve managing an array of selected values,
      // handling parent/child check states (treeCheckStrictly), etc.
      // For now, treeCheckable just implies multiple is possible, but selection logic is simplified.
      console.warn("TreeSelect: treeCheckable/multiple selection not fully implemented in this version.");
       if (controlledOpen === undefined) setIsDropdownVisible(false); // Close on select for now
    }
  };

  const handleToggleExpand = (nodeValue: string | number) => {
    const newExpandedKeys = expandedKeys.includes(nodeValue)
      ? expandedKeys.filter(k => k !== nodeValue)
      : [...expandedKeys, nodeValue];
    if (controlledExpandedKeys === undefined) {
      setExpandedKeys(newExpandedKeys);
    }
    onTreeExpand?.(newExpandedKeys);
  };
  
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (controlledValue === undefined) {
      setSelectedValue(undefined); // Or appropriate empty state for multiple
    }
    onChange?.(undefined, [], {}); // Notify change with empty value
  };

  const displayedNode = selectedValue !== undefined && !Array.isArray(selectedValue) 
    ? findNode(selectedValue, treeData) 
    : null;
  // For multiple values, display would be more complex (tags, etc.)
  const displayValue = displayedNode ? displayedNode[finalFieldNames.label] : (showSearch && searchValue ? searchValue : '');


  const renderTreeNodes = (nodes: TreeSelectOption[], level: number, currentSearchValue: string): React.ReactNode => {
    return nodes.map(node => {
      let isVisible = true;
      if (currentSearchValue && typeof filterTreeNode === 'function') {
        // If searching, check if node itself matches or if any child matches (recursive check needed for full AntD behavior)
        // Simplified: only show node if it matches, or if no search.
        // For a better filter, we'd need to filter `nodes` array first before mapping.
        // This current render will show all nodes and TreeNode can highlight.
        // A more accurate filter would hide non-matching parent nodes unless children match.
      }

      if (!isVisible) return null;

      return (
        <React.Fragment key={node[finalFieldNames.value]}>
          <TreeNode
            node={node}
            level={level}
            onSelect={handleSelectNode}
            isExpanded={expandedKeys.includes(node[finalFieldNames.value])}
            onToggleExpand={handleToggleExpand}
            isSelected={!treeCheckable && selectedValue === node[finalFieldNames.value]}
            fieldNames={finalFieldNames}
            searchValue={currentSearchValue}
            // expandIcon, showLine passed down from props if needed
          />
          {node[finalFieldNames.children] && expandedKeys.includes(node[finalFieldNames.value]) && (
            renderTreeNodes(node[finalFieldNames.children], level + 1, currentSearchValue)
          )}
        </React.Fragment>
      );
    });
  };
  
  // Filter treeData based on searchValue for rendering
  // This is a simplified filter. A proper filter might need to preserve parent structure.
  const getFilteredTreeData = (nodes: TreeSelectOption[], query: string): TreeSelectOption[] => {
    if (!query || typeof filterTreeNode !== 'function') return nodes;
    
    function filter(nodeList: TreeSelectOption[]): TreeSelectOption[] {
        return nodeList.reduce((acc, node) => {
            const children = node[finalFieldNames.children] ? filter(node[finalFieldNames.children]) : [];
            if (filterTreeNode!(query, node) || children.length > 0) {
                acc.push({ ...node, [finalFieldNames.children]: children.length > 0 ? children : undefined });
            }
            return acc;
        }, [] as TreeSelectOption[]);
    }
    return filter(nodes);
  };
  
  const currentTreeDataToRender = showSearch && searchValue ? getFilteredTreeData(treeData, searchValue) : treeData;


  const inputSuffix = (
    <>
      {allowClear && selectedValue !== undefined && !disabled && (
        <Icon name="CloseCircleFilled" className="ant-select-clear" onClick={handleClear} />
      )}
      <Icon name={isDropdownVisible ? "UpOutlined" : "DownOutlined"} className="ant-select-arrow" />
    </>
  );

  const containerClasses = [
    'ant-select', // Use common antd-select classes for styling consistency
    'ant-tree-select',
    className,
    size ? `ant-select-lg` : '', // AntD uses -lg, -sm for select sizes
    disabled ? 'ant-select-disabled' : '',
    status ? `ant-select-status-${status}` : '',
    isDropdownVisible ? 'ant-select-open' : '',
  ].filter(Boolean).join(' ');

  const dropdownClasses = [
    'ant-select-dropdown', // Common dropdown class
    'ant-tree-select-dropdown',
    dropdownClassName,
    `ant-select-dropdown-placement-${placement}`,
  ].filter(Boolean).join(' ');
  
  const dropdownComputedStyle: React.CSSProperties = { ...dropdownStyle };
  if (dropdownMatchSelectWidth && inputRef.current) { // Use inputRef for width matching
    dropdownComputedStyle.width = typeof dropdownMatchSelectWidth === 'number' 
        ? dropdownMatchSelectWidth 
        : inputRef.current.offsetWidth;
  }


  return (
    <div ref={containerRef} className={containerClasses} style={style}>
      <div className="ant-select-selector" onClick={() => !disabled && (controlledOpen === undefined ? setIsDropdownVisible(!isDropdownVisible) : onDropdownVisibleChange?.(!isDropdownVisible))}>
        {/* Input for display / search */}
        {showSearch && isDropdownVisible ? (
             <span className="ant-select-selection-search">
                <input
                    ref={inputRef} // Use this ref for width matching
                    type="search"
                    className="ant-select-selection-search-input"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder={placeholder}
                    autoFocus // Focus search input when dropdown opens
                />
            </span>
        ) : (
            <span className="ant-select-selection-item" title={typeof displayValue === 'string' ? displayValue : undefined}>
                {displayValue || <span className="ant-select-selection-placeholder">{placeholder}</span>}
            </span>
        )}
      </div>
      {inputSuffix && <span className="ant-select-suffix">{inputSuffix}</span>}
      
      {isDropdownVisible && !disabled && (
        <div ref={dropdownRef} className={dropdownClasses} style={dropdownComputedStyle}>
          <div className="ant-tree-select-tree">
            {currentTreeDataToRender.length > 0 
                ? renderTreeNodes(currentTreeDataToRender, 0, searchValue)
                : <div className="ant-select-empty-data">Not Found</div> // Or use notFoundContent prop
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default TreeSelect;
