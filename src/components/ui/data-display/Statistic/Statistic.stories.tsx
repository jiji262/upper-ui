// src/components/ui/data-display/Statistic/Statistic.stories.tsx
import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Statistic from './Statistic';
// import Countdown from './Countdown'; // Use Statistic.Countdown
import Icon from '../../general/Icon/Icon'; // Assuming Icon is available

export default {
  title: 'Data Display/Statistic',
  component: Statistic,
  subcomponents: { Countdown: (Statistic as any).Countdown },
  argTypes: {
    title: { control: 'text', defaultValue: 'Active Users' },
    value: { control: 'text', defaultValue: '112893' }, // Use text for story control, component handles number
    precision: { control: 'number' },
    loading: { control: 'boolean', defaultValue: false },
    // `formatter`, `prefix`, `suffix`, `valueStyle` are for specific stories
  },
} as Meta<typeof Statistic>;

const Template: StoryFn<typeof Statistic> = (args) => {
  // Convert value to number if it's a numeric string, otherwise pass as is
  const numericValue = args.value !== undefined && !isNaN(parseFloat(String(args.value))) 
    ? parseFloat(String(args.value)) 
    : args.value;
  return <Statistic {...args} value={numericValue} />;
};

export const Basic = Template.bind({});
Basic.args = {};

export const WithPrecision = Template.bind({});
WithPrecision.args = {
  title: 'Account Balance (CNY)',
  value: 112893.12345,
  precision: 2,
};

export const WithPrefixAndSuffix = Template.bind({});
WithPrefixAndSuffix.args = {
  title: 'Feedback',
  value: 93,
  prefix: <Icon name="LikeOutlined" />,
  suffix: '%',
};

export const LoadingState = Template.bind({});
LoadingState.args = {
  title: 'Loading Data...',
  loading: true,
  value: 0, // Value is hidden by loader
};

export const CustomValueStyle = Template.bind({});
CustomValueStyle.args = {
  title: 'Success Rate',
  value: 99.9,
  precision: 1,
  suffix: '%',
  valueStyle: { color: '#3f8600' }, // Green color for success
};

export const CustomFormatter: StoryFn<typeof Statistic> = (args) => (
  <Statistic
    {...args}
    formatter={(value) => `${value} Points`}
  />
);
CustomFormatter.args = {
  title: 'User Score',
  value: 8500,
};


// Countdown Stories
const CountdownTemplate: StoryFn<typeof (Statistic as any).Countdown> = (args) => (
  <(Statistic as any).Countdown {...args} />
);

export const BasicCountdown = CountdownTemplate.bind({});
BasicCountdown.args = {
  title: 'Time Remaining',
  value: Date.now() + 1000 * 60 * 60 * 2, // 2 hours from now
  onFinish: () => alert('Countdown finished!'),
};

export const CountdownWithFormat = CountdownTemplate.bind({});
CountdownWithFormat.args = {
  title: 'Sale Ends In (DD:HH:mm:ss)',
  value: Date.now() + 1000 * 60 * 60 * 24 * 3, // 3 days from now
  format: 'DD Day(s) HH:mm:ss', // Note: Simplified formatter in component only does HH:mm:ss
                                 // A real AntD formatter would handle DD, SSS etc.
                                 // This story will show 00 for DD with current simplified formatter.
};

export const CountdownWithSuffix = CountdownTemplate.bind({});
CountdownWithSuffix.args = {
  title: 'Next Update In',
  value: Date.now() + 1000 * 30, // 30 seconds
  suffix: 'seconds',
  format: 'ss', // Show only seconds
};

export const ExpiredCountdown = CountdownTemplate.bind({});
ExpiredCountdown.args = {
    title: "Event Ended",
    value: Date.now() - 1000 * 60 * 5 // 5 minutes ago
};
