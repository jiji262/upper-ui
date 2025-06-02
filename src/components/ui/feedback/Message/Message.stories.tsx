// src/components/ui/feedback/Message/Message.stories.tsx
import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import message from './Message'; // Import the API object
// import { MessageProvider } from './Message'; // If we had a MessageProvider for context/config
import Button from '../../general/Button/Button'; // Assuming Button is available
import Icon from '../../general/Icon/Icon';   // Assuming Icon is available

export default {
  title: 'Feedback/Message',
  // component: MessageProvider, // If using a provider for config
  parameters: {
    // layout: 'centered', // Messages are global, so layout doesn't matter much
    docs: {
      description: {
        component: 'Global messages that display at the top of the viewport. Accessed via API methods.',
      },
    },
  },
  argTypes: {
    // Args for controlling individual message calls within stories
    content: { control: 'text', defaultValue: 'This is a message!' },
    duration: { control: {type: 'number', min: 0, step: 0.5}, defaultValue: 3 },
  }
} as Meta;

const Template: StoryFn<{ content: string; duration: number; type: 'success'|'error'|'info'|'warning'|'loading' }> = (args) => {
  const showMessage = () => {
    switch(args.type) {
      case 'success':
        message.success({ content: args.content, duration: args.duration });
        break;
      case 'error':
        message.error({ content: args.content, duration: args.duration });
        break;
      case 'info':
        message.info({ content: args.content, duration: args.duration });
        break;
      case 'warning':
        message.warning({ content: args.content, duration: args.duration });
        break;
      case 'loading':
        message.loading({ content: args.content, duration: args.duration });
        break;
      default:
        message.open({content: args.content, duration: args.duration, type: 'info'});
    }
  };

  return (
    <div>
      <Button onClick={showMessage}>Show {args.type || 'Info'} Message</Button>
      <p style={{marginTop: 16, fontSize: 12, color: '#777'}}>
        Note: Messages appear globally, usually at the top of the viewport.
        The component itself (`Message.tsx`) doesn't render directly here but manages the message display.
      </p>
    </div>
  );
};

export const Success = Template.bind({});
Success.args = {
  type: 'success',
  content: 'This is a success message!',
};

export const Error = Template.bind({});
Error.args = {
  type: 'error',
  content: 'This is an error message!',
};

export const Info = Template.bind({});
Info.args = {
  type: 'info',
  content: 'This is an info message.',
};

export const Warning = Template.bind({});
Warning.args = {
  type: 'warning',
  content: 'This is a warning message.',
};

export const Loading = Template.bind({});
Loading.args = {
  type: 'loading',
  content: 'Loading in progress...',
  duration: 5, // Show loading for 5 seconds or until manually destroyed
};

export const CustomDuration: StoryFn<{ content: string; duration: number; type: 'info' }> = (args) => {
    const showNonDismissible = () => {
        message.info({ content: "This message stays until manually closed (or duration 0).", duration: 0 });
    };
    const showShortDuration = () => {
        message.success({content: "This message will disappear in 1.5 seconds.", duration: 1.5});
    }
     const showLongDuration = () => {
        message.warning({content: "This message will disappear in 10 seconds.", duration: 10});
    }
    return (
        <div style={{display: 'flex', gap: '10px'}}>
            <Button onClick={showNonDismissible}>Non-Dismissible (Duration 0)</Button>
            <Button onClick={showShortDuration}>Short (1.5s)</Button>
            <Button onClick={showLongDuration}>Long (10s)</Button>
        </div>
    );
};
CustomDuration.args = {};


export const WithKeyAndUpdate: StoryFn = () => {
  const key = 'updatable';
  const openMessage = () => {
    message.loading({ content: 'Loading...', key, duration: 0 }); // duration 0 for manual close/update
    setTimeout(() => {
      message.success({ content: 'Loaded successfully!', key, duration: 2 });
    }, 2500);
  };
  return (
    <Button onClick={openMessage}>Show Loading then Success (same key)</Button>
  );
};

export const DestroyMessages: StoryFn = () => {
    const showMultiple = () => {
        message.info('Message 1 (will be destroyed by key)', { key: 'msg1', duration: 0 });
        message.info('Message 2 (will be destroyed by key)', { key: 'msg2', duration: 0 });
        message.success('Message 3 (will be destroyed by all)', { duration: 0 });
        message.warning('Message 4 (will be destroyed by all)', { duration: 0 });
    }
    return (
        <div style={{display: 'flex', gap: '10px'}}>
            <Button onClick={showMultiple}>Show Multiple Messages</Button>
            <Button onClick={() => message.destroy('msg1')}>Destroy Message 1 (by key 'msg1')</Button>
            <Button onClick={() => message.destroy()}>Destroy All Messages</Button>
        </div>
    )
}

export const CustomIcon: StoryFn = () => {
    const showCustomIconMessage = () => {
        message.open({
            content: "Message with a custom smiley icon!",
            icon: <Icon name="SmileOutlined" style={{color: '#1890ff'}}/>,
            duration: 3,
            type: 'info', // Type still useful for styling container if not icon
        });
    };
    return <Button onClick={showCustomIconMessage}>Message with Custom Icon</Button>
};

// Note: Global configuration like `message.config({ top: 100, maxCount: 3 })`
// is not implemented in this simplified version but is a common feature in AntD.
// The message container is appended to document.body.
