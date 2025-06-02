// src/components/ui/feedback/Modal/Modal.stories.tsx
import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Modal from './Modal';
import Button from '../../general/Button/Button'; // Assuming Button is available

export default {
  title: 'Feedback/Modal',
  component: Modal,
  argTypes: {
    open: { control: 'boolean' }, // Controlled by story state
    title: { control: 'text', defaultValue: 'Basic Modal Title' },
    closable: { control: 'boolean', defaultValue: true },
    mask: { control: 'boolean', defaultValue: true },
    maskClosable: { control: 'boolean', defaultValue: true },
    centered: { control: 'boolean', defaultValue: false },
    width: { control: 'text', defaultValue: '520px' },
    okText: { control: 'text', defaultValue: 'OK' },
    cancelText: { control: 'text', defaultValue: 'Cancel' },
    // onOk, onCancel actions handled by stories
    // footer can be complex, shown in specific story
  },
  parameters: {
    layout: 'fullscreen', // Modal often interacts with the whole viewport
  },
} as Meta<typeof Modal>;

const Template: StoryFn<typeof Modal> = (args) => {
  const [isOpen, setIsOpen] = useState(args.open || false);

  const showModal = () => {
    setIsOpen(true);
  };

  const handleOk = (e: React.MouseEvent<HTMLElement>) => {
    console.log('Modal OK clicked');
    setIsOpen(false);
    args.onOk?.(e);
  };

  const handleCancel = (e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLDivElement>) => {
    console.log('Modal Cancel clicked or Esc pressed');
    setIsOpen(false);
    args.onCancel?.(e);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      <Modal
        {...args}
        open={isOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </div>
  );
};

export const Basic = Template.bind({});
Basic.args = {};

export const CenteredModal = Template.bind({});
CenteredModal.args = {
  title: 'Centered Modal',
  centered: true,
};

export const CustomWidth = Template.bind({});
CustomWidth.args = {
  title: 'Modal with Custom Width (800px)',
  width: 800,
};

export const NoMask = Template.bind({});
NoMask.args = {
  title: 'Modal without Mask',
  mask: false,
};

export const NotMaskClosable = Template.bind({});
NotMaskClosable.args = {
  title: 'Not Mask Closable',
  maskClosable: false, // Click on mask will not close
};

export const NoCloseButton = Template.bind({});
NoCloseButton.args = {
  title: 'No Close Button (Mask Clickable)',
  closable: false,
  maskClosable: true,
};

export const CustomFooter: StoryFn<typeof Modal> = (args) => {
    const [isOpen, setIsOpen] = useState(false);
    const showModal = () => setIsOpen(true);
    const handleCustomOk = () => { alert('Custom OK logic!'); setIsOpen(false); };
    const handleCustomCancel = () => { setIsOpen(false); };

    return (
        <div style={{ padding: '20px' }}>
            <Button type="primary" onClick={showModal}>Open Modal with Custom Footer</Button>
            <Modal
                {...args}
                open={isOpen}
                onOk={handleCustomOk} // Still needed if default buttons in custom footer trigger it
                onCancel={handleCustomCancel}
                footer={
                    <div>
                        <Button onClick={handleCustomCancel}>Return</Button>
                        <Button type="dashed" onClick={() => alert('More Info Clicked!')} style={{margin: '0 8px'}}>More Info</Button>
                        <Button type="primary" onClick={handleCustomOk}>Submit Custom</Button>
                    </div>
                }
            >
                <p>This modal has a completely custom footer.</p>
            </Modal>
        </div>
    );
};
CustomFooter.args = {
    title: "Modal with Custom Footer",
};

export const NoFooter: StoryFn<typeof Modal> = (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div style={{ padding: '20px' }}>
            <Button type="primary" onClick={() => setIsOpen(true)}>Open Modal (No Footer)</Button>
            <Modal
                {...args}
                open={isOpen}
                onCancel={() => setIsOpen(false)} // Still need onCancel for Esc or close button
                footer={null} // Pass null to hide footer
            >
                <p>This modal has no footer.</p>
                <p>Useful for informational messages or custom content that includes its own actions.</p>
            </Modal>
        </div>
    );
};
NoFooter.args = {
    title: "Modal without Footer",
};


export const LongContent: StoryFn<typeof Modal> = (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div style={{ padding: '20px' }}>
            <Button type="primary" onClick={() => setIsOpen(true)}>Open Modal with Long Content</Button>
            <Modal
                {...args}
                open={isOpen}
                onOk={() => setIsOpen(false)}
                onCancel={() => setIsOpen(false)}
            >
                {Array.from({ length: 30 }).map((_, i) => (
                    <p key={i}>This is line number {i + 1} of some very long content to demonstrate scrolling within the modal body.</p>
                ))}
            </Modal>
        </div>
    );
};
LongContent.args = {
    title: "Modal with Scrollable Content",
};

// Note: Static functions like Modal.confirm(), Modal.success() are not part of this simplified component.
// They would typically be implemented by a top-level API that manages Modal instances.
// `keyboard` prop for Esc key is handled by useEffect in Modal.tsx.
// `bodyStyle`, `confirmLoading`, `destroyOnClose`, `zIndex`, `getContainer` can be tested by passing props.
// `wrapClassName` can be used to style the .ant-modal-wrap.
// `style` prop applies to the .ant-modal-dialog (the main modal box).
