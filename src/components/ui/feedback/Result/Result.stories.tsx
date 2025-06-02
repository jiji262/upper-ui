// src/components/ui/feedback/Result/Result.stories.tsx
import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Result from './Result';
import Button from '../../general/Button/Button'; // Assuming Button is available
import Icon from '../../general/Icon/Icon';   // Assuming Icon is available

export default {
  title: 'Feedback/Result',
  component: Result,
  argTypes: {
    status: {
      control: { type: 'select', options: ['success', 'error', 'info', 'warning', '403', '404', '500'] },
      defaultValue: 'info',
    },
    title: { control: 'text' }, // Allow overriding default titles
    subTitle: { control: 'text', defaultValue: 'Please check and modify the following information before resubmitting.' },
    // `icon` and `extra` are complex, shown in specific stories
  },
} as Meta<typeof Result>;

const Template: StoryFn<typeof Result> = (args) => <Result {...args} />;

export const Info = Template.bind({});
Info.args = {
  status: 'info',
  title: 'Information',
  subTitle: 'This is an informational message.',
};

export const Success = Template.bind({});
Success.args = {
  status: 'success',
  title: 'Successfully Purchased Cloud Server ECS!',
  subTitle: 'Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait.',
  extra: [
    <Button type="primary" key="console">Go Console</Button>,
    <Button key="buy">Buy Again</Button>,
  ],
};

export const ErrorStatus = Template.bind({});
ErrorStatus.args = {
  status: 'error',
  title: 'Submission Failed',
  subTitle: 'Please check and modify the following information before resubmitting.',
  extra: [
    <Button type="primary" key="console">Go Console</Button>,
    <Button key="buy">Buy Again</Button>,
  ],
};

export const Warning = Template.bind({});
Warning.args = {
  status: 'warning',
  title: 'There are some problems with your operation.',
  extra: [<Button type="primary" key="console">Go Console</Button>],
};

export const Status403 = Template.bind({});
Status403.args = {
  status: '403',
  title: '403',
  subTitle: 'Sorry, you are not authorized to access this page.',
  extra: <Button type="primary">Back Home</Button>,
};

export const Status404 = Template.bind({});
Status404.args = {
  status: '404',
  title: '404',
  subTitle: 'Sorry, the page you visited does not exist.',
  extra: <Button type="primary">Back Home</Button>,
};

export const Status500 = Template.bind({});
Status500.args = {
  status: '500',
  title: '500',
  subTitle: 'Sorry, something went wrong on the server.',
  extra: <Button type="primary">Back Home</Button>,
};

export const CustomIcon: StoryFn<typeof Result> = (args) => (
  <Result
    {...args}
    icon={<Icon name="SmileOutlined" style={{color: '#1890ff', fontSize: '64px'}} />}
  />
);
CustomIcon.args = {
  title: 'Great, we have done all the operations!',
  subTitle: 'Waiting for your next instruction.',
  extra: <Button type="primary">Next Step</Button>,
  status: undefined, // Explicitly undefined so custom icon takes precedence without status class styling icon color
};

export const NoIcon = Template.bind({});
NoIcon.args = {
    status: undefined, // No status to derive icon from
    icon: null, // Explicitly no icon
    title: "Just a Title and Subtitle",
    subTitle: "This result component has no icon.",
    extra: <Button>Action</Button>
};

export const OnlyTitle = Template.bind({});
OnlyTitle.args = {
    status: 'info',
    icon: null,
    title: "Operation Information",
    subTitle: null,
    extra: null,
};
