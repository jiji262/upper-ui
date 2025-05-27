// src/components/ui/data-entry/Slider/Slider.stories.tsx
import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Slider from './Slider';

export default {
  title: 'Data Entry/Slider',
  component: Slider,
  argTypes: {
    min: { control: 'number', defaultValue: 0 },
    max: { control: 'number', defaultValue: 100 },
    step: { control: 'number', defaultValue: 1 },
    disabled: { control: 'boolean', defaultValue: false },
    range: { control: 'boolean', defaultValue: false },
    vertical: { control: 'boolean', defaultValue: false },
    reverse: { control: 'boolean', defaultValue: false },
    dots: { control: 'boolean', defaultValue: false },
    included: { control: 'boolean', defaultValue: true },
    // `marks` and `tooltip` are complex, shown in specific stories
  },
} as Meta<typeof Slider>;

const Template: StoryFn<typeof Slider> = (args) => {
  const [value, setValue] = useState<number | [number, number]>(
    args.defaultValue !== undefined ? args.defaultValue : (args.range ? [20, 50] : 30)
  );

  const handleChange = (newValue: number | [number, number]) => {
    console.log('Slider onChange:', newValue);
    setValue(newValue);
    args.onChange?.(newValue);
  };
  
  const handleAfterChange = (newValue: number | [number, number]) => {
    console.log('Slider onAfterChange:', newValue);
    args.onAfterChange?.(newValue);
  };

  return (
    <div style={args.vertical ? { height: 300, margin: '20px' } : { margin: '20px' }}>
      <Slider
        {...args}
        value={args.value !== undefined ? args.value : value}
        onChange={handleChange}
        onAfterChange={handleAfterChange}
      />
    </div>
  );
};

export const Basic = Template.bind({});
Basic.args = {
  defaultValue: 30,
};

export const RangeSlider = Template.bind({});
RangeSlider.args = {
  range: true,
  defaultValue: [20, 50],
};

export const WithStep = Template.bind({});
WithStep.args = {
  step: 10,
  defaultValue: 30,
};

export const StepNullContinuous = Template.bind({});
StepNullContinuous.args = {
  step: null, // Continuous
  defaultValue: 25.5,
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  defaultValue: 40,
};

export const VerticalSlider = Template.bind({});
VerticalSlider.args = {
  vertical: true,
  defaultValue: 30,
};

export const VerticalRange = Template.bind({});
VerticalRange.args = {
  vertical: true,
  range: true,
  defaultValue: [20, 60],
};

export const WithDots = Template.bind({});
WithDots.args = {
  dots: true,
  step: 10,
  defaultValue: 30,
};

export const WithMarks: StoryFn<typeof Slider> = (args) => (
    <div style={{margin: '40px 20px'}}> {/* Extra margin for marks */}
         <Slider {...args} />
    </div>
);
WithMarks.args = {
  marks: {
    0: '0°C',
    26: '26°C',
    37: '37°C',
    100: {
      style: { color: '#f50' },
      label: <strong>100°C</strong>,
    },
  },
  defaultValue: 37,
};

export const ReverseSlider = Template.bind({});
ReverseSlider.args = {
  reverse: true,
  defaultValue: 30,
};

export const ReverseRange = Template.bind({});
ReverseRange.args = {
  range: true,
  reverse: true,
  defaultValue: [20,50]
};


export const TooltipVisibility: StoryFn<typeof Slider> = (args) => {
    const [value, setValue] = useState<number | [number,number]>(args.range ? [10,30] : 20);
    return (
        <div style={args.vertical ? { height: 300, margin: '30px' } : { margin: '30px' }}>
            <Slider 
                {...args}
                value={value}
                onChange={setValue}
            />
        </div>
    );
}
TooltipVisibility.args = {
    tooltip: { 
        open: true, // Always show tooltip
        formatter: (val) => `${val}%`
    },
    defaultValue: 25,
};

export const NoTooltip: StoryFn<typeof Slider> = (args) => {
    const [value, setValue] = useState<number | [number,number]>(args.range ? [10,30] : 20);
    return (
        <div style={args.vertical ? { height: 300, margin: '30px' } : { margin: '30px' }}>
            <Slider 
                {...args}
                value={value}
                onChange={setValue}
            />
        </div>
    );
}
NoTooltip.args = {
    tooltip: { 
        formatter: null // Disable tooltip
    },
    defaultValue: 25,
};


export const NotIncludedTrack = Template.bind({});
NotIncludedTrack.args = {
  included: false,
  defaultValue: 30,
};

export const NotIncludedRangeTrack = Template.bind({});
NotIncludedRangeTrack.args = {
  range: true,
  included: false,
  defaultValue: [20,50],
};
