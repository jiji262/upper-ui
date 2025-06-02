// src/components/ui/layout/Space/Space.stories.tsx
import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Space from './Space';
import Button from '../../general/Button'; // Assuming a Button component exists
import Divider from '../Divider'; // To use as a split

export default {
  title: 'Layout/Space',
  component: Space,
  argTypes: {
    align: {
      control: { type: 'select', options: ['start', 'end', 'center', 'baseline'] },
    },
    direction: {
      control: { type: 'select', options: ['horizontal', 'vertical'] },
      defaultValue: 'horizontal',
    },
    size: {
      control: { type: 'select', options: ['small', 'middle', 'large', 12, 20] }, // Example custom numbers
      defaultValue: 'small',
    },
    wrap: {
      control: 'boolean',
      defaultValue: false,
    },
    split: {
      control: false, // Handled by specific stories
    },
  },
} as Meta<typeof Space>;

const Template: StoryFn<typeof Space> = (args) => (
  <Space {...args}>
    <Button type="primary">Button 1</Button>
    <Button>Button 2</Button>
    <Button type="dashed">Button 3</Button>
    {args.wrap && (
        <>
            <Button>Button 4</Button>
            <Button>Button 5</Button>
            <Button>Button 6</Button>
            <Button>Button 7</Button>
            <Button>Button 8</Button>
            <Button>Button 9</Button>
            <Button>Button 10</Button>
        </>
    )}
  </Space>
);

export const Horizontal = Template.bind({});
Horizontal.args = {};

export const Vertical: StoryFn<typeof Space> = (args) => (
  <Space {...args}>
    <Button type="primary">Button 1</Button>
    <div style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>Custom Block</div>
    <Button>Button 2</Button>
  </Space>
);
Vertical.args = {
  direction: 'vertical',
  size: 'middle',
};

export const CustomSize = Template.bind({});
CustomSize.args = {
  size: 20, // Custom number size
};

export const SizeArray: StoryFn<typeof Space> = (args) => (
    <Space {...args}>
      <Button type="primary">Button 1</Button>
      <Button>Button 2</Button>
      <Button type="dashed">Button 3</Button>
    </Space>
  );
SizeArray.args = {
    size: ['middle', 'large'], // [horizontal, vertical] - vertical will apply if direction is vertical or wrap is true
    wrap: true, // To see effect of vertical gap
};


export const AlignCenter = Template.bind({});
AlignCenter.args = {
  align: 'center',
  direction: 'horizontal', // Align works best with horizontal typically
  children: ( // Custom children for this story to show alignment
    <>
      <Button type="primary">Primary</Button>
      <span style={{ padding: '10px', border: '1px solid #ccc', display: 'inline-block', height: '60px', lineHeight: '60px' }}>
        Tall Item
      </span>
      <Button style={{height: '20px', lineHeight: '20px' }}>Short</Button>
    </>
  ),
};

export const AlignBaseline: StoryFn<typeof Space> = (args) => (
    <Space {...args}>
      <span style={{ fontSize: '12px' }}>Text A</span>
      <Button type="primary" size="small">Button B</Button>
      <span style={{ fontSize: '24px', fontWeight: 'bold' }}>Text C</span>
      <input type="text" placeholder="Input D" style={{height: '20px'}}/>
    </Space>
  );
AlignBaseline.args = {
    align: 'baseline',
    size: 'middle'
};


export const WrapSpace = Template.bind({});
WrapSpace.args = {
  size: 'middle',
  wrap: true,
  // Add more buttons via default template's wrap check
};


export const WithSplit: StoryFn<typeof Space> = (args) => (
  <Space {...args}>
    <span>Item 1</span>
    <span>Item 2</span>
    <span>Item 3</span>
  </Space>
);
WithSplit.args = {
  split: <Divider type="vertical" />,
  size: 'middle',
};

export const WithSplitVertical: StoryFn<typeof Space> = (args) => (
    <Space {...args}>
      <span>Item 1</span>
      <span>Item 2</span>
      <span>Item 3</span>
    </Space>
  );
WithSplitVertical.args = {
    direction: 'vertical',
    split: <Divider type="horizontal" />,
    size: 'middle',
};
