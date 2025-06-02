// src/components/ui/data-display/Tree/Tree.stories.tsx
import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Tree, { TreeDataType, FieldNames } from './Tree';
import Icon from '../../general/Icon/Icon'; // Assuming Icon is available

const defaultTreeData: TreeDataType[] = [
  {
    title: 'Parent 1',
    key: '0-0',
    children: [
      {
        title: 'Child 1-1',
        key: '0-0-0',
        disabled: true, // Example of a disabled node
        children: [
          { title: 'Grandchild 1-1-1', key: '0-0-0-0', isLeaf: true },
          { title: 'Grandchild 1-1-2', key: '0-0-0-1', isLeaf: true },
        ],
      },
      {
        title: 'Child 1-2',
        key: '0-0-1',
        children: [{ title: 'Grandchild 1-2-1', key: '0-0-1-0', isLeaf: true }],
      },
    ],
  },
  {
    title: 'Parent 2',
    key: '0-1',
    children: [
      { title: 'Child 2-1', key: '0-1-0', icon: <Icon name="SmileOutlined" /> },
      { title: 'Child 2-2 (Leaf)', key: '0-1-1', isLeaf: true, icon: <Icon name="CarryOutOutlined" /> },
    ],
  },
  {
    title: 'Parent 3 (No children, isLeaf implicitly)',
    key: '0-2',
  }
];

export default {
  title: 'Data Display/Tree',
  component: Tree,
  argTypes: {
    // `treeData` is complex, defined globally for stories
    defaultExpandAll: { control: 'boolean', defaultValue: false },
    showLine: { control: 'boolean', defaultValue: false },
    showIcon: { control: 'boolean', defaultValue: false },
    draggable: { control: 'boolean', defaultValue: false },
    // `expandedKeys`, `selectedKeys`, `onExpand`, `onSelect` controlled in stories
  },
} as Meta<typeof Tree>;

const Template: StoryFn<typeof Tree> = (args) => {
  const [expandedKeys, setExpandedKeys] = useState<Array<string | number>>(args.defaultExpandedKeys || ['0-0']);
  const [selectedKeys, setSelectedKeys] = useState<Array<string | number>>(args.defaultSelectedKeys || []);

  const handleExpand = (keys: Array<string | number>, info: any) => {
    console.log('Tree onExpand:', keys, info);
    setExpandedKeys(keys);
    args.onExpand?.(keys, info);
  };

  const handleSelect = (keys: Array<string | number>, info: any) => {
    console.log('Tree onSelect:', keys, info);
    setSelectedKeys(keys);
    args.onSelect?.(keys, info);
  };

  return (
    <Tree
      {...args}
      treeData={defaultTreeData}
      expandedKeys={args.expandedKeys !== undefined ? args.expandedKeys : expandedKeys}
      selectedKeys={args.selectedKeys !== undefined ? args.selectedKeys : selectedKeys}
      onExpand={handleExpand}
      onSelect={handleSelect}
    />
  );
};

export const Basic = Template.bind({});
Basic.args = {};

export const DefaultExpandAll = Template.bind({});
DefaultExpandAll.args = {
  defaultExpandAll: true,
};

export const WithShowLine: StoryFn<typeof Tree> = (args) => <Tree {...args} treeData={defaultTreeData} />;
WithShowLine.args = {
  showLine: true,
  defaultExpandedKeys: ['0-0', '0-0-0'], // Expand some to show lines better
};

export const WithShowIcon: StoryFn<typeof Tree> = (args) => <Tree {...args} treeData={defaultTreeData} />;
WithShowIcon.args = {
  showIcon: true, // Shows default folder/file icons if node.icon not set
  defaultExpandedKeys: ['0-0'],
};

