// src/components/ui/feedback/Watermark/Watermark.stories.tsx
import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Watermark from './Watermark';

export default {
  title: 'Feedback/Watermark',
  component: Watermark,
  argTypes: {
    content: { control: 'text', defaultValue: 'Ant Design' },
    // `image` for image watermark
    rotate: { control: { type: 'number', min: -180, max: 180 }, defaultValue: -22 },
    zIndex: { control: 'number', defaultValue: 9 },
    // `font` object for font styles
    // `gap` array for gap between watermarks
    // `offset` array for initial offset
  },
} as Meta<typeof Watermark>;

const defaultContentStyle: React.CSSProperties = {
  height: '400px',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid #eee',
  background: '#f9f9f9',
};

const Template: StoryFn<typeof Watermark> = (args) => (
  <Watermark {...args}>
    <div style={defaultContentStyle}>
      <h3>Content Area</h3>
      <p>This content is covered by the watermark.</p>
      <p>Try changing props in the Storybook controls.</p>
    </div>
  </Watermark>
);

export const BasicText = Template.bind({});
BasicText.args = {};

export const MultiLineText: StoryFn<typeof Watermark> = (args) => (
    <Watermark {...args}>
        <div style={defaultContentStyle}>
            <p>This area has a multi-line watermark.</p>
        </div>
    </Watermark>
);
MultiLineText.args = {
  content: ['Confidential Document', 'Property of ACME Corp.'],
  font: { fontSize: 14, color: 'rgba(128,0,128,0.15)' }, // Purpleish
  gap: [150, 150],
  rotate: -15,
};

export const ImageWatermark: StoryFn<typeof Watermark> = (args) => (
    <Watermark {...args}>
         <div style={defaultContentStyle}>
            <p>This area has an image watermark.</p>
            <p>(Note: Image URL should be accessible and CORS-friendly if external)</p>
        </div>
    </Watermark>
);
ImageWatermark.args = {
  content: undefined, // Clear text content to show image
  image: 'https://gw.alipayobjects.com/zos/bmw-prod/59a18171-ae17-4fc5-93a0-2645f64a3aca.svg', // AntD logo
  width: 120, // Width of one watermark image tile
  height: 32, // Height of one watermark image tile
  gap: [100, 100],
  rotate: 0, // Images often not rotated or less rotated
  font: { color: 'rgba(0,0,0,0.05)'} // This color won't apply to image but is part of font prop
};

export const CustomFont = Template.bind({});
CustomFont.args = {
  content: 'Custom Font Style',
  font: {
    color: 'rgba(255, 0, 0, 0.2)',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Georgia, serif',
    fontStyle: 'italic',
  },
};

export const CustomGapAndOffset = Template.bind({});
CustomGapAndOffset.args = {
  content: 'Gap & Offset',
  gap: [50, 50], // Smaller gap
  offset: [10, 10], // Smaller offset
  rotate: 0,
};

export const FullPageWatermark: StoryFn<typeof Watermark> = (args) => (
    <Watermark 
        {...args}
        style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1001 /* Above other content */}}
    >
        {/* This watermark covers the whole page. 
            The children are optional for this use case, or can be the page content itself.
            For storybook, we'll just put a placeholder text.
        */}
        <div style={{padding: 20, textAlign: 'center', color: '#aaa'}}>
            (This Watermark covers the entire page content area of the story)
            <br/>
            <a href="#">Try clicking here</a>
        </div>
    </Watermark>
);
FullPageWatermark.args = {
    content: "COMPANY SECRET",
    font: { fontSize: 18, color: 'rgba(0,0,0,0.1)'},
    gap: [120, 120],
    rotate: -30,
};

// Note:
// - The dynamic generation of watermark using canvas and `toDataURL()` can be performance-intensive if props change frequently.
//   AntD's implementation might have optimizations or use different techniques.
// - `inherit` prop for appending watermark to parent's parent is not implemented.
// - The estimation of canvas size for text content in Watermark.tsx is very basic.
//   A robust solution would use `ctx.measureText()` for each line and consider rotation.
// - If an image URL is used, it needs to be accessible (CORS).
// - For the `image` prop, if it's a complex SVG or requires specific sizing for the watermark tile itself (not just the repetition),
//   the current implementation passes `width` and `height` to the canvas estimation, which might not be ideal for image tiling.
//   AntD might use the image's natural dimensions or scale it if `width`/`height` are provided for the tile.
//   Current simplified version uses image directly as background-image URL.
//   The `width` and `height` props in this simplified version are more for text-based watermarks to define the tile box.
//   For image, if you want to control the repeated size of the image, you'd typically use `background-size` which is not explicitly set here
//   based on width/height props for image type, but could be added. It uses natural image size for repeat.
