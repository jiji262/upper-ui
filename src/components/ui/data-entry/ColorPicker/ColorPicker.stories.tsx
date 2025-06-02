// src/components/ui/data-entry/ColorPicker/ColorPicker.stories.tsx
import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import ColorPicker from './ColorPicker';

const defaultPresets = [
    {
      label: 'Recommended',
      colors: ['#F5222D', '#FA8C16', '#FADB14', '#52C41A', '#1677FF', '#722ED1'],
    },
    {
      label: 'Primary Colors',
      colors: ['#ff0000', '#00ff00', '#0000ff'],
    },
];

export default {
  title: 'Data Entry/ColorPicker',
  component: ColorPicker,
  argTypes: {
    defaultValue: { control: 'color', defaultValue: '#1677FF' },
    disabled: { control: 'boolean', defaultValue: false },
    showText: { control: 'boolean', defaultValue: false },
    allowClear: { control: 'boolean', defaultValue: false },
    size: { control: { type: 'select', options: ['small', 'middle', 'large'] }, defaultValue: 'middle' },
    trigger: { control: { type: 'select', options: ['click', 'hover'] }, defaultValue: 'click' },
    presets: { control: 'object', defaultValue: defaultPresets}
    // `open` and `onOpenChange` for controlled mode.
    // `panelRender` for custom panel.
  },
} as Meta<typeof ColorPicker>;

const Template: StoryFn<typeof ColorPicker> = (args) => {
  const [color, setColor] = useState(args.value || args.defaultValue || '#1677FF');

  const handleChange = (newColor: string) => {
    console.log('ColorPicker onChange:', newColor);
    setColor(newColor);
    args.onChange?.(newColor);
  };

  return (
    <ColorPicker
      {...args}
      value={color} // Control the component's value through story state
      onChange={handleChange}
    />
  );
};

export const Basic = Template.bind({});
Basic.args = {};

export const ShowText = Template.bind({});
ShowText.args = {
  showText: true,
};

export const AllowClear = Template.bind({});
AllowClear.args = {
  allowClear: true,
  defaultValue: '#52C41A',
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  defaultValue: '#FA8C16',
};

export const SmallSize = Template.bind({});
SmallSize.args = {
  size: 'small',
  showText: true,
};

export const LargeSize = Template.bind({});
LargeSize.args = {
  size: 'large',
  showText: true,
};

export const HoverTrigger = Template.bind({});
HoverTrigger.args = {
  trigger: 'hover',
  showText: true,
};

export const WithPresets = Template.bind({});
WithPresets.args = {
  presets: [
    { label: 'Primary Tones', colors: ['#D70040', '#00755E', '#F7B500', '#0047AB'] },
    { label: 'Pastels', colors: ['#FFB6C1', '#FFFACD', '#ADD8E6', '#90EE90'] },
  ],
  defaultValue: '#FFB6C1',
  showText: true,
};

export const Controlled: StoryFn<typeof ColorPicker> = (args) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('#FADB14');

    return (
        <div>
            <p>Current color: {value}</p>
            <p>Panel open: {open ? 'Yes' : 'No'}</p>
            <button onClick={() => setOpen(!open)} style={{marginBlockEnd: '10px'}}>Toggle Panel</button>
            <ColorPicker 
                {...args}
                value={value}
                onChange={setValue}
                open={open}
                onOpenChange={setOpen}
            />
        </div>
    )
}
Controlled.args = {
    showText: true,
    allowClear: true,
};

export const CustomPanelRender: StoryFn<typeof ColorPicker> = (args) => (
    <ColorPicker
      {...args}
      panelRender={(panel) => (
        <div style={{ padding: '10px', border: '1px solid #ccc', background: '#f0f0f0' }}>
          <h4>Custom Panel Wrapper</h4>
          {panel}
          <p style={{marginTop: '10px', fontSize: '12px'}}>Additional custom content in panel.</p>
        </div>
      )}
    />
);
CustomPanelRender.args = {
    defaultValue: '#722ED1',
    showText: true,
};
