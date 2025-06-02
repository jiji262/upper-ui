// src/components/ui/data-entry/Transfer/Transfer.stories.tsx
import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Transfer, { TransferItem } from './Transfer';

const mockData: TransferItem[] = Array.from({ length: 20 }).map((_, i) => ({
  key: i.toString(),
  title: `Content ${i + 1}`,
  description: `Description of content ${i + 1}`,
  disabled: i % 4 === 0, // Disable every 4th item for demo
}));

const initialTargetKeys = mockData
  .filter(item => parseInt(item.key) > 10 && !item.disabled) // Example: move some non-disabled items to target
  .map(item => item.key)
  .slice(0, 3); // Take first 3


export default {
  title: 'Data Entry/Transfer',
  component: Transfer,
  argTypes: {
    disabled: { control: 'boolean', defaultValue: false },
    showSearch: { control: 'boolean', defaultValue: false },
    // `dataSource`, `targetKeys`, `selectedKeys` are complex, controlled in stories
    // `titles`, `operations`, `render`, `filterOption` are also for specific stories
  },
} as Meta<typeof Transfer>;

const Template: StoryFn<typeof Transfer> = (args) => {
  const [targetKeys, setTargetKeys] = useState<string[]>(args.targetKeys || initialTargetKeys);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(args.selectedKeys || []);

  const handleChange = (nextTargetKeys: string[], direction: string, moveKeys: string[]) => {
    console.log('Transfer onChange:', nextTargetKeys, direction, moveKeys);
    setTargetKeys(nextTargetKeys);
    args.onChange?.(nextTargetKeys, direction as 'left'|'right', moveKeys);
  };

  const handleSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
    console.log('Transfer onSelectChange:', sourceSelectedKeys, targetSelectedKeys);
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
    args.onSelectChange?.(sourceSelectedKeys, targetSelectedKeys);
  };

  return (
    <Transfer
      {...args}
      dataSource={mockData} // Use predefined mockData
      targetKeys={targetKeys}
      selectedKeys={selectedKeys}
      onChange={handleChange}
      onSelectChange={handleSelectChange}
    />
  );
};

export const Basic = Template.bind({});
Basic.args = {};

export const WithSearch = Template.bind({});
WithSearch.args = {
  showSearch: true,
  searchPlaceholder: 'Search here...',
};

export const CustomTitlesAndOperations: StoryFn<typeof Transfer> = (args) => (
    <Transfer {...args} dataSource={mockData} />
);
CustomTitlesAndOperations.args = {
  titles: ['Source Items', 'Target Items'],
  operations: ['To Target', 'To Source'],
  targetKeys: initialTargetKeys.slice(0,1), // Different initial target for this story
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  targetKeys: mockData.filter(item => parseInt(item.key) > 15).map(item => item.key),
};

export const CustomRender: StoryFn<typeof Transfer> = (args) => (
    <Transfer
        {...args}
        dataSource={mockData.map(item => ({...item, name: `User-${item.key}`}))} // Add name for custom render
        render={item => `${item.name} - ${item.description}`}
    />
);
CustomRender.args = {
    targetKeys: initialTargetKeys,
    showSearch: true,
};

export const FilterOption: StoryFn<typeof Transfer> = (args) => (
    <Transfer
        {...args}
        dataSource={mockData}
        filterOption={(inputValue, item) => 
            item.description!.toLowerCase().includes(inputValue.toLowerCase()) ||
            item.title!.toString().toLowerCase().includes(inputValue.toLowerCase())
        }
    />
);
FilterOption.args = {
    showSearch: true,
    searchPlaceholder: "Filter by title or description",
    targetKeys: [],
};

export const ControlledSelectionAndTarget: StoryFn<typeof Transfer> = (args) => {
    const [targetKeysData, setTargetKeysData] = useState<string[]>(['1', '5']);
    const [selectedKeysData, setSelectedKeysData] = useState<string[]>(['0', '2']);

    const handleControlledChange = (nextTargetKeys: string[]) => {
        setTargetKeysData(nextTargetKeys);
    };
    const handleControlledSelectChange = (sourceSelected: string[], targetSelected: string[]) => {
        setSelectedKeysData([...sourceSelected, ...targetSelected]);
    };

    return (
        <div>
            <p>Target Keys: {targetKeysData.join(', ')}</p>
            <p>Selected Keys: {selectedKeysData.join(', ')}</p>
            <Button onClick={() => setTargetKeysData(['3', '7', '10'])} style={{marginRight: 8}}>Set Target Keys to 3,7,10</Button>
            <Button onClick={() => setSelectedKeysData(['4', '8'])}>Set Selected Keys to 4,8</Button>
            <hr style={{margin: '10px 0'}}/>
            <Transfer
                {...args}
                dataSource={mockData}
                targetKeys={targetKeysData}
                selectedKeys={selectedKeysData}
                onChange={handleControlledChange}
                onSelectChange={handleControlledSelectChange}
            />
        </div>
    );
};
ControlledSelectionAndTarget.args = {};

// Note: `listStyle` (function), `onScroll`, `pagination`, `oneWay` are more advanced features
// not fully implemented or easily demonstrated in this simplified version.
// `selectAllLabels` is part of TransferList header which is basic here.
