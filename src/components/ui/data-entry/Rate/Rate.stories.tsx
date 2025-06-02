// src/components/ui/data-entry/Rate/Rate.stories.tsx
import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Rate from './Rate';
import Icon from '../../general/Icon'; // Assuming Icon component is available

export default {
  title: 'Data Entry/Rate',
  component: Rate,
  argTypes: {
    count: { control: { type: 'number', min: 1, max: 10 }, defaultValue: 5 },
    defaultValue: { control: { type: 'number', min: 0, step: 0.5 } },
    allowHalf: { control: 'boolean', defaultValue: false },
    allowClear: { control: 'boolean', defaultValue: true },
    disabled: { control: 'boolean', defaultValue: false },
    // `character` can be complex, shown in specific stories
    // `tooltips` array is also better for specific stories
  },
} as Meta<typeof Rate>;

const Template: StoryFn<typeof Rate> = (args) => {
  // For controlled component in story, if needed
  const [value, setValue] = useState(args.defaultValue || 2.5);

  const handleChange = (newValue: number) => {
    console.log('Rate onChange:', newValue);
    setValue(newValue);
    args.onChange?.(newValue);
  };

  return (
    <Rate
      {...args}
      value={args.value !== undefined ? args.value : value}
      onChange={handleChange}
    />
  );
};

export const Basic = Template.bind({});
Basic.args = {
  defaultValue: 3,
};

export const AllowHalf = Template.bind({});
AllowHalf.args = {
  allowHalf: true,
  defaultValue: 2.5,
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  defaultValue: 2,
};

export const CustomCount = Template.bind({});
CustomCount.args = {
  count: 10,
  defaultValue: 6,
};

export const WithTooltips: StoryFn<typeof Rate> = (args) => (
  <Rate {...args} />
);
WithTooltips.args = {
  tooltips: ['terrible', 'bad', 'normal', 'good', 'wonderful'],
  defaultValue: 3,
};

export const CustomCharacter: StoryFn<typeof Rate> = (args) => (
  <Rate {...args} />
);
CustomCharacter.args = {
  character: <Icon name="HeartFilled" style={{ color: '#eb2f96' }} />,
  allowHalf: true,
  defaultValue: 2.5,
};

export const CustomCharacterFunction: StoryFn<typeof Rate> = (args) => (
    <Rate 
        {...args}
        character={({index, status}) => {
            if (index === 0 && status === 'full') return <Icon name="FrownFilled" />;
            if (index === 1 && status === 'full') return <Icon name="MehFilled" />;
            if (status === 'full') return <Icon name="SmileFilled" />;
            return <Icon name="StarOutlined" />; // Default for zero or half (simplified)
        }}
    />
);
CustomCharacterFunction.args = {
    count: 3,
    tooltips: ['Useless', 'Ok', 'Great!'],
    defaultValue: 1,
};


export const ReadOnlyNoClear = Template.bind({});
ReadOnlyNoClear.args = {
  defaultValue: 3.5,
  allowHalf: true,
  disabled: true, // Usually disabled implies read-only
  allowClear: false, // Even if clicked again, won't clear
};

export const ControlledRate: StoryFn<typeof Rate> = (args) => {
    const [val, setVal] = useState(1);
    return (
        <div>
            <p>Current value: {val}</p>
            <Rate {...args} value={val} onChange={setVal} />
            <button onClick={() => setVal(val < (args.count || 5) ? val + (args.allowHalf ? 0.5 : 1) : (args.count || 5))} style={{marginTop: '10px', marginRight: '5px'}}>Inc</button>
            <button onClick={() => setVal(val > 0 ? val - (args.allowHalf ? 0.5 : 1) : 0)}>Dec</button>
            <button onClick={() => setVal(0)}>Clear</button>
        </div>
    )
}
ControlledRate.args = {
    allowHalf: true,
    count: 5,
};
