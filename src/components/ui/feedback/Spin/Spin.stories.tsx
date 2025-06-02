// src/components/ui/feedback/Spin/Spin.stories.tsx
import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Spin from './Spin';
import Icon from '../../general/Icon/Icon'; // Assuming Icon is available
import Alert from '../Alert/Alert'; // Assuming Alert is available for wrapped content example
import Button from '../../general/Button/Button'; // For toggle example

export default {
  title: 'Feedback/Spin',
  component: Spin,
  argTypes: {
    spinning: { control: 'boolean', defaultValue: true },
    size: {
      control: { type: 'select', options: ['small', 'default', 'large'] },
      defaultValue: 'default',
    },
    tip: { control: 'text', defaultValue: '' },
    // `indicator` is complex, shown in a specific story
  },
} as Meta<typeof Spin>;

const Template: StoryFn<typeof Spin> = (args) => <Spin {...args} />;

export const Basic = Template.bind({});
Basic.args = {};

export const SmallSize = Template.bind({});
SmallSize.args = {
  size: 'small',
};

export const LargeSize = Template.bind({});
LargeSize.args = {
  size: 'large',
};

export const WithTip = Template.bind({});
WithTip.args = {
  tip: 'Loading, please wait...',
};

export const CustomIndicator: StoryFn<typeof Spin> = (args) => (
  <Spin
    {...args}
    indicator={<Icon name="SyncOutlined" spin style={{ fontSize: 24, color: '#1890ff' }} />}
  />
);
CustomIndicator.args = {
  tip: 'Customizing...',
};

export const WrappedContent: StoryFn<typeof Spin> = (args) => {
  const [loading, setLoading] = useState(true);
  return (
    <div>
      <Spin {...args} spinning={loading}>
        <Alert
          message="Alert message title"
          description="Further details about the context of this alert."
          type="info"
          style={{border: '1px solid #ddd', padding: '16px'}}
        />
      </Spin>
      <div style={{ marginTop: 16 }}>
        <Button onClick={() => setLoading(!loading)}>Toggle Spinning</Button>
      </div>
    </div>
  );
};
WrappedContent.args = {
  tip: 'Content is loading...',
};


export const NoSpinIfFalse: StoryFn<typeof Spin> = (args) => {
    const [isLoading, setIsLoading] = useState(false);
    return (
        <div>
             <Button onClick={() => setIsLoading(!isLoading)} style={{marginBottom: 16}}>
                Toggle Loading State (Currently: {isLoading ? "ON" : "OFF"})
            </Button>
            <br/>
            <Spin {...args} spinning={isLoading} />
            <p style={{marginTop: 8, fontSize: 12, color: '#777'}}>
                (If spinning is false and no children, Spin renders null)
            </p>
        </div>
    )
}
NoSpinIfFalse.args = {
    tip: "I am loading..."
};

export const DelayNotImplemented: StoryFn<typeof Spin> = (args) => (
    <Spin {...args} tip="This spinner does not implement the 'delay' prop." />
);
DelayNotImplemented.args = {
    // delay: 500, // This prop is not implemented in the simplified component
};
