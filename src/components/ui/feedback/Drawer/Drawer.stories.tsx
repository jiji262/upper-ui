// src/components/ui/feedback/Drawer/Drawer.stories.tsx
import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Drawer from './Drawer';
import Button from '../../general/Button/Button'; // Assuming Button is available

export default {
  title: 'Feedback/Drawer',
  component: Drawer,
  argTypes: {
    open: { control: 'boolean' }, // Controlled by story state for most stories
    placement: {
      control: { type: 'select', options: ['top', 'right', 'bottom', 'left'] },
      defaultValue: 'right',
    },
    title: { control: 'text', defaultValue: 'Basic Drawer Title' },
    closable: { control: 'boolean', defaultValue: true },
    mask: { control: 'boolean', defaultValue: true },
    maskClosable: { control: 'boolean', defaultValue: true },
    width: { control: 'text', defaultValue: '378px' },
    height: { control: 'text', defaultValue: '378px' },
    // onClose action is handled by stories
  },
  parameters: {
    layout: 'fullscreen', // Drawer often interacts with the whole viewport
  },
} as Meta<typeof Drawer>;

const Template: StoryFn<typeof Drawer> = (args) => {
  const [isOpen, setIsOpen] = useState(args.open || false);

  const showDrawer = () => {
    setIsOpen(true);
    args.onClose?.({} as any); // Simulate event for action logger if needed
  };

  const handleClose = (e?: React.MouseEvent | React.KeyboardEvent) => {
    setIsOpen(false);
    args.onClose?.(e as any); // Propagate to Storybook actions
  };

  return (
    <div style={{ padding: '20px' }}>
      <Button type="primary" onClick={showDrawer}>
        Open Drawer
      </Button>
      <Drawer
        {...args}
        open={isOpen}
        onClose={handleClose}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        {args.footer === undefined && args.placement === 'bottom' && ( // Example: add default footer for bottom drawer
            <div style={{textAlign: 'right'}}>
                <Button onClick={handleClose} style={{marginRight: 8}}>Cancel</Button>
                <Button type="primary" onClick={handleClose}>OK</Button>
            </div>
        )}
      </Drawer>
    </div>
  );
};

export const BasicRight = Template.bind({});
BasicRight.args = {
  // open: false, // Initial state handled by Template's useState
};

export const PlacementLeft = Template.bind({});
PlacementLeft.args = {
  placement: 'left',
  title: 'Left Drawer',
};

export const PlacementTop = Template.bind({});
PlacementTop.args = {
  placement: 'top',
  title: 'Top Drawer',
  // height: '50vh', // Example height for top/bottom
};

export const PlacementBottom = Template.bind({});
PlacementBottom.args = {
  placement: 'bottom',
  title: 'Bottom Drawer',
  // height: 200, // Example height
};

export const NoMask = Template.bind({});
NoMask.args = {
  title: 'Drawer without Mask',
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

export const WithFooter: StoryFn<typeof Drawer> = (args) => {
    const [isOpen, setIsOpen] = useState(false);
    const showDrawer = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    return (
        <div style={{ padding: '20px' }}>
            <Button type="primary" onClick={showDrawer}>Open Drawer with Footer</Button>
            <Drawer
                {...args}
                open={isOpen}
                onClose={handleClose}
                footer={
                    <div style={{ textAlign: 'right' }}>
                        <Button onClick={handleClose} style={{ marginRight: 8 }}>
                            Cancel
                        </Button>
                        <Button type="primary" onClick={handleClose}>
                            Submit
                        </Button>
                    </div>
                }
            >
                <p>This drawer has a custom footer.</p>
                <p>Useful for forms or actions.</p>
            </Drawer>
        </div>
    );
};
WithFooter.args = {
    title: "Drawer with Footer",
};


export const CustomWidthAndHeight: StoryFn<typeof Drawer> = (args) => {
    const [openLeft, setOpenLeft] = useState(false);
    const [openTop, setOpenTop] = useState(false);
    return (
        <div style={{padding: '20px'}}>
            <Button onClick={() => setOpenLeft(true)} style={{marginRight: 10}}>Open Left (width 500px)</Button>
            <Button onClick={() => setOpenTop(true)}>Open Top (height 300px)</Button>
            <Drawer title="Custom Width Drawer" placement="left" width={500} open={openLeft} onClose={() => setOpenLeft(false)}>
                <p>This drawer has a custom width of 500px.</p>
            </Drawer>
            <Drawer title="Custom Height Drawer" placement="top" height={300} open={openTop} onClose={() => setOpenTop(false)}>
                <p>This drawer has a custom height of 300px.</p>
            </Drawer>
        </div>
    )
}
CustomWidthAndHeight.args = {};

// Note: `getContainer` for portal destination is not easily demonstrated in Storybook without specific setup.
// `keyboard` prop for Esc key is handled by useEffect in Drawer.tsx.
// `bodyStyle`, `headerStyle`, `footerStyle`, `drawerStyle`, `contentWrapperStyle` can be tested by passing style objects.
// `closeIcon` can be customized with a ReactNode.
// The Drawer is appended to document.body by default in the simplified implementation.
