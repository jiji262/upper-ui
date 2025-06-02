// src/components/ui/data-display/Tag/Tag.stories.tsx
import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Tag from './Tag';
import Icon from '../../general/Icon/Icon'; // Assuming Icon is available

const PRESET_COLORS = [
    'magenta', 'red', 'volcano', 'orange', 'gold',
    'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple',
];

export default {
  title: 'Data Display/Tag',
  component: Tag,
  argTypes: {
    color: { 
        control: { type: 'select', options: [...PRESET_COLORS, '#f50', '#2db7f5', '#87d068', '#108ee9'] },
        description: 'Preset color or custom hex/rgb string'
    },
    closable: { control: 'boolean', defaultValue: false },
    bordered: { control: 'boolean', defaultValue: true },
    icon: { control: false }, // Handled by specific stories
    onClose: { action: 'closed' },
  },
} as Meta<typeof Tag>;

const Template: StoryFn<typeof Tag> = (args) => <Tag {...args}>Tag Content</Tag>;

export const Basic = Template.bind({});
Basic.args = {};

export const Closable = Template.bind({});
Closable.args = {
  closable: true,
  children: 'Closable Tag',
};

export const WithIcon: StoryFn<typeof Tag> = (args) => (
  <Tag {...args} icon={<Icon name="TwitterOutlined" />}>
    Twitter
  </Tag>
);
WithIcon.args = {
  color: '#55acee', // Twitter blue
};

export const Borderless = Template.bind({});
Borderless.args = {
  bordered: false,
  color: 'blue',
  children: 'Borderless Blue Tag',
};

export const PresetColors: StoryFn<typeof Tag> = (args) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <div><strong>Default Presets:</strong></div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {PRESET_COLORS.map(color => <Tag key={color} color={color}>{color}</Tag>)}
    </div>
    <div><strong>Status Presets (AntD uses specific colors for these, e.g., success, processing, error, warning):</strong></div>
     <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <Tag color="success">success</Tag>
        <Tag color="processing">processing</Tag>
        <Tag color="error">error</Tag>
        <Tag color="warning">warning</Tag>
        <Tag color="default">default</Tag>
    </div>
    <p style={{fontSize: '12px', color: '#555'}}>(Note: Status preset colors like 'success' are often mapped to specific hex codes like 'green', 'blue', etc. This story uses the direct color name if available in PRESET_COLORS, otherwise it's a custom color.)</p>
  </div>
);
PresetColors.args = {};


export const CustomColors: StoryFn<typeof Tag> = (args) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
    <Tag color="#f50">#f50</Tag>
    <Tag color="#2db7f5">#2db7f5</Tag>
    <Tag color="#87d068">#87d068</Tag>
    <Tag color="#108ee9">#108ee9</Tag>
    <Tag color="rgb(45, 183, 245)">rgb(45, 183, 245)</Tag>
    <Tag color="hsl(206, 90%, 55%)">hsl(206, 90%, 55%)</Tag>
  </div>
);
CustomColors.args = {};

export const ClosableWithPreventDefault: StoryFn<typeof Tag> = (args) => {
    const handleClose = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault(); // Prevent default hiding behavior
        alert('Close event prevented! Tag will not be hidden by default logic.');
        args.onClose?.(e);
    };
    return <Tag {...args} onClose={handleClose}>Try Closing Me</Tag>;
};
ClosableWithPreventDefault.args = {
    closable: true,
    color: 'volcano'
};
