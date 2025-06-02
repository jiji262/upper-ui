// src/components/ui/general/FloatButton/FloatButton.stories.tsx
import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import FloatButton from './FloatButton';
import { HomeOutlined } from '@ant-design/icons';

export default {
  title: 'General/FloatButton',
  component: FloatButton,
  argTypes: {
    type: {
      control: { type: 'select', options: ['default', 'primary'] },
    },
    shape: {
      control: { type: 'select', options: ['circle', 'square'] },
    },
    href: {
      control: 'text',
    },
    target: {
      control: 'text',
    },
    tooltip: {
      control: 'text',
    },
    icon: {
      control: false, // Handled by template
    },
    description: {
      control: 'text',
    }
  },
  args: {
    type: 'default',
    shape: 'circle',
    tooltip: 'Tooltip',
  },
} as Meta<typeof FloatButton>;

const Template: StoryFn<typeof FloatButton> = (args) => <FloatButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  icon: <HomeOutlined />,
};

export const Primary = Template.bind({});
Primary.args = {
  type: 'primary',
  icon: <HomeOutlined />,
};

export const Square = Template.bind({});
Square.args = {
  shape: 'square',
  icon: <HomeOutlined />,
};

export const WithDescription = Template.bind({});
WithDescription.args = {
  icon: <HomeOutlined />,
  description: 'Home',
};

export const WithLink = Template.bind({});
WithLink.args = {
  icon: <HomeOutlined />,
  href: 'https://www.example.com',
  target: '_blank',
  tooltip: 'Open example.com in new tab',
};

export const PrimarySquareWithDescription = Template.bind({});
PrimarySquareWithDescription.args = {
  type: 'primary',
  shape: 'square',
  icon: <HomeOutlined />,
  description: 'Home',
  tooltip: 'Primary Square Button with Description'
};
