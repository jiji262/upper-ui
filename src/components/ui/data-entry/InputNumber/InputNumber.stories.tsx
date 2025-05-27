// src/components/ui/data-entry/InputNumber/InputNumber.stories.tsx
import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import InputNumber from './InputNumber';
import Icon from '../../general/Icon'; // Assuming Icon is available for custom controls

export default {
  title: 'Data Entry/InputNumber',
  component: InputNumber,
  argTypes: {
    placeholder: { control: 'text', defaultValue: 'Enter number' },
    disabled: { control: 'boolean', defaultValue: false },
    min: { control: 'number', defaultValue: -Infinity },
    max: { control: 'number', defaultValue: Infinity },
    step: { control: 'number', defaultValue: 1 },
    precision: { control: 'number' },
    controls: { control: 'boolean', defaultValue: true },
    keyboard: { control: 'boolean', defaultValue: true },
    stringMode: { control: 'boolean', defaultValue: false },
    size: {control: {type: 'select', options: ['small', 'middle', 'large']}},
    status: {control: {type: 'select', options: [undefined, 'error', 'warning']}},
    // `formatter` and `parser` are complex, shown in specific stories
    // `value`, `defaultValue`, `onChange` are controlled in stories
  },
} as Meta<typeof InputNumber>;

const Template: StoryFn<typeof InputNumber> = (args) => {
  // For controlled component in story, if needed
  const [value, setValue] = useState<number | null | string>(args.defaultValue !== undefined ? args.defaultValue : null);

  const handleChange = (newValue: number | null | string) => {
    console.log('InputNumber onChange:', newValue);
    setValue(newValue);
    args.onChange?.(newValue as any); // Propagate to Storybook actions
  };

  return (
    <InputNumber
      {...args}
      value={args.value !== undefined ? args.value : (value as number | null)} // Cast based on stringMode or not
      onChange={handleChange}
      style={{ width: 150, ...args.style }}
    />
  );
};

export const Basic = Template.bind({});
Basic.args = {};

export const MinMax = Template.bind({});
MinMax.args = {
  min: 1,
  max: 10,
  defaultValue: 5,
};

export const WithStep = Template.bind({});
WithStep.args = {
  step: 0.5,
  defaultValue: 2.0,
};

export const Precision = Template.bind({});
Precision.args = {
  precision: 2,
  step: 0.01,
  defaultValue: 1.23,
  placeholder: "e.g., 1.23"
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  defaultValue: 99,
};

export const NoControls = Template.bind({});
NoControls.args = {
  controls: false,
  defaultValue: 50,
};

export const CustomControls: StoryFn<typeof InputNumber> = (args) => (
    <InputNumber
      {...args}
      controls={{
        upIcon: <Icon name="CaretUpFilled" />,
        downIcon: <Icon name="CaretDownFilled" />,
      }}
    />
);
CustomControls.args = {
    defaultValue: 10,
    style: { width: 100}
};


export const FormatterAndParser: StoryFn<typeof InputNumber> = (args) => {
  const [val, setVal] = useState<number | null>(1000);
  return (
    <InputNumber
      {...args}
      value={val}
      onChange={setVal}
      formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      parser={(displayValue) => (displayValue ? displayValue.replace(/\$\s?|(,*)/g, '') : '')}
      placeholder="Enter amount"
    />
  );
};
FormatterAndParser.args = {
  step: 100, // Step with formatter/parser can be tricky
  style: { width: 200}
};

export const StringMode: StoryFn<typeof InputNumber> = (args) => {
    const [strVal, setStrVal] = useState<string | null>("0.000000001");
    return (
        <InputNumber
        {...args}
        value={strVal as any} // Storybook might complain about type if not 'any' here
        onChange={(v) => setStrVal(v as string | null)}
        placeholder="High precision number"
        />
    );
};
StringMode.args = {
    stringMode: true,
    step: 0.000000001, // Very small step
    precision: 9, // High precision
    style: { width: 250 }
};


export const WithStatus: StoryFn<typeof InputNumber> = (args) => (
    <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
        <InputNumber {...args} status="error" placeholder="Error status" defaultValue={10} />
        <InputNumber {...args} status="warning" placeholder="Warning status" defaultValue={20}/>
    </div>
);
WithStatus.args = {
    style: { width: 180 }
};

export const DifferentSizes: StoryFn<typeof InputNumber> = (args) => (
    <div style={{display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start'}}>
        <InputNumber {...args} size="small" placeholder="Small" defaultValue={5} />
        <InputNumber {...args} size="middle" placeholder="Middle (Default)" defaultValue={10} />
        <InputNumber {...args} size="large" placeholder="Large" defaultValue={15} />
    </div>
);
DifferentSizes.args = {};

export const WithPrefix: StoryFn<typeof InputNumber> = (args) => (
    <InputNumber
      {...args}
      prefix="¥"
    />
);
WithPrefix.args = {
    defaultValue: 100,
    style: { width: 180 }
};
