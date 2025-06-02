// src/components/ui/navigation/Steps/Steps.stories.tsx
import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Steps from './Steps';
// import Step from './Step'; // Use Steps.Step
import Icon from '../../general/Icon';
import Button from '../../general/Button'; // For controlling steps

export default {
  title: 'Navigation/Steps',
  component: Steps,
  subcomponents: { Step: Steps.Step }, // Referencing static property
  argTypes: {
    current: { control: 'number', defaultValue: 0 },
    direction: {
      control: { type: 'select', options: ['horizontal', 'vertical'] },
      defaultValue: 'horizontal',
    },
    size: {
      control: { type: 'select', options: ['default', 'small'] },
      defaultValue: 'default',
    },
    status: {
      control: { type: 'select', options: ['wait', 'process', 'finish', 'error'] },
      defaultValue: 'process',
    },
    progressDot: { control: 'boolean', defaultValue: false },
    type: {
        control: { type: 'select', options: ['default', 'navigation', 'inline'] },
        defaultValue: 'default',
    },
    percent: { control: {type: 'number', min:0, max:100, step: 10 }}
  },
} as Meta<typeof Steps>;

const Template: StoryFn<typeof Steps> = (args) => (
  <Steps {...args}>
    <Steps.Step title="Finished" description="This is a description." />
    <Steps.Step title="In Progress" subTitle="Left 00:00:08" description="This is a description." />
    <Steps.Step title="Waiting" description="This is a description." />
  </Steps>
);

export const Basic = Template.bind({});
Basic.args = {
  current: 1,
};

export const SmallSize = Template.bind({});
SmallSize.args = {
  current: 1,
  size: 'small',
};

export const WithIcons: StoryFn<typeof Steps> = (args) => (
  <Steps {...args}>
    <Steps.Step status="finish" title="Login" icon={<Icon name="UserOutlined" />} />
    <Steps.Step status="finish" title="Verification" icon={<Icon name="SolutionOutlined" />} />
    <Steps.Step status="process" title="Pay" icon={<Icon name="LoadingOutlined" />} />
    <Steps.Step status="wait" title="Done" icon={<Icon name="SmileOutlined" />} />
  </Steps>
);
WithIcons.args = {
  current: 2, // Corresponds to 'Pay' being in process
};

export const VerticalSteps = Template.bind({});
VerticalSteps.args = {
  current: 1,
  direction: 'vertical',
};

export const VerticalSmall = Template.bind({});
VerticalSmall.args = {
    current: 1,
    direction: 'vertical',
    size: 'small',
};


export const ErrorStatus: StoryFn<typeof Steps> = (args) => (
  <Steps {...args}>
    <Steps.Step title="Finished" description="This is a description." />
    <Steps.Step title="In Process" subTitle="00:00:08" description="This is a description." />
    <Steps.Step title="Waiting" description="This is a description." />
  </Steps>
);
ErrorStatus.args = {
  current: 1,
  status: 'error', // Overall status, will apply to current step (In Process)
};

export const ProgressDot: StoryFn<typeof Steps> = (args) => (
  <Steps {...args}>
    <Steps.Step title="Finished" description="This is a description." />
    <Steps.Step title="In Progress" description="This is a description." />
    <Steps.Step title="Waiting" description="This is a description." />
    <Steps.Step title="Also Waiting" description="Another waiting step." />
  </Steps>
);
ProgressDot.args = {
  current: 1,
  progressDot: true,
  percent: 60, // For current step (In Progress)
};

export const ProgressDotVertical: StoryFn<typeof Steps> = (args) => (
    <Steps {...args}>
      <Steps.Step title="Finished" description="This is a description." />
      <Steps.Step title="In Progress" description="This is a description." />
      <Steps.Step title="Waiting" description="This is a description." />
    </Steps>
  );
ProgressDotVertical.args = {
    current: 1,
    progressDot: true,
    direction: 'vertical',
    percent: 30,
};

export const ClickableNavigation: StoryFn<typeof Steps> = (args) => {
  const [current, setCurrent] = useState(0);
  const onChange = (value: number) => {
    console.log('onChange:', value);
    setCurrent(value);
  };
  return <Steps {...args} current={current} onChange={onChange} />;
};
ClickableNavigation.args = {
  type: 'navigation',
  // Initial current is 0 from useState
  children: (
    <>
      <Steps.Step title="Step 1" description="First step." />
      <Steps.Step title="Step 2" description="Second step." />
      <Steps.Step title="Step 3" description="Third step." />
    </>
  ),
};

export const InlineType: StoryFn<typeof Steps> = (args) => {
    const [current, setCurrent] = useState(0);
    return (
      <Steps 
        {...args} 
        current={current} 
        onChange={setCurrent}
        style={{maxWidth: '600px', margin: 'auto'}} // Inline often used in limited space
      >
        <Steps.Step title="Step 1" description="This is step 1." />
        <Steps.Step title="Step 2" description="This is step 2. This description might be a bit longer to see how it wraps or behaves in inline mode." />
        <Steps.Step title="Step 3" icon={<Icon name="StarOutlined" />} description="Last step with icon." />
      </Steps>
    );
  };
InlineType.args = {
    type: 'inline',
    // current is managed by useState
};


export const ControlledSteps: StoryFn<typeof Steps> = (args) => {
  const [current, setCurrent] = useState(0);
  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);

  const stepsItems = [
    { title: 'First', content: 'Content of First Step' },
    { title: 'Second', content: 'Content of Second Step' },
    { title: 'Last', content: 'Content of Last Step' },
  ];

  return (
    <>
      <Steps {...args} current={current} items={stepsItems.map(item => ({title: item.title}))} />
      <div style={{ marginTop: 24, padding: '20px', border: '1px dashed #ccc' }}>
        {stepsItems[current] && stepsItems[current].content}
      </div>
      <div style={{ marginTop: 24 }}>
        {current < stepsItems.length - 1 && (
          <Button type="primary" onClick={next}>Next</Button>
        )}
        {current === stepsItems.length - 1 && (
          <Button type="primary" onClick={() => alert('Processing complete!')}>Done</Button>
        )}
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={prev}>Previous</Button>
        )}
      </div>
    </>
  );
};
ControlledSteps.args = {
  // Current is controlled by component state
  // Items are used here instead of children
};
