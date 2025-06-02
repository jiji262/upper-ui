// src/components/ui/data-display/Tree/Tree.tsx
import React, { useState, useEffect, useCallback } from 'react';
import TreeNodeInternal from './TreeNodeInternal';
import './Tree.css';

export interface TreeDataType {
  key: string | number;
  title?: React.ReactNode;
  children?: TreeDataType[];
  disabled?: boolean;
  isLeaf?: boolean;
  icon?: React.ReactNode | ((props: any) => React.ReactNode); // For individual node icon
  switcherIcon?: React.ReactNode | ((props: any) => React.ReactNode); // For individual node switcher
  className?: string; // Custom class for this node
  style?: React.CSSProperties; // Custom style for this node
  [customField: string]: any; // Allow other custom fields
}

export interface FieldNames {
  title?: string;
  key?: string;
  children?: string;
  disabled?: string;
  isLeaf?: string;
  icon?: string;
  switcherIcon?: string;
}

interface TreeProps {
  treeData: TreeDataType[];
  fieldNames?: FieldNames; // Customize field names in treeData
  
  expandedKeys?: Array<string | number>; // Controlled expanded keys
  defaultExpandedKeys?: Array<string | number>;
  onExpand?: (expandedKeys: Array<string | number>, info: {node: TreeDataType, expanded: boolean, nativeEvent: MouseEvent}) => void;
  defaultExpandAll?: boolean;
  defaultExpandParent?: boolean; // Expand parent nodes of defaultSelectedKeys or selectedKeys

  selectedKeys?: Array<string | number>; // Controlled selected keys (single select focus)
  defaultSelectedKeys?: Array<string | number>;
  onSelect?: (selectedKeys: Array<string | number>, info: {event: 'select', selected: boolean, node: TreeDataType, selectedNodes: TreeDataType[], nativeEvent: MouseEvent}) => void;
  // multiple?: boolean; // For multi-select (not primary focus for this simplified version)
  // checkable?: boolean; // Show checkboxes (complex, not implemented here)
  // checkedKeys?: ...
  // onCheck?: ...
  
  draggable?: boolean | ((node: TreeDataType) => boolean) | { icon?: React.ReactNode; directoryDraggable?: boolean; }; // Basic boolean support here
  onDragStart?: (info: {event: React.DragEvent, node: TreeDataType}) => void;
  onDragEnter?: (info: {event: React.DragEvent, node: TreeDataType, expandedKeys: Array<string|number>}) => void;
  onDragOver?: (info: {event: React.DragEvent, node: TreeDataType}) => void;
  onDragLeave?: (info: {event: React.DragEvent, node: TreeDataType}) => void;
  onDrop?: (info: {event: React.DragEvent, node: TreeDataType, dragNode: TreeDataType, dragNodesKeys: Array<string|number>, dropPosition: number, dropToGap?: boolean}) => void;
  onDragEnd?: (info: {event: React.DragEvent, node: TreeDataType}) => void;
  // allowDrop?: (info: {dropNode: TreeDataType, dropPosition: number}) => boolean;

  showLine?: boolean | { showLeafIcon?: boolean }; // Show connecting lines
  showIcon?: boolean; // Show default or custom icons
  icon?: React.ReactNode | ((props: any) => React.ReactNode); // Global icon for all nodes
  switcherIcon?: React.ReactNode | ((props: any) => React.ReactNode); // Global switcher icon

  // height?: number; // Virtual scrolling (not implemented)
  // virtual?: boolean; // (not implemented)
  
  className?: string;
  style?: React.CSSProperties;
  // blockNode?: boolean; // Whether nodes take full width
}

const defaultFieldNamesConfig: Required<FieldNames> = {
  title: 'title',
  key: 'key',
  children: 'children',
  disabled: 'disabled',
  isLeaf: 'isLeaf',
  icon: 'icon',
  switcherIcon: 'switcherIcon',
};