export const CustomGlobalIcons: StoryFn<typeof Tree> = (args) => <Tree {...args} treeData={defaultTreeData} />;
CustomGlobalIcons.args = {
  showIcon: true,
  icon: <Icon name="GlobalOutlined" />, // Global icon for all nodes
  switcherIcon: ({isExpanded}: {isExpanded: boolean}) => isExpanded ? <Icon name="DownSquareOutlined" /> : <Icon name="RightSquareOutlined" />,
  defaultExpandedKeys: ['0-0'],
};

export const DraggableTree: StoryFn<typeof Tree> = (args) => {
    const [gData, setGData] = useState(defaultTreeData);
    const [expanded, setExpanded] = useState(['0-0']);

    const onDrop = (info: any) => {
        console.log('onDrop info:', info);
        const dropKey = info.node.key;
        const dragKey = info.dragNode.key;
        const dropPos = info.node.pos.split('-'); // e.g. "0-1-0" -> dropPos[dropPos.length-1] is index
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

        const loop = (
            data: TreeDataType[],
            key: React.Key,
            callback: (node: TreeDataType, i: number, data: TreeDataType[]) => void,
        ) => {
            for (let i = 0; i < data.length; i++) {
            if (data[i].key === key) {
                return callback(data[i], i, data);
            }
            if (data[i].children) {
                loop(data[i].children!, key, callback);
            }
            }
        };
        const data = [...gData];

        // Find dragObject
        let dragObj: TreeDataType | undefined;
        loop(data, dragKey, (item, index, arr) => {
            arr.splice(index, 1);
            dragObj = item;
        });

        if (!dragObj) return; // Should not happen

        if (!info.dropToGap) { // Drop on the content
            loop(data, dropKey, (item) => {
                item.children = item.children || [];
                item.children.unshift(dragObj!); // Add to top of children
            });
        } else if (
            (info.node.children || []).length > 0 && // Has children
            info.node.expanded && // Is expanded
            dropPosition === 1 // On the bottom gap
        ) {
            loop(data, dropKey, (item) => {
                item.children = item.children || [];
                item.children.unshift(dragObj!); // Add to top of children (AntD example)
            });
        } else {
            let ar: TreeDataType[] = [];
            let i: number = -1;
            loop(data, dropKey, (_item, index, arr) => {
                ar = arr;
                i = index;
            });
            if (dropPosition === -1) { // Drop on the top gap
                ar.splice(i, 0, dragObj!);
            } else { // Drop on the bottom gap
                ar.splice(i + 1, 0, dragObj!);
            }
        }
        setGData(data);
        args.onDrop?.(info);
    };

    return (
        <Tree 
            {...args} 
            treeData={gData} 
            expandedKeys={expanded}
            onExpand={setExpanded}
            onDrop={onDrop}
        />
    );
};
DraggableTree.args = {
  draggable: true,
  defaultExpandAll: true, // Keep expanded to see drop effect easily
};


export const CustomFieldNames: StoryFn<typeof Tree> = (args) => {
    const customTreeData = [
        { name: 'Category A', id: 'cat-a', subItems: [
            { name: 'Item A1', id: 'item-a1'},
            { name: 'Item A2 (disabled)', id: 'item-a2', inactive: true }
        ]},
        { name: 'Category B (Leaf)', id: 'cat-b', isBranch: false }
    ];
    const fieldNames: FieldNames = { title: 'name', key: 'id', children: 'subItems', disabled: 'inactive', isLeaf: 'isBranch' };

    return <Tree {...args} treeData={customTreeData} fieldNames={fieldNames} />;
};
CustomFieldNames.args = {
    defaultExpandAll: true,
    showIcon: true, // To see default icons apply with custom fields
};

// Note: `multiple`, `checkable`, `checkedKeys`, `onCheck` for multi-select/checkbox tree are not implemented.
// `height` and `virtual` for virtual scrolling are not implemented.
// `blockNode` style is not implemented.
// `allowDrop` for fine-grained dnd control is not implemented.
// The drag-and-drop implementation is very basic and primarily for demonstration of event handling.
// A production-ready D&D Tree would require more robust state management for tree data updates.
