// src/components/ui/feedback/Popconfirm/Popconfirm.stories.tsx
import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Popconfirm from './Popconfirm';
import Button from '../../general/Button/Button'; // Assuming Button is available
import messageApi from '../Message/Message'; // For showing feedback

export default {
  title: 'Feedback/Popconfirm',
  component: Popconfirm,
  argTypes: {
    title: { control: 'text', defaultValue: 'Are you sure to delete this task?' },
    description: { control: 'text' },
    placement: {
      control: {
        type: 'select',
        options: ['top', 'left', 'right', 'bottom', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight', 'leftTop', 'leftBottom', 'rightTop', 'rightBottom'],
      },
      defaultValue: 'top',
    },
    okText: { control: 'text', defaultValue: 'Yes' },
    cancelText: { control: 'text', defaultValue: 'No' },
    disabled: { control: 'boolean', defaultValue: false },
    showCancel: { control: 'boolean', defaultValue: true },
    // onConfirm, onCancel actions handled by stories
    // `open`, `onPopupOpenChange` controlled in stories
  },
  parameters: {
    layout: 'centered', // Popconfirm usually appears relative to a trigger
  },
} as Meta<typeof Popconfirm>;

const Template: StoryFn<typeof Popconfirm> = (args) => {
  const handleConfirm = (e?: React.MouseEvent<HTMLElement>) => {
    console.log('Popconfirm Confirmed');
    messageApi.success('Task deleted successfully!');
    args.onConfirm?.(e);
  };

  const handleCancel = (e?: React.MouseEvent<HTMLElement>) => {
    console.log('Popconfirm Canceled');
    messageApi.info('Delete action canceled.');
    args.onCancel?.(e);
  };

  return (
    <Popconfirm
      {...args}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    >
      <Button type="danger">Delete Task</Button>
    </Popconfirm>
  );
};

export const Basic = Template.bind({});
Basic.args = {};

export const WithDescription = Template.bind({});
WithDescription.args = {
  title: "Confirm Action",
  description: "This action cannot be undone. Are you absolutely sure?",
};

export const DifferentPlacement: StoryFn<typeof Popconfirm> = (args) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', padding: '100px' }}>
    <Popconfirm {...args} placement="topLeft" title="Delete TopLeft?"><Button>TopLeft</Button></Popconfirm>
    <Popconfirm {...args} placement="top" title="Delete Top?"><Button>Top</Button></Popconfirm>
    <Popconfirm {...args} placement="topRight" title="Delete TopRight?"><Button>TopRight</Button></Popconfirm>
    <Popconfirm {...args} placement="left" title="Delete Left?"><Button>Left</Button></Popconfirm>
    <div></div>
    <Popconfirm {...args} placement="right" title="Delete Right?"><Button>Right</Button></Popconfirm>
    <Popconfirm {...args} placement="bottomLeft" title="Delete BottomLeft?"><Button>BottomLeft</Button></Popconfirm>
    <Popconfirm {...args} placement="bottom" title="Delete Bottom?"><Button>Bottom</Button></Popconfirm>
    <Popconfirm {...args} placement="bottomRight" title="Delete BottomRight?"><Button>BottomRight</Button></Popconfirm>
  </div>
);
DifferentPlacement.args = {
  title: "Are you sure?",
  onConfirm: () => messageApi.success("Confirmed!"),
  onCancel: () => messageApi.error("Cancelled!"),
};

export const CustomButtonText = Template.bind({});
CustomButtonText.args = {
  okText: 'Proceed',
  cancelText: 'Hold Up',
  okType: 'default',
};

export const DisabledTrigger = Template.bind({});
DisabledTrigger.args = {
  title: "This won't show if button is truly disabled by Popconfirm",
  // To make Popconfirm itself disabled (preventing open):
  // disabled: true, // This would make the Popconfirm not open
  // Instead, we disable the child button for this story's purpose:
  children: <Button type="danger" disabled>Delete (Button Disabled)</Button>
};
// To test Popconfirm's disabled prop:
export const PopconfirmDisabled = Template.bind({});
PopconfirmDisabled.args = {
    title: "This Popconfirm is disabled",
    disabled: true,
};


export const NoCancelButton = Template.bind({});
NoCancelButton.args = {
  title: "This action requires confirmation. (No Cancel option)",
  showCancel: false,
  okText: "Got it!",
};


export const ControlledPopconfirm: StoryFn<typeof Popconfirm> = (args) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsOpen(false); // Close popconfirm
            messageApi.success("Action confirmed and processed!");
            args.onConfirm?.();
        }, 2000);
    };
    
    const handleCancel = () => {
        setIsOpen(false);
        args.onCancel?.();
    }

    return (
        <div>
            <Popconfirm
                {...args}
                title="Submit your request?"
                open={isOpen}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                onPopupOpenChange={setIsOpen} // Control open state
                okButtonProps={{ loading: isLoading }}
            >
                <Button type="primary">Submit Request</Button>
            </Popconfirm>
            <p style={{marginTop: 10}}>Popover is {isOpen ? 'Open' : 'Closed'}. Click button to toggle.</p>
        </div>
    );
};
ControlledPopconfirm.args = {
    // `open` is controlled by story state
    // `onConfirm` and `onCancel` are handled with loading state
};

// Note: `icon` prop can be customized with a ReactNode.
// `mouseEnterDelay`, `mouseLeaveDelay` for hover trigger (if used).
// `overlayClassName`, `overlayStyle`, `overlayInnerStyle` for styling.
// `getPopupContainer` for portal.
// Popconfirm.tsx uses ReactDOM.createPortal, which might need adjustments for SSR.
// Positioning is basic and might not handle all edge cases like Popper.js would.
// Default trigger is 'click'.