const Tree: React.FC<TreeProps> = ({
  treeData = [],
  fieldNames: customFieldNames,
  expandedKeys: controlledExpandedKeys,
  defaultExpandedKeys = [],
  onExpand,
  defaultExpandAll = false,
  defaultExpandParent = true, // Default behavior in AntD
  selectedKeys: controlledSelectedKeys,
  defaultSelectedKeys = [],
  onSelect,
  draggable = false,
  onDragStart, onDragEnter, onDragOver, onDragLeave, onDrop, onDragEnd,
  showLine = false,
  showIcon = false, // AntD default is false unless tree has icons or showLine is object
  icon: globalTreeIcon,
  switcherIcon: globalTreeSwitcherIcon,
  className,
  style,
  // blockNode = false,
}) => {
  const fieldNames = { ...defaultFieldNamesConfig, ...customFieldNames };
  const [internalExpandedKeys, setInternalExpandedKeys] = useState<Array<string|number>>([]);
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<Array<string|number>>(defaultSelectedKeys);
  
  // For drag and drop state
  const [draggingNode, setDraggingNode] = useState<TreeDataType | null>(null);
  const [dragOverNodeKey, setDragOverNodeKey] = useState<string|number|null>(null); // Key of node being dragged over


  // Helper to get all keys for defaultExpandAll or specific keys for defaultExpandParent
  const getAllKeys = useCallback((nodes: TreeDataType[]): (string|number)[] => {
    let keys: (string|number)[] = [];
    for (const node of nodes) {
      keys.push(node[fieldNames.key]);
      const childrenNodes = node[fieldNames.children] as TreeDataType[] | undefined;
      if (childrenNodes) {
        keys = keys.concat(getAllKeys(childrenNodes));
      }
    }
    return keys;
  }, [fieldNames]);

  const getParentKeys = useCallback((keyToFind: string|number, nodes: TreeDataType[]): (string|number)[] => {
    for (const node of nodes) {
        if (node[fieldNames.key] === keyToFind) return [node[fieldNames.key]];
        const childrenNodes = node[fieldNames.children] as TreeDataType[] | undefined;
        if (childrenNodes) {
            const foundInChildren = getParentKeys(keyToFind, childrenNodes);
            if (foundInChildren.length > 0) {
                return [node[fieldNames.key], ...foundInChildren];
            }
        }
    }
    return [];
  }, [fieldNames]);


  useEffect(() => {
    let initialExpanded: (string|number)[] = defaultExpandedKeys;
    if (defaultExpandAll) {
      initialExpanded = getAllKeys(treeData);
    } else if (defaultExpandParent) {
        const keysToExpand = new Set<string|number>(initialExpanded);
        (controlledSelectedKeys || defaultSelectedKeys).forEach(key => {
            const path = getParentKeys(key, treeData);
            path.slice(0, -1).forEach(parentKey => keysToExpand.add(parentKey)); // Add all parents except the node itself
        });
        initialExpanded = Array.from(keysToExpand);
    }
    setInternalExpandedKeys(initialExpanded);
  }, [treeData, defaultExpandedKeys, defaultExpandAll, defaultExpandParent, getAllKeys, getParentKeys, controlledSelectedKeys, defaultSelectedKeys]);


  const currentExpandedKeys = controlledExpandedKeys !== undefined ? controlledExpandedKeys : internalExpandedKeys;
  const currentSelectedKeys = controlledSelectedKeys !== undefined ? controlledSelectedKeys : internalSelectedKeys;

  const handleToggleExpand = (key: string | number, nativeEvent?: MouseEvent) => { // Added nativeEvent
    const newExpandedKeys = currentExpandedKeys.includes(key)
      ? currentExpandedKeys.filter(k => k !== key)
      : [...currentExpandedKeys, key];
    
    if (controlledExpandedKeys === undefined) {
      setInternalExpandedKeys(newExpandedKeys);
    }
    // Find node for onExpand callback
    const findNodeRecursively = (nodes: TreeDataType[], targetKey: string|number): TreeDataType | null => {
        for (const node of nodes) {
            if (node[fieldNames.key] === targetKey) return node;
            const childrenOfNode = node[fieldNames.children] as TreeDataType[] | undefined;
            if (childrenOfNode) {
                const found = findNodeRecursively(childrenOfNode, targetKey);
                if (found) return found;
            }
        }
        return null;
    }
    const node = findNodeRecursively(treeData, key);
    if (node) {
        onExpand?.(newExpandedKeys, { node, expanded: !currentExpandedKeys.includes(key), nativeEvent: nativeEvent as MouseEvent });
    }
  };

  const handleSelectNode = (node: TreeDataType, nativeEvent?: MouseEvent) => { // Added nativeEvent
    if (node[fieldNames.disabled]) return;
    // Simplified single selection, AntD `multiple` prop handles multi-select
    const newSelectedKeys = [node[fieldNames.key]];
    if (controlledSelectedKeys === undefined) {
      setInternalSelectedKeys(newSelectedKeys);
    }
    onSelect?.(newSelectedKeys, { event: 'select', selected: true, node, selectedNodes: [node], nativeEvent: nativeEvent as MouseEvent });
  };
  
  // --- Basic Drag and Drop Handlers ---
  const handleDragStart = (e: React.DragEvent, node: TreeDataType) => {
    setDraggingNode(node);
    onDragStart?.({event: e, node});
    // e.dataTransfer.setData('text/plain', node[fieldNames.key]); // Standard practice
    try { e.dataTransfer.setData('text/plain', JSON.stringify(node[fieldNames.key])); } catch (error) {/* some browsers restrict this */}

  };
  const handleDragEnter = (e: React.DragEvent, node: TreeDataType) => {
    setDragOverNodeKey(node[fieldNames.key]); // Highlight node being dragged over
    onDragEnter?.({event: e, node, expandedKeys: currentExpandedKeys});
  };
  const handleDragOver = (e: React.DragEvent, node: TreeDataType) => {
    e.preventDefault(); // Necessary to allow onDrop
    onDragOver?.({event: e, node});
  };
  const handleDragLeave = (e: React.DragEvent, node: TreeDataType) => {
    if (dragOverNodeKey === node[fieldNames.key]) {
        setDragOverNodeKey(null); // Clear highlight when leaving
    }
    onDragLeave?.({event: e, node});
  };
  const handleDrop = (e: React.DragEvent, dropNode: TreeDataType) => {
    e.preventDefault();
    if (draggingNode) {
      // Simplified drop logic: assumes dropping ON a node makes it a child.
      // AntD has dropPosition (before, after, inside) and dropToGap.
      // This is a placeholder for where complex reordering logic would go.
      console.log(`Dropped node ${draggingNode[fieldNames.key]} onto ${dropNode[fieldNames.key]}`);
      onDrop?.({
        event: e, 
        node: dropNode, 
        dragNode: draggingNode, 
        dragNodesKeys: [draggingNode[fieldNames.key]], 
        dropPosition: 0, // Simplified: 0 for inside, 1 for after, -1 for before
        // dropToGap: true, // If dropping between nodes
      });
    }
    setDraggingNode(null);
    setDragOverNodeKey(null);
  };
  const handleDragEnd = (e: React.DragEvent, node: TreeDataType) => {
    onDragEnd?.({event: e, node});
    setDraggingNode(null);
    setDragOverNodeKey(null);
  };
  // --- End Basic Drag and Drop Handlers ---


  const renderTree = (nodes: TreeDataType[], level: number): React.ReactNode => {
    return nodes.map(node => {
      const nodeKey = node[fieldNames.key];
      return (
        <React.Fragment key={nodeKey}>
          <TreeNodeInternal
            node={node}
            level={level}
            fieldNames={fieldNames}
            isExpanded={currentExpandedKeys.includes(nodeKey)}
            onToggleExpand={(key) => handleToggleExpand(key, undefined)} // Pass undefined or actual event
            isSelected={currentSelectedKeys.includes(nodeKey)}
            onSelectNode={(n) => handleSelectNode(n, undefined)} // Pass undefined or actual event
            isDraggable={!!draggable} // Convert draggable prop to boolean
            onDragStart={handleDragStart}
            onDragEnter={handleDragEnter}
            onDragOver={(e) => handleDragOver(e, node)} // Pass node to onDragOver
            onDragLeave={(e) => handleDragLeave(e, node)}
            onDrop={handleDrop}
            onDragEnd={(e) => handleDragEnd(e, node)}
            showLine={typeof showLine === 'object' ? showLine.showLeafIcon : !!showLine} // Simplified showLine
            showIcon={showIcon}
            icon={globalTreeIcon} // Pass global icon prop
            switcherIcon={globalTreeSwitcherIcon} // Pass global switcher icon prop
            className={node.className} // Pass custom class from node data
            style={node.style} // Pass custom style from node data
          />
          {node[fieldNames.children] && currentExpandedKeys.includes(nodeKey) && (
            <div className="ant-tree-child-tree">
                {renderTree(node[fieldNames.children] as TreeDataType[], level + 1)}
            </div>
          )}
        </React.Fragment>
      );
    });
  };

  const treeClasses = [
    'ant-tree',
    showLine ? 'ant-tree-show-line' : '',
    // blockNode ? 'ant-tree-block-node' : '',
    // draggable ? 'ant-tree-draggable' : '', // If global draggable class is needed
    className,
  ].filter(Boolean).join(' ');
  
  // For accessibility with tree structure
  // role="tree" on the main ul/div, role="treeitem" on each node.

  return (
    <div className={treeClasses} style={style} role="tree">
      {renderTree(treeData, 0)}
    </div>
  );
};

export default Tree;
