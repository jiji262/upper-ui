// src/components/ui/data-entry/DatePicker/DatePicker.stories.tsx
import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import DatePicker from './DatePicker';

export default {
  title: 'Data Entry/DatePicker',
  component: DatePicker,
  argTypes: {
    placeholder: { control: 'text', defaultValue: 'Select date' },
    disabled: { control: 'boolean', defaultValue: false },
    allowClear: { control: 'boolean', defaultValue: true },
    format: { control: 'text', defaultValue: 'YYYY-MM-DD' },
    picker: { control: {type: 'select', options: ['date', 'week', 'month', 'year']}, defaultValue: 'date'},
    size: {control: {type: 'select', options: ['small', 'middle', 'large']}},
    status: {control: {type: 'select', options: [undefined, 'error', 'warning']}}
    // `value`, `defaultValue`, `onChange`, `open`, `onOpenChange` are controlled in stories
  },
} as Meta<typeof DatePicker>;

const Template: StoryFn<typeof DatePicker> = (args) => {
  // For controlled component in story, if needed, otherwise DatePicker handles its own state
  const [date, setDate] = useState<Date | null>(args.defaultValue || null);

  const handleChange = (d: Date | null, dateString: string) => {
    console.log('DatePicker onChange:', d, dateString);
    setDate(d); // Update local story state
    args.onChange?.(d, dateString); // Propagate to Storybook actions
  };

  return (
    <DatePicker
      {...args}
      value={args.value !== undefined ? args.value : date} // Prefer controlled value from args if provided
      onChange={handleChange}
    />
  );
};

export const Basic = Template.bind({});
Basic.args = {};

export const DefaultValue = Template.bind({});
DefaultValue.args = {
  defaultValue: new Date(), // Today
};

export const Formatted = Template.bind({});
Formatted.args = {
  format: 'DD/MM/YYYY',
  placeholder: 'DD/MM/YYYY',
  defaultValue: new Date('2023-10-25'), // Provide a specific date for consistent story
};

export const AllowClear = Template.bind({});
AllowClear.args = {
  allowClear: true,
  defaultValue: new Date(),
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  defaultValue: new Date(),
};

export const WithStatus: StoryFn<typeof DatePicker> = (args) => (
    <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
        <DatePicker {...args} status="error" placeholder="Error status" defaultValue={new Date()} />
        <DatePicker {...args} status="warning" placeholder="Warning status" defaultValue={new Date()} />
    </div>
);
WithStatus.args = {};

export const DifferentSizes: StoryFn<typeof DatePicker> = (args) => (
    <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
        <DatePicker {...args} size="small" placeholder="Small" defaultValue={new Date()} />
        <DatePicker {...args} size="middle" placeholder="Middle (Default)" defaultValue={new Date()} />
        <DatePicker {...args} size="large" placeholder="Large" defaultValue={new Date()} />
    </div>
);
DifferentSizes.args = {};


export const ControlledOpen: StoryFn<typeof DatePicker> = (args) => {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date|null>(new Date());

    return (
        <div>
            <button onClick={() => setOpen(!open)} style={{marginBottom: '10px'}}>
                {open ? 'Close' : 'Open'} Picker
            </button>
            <DatePicker 
                {...args}
                open={open}
                onOpenChange={setOpen}
                value={date}
                onChange={(d, ds) => setDate(d)}
            />
        </div>
    )
}
ControlledOpen.args = {};

// Picker types other than 'date' (week, month, year) would require more complex UI in the popup,
// which is beyond the scope of this simplified DatePicker.
// The `renderCalendarPopup` prop could be used to inject a more complex calendar.

export const CustomCalendarPopup: StoryFn<typeof DatePicker> = (args) => (
    <DatePicker
      {...args}
      renderCalendarPopup={(currentDate, onSelectDate) => (
        <div style={{ padding: '20px', border: '1px solid #ccc', background: '#fff' }}>
          <h4>Custom Calendar Area</h4>
          <p>Current selected: {currentDate ? formatDate(currentDate, 'YYYY-MM-DD') : 'None'}</p>
          <button onClick={() => onSelectDate(new Date(2024, 0, 15))}>Select Jan 15, 2024</button>
          <button onClick={() => onSelectDate(new Date(2024, 4, 20))}>Select May 20, 2024</button>
        </div>
      )}
    />
);
CustomCalendarPopup.args = {
    defaultValue: new Date('2024-01-15'),
};
