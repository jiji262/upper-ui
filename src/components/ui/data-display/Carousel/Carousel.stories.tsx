// src/components/ui/data-display/Carousel/Carousel.stories.tsx
import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Carousel from './Carousel';
import Icon from '../../general/Icon'; // Assuming Icon is available for custom arrows

const contentStyle: React.CSSProperties = {
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
  overflow: 'hidden', // Ensure content doesn't spill
};

export default {
  title: 'Data Display/Carousel',
  component: Carousel,
  argTypes: {
    autoplay: { control: 'boolean', defaultValue: false },
    dots: { control: 'boolean', defaultValue: true },
    arrows: { control: 'boolean', defaultValue: false },
    dotPosition: {
      control: { type: 'select', options: ['top', 'bottom', 'left', 'right'] },
      defaultValue: 'bottom',
    },
    effect: {
      control: { type: 'select', options: ['scrollx', 'fade'] },
      defaultValue: 'scrollx',
    },
    autoplaySpeed: { control: 'number', defaultValue: 3000 },
    speed: { control: 'number', defaultValue: 500 },
    initialSlide: { control: 'number', defaultValue: 0 },
  },
} as Meta<typeof Carousel>;

const Template: StoryFn<typeof Carousel> = (args) => (
  <Carousel {...args}>
    <div><h3 style={contentStyle}>Slide 1</h3></div>
    <div><h3 style={contentStyle}>Slide 2</h3></div>
    <div><h3 style={{...contentStyle, background: '#5270a3'}}>Slide 3</h3></div>
    <div><h3 style={{...contentStyle, background: '#2a3f6a'}}>Slide 4</h3></div>
  </Carousel>
);

export const Basic = Template.bind({});
Basic.args = {};

export const Autoplay = Template.bind({});
Autoplay.args = {
  autoplay: true,
};

export const FadeEffect = Template.bind({});
FadeEffect.args = {
  effect: 'fade',
  autoplay: true,
};

export const WithArrows = Template.bind({});
WithArrows.args = {
  arrows: true,
  dots: false, // Often hide dots if arrows are prominent
};

export const CustomArrows: StoryFn<typeof Carousel> = (args) => (
    <Carousel
      {...args}
      prevArrow={<button className="custom-slick-arrow"><Icon name="LeftCircleFilled" style={{fontSize: '20px'}} /></button>}
      nextArrow={<button className="custom-slick-arrow"><Icon name="RightCircleFilled" style={{fontSize: '20px'}} /></button>}
    >
      <div><h3 style={contentStyle}>1</h3></div>
      <div><h3 style={contentStyle}>2</h3></div>
      <div><h3 style={{...contentStyle, background: '#5270a3'}}>3</h3></div>
    </Carousel>
  );
CustomArrows.args = {
    arrows: true, // Enable arrows to show custom ones
    dots: true,
};


export const DotPositionTop = Template.bind({});
DotPositionTop.args = {
  dotPosition: 'top',
};

// Note: DotPosition 'left' or 'right' requires significant CSS changes for vertical dots,
// which are not fully implemented in the simplified Carousel.css. This story might not look correct.
export const DotPositionLeft: StoryFn<typeof Carousel> = (args) => (
    <div style={{height: '160px'}}> {/* Ensure container has height for vertical dots */}
        <Carousel {...args}>
            <div><h3 style={contentStyle}>Slide A</h3></div>
            <div><h3 style={contentStyle}>Slide B</h3></div>
            <div><h3 style={{...contentStyle, background: '#5270a3'}}>Slide C</h3></div>
        </Carousel>
    </div>
);
DotPositionLeft.args = {
  dotPosition: 'left',
};

export const InitialSlide: StoryFn<typeof Carousel> = (args) => (
    <Carousel {...args}>
        <div><h3 style={{...contentStyle, background: '#7890cd'}}>Slide Alpha (Index 0)</h3></div>
        <div><h3 style={contentStyle}>Slide Beta (Index 1)</h3></div>
        <div><h3 style={{...contentStyle, background: '#5270a3'}}>Slide Gamma (Index 2)</h3></div>
    </Carousel>
);
InitialSlide.args = {
    initialSlide: 1, // Start on "Slide Beta"
};
