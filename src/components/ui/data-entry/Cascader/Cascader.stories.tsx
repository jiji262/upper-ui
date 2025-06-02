// src/components/ui/data-entry/Cascader/Cascader.stories.tsx
import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Cascader, { CascaderOption } from './Cascader';

const options: CascaderOption[] = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
            isLeaf: true,
          },
          {
            value: 'binjiang',
            label: 'Binjiang District',
          }
        ],
      },
      {
        value: 'ningbo',
        label: 'Ningbo',
        children: [
            { value: 'haishu', label: 'Haishu District'}
        ]
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
  {
    value: 'disabled-province',
    label: 'Disabled Province',
    disabled: true,
    children: [ {value: 'disabled-child', label: 'Disabled Child'}]
  }
];


export default {
  title: 'Data Entry/Cascader',
  component: Cascader,
  argTypes: {
    placeholder: { control: 'text', defaultValue: 'Please select' },
    disabled: { control: 'boolean', defaultValue: false },
    allowClear: { control: 'boolean', defaultValue: true },
    changeOnSelect: { control: 'boolean', defaultValue: false },
    expandTrigger: { control: { type: 'select', options: ['click', 'hover'] }, defaultValue: 'click' },
    // `options` is complex, defined globally for stories.
    // `loadData` for dynamic loading.
    // `displayRender` for custom display.
    // `showSearch` for search functionality.
    size: {control: {type: 'select', options: ['small', 'middle', 'large']}},
    status: {control: {type: 'select', options: [undefined, 'error', 'warning']}}
  },
} as Meta<typeof Cascader>;

const Template: StoryFn<typeof Cascader> = (args) => {
  const [value, setValue] = useState<Array<string | number>>(args.defaultValue || []);

  const handleChange = (val: Array<string | number>, selectedOptions: CascaderOption[]) => {
    console.log('Cascader onChange:', val, selectedOptions);
    setValue(val);
    args.onChange?.(val, selectedOptions);
  };

  return (
    <Cascader
      {...args}
      options={options} // Use the predefined options
      value={value}
      onChange={handleChange}
      style={{ width: '300px', ...args.style }}
    />
  );
};

export const Basic = Template.bind({});
Basic.args = {};

export const DefaultValue = Template.bind({});
DefaultValue.args = {
  defaultValue: ['zhejiang', 'hangzhou', 'xihu'],
};

export const HoverTrigger = Template.bind({});
HoverTrigger.args = {
  expandTrigger: 'hover',
};

export const ChangeOnSelect = Template.bind({});
ChangeOnSelect.args = {
  changeOnSelect: true,
  defaultValue: ['zhejiang', 'hangzhou'],
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  defaultValue: ['zhejiang', 'hangzhou'],
};

export const CustomDisplayRender: StoryFn<typeof Cascader> = (args) => (
  <Cascader
    {...args}
    options={options}
    defaultValue={['zhejiang', 'hangzhou', 'xihu']}
    displayRender={(labels, selectedOptions) =>
      labels.map((label, i) => {
        const option = selectedOptions?.[i];
        if (i === labels.length - 1) {
          return <span key={option?.value || label}>{label} (Last)</span>;
        }
        return <span key={option?.value || label}>{label} / </span>;
      })
    }
    style={{ width: '300px' }}
  />
);
CustomDisplayRender.args = {};

export const WithStatus: StoryFn<typeof Cascader> = (args) => (
    <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
        <Cascader {...args} options={options} status="error" defaultValue={['zhejiang', 'hangzhou']} placeholder="Error status" style={{ width: '300px' }} />
        <Cascader {...args} options={options} status="warning" defaultValue={['jiangsu', 'nanjing']} placeholder="Warning status" style={{ width: '300px' }} />
    </div>
);
WithStatus.args = {};


export const DynamicLoading: StoryFn<typeof Cascader> = (args) => {
  interface DynamicOption extends CascaderOption {
    isLeaf?: boolean;
  }
  const initialDynamicOptions: DynamicOption[] = [
    { value: 'level1-1', label: 'Level 1 - Item 1', isLeaf: false },
    { value: 'level1-2', label: 'Level 1 - Item 2', isLeaf: false },
    { value: 'level1-3', label: 'Level 1 - Item 3', isLeaf: true },
  ];
  const [dynamicOptions, setDynamicOptions] = useState<DynamicOption[]>(initialDynamicOptions);

  const handleLoadData = (selectedOpts: CascaderOption[]) => {
    const targetOption = selectedOpts[selectedOpts.length - 1] as DynamicOption;
    targetOption.loading = true; // Show loading state

    // Simulate API call
    setTimeout(() => {
      targetOption.loading = false;
      const children = [];
      for (let i = 0; i < 3; i++) {
        children.push({
          value: `${targetOption.value}-child-${i}`,
          label: `${targetOption.label} Child ${i}`,
          isLeaf: selectedOpts.length >= 2, // Max 3 levels for demo
        });
      }
      targetOption.children = children;
      setDynamicOptions([...dynamicOptions]); // Trigger re-render
    }, 1000);
  };

  return (
    <Cascader
      {...args}
      options={dynamicOptions}
      loadData={handleLoadData}
      placeholder="Select dynamically loaded option"
      style={{ width: '300px' }}
    />
  );
};
DynamicLoading.args = {
    changeOnSelect: true, // Often useful with loadData
};

// Note: `showSearch` is a more complex feature involving input and filtering logic within the dropdown,
// which would require significant additions to Cascader.tsx and its CSS.
// `placement`, `suffixIcon`, `expandIcon`, `dropdownClassName`, `dropdownStyle`, `open` (controlled)
// are also valid props that can be tested.Okay, I've created `Cascader.tsx` and its Storybook stories. Now I'll create the `index.ts` file for the Cascader component.
