// src/components/ui/general/Icon/Icon.stories.tsx
import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Icon from './Icon';
import * as AntDesignIcons from '@ant-design/icons';

const iconNames = Object.keys(AntDesignIcons).filter(
  (name) => name.endsWith('Outlined') || name.endsWith('Filled') || name.endsWith('TwoTone')
);

export default {
  title: 'General/Icon',
  component: Icon,
  argTypes: {
    name: {
      control: { type: 'select', options: iconNames },
      description: 'Name of the Ant Design icon',
    },
    size: {
      control: 'text', // More flexible input for size (e.g., '24px', '2em')
      description: 'Size of the icon (e.g., 24, "24px", "2em")',
    },
    color: {
      control: 'color',
      description: 'Color of the icon',
    },
    spin: {
      control: 'boolean',
      description: 'Whether the icon should spin',
    },
    rotate: {
      control: { type: 'number', min: 0, max: 360, step: 1 },
      description: 'Rotation angle of the icon (in degrees)',
    },
    twoToneColor: {
      control: 'color',
      description: 'Primary color for two-tone icons',
    },
  },
  args: {
    name: 'HomeOutlined',
    size: '24px',
    spin: false,
    rotate: 0,
  },
} as Meta<typeof Icon>;

const Template: StoryFn<typeof Icon> = (args) => <Icon {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: 'HomeOutlined',
};

export const Colored = Template.bind({});
Colored.args = {
  name: 'CheckCircleOutlined',
  color: 'green',
  size: '30px',
};

export const Spinning = Template.bind({});
Spinning.args = {
  name: 'LoadingOutlined',
  spin: true,
  size: '36px',
  color: '#1677ff',
};

export const Rotated = Template.bind({});
Rotated.args = {
  name: 'SettingOutlined',
  rotate: 45,
  size: '28px',
};

export const TwoTone = Template.bind({});
TwoTone.args = {
  name: 'SmileTwoTone',
  twoToneColor: '#eb2f96', // Example two-tone color
  size: '32px',
};

export const AllIcons: StoryFn = (args) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
    {iconNames.slice(0, 50).map((iconName) => ( // Display first 50 icons for brevity
      <div key={iconName} style={{ textAlign: 'center', minWidth: '100px' }}>
        <Icon {...args} name={iconName as keyof typeof AntDesignIcons} />
        <p style={{ fontSize: '12px', marginTop: '8px' }}>{iconName}</p>
      </div>
    ))}
  </div>
);
AllIcons.args = {
  size: '24px',
};
AllIcons.argTypes = { // Hide individual controls for this story as it's a gallery
    name: { control: false },
    size: { control: 'text' },
    color: { control: 'color' },
    spin: { control: false },
    rotate: { control: false },
    twoToneColor: { control: 'color' }
};
