// src/components/ui/layout/Divider/Divider.stories.tsx
import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Divider from './Divider';

export default {
  title: 'Layout/Divider',
  component: Divider,
  argTypes: {
    type: {
      control: { type: 'select', options: ['horizontal', 'vertical'] },
      defaultValue: 'horizontal',
    },
    orientation: {
      control: { type: 'select', options: ['left', 'right', 'center'] },
      defaultValue: 'center',
    },
    dashed: {
      control: 'boolean',
      defaultValue: false,
    },
    plain: {
      control: 'boolean',
      defaultValue: false,
    },
    children: {
      control: 'text',
    },
  },
} as Meta<typeof Divider>;

const Template: StoryFn<typeof Divider> = (args) => <Divider {...args} />;

export const Horizontal = Template.bind({});
Horizontal.args = {};

export const HorizontalWithText = Template.bind({});
HorizontalWithText.args = {
  children: 'Text',
};

export const HorizontalWithTextLeft = Template.bind({});
HorizontalWithTextLeft.args = {
  children: 'Left Text',
  orientation: 'left',
};

export const HorizontalWithTextRight = Template.bind({});
HorizontalWithTextRight.args = {
  children: 'Right Text',
  orientation: 'right',
};

export const Dashed = Template.bind({});
Dashed.args = {
  dashed: true,
  children: 'Dashed',
};

export const Plain = Template.bind({});
Plain.args = {
  plain: true,
  children: 'Plain Text',
};


export const Vertical: StoryFn<typeof Divider> = (args) => (
  <div style={{ height: '30px', display: 'flex', alignItems: 'center' }}>
    <span>Text 1</span>
    <Divider {...args} type="vertical" />
    <span>Text 2</span>
    <Divider {...args} type="vertical" dashed />
    <span>Text 3</span>
  </div>
);
Vertical.args = {
  type: 'vertical',
};

export const VerticalWithCustomHeight: StoryFn<typeof Divider> = (args) => (
    <div style={{ height: '50px', display: 'flex', alignItems: 'center' }}>
      <span>Text A</span>
      <Divider {...args} type="vertical" style={{ height: '40px', backgroundColor: '#1677ff' }} />
      <span>Text B</span>
    </div>
  );
VerticalWithCustomHeight.args = {
    type: 'vertical',
};
