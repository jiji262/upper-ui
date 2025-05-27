// src/components/ui/data-entry/TreeSelect/TreeSelect.stories.tsx
import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import TreeSelect, { TreeSelectOption } from './TreeSelect';

const treeData: TreeSelectOption[] = [
  {
    title: 'Node1',
    value: '0-0',
    children: [
      {
        title: 'Child Node1',
        value: '0-0-0',
      },
      {
        title: 'Child Node2',
        value: '0-0-1',
        disabled: true, // Example of a disabled node
      },
    ],
  },
  {
    title: 'Node2',
    value: '0-1',
    children: [
      {
        title: 'Child Node3',
        value: '0-1-0',
        isLeaf: true, // Example of explicitly marking as leaf
      },
      {
        title: 'Child Node4',
        value: '0-1-1',
      },
    ],
  },
  {
    title: 'Node3 (Leaf)',
    value: '0-2',
    isLeaf: true,
  }
];

export default {
  title: 'Data Entry/TreeSelect',
  component: TreeSelect,
  argTypes: {
    placeholder: { control: 'text', defaultValue: 'Please select' },
    disabled: { control: 'boolean', defaultValue: false },
    allowClear: { control: 'boolean', defaultValue: true },
    showSearch: { control: 'boolean', defaultValue: true },
    treeDefaultExpandAll: { control: 'boolean', defaultValue: false },
    // `treeData`, `value`, `defaultValue` are complex, controlled in stories
    size: {control: {type: 'select', options: ['small', 'middle', 'large']}},
    status: {control: {type: 'select', options: [undefined, 'error', 'warning']}}
  },
} as Meta<typeof TreeSelect>;

const Template: StoryFn<typeof TreeSelect> = (args) => {
  const [value, setValue] = useState(args.defaultValue);

  const handleChange = (val: any, labelList: React.ReactNode[], extra: any) => {
    console.log('TreeSelect onChange:', val, labelList, extra);
    setValue(val);
    args.onChange?.(val, labelList, extra);
  };

  return (
    <TreeSelect
      {...args}
      treeData={treeData} // Use predefined treeData
      value={args.value !== undefined ? args.value : value}
      onChange={handleChange}
      style={{ width: 300, ...args.style }}
    />
  );
};

export const Basic = Template.bind({});
Basic.args = {};

export const DefaultValue = Template.bind({});
DefaultValue.args = {
  defaultValue: '0-0-0', // Value of 'Child Node1'
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  defaultValue: '0-0',
};

export const AllowClear = Template.bind({});
AllowClear.args = {
  allowClear: true,
  defaultValue: '0-1-0',
};

export const DefaultExpandAll = Template.bind({});
DefaultExpandAll.args = {
  treeDefaultExpandAll: true,
};

export const CustomPlaceholder = Template.bind({});
CustomPlaceholder.args = {
  placeholder: 'Select your item...',
};

export const WithStatus: StoryFn<typeof TreeSelect> = (args) => (
    <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
        <TreeSelect {...args} treeData={treeData} status="error" placeholder="Error status" style={{ width: 300 }} />
        <TreeSelect {...args} treeData={treeData} status="warning" placeholder="Warning status" style={{ width: 300 }} />
    </div>
);
WithStatus.args = {};

export const DifferentSizes: StoryFn<typeof TreeSelect> = (args) => (
    <div style={{display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start'}}>
        <TreeSelect {...args} treeData={treeData} size="small" placeholder="Small" style={{ width: 200 }} />
        <TreeSelect {...args} treeData={treeData} size="middle" placeholder="Middle (Default)" style={{ width: 250 }} />
        <TreeSelect {...args} treeData={treeData} size="large" placeholder="Large" style={{ width: 300 }} />
    </div>
);
DifferentSizes.args = {};


export const ControlledOpen: StoryFn<typeof TreeSelect> = (args) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string | number | undefined>();

    return (
        <div>
            <button onClick={() => setOpen(!open)} style={{marginBottom: '10px'}}>
                {open ? 'Close' : 'Open'} TreeSelect Dropdown
            </button>
            <TreeSelect 
                {...args}
                treeData={treeData}
                open={open}
                onDropdownVisibleChange={setOpen}
                value={value}
                onChange={(val) => setValue(val)}
                style={{ width: 300 }}
            />
        </div>
    )
}
ControlledOpen.args = {
    placeholder: "Controlled open state"
};

// Note: `treeCheckable` (for multi-select), `loadData` (dynamic loading),
// `treeLine`, `treeIcon`, `filterTreeNode` (custom function), `treeNodeFilterProp`,
// `treeNodeLabelProp` (advanced display), `dropdownClassName`, `dropdownStyle`,
// `dropdownMatchSelectWidth`, `placement` are more advanced features.
// The current simplified TreeSelect focuses on single selection and basic title filtering.
// `treeCheckable` would require significant changes to state management and UI for checkboxes.
// `loadData` would need async logic within the component.
// `treeLine` is primarily a CSS visual feature.
// `treeIcon` can be added to TreeNode if needed.
// `treeNodeLabelProp` is somewhat supported via `fieldNames.label`.
// `filterTreeNode` as a function and `treeNodeFilterProp` would enhance search.
// Dropdown positioning props are standard for popup components.
