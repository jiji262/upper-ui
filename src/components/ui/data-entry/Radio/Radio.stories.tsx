// src/components/ui/data-entry/Radio/Radio.stories.tsx
import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Radio from './Radio';
import RadioGroup from './Group'; // Import RadioGroup

// Assign RadioGroup to Radio as a static property for Radio.Group usage in stories
(Radio as any).Group = RadioGroup;


export default {
  title: 'Data Entry/Radio',
  component: Radio,
  subcomponents: { Group: (Radio as any).Group },
  argTypes: {
    disabled: { control: 'boolean', defaultValue: false },
    // `checked` and `value` for individual Radio are often controlled by Group or local state in stories
  },
} as Meta<typeof Radio>;

const Template: StoryFn<typeof Radio> = (args) => {
    const [checked, setChecked] = useState(args.checked || args.defaultChecked || false);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(e.target.checked);
        args.onChange?.(e);
    }
    return <Radio {...args} checked={args.checked !== undefined ? args.checked : checked} onChange={handleChange} />;
};

export const BasicRadio = Template.bind({});
BasicRadio.args = {
  children: 'Radio',
};

export const DisabledRadio = Template.bind({});
DisabledRadio.args = {
  children: 'Disabled Radio',
  disabled: true,
  checked: false,
};

export const DisabledCheckedRadio = Template.bind({});
DisabledCheckedRadio.args = {
  children: 'Disabled Checked Radio',
  disabled: true,
  checked: true,
};


// Radio.Group Stories
const GroupTemplate: StoryFn<typeof RadioGroup> = (args) => {
  const [value, setValue] = useState(args.defaultValue || 'A');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Radio.Group onChange:', e.target.value);
    setValue(e.target.value);
    args.onChange?.(e);
  };

  return (
    <(Radio as any).Group
      {...args}
      value={args.value !== undefined ? args.value : value}
      onChange={handleChange}
    >
      <Radio value="A">Option A</Radio>
      <Radio value="B">Option B</Radio>
      <Radio value="C">Option C</Radio>
      <Radio value="D" disabled>Option D (Disabled)</Radio>
    </<(Radio as any).Group>
  );
};

export const RadioGroupBasic = GroupTemplate.bind({});
RadioGroupBasic.args = {
  name: 'basicGroup',
  defaultValue: 'A',
};

export const RadioGroupDisabled = GroupTemplate.bind({});
RadioGroupDisabled.args = {
  name: 'disabledGroup',
  disabled: true,
  defaultValue: 'A',
};


export const RadioGroupWithOptions: StoryFn<typeof RadioGroup> = (args) => {
    const [value, setValue] = useState(args.defaultValue || 'Apple');
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        args.onChange?.(e);
    }
    return <(Radio as any).Group {...args} value={args.value !== undefined ? args.value : value} onChange={handleChange} />;
};
RadioGroupWithOptions.args = {
  name: 'optionsGroup',
  options: [
    { label: 'Apple', value: 'Apple' },
    { label: 'Pear', value: 'Pear' },
    { label: 'Orange', value: 'Orange', disabled: true },
  ],
  defaultValue: 'Apple',
};

export const RadioGroupWithNumberValues: StoryFn<typeof RadioGroup> = (args) => {
    const [value, setValue] = useState<number | undefined>(args.defaultValue || 1);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // e.target.value is always string, need to parse based on original option type
        const numValue = parseInt(e.target.value, 10);
        setValue(isNaN(numValue) ? undefined : numValue);
        args.onChange?.(e);
    }
    return <(Radio as any).Group {...args} value={args.value !== undefined ? args.value : value} onChange={handleChange} />;
};
RadioGroupWithNumberValues.args = {
  name: 'numberOptionsGroup',
  options: [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
    { label: 'Option 3 (Disabled)', value: 3, disabled: true },
  ],
  defaultValue: 1,
};


// Radio.Button Stories (assuming Radio.Button is a style variation of Radio within a Group)
// This requires CSS to style Radio components like buttons when inside a Radio.Group with optionType="button"
export const RadioButtonGroup: StoryFn<typeof RadioGroup> = (args) => {
    const [value, setValue] = useState('Hangzhou');
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        args.onChange?.(e);
    }
    return (
        <(Radio as any).Group 
            {...args}
            value={value}
            onChange={handleChange}
        >
            <Radio value="Hangzhou">Hangzhou</Radio>
            <Radio value="Shanghai">Shanghai</Radio>
            <Radio value="Beijing" disabled>Beijing</Radio>
            <Radio value="Chengdu">Chengdu</Radio>
        </(Radio as any).Group>
    );
};
RadioButtonGroup.args = {
  optionType: 'button',
  buttonStyle: 'outline', // Default
  defaultValue: 'Hangzhou',
};

export const RadioButtonGroupSolid = RadioButtonGroup.bind({});
RadioButtonGroupSolid.args = {
  optionType: 'button',
  buttonStyle: 'solid',
  defaultValue: 'Shanghai',
};

export const RadioButtonGroupSizes: StoryFn<typeof RadioGroup> = (args) => (
    <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
        <(Radio as any).Group {...args} size="small" defaultValue="A">
            <Radio value="A">Small A</Radio><Radio value="B">Small B</Radio>
        </(Radio as any).Group>
        <(Radio as any).Group {...args} size="middle" defaultValue="A">
            <Radio value="A">Middle A</Radio><Radio value="B">Middle B</Radio>
        </(Radio as any).Group>
        <(Radio as any).Group {...args} size="large" defaultValue="A">
            <Radio value="A">Large A</Radio><Radio value="B">Large B</Radio>
        </(Radio as any).Group>
    </div>
);
RadioButtonGroupSizes.args = {
  optionType: 'button',
  buttonStyle: 'solid',
};
