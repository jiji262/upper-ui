// src/components/ui/data-display/Timeline/Timeline.stories.tsx
import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Timeline from './Timeline';
// import TimelineItem from './TimelineItem'; // Use Timeline.Item
import Icon from '../../general/Icon/Icon'; // Assuming Icon is available
import Button from '../../general/Button/Button'; // For pending example

export default {
  title: 'Data Display/Timeline',
  component: Timeline,
  subcomponents: { Item: (Timeline as any).Item },
  argTypes: {
    pending: { control: 'boolean', defaultValue: false }, // Can also be ReactNode
    reverse: { control: 'boolean', defaultValue: false },
    mode: {
      control: { type: 'select', options: ['left', 'alternate', 'right'] },
      defaultValue: 'left',
    },
  },
} as Meta<typeof Timeline>;

const Template: StoryFn<typeof Timeline> = (args) => (
  <Timeline {...args}>
    <(Timeline as any).Item>Create a services site 2015-09-01</(Timeline as any).Item>
    <(Timeline as any).Item>Solve initial network problems 2015-09-01</(Timeline as any).Item>
    <(Timeline as any).Item>Technical testing 2015-09-01</(Timeline as any).Item>
    <(Timeline as any).Item>Network problems being solved 2015-09-01</(Timeline as any).Item>
  </Timeline>
);

export const Basic = Template.bind({});
Basic.args = {};

export const WithColors: StoryFn<typeof Timeline> = (args) => (
  <Timeline {...args}>
    <(Timeline as any).Item color="green">Create a services site 2015-09-01</(Timeline as any).Item>
    <(Timeline as any).Item color="green">Solve initial network problems 2015-09-01</(Timeline as any).Item>
    <(Timeline as any).Item color="red">
      <p>Solve initial network problems 1</p>
      <p>Solve initial network problems 2</p>
      <p>Solve initial network problems 3 2015-09-01</p>
    </(Timeline as any).Item>
    <(Timeline as any).Item>
      <p>Technical testing 1</p>
      <p>Technical testing 2</p>
      <p>Technical testing 3 2015-09-01</p>
    </(Timeline as any).Item>
    <(Timeline as any).Item color="gray">
      <p>Network problems being solved 1</p>
      <p>Network problems being solved 2</p>
      <p>Network problems being solved 3 2015-09-01</p>
    </(Timeline as any).Item>
    <(Timeline as any).Item color="#00CCFF" dot={<Icon name="ClockCircleOutlined" />}> {/* Custom color and dot */}
      Custom color and icon 2023-10-26
    </(Timeline as any).Item>
  </Timeline>
);
WithColors.args = {};

export const AlternateMode = Template.bind({});
AlternateMode.args = {
  mode: 'alternate',
};

export const RightMode = Template.bind({});
RightMode.args = {
  mode: 'right',
};

export const WithPending: StoryFn<typeof Timeline> = (args) => {
    const [showPending, setShowPending] = React.useState(true);
    return (
        <div>
            <Timeline {...args} pending={showPending ? "Recording..." : false}>
                <(Timeline as any).Item>Create a services site 2015-09-01</(Timeline as any).Item>
                <(Timeline as any).Item>Solve initial network problems 2015-09-01</(Timeline as any).Item>
                <(Timeline as any).Item>Technical testing 2015-09-01</(Timeline as any).Item>
            </Timeline>
            <Button style={{marginTop: 16}} onClick={() => setShowPending(!showPending)}>
                Toggle Pending
            </Button>
        </div>
    );
}
WithPending.args = {
  // `pending` is controlled by story state
};

export const CustomPendingDot = Template.bind({});
CustomPendingDot.args = {
  pending: true, // Show pending item
  pendingDot: <Icon name="SyncOutlined" spin />,
};

export const Reversed = Template.bind({});
Reversed.args = {
  reverse: true,
};


export const WithLabels: StoryFn<typeof Timeline> = (args) => (
    <Timeline {...args}>
      <(Timeline as any).Item label="2015-09-01">Create a services site</(Timeline as any).Item>
      <(Timeline as any).Item label="2015-09-01 09:12:11">Solve initial network problems</(Timeline as any).Item>
      <(Timeline as any).Item label="2015-09-01">Technical testing</(Timeline as any).Item>
      <(Timeline as any).Item label="2015-09-01">Network problems being solved</(Timeline as any).Item>
    </Timeline>
);
WithLabels.args = {
    mode: 'left', // Default, labels appear on left if mode is 'left'
};

export const AlternateModeWithLabels: StoryFn<typeof Timeline> = (args) => (
    <Timeline {...args}>
      <(Timeline as any).Item label="2023-01-01">Event A</(Timeline as any).Item>
      <(Timeline as any).Item label="2023-02-15">Event B - A longer label to see how it wraps or affects layout.</(Timeline as any).Item>
      <(Timeline as any).Item label="2023-03-20" color="green">Event C with custom color</(Timeline as any).Item>
      <(Timeline as any).Item label="2023-04-10" dot={<Icon name="ClockCircleOutlined" />}>Event D with custom dot</(Timeline as any).Item>
    </Timeline>
);
AlternateModeWithLabels.args = {
    mode: 'alternate',
};

// Using items prop
export const FromItemsProp: StoryFn<typeof Timeline> = (args) => {
    const timelineItems = [
        { children: 'Eat 08:00', color: 'green' },
        { children: 'Code 10:00', dot: <Icon name="CodeOutlined" /> },
        { children: 'Sleep 12:00', label: "Evening Activity", color: 'red' },
        { children: 'Repeat 00:00', color: 'gray' },
    ];
    return <Timeline {...args} items={timelineItems} />;
};
FromItemsProp.args = {
    mode: 'alternate',
};
