// src/components/ui/data-entry/TimePicker/TimePicker.stories.tsx
import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import TimePicker from './TimePicker';

export default {
  title: 'Data Entry/TimePicker',
  component: TimePicker,
  argTypes: {
    placeholder: { control: 'text', defaultValue: 'Select time' },
    disabled: { control: 'boolean', defaultValue: false },
    allowClear: { control: 'boolean', defaultValue: true },
    format: { control: { type: 'select', options: ['HH:mm', 'HH:mm:ss'] }, defaultValue: 'HH:mm' },
    use12Hours: { control: 'boolean', defaultValue: false }, // Note: 12hr format not fully implemented in component
    hourStep: { control: { type: 'number', min: 1, max: 23 }, defaultValue: 1 },
    minuteStep: { control: { type: 'number', min: 1, max: 59 }, defaultValue: 1 },
    secondStep: { control: { type: 'number', min: 1, max: 59 }, defaultValue: 1 },
    size: {control: {type: 'select', options: ['small', 'middle', 'large']}},
    status: {control: {type: 'select', options: [undefined, 'error', 'warning']}}
    // `value`, `defaultValue`, `onChange`, `open`, `onOpenChange` are controlled in stories
  },
} as Meta<typeof TimePicker>;

const Template: StoryFn<typeof TimePicker> = (args) => {
  const [time, setTime] = useState<Date | null>(args.defaultValue || null);

  const handleChange = (t: Date | null, timeString: string) => {
    console.log('TimePicker onChange:', t, timeString);
    setTime(t);
    args.onChange?.(t, timeString);
  };

  return (
    <TimePicker
      {...args}
      value={args.value !== undefined ? args.value : time}
      onChange={handleChange}
    />
  );
};

export const Basic = Template.bind({});
Basic.args = {};

export const DefaultValue: StoryFn<typeof TimePicker> = (args) => {
    const defaultT = new Date();
    defaultT.setHours(14, 30, 0); // 2:30 PM
    return <TimePicker {...args} defaultValue={defaultT} />;
};
DefaultValue.args = {};


export const FormatHHMMSS = Template.bind({});
FormatHHMMSS.args = {
  format: 'HH:mm:ss',
  defaultValue: (() => { const d = new Date(); d.setHours(10, 20, 30); return d; })(),
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  defaultValue: (() => { const d = new Date(); d.setHours(12,0,0); return d; })(),
};

export const AllowClear = Template.bind({});
AllowClear.args = {
  allowClear: true,
  defaultValue: (() => { const d = new Date(); d.setHours(11,15,0); return d; })(),
};

export const WithSteps = Template.bind({});
WithSteps.args = {
  hourStep: 2,
  minuteStep: 15,
  secondStep: 10, // Will only apply if format is HH:mm:ss
  format: 'HH:mm:ss',
  placeholder: 'Stepped time',
};

export const DisabledOptions: StoryFn<typeof TimePicker> = (args) => (
    <TimePicker
      {...args}
      disabledHours={() => [0, 1, 2, 3, 4, 5, 22, 23]} // Disable early morning/late night
      disabledMinutes={(selectedHour) => (selectedHour === 9 ? [0, 5, 10, 50, 55] : [])}
      disabledSeconds={(selectedHour, selectedMinute) => (selectedHour === 10 && selectedMinute === 30 ? Array.from({length: 50}, (_,i)=> i+5) : [])} // Disable 05-54 seconds for 10:30
    />
);
DisabledOptions.args = {
    format: 'HH:mm:ss',
    defaultValue: (() => { const d = new Date(); d.setHours(9,30,0); return d; })(),
};


export const WithStatus: StoryFn<typeof TimePicker> = (args) => (
    <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
        <TimePicker {...args} status="error" placeholder="Error status" />
        <TimePicker {...args} status="warning" placeholder="Warning status" />
    </div>
);
WithStatus.args = {};

export const DifferentSizes: StoryFn<typeof TimePicker> = (args) => (
    <div style={{display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start'}}>
        <TimePicker {...args} size="small" placeholder="Small" />
        <TimePicker {...args} size="middle" placeholder="Middle (Default)" />
        <TimePicker {...args} size="large" placeholder="Large" />
    </div>
);
DifferentSizes.args = {};


export const ControlledOpenPanel: StoryFn<typeof TimePicker> = (args) => {
    const [open, setOpen] = useState(false);
    const [time, setTime] = useState<Date|null>(null);

    return (
        <div>
            <button onClick={() => setOpen(!open)} style={{marginBottom: '10px'}}>
                {open ? 'Close' : 'Open'} Time Panel
            </button>
            <TimePicker 
                {...args}
                open={open}
                onOpenChange={setOpen}
                value={time}
                onChange={(t, ts) => setTime(t)}
            />
        </div>
    )
}
ControlledOpenPanel.args = {};

// Note: `use12Hours` would require significant changes to formatting, parsing, and panel UI.
// `renderExtraFooter`, `popupClassName`, `popupStyle`, `placement` are also not demonstrated
// as the current simplified panel is basic.
