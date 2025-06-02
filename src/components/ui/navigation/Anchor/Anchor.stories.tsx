// src/components/ui/navigation/Anchor/Anchor.stories.tsx
import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Anchor from './Anchor';
import AnchorLink from './AnchorLink'; // Import AnchorLink

// Helper to create dummy sections for scrolling
const DummySection: React.FC<{ id: string; title: string; style?: React.CSSProperties }> = ({ id, title, style }) => (
  <div
    id={id}
    style={{
      height: '600px',
      padding: '20px',
      borderBottom: '1px solid #eee',
      backgroundColor: '#f9f9f9',
      ...style,
    }}
  >
    <h2>{title}</h2>
    <p>Scroll down to see other sections and the anchor behavior.</p>
  </div>
);

export default {
  title: 'Navigation/Anchor',
  component: Anchor,
  subcomponents: { AnchorLink },
  parameters: {
    layout: 'fullscreen', // Anchor often works with full page scroll
  },
  argTypes: {
    affix: { control: 'boolean', defaultValue: true },
    offsetTop: { control: 'number', defaultValue: 0 },
    targetOffset: { control: 'number', defaultValue: 0 },
    direction: { control: {type: 'select', options: ['vertical', 'horizontal']}, defaultValue: 'vertical'},
    // items prop can be complex, so we'll primarily use children for stories
  },
} as Meta<typeof Anchor>;

const Template: StoryFn<typeof Anchor> = (args) => (
  <div style={{ display: 'flex', flexDirection: args.direction === 'horizontal' ? 'column' : 'row' }}>
    <div style={args.direction === 'horizontal' ? {width: '100%', order: 1} : {width: '200px', order: 2, position: 'relative'}}>
      <Anchor {...args}>
        <Anchor.Link href="#section-1" title="Section 1: Introduction" />
        <Anchor.Link href="#section-2" title="Section 2: Features">
          <Anchor.Link href="#subsection-2-1" title="Subsection 2.1: Feature A" />
          <Anchor.Link href="#subsection-2-2" title="Subsection 2.2: Feature B" />
        </Anchor.Link>
        <Anchor.Link href="#section-3" title="Section 3: Conclusion" />
        <Anchor.Link href="#non-existent-section" title="Non-Existent Section" />
      </Anchor>
    </div>
    <div style={{ flex: 1, overflow: 'auto', height: args.direction === 'horizontal' ? 'calc(100vh - 80px)' : '100vh', order: args.direction === 'horizontal' ? 2 : 1 }}>
      <DummySection id="section-1" title="Section 1: Introduction" />
      <DummySection id="section-2" title="Section 2: Features" style={{ backgroundColor: '#e9f7fe' }} />
      <DummySection id="subsection-2-1" title="Subsection 2.1: Feature A" style={{ height: '300px', backgroundColor: '#dcf0fa' }} />
      <DummySection id="subsection-2-2" title="Subsection 2.2: Feature B" style={{ height: '300px', backgroundColor: '#dcf0fa' }} />
      <DummySection id="section-3" title="Section 3: Conclusion" />
    </div>
  </div>
);

export const DefaultVertical = Template.bind({});
DefaultVertical.args = {};

export const NonAffixed = Template.bind({});
NonAffixed.args = {
  affix: false,
};

export const WithOffsetTop: StoryFn<typeof Anchor> = (args) => (
    <>
      <div style={{ height: `${args.offsetTop}px`, background: 'lightblue', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10, textAlign: 'center', lineHeight: `${args.offsetTop}px`}}>
        Fixed Header ({args.offsetTop}px)
      </div>
      <div style={{ display: 'flex', paddingTop: `${args.offsetTop}px` }}>
        <div style={{width: '200px', position: 'relative'}}>
          <Anchor {...args} /*offsetTop is for anchor itself, targetOffset for scroll position */ >
            <Anchor.Link href="#section-1-offset" title="Section 1" />
            <Anchor.Link href="#section-2-offset" title="Section 2" />
            <Anchor.Link href="#section-3-offset" title="Section 3" />
          </Anchor>
        </div>
        <div style={{ flex: 1, overflow: 'auto', height: `calc(100vh - ${args.offsetTop}px)` }}>
          <DummySection id="section-1-offset" title="Section 1 with Offset" />
          <DummySection id="section-2-offset" title="Section 2 with Offset" style={{ backgroundColor: '#e9f7fe' }} />
          <DummySection id="section-3-offset" title="Section 3 with Offset" />
        </div>
      </div>
    </>
);
WithOffsetTop.args = {
  offsetTop: 60, // For the fixed header
  targetOffset: 60, // For scroll calculation to account for fixed header
  affix: true,
};


export const HorizontalAnchor: StoryFn<typeof Anchor> = (args) => (
    <div style={{ width: '100%' }}>
      <Anchor {...args} style={{padding: '10px 0', borderBottom: '1px solid #f0f0f0', background: 'white'}}>
        <Anchor.Link href="#h-section-1" title="Horizontal Section 1" />
        <Anchor.Link href="#h-section-2" title="Horizontal Section 2" />
        <Anchor.Link href="#h-section-3" title="Horizontal Section 3" />
      </Anchor>
      <div style={{ overflow: 'auto', height: 'calc(100vh - 100px)', // Assuming anchor + some padding is 100px
        scrollSnapType: 'y mandatory' // Optional: for demo purposes
    }}>
        <DummySection id="h-section-1" title="Horizontal Target Section 1" style={{scrollSnapAlign: 'start'}}/>
        <DummySection id="h-section-2" title="Horizontal Target Section 2" style={{ backgroundColor: '#e9f7fe', scrollSnapAlign: 'start' }} />
        <DummySection id="h-section-3" title="Horizontal Target Section 3" style={{scrollSnapAlign: 'start'}} />
      </div>
    </div>
  );
HorizontalAnchor.args = {
    direction: 'horizontal',
    affix: true, // Affix might behave differently for horizontal, ensure CSS supports it
    offsetTop: 0, // If there's a fixed header above the horizontal anchor
    targetOffset: 10, // Small offset for visual clarity
};

export const UsingItemsProp: StoryFn<typeof Anchor> = (args) => (
    <div style={{ display: 'flex' }}>
      <div style={{width: '200px', position: 'relative'}}>
        <Anchor {...args} />
      </div>
      <div style={{ flex: 1, overflow: 'auto', height: '100vh' }}>
        <DummySection id="item-1" title="Item 1" />
        <DummySection id="item-2" title="Item 2" style={{ backgroundColor: '#e9f7fe' }} />
        <DummySection id="sub-item-2-1" title="Sub Item 2.1" style={{ height: '300px', backgroundColor: '#dcf0fa' }} />
        <DummySection id="item-3" title="Item 3" />
      </div>
    </div>
);
UsingItemsProp.args = {
    items: [
        { href: '#item-1', title: 'Item 1 (via prop)' },
        { href: '#item-2', title: 'Item 2 (via prop)', children: [
            { href: '#sub-item-2-1', title: 'Sub Item 2.1' }
        ]},
        { href: '#item-3', title: 'Item 3 (via prop)' },
    ],
    offsetTop: 0,
    targetOffset: 0,
};

// Note: `container` prop is hard to demonstrate in Storybook iframe unless specific DOM structure is set up.
// `getCurrentAnchor`, `onClick`, `onChange` are event handlers/callbacks and can be tested via action logs.
// `showInkInFixed` is a visual detail.
// `replace` prop affects browser history.Okay, I've created `AnchorLink.tsx`, `Anchor.tsx`, and `Anchor.stories.tsx`. Now I'll create the `index.ts` file for the Anchor component.
