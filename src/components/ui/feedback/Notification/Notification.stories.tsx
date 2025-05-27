// src/components/ui/feedback/Notification/Notification.stories.tsx
import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import notification from './Notification'; // Import the API object
// import { NotificationProvider } from './Notification'; // If using a Provider
import Button from '../../general/Button/Button'; // Assuming Button is available
import Icon from '../../general/Icon/Icon';   // Assuming Icon is available

export default {
  title: 'Feedback/Notification',
  // component: NotificationProvider, // If using a provider for config
  parameters: {
    docs: {
      description: {
        component: 'Global notification messages that display in a corner of the viewport. Accessed via API methods.',
      },
    },
  },
  argTypes: {
    // Args for controlling individual notification calls within stories
    message: { control: 'text', defaultValue: 'Notification Title' },
    description: { control: 'text', defaultValue: 'This is the content of the notification. This is the content of the notification. This is the content of the notification.' },
    duration: { control: {type: 'number', min: 0, step: 0.5}, defaultValue: 4.5 },
    placement: { 
        control: {type: 'select', options: ['topLeft', 'topRight', 'bottomLeft', 'bottomRight']},
        defaultValue: 'topRight'
    },
  }
} as Meta;

const Template: StoryFn<{ message: string; description: string; duration: number; placement: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'; type: 'success'|'error'|'info'|'warning'|'open' }> = (args) => {
  const showNotification = () => {
    notification.open({
      message: args.message,
      description: args.description,
      duration: args.duration,
      placement: args.placement,
      type: args.type, // For 'open' type, icon might need to be explicit
    });
  };
  const showTypedNotification = (type: 'success'|'error'|'info'|'warning') => {
      notification[type]({
          message: `${type.charAt(0).toUpperCase() + type.slice(1)} Notification`,
          description: args.description,
          duration: args.duration,
          placement: args.placement,
      })
  }

  return (
    <div>
      <Button onClick={showNotification} style={{marginRight: 8}}>Show Generic Notification</Button>
      <Button onClick={() => showTypedNotification('success')} style={{marginRight: 8}}>Show Success</Button>
      <Button onClick={() => showTypedNotification('info')} style={{marginRight: 8}}>Show Info</Button>
      <Button onClick={() => showTypedNotification('warning')} style={{marginRight: 8}}>Show Warning</Button>
      <Button onClick={() => showTypedNotification('error')}>Show Error</Button>
      <p style={{marginTop: 16, fontSize: 12, color: '#777'}}>
        Note: Notifications appear globally, usually in a corner of the viewport.
        The component itself (`Notification.tsx`) doesn't render directly here but manages the display.
      </p>
    </div>
  );
};

export const Basic = Template.bind({});
Basic.args = {
  type: 'open', // Generic type
  message: 'Basic Notification',
  description: 'This is a basic notification message.',
};

export const SuccessNotification = Template.bind({});
SuccessNotification.args = {
  type: 'success',
  message: 'Success!',
  description: 'Your operation was completed successfully.',
};

export const InfoNotification = Template.bind({});
InfoNotification.args = {
  type: 'info',
  message: 'Information',
  description: 'Here is some useful information for you.',
};

export const WarningNotification = Template.bind({});
WarningNotification.args = {
  type: 'warning',
  message: 'Warning',
  description: 'Please be aware of potential issues.',
};

export const ErrorNotification = Template.bind({});
ErrorNotification.args = {
  type: 'error',
  message: 'Error Occurred',
  description: 'An error happened while processing your request.',
};


export const DifferentPlacements: StoryFn = () => {
    const openNotification = (placement: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight') => {
      notification.info({
        message: `Notification ${placement}`,
        description: `This notification is placed at ${placement}.`,
        placement,
      });
    };
    return (
      <div style={{display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start'}}>
        <Button onClick={() => openNotification('topLeft')}>Top Left</Button>
        <Button onClick={() => openNotification('topRight')}>Top Right (Default)</Button>
        <Button onClick={() => openNotification('bottomLeft')}>Bottom Left</Button>
        <Button onClick={() => openNotification('bottomRight')}>Bottom Right</Button>
      </div>
    );
};

export const WithCustomIconAndButton: StoryFn = () => {
    const openCustom = () => {
        notification.open({
            message: "Custom Notification",
            description: "This notification has a custom icon and an action button.",
            icon: <Icon name="SmileOutlined" style={{color: '#108ee9'}} />,
            btn: (
                <Button type="primary" size="small" onClick={() => alert("Undo Clicked!")}>
                    Undo Action
                </Button>
            ),
            duration: 0, // Keep open until manually closed or action taken
            key: 'customNotificationKey', // Allow updating or closing by key
        });
    };
    return (
        <div>
            <Button onClick={openCustom}>Show Custom Notification</Button>
            <Button onClick={() => notification.destroy('customNotificationKey')} style={{marginLeft: 8}}>Close Custom (by key)</Button>
        </div>
    );
};

export const NonClosableDuration: StoryFn = () => {
    const showNonClosable = () => {
        notification.info({
            message: "Permanent Notification",
            description: "This notification will stay until manually closed by API or duration is null/0.",
            duration: null, // null or 0 for permanent
        });
    };
     const showShort = () => {
        notification.success({
            message: "Short Lived",
            description: "I'm here for only 2 seconds!",
            duration: 2,
        });
    };
    return (
        <div style={{display: 'flex', gap: '10px'}}>
            <Button onClick={showNonClosable}>Permanent Notification (Duration null)</Button>
            <Button onClick={showShort}>Short (2s)</Button>
            <Button onClick={() => notification.destroy()}>Destroy All</Button>
        </div>
    );
};


// Note: Global configuration like `notification.config({ placement: 'bottomRight', duration: 3 })`
// is handled by the `notification.config()` method in the API.
// `getContainer`, `top`, `bottom` in config are not easily demonstrated without more setup.
// The notification containers are appended to document.body.
