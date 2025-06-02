// src/components/ui/layout/Splitter/Splitter.stories.tsx
import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Splitter from './Splitter';

export default {
  title: 'Layout/Splitter',
  component: Splitter,
  argTypes: {
    direction: {
      control: { type: 'select', options: ['horizontal', 'vertical'] },
      defaultValue: 'horizontal',
    },
    initialSize: {
      control: 'text',
      defaultValue: '50%',
    },
    minSize: {
      control: 'number',
      defaultValue: 50,
    },
    maxSize: {
      control: 'number',
    },
    onResizeStart: { action: 'resizeStart' },
    onResizeEnd: { action: 'resizeEnd' },
  },
  parameters: {
    layout: 'fullscreen', // Splitter often needs full screen or a large container
  },
} as Meta<typeof Splitter>;

const PaneContent: React.FC<{ text: string; style?: React.CSSProperties }> = ({ text, style }) => (
  <div
    style={{
      padding: '20px',
      height: '100%',
      width: '100%',
      overflow: 'auto',
      background: 'rgba(0,0,0,0.05)',
      border: '1px solid rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style,
    }}
  >
    {text}
  </div>
);

const Template: StoryFn<typeof Splitter> = (args) => (
  <div style={{ height: '400px', width: '100%', border: '1px solid #ccc' }}>
    <Splitter {...args}>
      <PaneContent text="Pane 1" />
      <PaneContent text="Pane 2" style={{ background: 'rgba(0,0,0,0.02)'}} />
    </Splitter>
  </div>
);

export const Horizontal = Template.bind({});
Horizontal.args = {
  direction: 'horizontal',
};

export const Vertical = Template.bind({});
Vertical.args = {
  direction: 'vertical',
  initialSize: '150px', // Example with pixel value
};

export const WithMinMaxSizes = Template.bind({});
WithMinMaxSizes.args = {
  direction: 'horizontal',
  initialSize: '30%',
  minSize: 100, // Min size for pane 1 in pixels
  maxSize: 500, // Max size for pane 1 in pixels
};

export const CustomStyledPanes: StoryFn<typeof Splitter> = (args) => (
    <div style={{ height: '300px', width: '100%', border: '1px solid #ccc' }}>
      <Splitter {...args}>
        <PaneContent text="Pane 1 with custom style" style={{ backgroundColor: '#e6f7ff' }} />
        <PaneContent text="Pane 2 also custom" style={{ backgroundColor: '#fffbe6' }} />
      </Splitter>
    </div>
  );
CustomStyledPanes.args = {
    direction: 'horizontal',
    initialSize: '200px',
    pane1Style: { borderRight: '2px dashed blue' },
    pane2Style: { borderLeft: '2px dashed orange' },
    splitterStyle: { backgroundColor: 'red', width: '10px' }
};

export const NestedSplitters: StoryFn<typeof Splitter> = (args) => (
    <div style={{ height: '500px', width: '100%', border: '1px solid #ccc' }}>
      <Splitter direction="horizontal" initialSize="60%">
        <PaneContent text="Outer Pane 1" />
        <Splitter direction="vertical" initialSize="200px">
            <PaneContent text="Nested Pane A" style={{background: '#f0f0f0'}} />
            <PaneContent text="Nested Pane B" style={{background: '#e0e0e0'}}/>
        </Splitter>
      </Splitter>
    </div>
  );
NestedSplitters.args = {};
