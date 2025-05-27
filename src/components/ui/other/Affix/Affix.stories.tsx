// src/components/ui/other/Affix/Affix.stories.tsx
import React, { useRef } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Affix from './Affix';
import Button from '../../general/Button/Button'; // Assuming Button is available

export default {
  title: 'Other/Affix',
  component: Affix,
  argTypes: {
    offsetTop: { control: 'number', defaultValue: 0 },
    offsetBottom: { control: 'number' },
    // `target` prop is complex, shown in a specific story if possible
    onChange: { action: 'changed' },
  },
  parameters: {
    layout: 'fullscreen', // Affix often interacts with page scroll
  },
} as Meta<typeof Affix>;

const Template: StoryFn<typeof Affix> = (args) => (
  <div style={{ height: '200vh', paddingTop: '50px' }}> {/* Scrollable container */}
    <p>Scroll down to see the button affix.</p>
    <Affix {...args}>
      <Button type="primary">Affixed Button</Button>
    </Affix>
    <p style={{ marginTop: '20px' }}>Some more content below the affix placeholder.</p>
  </div>
);

export const AffixTop = Template.bind({});
AffixTop.args = {
  offsetTop: 20, // Affix 20px from the top of viewport
};

export const AffixBottom: StoryFn<typeof Affix> = (args) => (
  <div style={{ height: '200vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
    <div>
        <p>Scroll down. The button will affix to the bottom.</p>
        <p>... more content ...</p>
        {Array.from({length: 30}).map((_, i) => <p key={i}>Line {i+1}</p>)}
    </div>
    <Affix {...args}>
      <Button type="primary" style={{padding: '10px 20px'}}>Affixed to Bottom</Button>
    </Affix>
    <p>Content above footer/bottom affix target.</p>
  </div>
);
AffixBottom.args = {
  offsetBottom: 20, // Affix 20px from the bottom of viewport
};


export const AffixToScrollableContainer: StoryFn<typeof Affix> = (args) => {
  const scrollableContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div style={{ padding: '20px' }}>
      <p>The Affix component below will stick to the top of the scrollable blue container.</p>
      <div 
        ref={scrollableContainerRef} 
        style={{ 
            height: '300px', 
            overflowY: 'auto', 
            border: '2px solid blue', 
            marginTop: '20px',
            position: 'relative', // Important for target offset calculation
        }}
      >
        <div style={{ height: '100px', background: '#f0f0f0', padding: 10 }}>
            Top content in scrollable area.
        </div>
        <Affix {...args} target={() => scrollableContainerRef.current}>
          <Button type="default" style={{background: 'lightblue'}}>Affixed within Blue Container</Button>
        </Affix>
        <div style={{ height: '600px', paddingTop: '20px', background: '#e6e6e6' }}>
          <p>Scrollable content...</p>
          <p>More content...</p>
          <p>Even more content...</p>
          <p>...</p>
          <p>End of scrollable content.</p>
        </div>
      </div>
    </div>
  );
};
AffixToScrollableContainer.args = {
  offsetTop: 10, // Affix 10px from the top of the scrollable container
};

export const WithOnChangeCallback = Template.bind({});
WithOnChangeCallback.args = {
  offsetTop: 50,
  onChange: (affixed) => {
    console.log('Affix state changed:', affixed);
    // Could show a message or update UI based on affix state
    // For storybook, this will appear in the "Actions" tab.
  },
};

// Note: The current Affix.tsx implementation for `offsetBottom` with a target element
// might need refinement for precise positioning, as calculating bottom offset relative to a
// scrollable container's viewport is more complex than for the window.
// The `targetIsWindow` logic helps, but specific offsets within a container's scroll
// might behave differently from AntD's version without more complex calculations or a ResizeObserver.
// The placeholder div logic helps maintain layout space.Okay, I've created `Affix.tsx` and its Storybook stories. Now I'll create the `index.ts` file for the Affix component.
