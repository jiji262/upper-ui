// src/components/ui/data-display/Popover/Popover.stories.tsx
import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Popover from './Popover';
import Button from '../../general/Button/Button'; // Assuming Button is available

export default {
  title: 'Data Display/Popover',
  component: Popover,
  argTypes: {
    title: { control: 'text', defaultValue: 'Popover Title' },
    // `content` is complex, defined in stories
    trigger: {
      control: { type: 'select', options: ['hover', 'click', 'focus', 'contextMenu'] },
      defaultValue: 'hover',
    },
    placement: {
      control: {
        type: 'select',
        options: ['top', 'left', 'right', 'bottom', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight', 'leftTop', 'leftBottom', 'rightTop', 'rightBottom'],
      },
      defaultValue: 'top',
    },
    // `open`, `onOpenChange` controlled in stories
  },
} as Meta<typeof Popover>;

const defaultContent = (
  <div>
    <p>Content line 1</p>
    <p>Content line 2</p>
  </div>
);

const Template: StoryFn<typeof Popover> = (args) => (
  <div style={{ padding: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
    <Popover {...args} content={args.content || defaultContent}>
      <Button type="primary">
        {Array.isArray(args.trigger) ? args.trigger.join('/') : args.trigger} me
      </Button>
    </Popover>
  </div>
);

export const Basic = Template.bind({});
Basic.args = {};

export const ClickTrigger = Template.bind({});
ClickTrigger.args = {
  trigger: 'click',
  title: 'Click Popover',
};

export const FocusTrigger: StoryFn<typeof Popover> = (args) => (
    <div style={{ padding: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
      <Popover {...args} content={args.content || defaultContent}>
        <input type="text" defaultValue="Focus me" style={{padding: '5px 10px'}} />
      </Popover>
    </div>
  );
FocusTrigger.args = {
    trigger: 'focus',
    title: 'Focus Popover',
};


export const NoTitle = Template.bind({});
NoTitle.args = {
  title: undefined, // No title
  content: <p>This popover has no title.</p>,
};

export const DifferentPlacements: StoryFn<typeof Popover> = (args) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', padding: '100px' }}>
    <Popover {...args} placement="topLeft" title="TopLeft" content="Content for TopLeft">
      <Button>TopLeft</Button>
    </Popover>
    <Popover {...args} placement="top" title="Top" content="Content for Top">
      <Button>Top</Button>
    </Popover>
    <Popover {...args} placement="topRight" title="TopRight" content="Content for TopRight">
      <Button>TopRight</Button>
    </Popover>
    <Popover {...args} placement="leftTop" title="LeftTop" content="Content for LeftTop">
      <Button>LeftTop</Button>
    </Popover>
    <div></div> {/* Placeholder for center */}
    <Popover {...args} placement="rightTop" title="RightTop" content="Content for RightTop">
      <Button>RightTop</Button>
    </Popover>
    <Popover {...args} placement="left" title="Left" content="Content for Left">
      <Button>Left</Button>
    </Popover>
     <div></div> {/* Placeholder for center */}
    <Popover {...args} placement="right" title="Right" content="Content for Right">
      <Button>Right</Button>
    </Popover>
     <Popover {...args} placement="leftBottom" title="LeftBottom" content="Content for LeftBottom">
      <Button>LeftBottom</Button>
    </Popover>
     <div></div> {/* Placeholder for center */}
    <Popover {...args} placement="rightBottom" title="RightBottom" content="Content for RightBottom">
      <Button>RightBottom</Button>
    </Popover>
    <Popover {...args} placement="bottomLeft" title="BottomLeft" content="Content for BottomLeft">
      <Button>BottomLeft</Button>
    </Popover>
    <Popover {...args} placement="bottom" title="Bottom" content="Content for Bottom">
      <Button>Bottom</Button>
    </Popover>
    <Popover {...args} placement="bottomRight" title="BottomRight" content="Content for BottomRight">
      <Button>BottomRight</Button>
    </Popover>
  </div>
);
DifferentPlacements.args = {
  trigger: 'click', // Use click for easier testing of placements
};


export const ControlledPopover: StoryFn<typeof Popover> = (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div style={{ padding: '50px' }}>
            <Button onClick={() => setIsOpen(!isOpen)} style={{marginRight: '20px'}}>
                {isOpen ? 'Close Popover' : 'Open Popover'}
            </Button>
            <Popover
                {...args}
                content="This is a controlled popover."
                title="Controlled Title"
                open={isOpen}
                onOpenChange={setIsOpen} // AntD 5.x uses onOpenChange
            >
                <Button type="dashed">Reference Element</Button>
            </Popover>
        </div>
    );
};
ControlledPopover.args = {
    trigger: 'click', // Usually controlled popovers don't rely on trigger prop for visibility
};

// Note: `mouseEnterDelay`, `mouseLeaveDelay` affect hover trigger.
// `overlayClassName`, `overlayStyle`, `overlayInnerStyle` for custom styling.
// `getPopupContainer` for portal destination.
// `color` and advanced `arrow` props are not in this simplified version.
// The Popover.tsx has a basic ReactDOM.createPortal which might not be ideal for SSR or complex scenarios.
// A robust solution often uses a dedicated Portal component or library.
// The positioning logic in Popover.tsx is very basic and won't handle all edge cases or viewport collisions like Popper.js.
