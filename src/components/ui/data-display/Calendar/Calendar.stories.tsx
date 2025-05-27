// src/components/ui/data-display/Calendar/Calendar.stories.tsx
import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Calendar from './Calendar';

export default {
  title: 'Data Display/Calendar',
  component: Calendar,
  argTypes: {
    // `value`, `defaultValue`, `onChange`, `onPanelChange` are controlled in stories
    mode: { control: { type: 'select', options: ['month', 'year'] }, defaultValue: 'month' },
    // fullscreen: { control: 'boolean', defaultValue: true },
  },
} as Meta<typeof Calendar>;

const Template: StoryFn<typeof Calendar> = (args) => {
  const [value, setValue] = useState<Date | undefined>(args.defaultValue || new Date());
  const [panelDate, setPanelDate] = useState<Date>(args.defaultValue || new Date());

  const handleChange = (date: Date) => {
    console.log('Calendar onChange:', date.toLocaleDateString());
    setValue(date);
    args.onChange?.(date);
  };

  const handlePanelChange = (date: Date, mode: 'month' | 'year') => {
    console.log('Calendar onPanelChange:', date.toLocaleDateString(), mode);
    setPanelDate(date); // Update the date that controls the displayed panel
    args.onPanelChange?.(date, mode);
  };

  return (
    <Calendar
      {...args}
      value={args.value !== undefined ? args.value : value}
      // The Calendar component itself uses currentDisplayDate for panel control,
      // so we don't need to pass panelDate back into it as a prop directly here.
      // The onPanelChange story arg is for demonstrating the event.
      onChange={handleChange}
      onPanelChange={handlePanelChange}
      // Forcing a re-render if panelDate changes, which is not ideal for this story setup.
      // The internal state of Calendar (currentDisplayDate) should handle panel changes.
      // This key is a workaround for storybook if Calendar isn't fully reactive to props for panel.
      // key={panelDate.toISOString()} 
    />
  );
};

export const Basic = Template.bind({});
Basic.args = {};

export const DefaultValue = Template.bind({});
DefaultValue.args = {
  defaultValue: new Date(2024, 5, 15), // June 15, 2024
};

export const ControlledValue: StoryFn<typeof Calendar> = (args) => {
    const [date, setDate] = useState(new Date(2024, 0, 1)); // Jan 1, 2024
    const [currentMonth, setCurrentMonth] = useState(new Date(2024,0,1));

    const selectNextMonth = () => {
        const nextMonth = new Date(currentMonth);
        nextMonth.setMonth(currentMonth.getMonth() + 1);
        setCurrentMonth(nextMonth);
        // If Calendar's panel is controlled by its internal state based on value,
        // then changing value should also change panel.
        // For this story, we'll simulate external control affecting the 'value' which Calendar uses.
        // A real controlled Calendar might need a `displayDate` prop.
    }

    return (
        <div>
            <p>Selected Date: {date.toLocaleDateString()}</p>
            <p>Displayed Month: {currentMonth.getFullYear()}-{currentMonth.getMonth()+1}</p>
            <Button onClick={selectNextMonth} style={{marginBottom: '10px'}}>Show Next Month's Panel (via value)</Button>
            <Calendar 
                {...args} 
                value={date} 
                onChange={setDate}
                // The Calendar's internal currentDisplayDate should react to 'value' prop changes
                // or have a separate prop for panel control if value is only for selection.
                // For this simplified version, we'll assume `value` also influences the displayed month.
            />
        </div>
    )
}
ControlledValue.args = {};

// Note: `mode` 'year' is not implemented in the simplified Calendar.tsx.
// `fullscreen` (card mode), `validRange`, `disabledDate`, `dateCellRender`,
// `monthCellRender`, `headerRender` are more advanced features.

export const SmallContainer: StoryFn<typeof Calendar> = (args) => (
    <div style={{ width: '300px', border: '1px solid #d9d9d9', borderRadius: '8px' }}>
        <Calendar {...args} />
    </div>
);
SmallContainer.args = {
    // fullscreen: false, // This would trigger card styles if implemented
    defaultValue: new Date(),
};
