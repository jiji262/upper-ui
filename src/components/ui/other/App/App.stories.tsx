// src/components/ui/other/App/App.stories.tsx
import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import App, { useApp } from './App'; // Import useApp if you want to demo context consumption
import messageApi from '../../feedback/Message/Message'; // For demoing message within App context
import notificationApi from '../../feedback/Notification/Notification'; // For demoing notification
import Button from '../../general/Button/Button';

export default {
  title: 'Other/App',
  component: App,
  argTypes: {
    // Props for App component itself, if any, beyond children
  },
  parameters: {
    docs: {
      description: {
        component: 'A top-level wrapper component for Ant Design applications. It provides context for components like `message`, `notification`, and `Modal` static methods to access app-specific configurations (e.g., theme). This simplified version mainly acts as a conceptual wrapper and basic context provider.',
      },
    },
  },
} as Meta<typeof App>;

// Example component that might consume App context (conceptual)
const DemoAppComponent: React.FC = () => {
  const appConfig = useApp(); // Example of using context

  const showMsg = () => {
    // In a real scenario, messageApi might internally use AppContext if configured.
    // For this demo, we'll just show that message can be used inside App.
    messageApi.success({
        content: `Message shown within App context. Configured top: ${appConfig?.messageConfig?.top || 'default'}`,
        duration: appConfig?.messageConfig?.duration || 3,
    });
  };
  
  const showNotif = () => {
    notificationApi.info({
        message: "Notification in App",
        description: `Placement: ${appConfig?.notificationConfig?.placement || 'default'}`,
        duration: appConfig?.notificationConfig?.duration || 4.5,
    })
  }

  return (
    <div style={{padding: '20px', border: '1px dashed #ccc', background: '#f9f9f9'}}>
      <h4>Demo Content Inside App Wrapper</h4>
      <p>This content is wrapped by the Ant Design `App` component.</p>
      {appConfig?.messageConfig && <p>Custom Message Top: {appConfig.messageConfig.top}px</p>}
      {appConfig?.notificationConfig && <p>Custom Notification Placement: {appConfig.notificationConfig.placement}</p>}
      <Button onClick={showMsg} style={{marginRight: 8}}>Show Message</Button>
      <Button onClick={showNotif}>Show Notification</Button>
    </div>
  );
};


const Template: StoryFn<typeof App> = (args) => (
  <App {...args}>
    <DemoAppComponent />
    <hr style={{margin: '20px 0'}}/>
    <p>Other content outside the demo component but still within App:</p>
    <Button type="primary">Primary Button in App</Button>
  </App>
);

export const BasicAppWrapper = Template.bind({});
BasicAppWrapper.args = {
  // Default App wrapper, no specific config passed
};

export const AppWithStaticComponentConfig: StoryFn<typeof App> = (args) => (
    <App {...args}>
        <DemoAppComponent />
        <p style={{marginTop: 20, fontSize: 12, color: '#777'}}>
            (Note: The simplified `message` and `notification` components in this project
            do not yet consume configurations from `App` context. This story demonstrates
            how such configurations *could* be passed to the `App` component.
            A full implementation would involve `message.config()` and `notification.config()`
            being called by `App` or the static methods reading from the context.)
        </p>
    </App>
);
AppWithStaticComponentConfig.args = {
    message: {
        top: 100, // Example: messages appear 100px from top
        duration: 5, // Default duration 5 seconds
        maxCount: 3, // Max 3 messages at a time (not implemented in current message)
    },
    notification: {
        placement: 'bottomLeft', // Example: notifications appear at bottomLeft
        duration: 7, // Default duration 7 seconds
    }
};

// Story to demonstrate that App is mostly a wrapper and doesn't have much visual UI itself.
export const MinimalApp = Template.bind({});
MinimalApp.args = {
    children: <p>This is a minimal App wrapper with just a paragraph of text.</p>
};
