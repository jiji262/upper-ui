// src/components/ui/data-entry/AutoComplete/AutoComplete.stories.tsx
import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import AutoComplete, { AutoCompleteOption } from './AutoComplete';
// Assuming a basic Input component or mock is available if AutoComplete depends on a custom one.
// import Input from '../Input/Input'; // If needed for composition or specific props

export default {
  title: 'Data Entry/AutoComplete',
  component: AutoComplete,
  argTypes: {
    placeholder: { control: 'text', defaultValue: 'Enter text here' },
    disabled: { control: 'boolean', defaultValue: false },
    allowClear: { control: 'boolean', defaultValue: true },
    // `options` can be complex, so it's defined in stories.
    // `filterOption` can also be complex.
    status: { control: {type: 'select', options: [undefined, 'error', 'warning']}}
  },
} as Meta<typeof AutoComplete>;

const defaultOptions: AutoCompleteOption[] = [
  { value: 'Burns Bay Road' },
  { value: 'Downing Street' },
  { value: 'Wall Street' },
];

const Template: StoryFn<typeof AutoComplete> = (args) => {
  const [value, setValue] = useState(args.value || '');
  const [options, setOptions] = useState<AutoCompleteOption[]>(defaultOptions);

  const handleSearch = (searchText: string) => {
    if (!searchText) {
      setOptions(defaultOptions);
    } else {
      setOptions([
        { value: searchText },
        { value: searchText + searchText },
        { value: searchText + searchText + searchText },
        ...defaultOptions.filter(opt => opt.value.toLowerCase().includes(searchText.toLowerCase()))
      ]);
    }
  };

  const handleSelect = (selectedValue: string, option: AutoCompleteOption) => {
    console.log('onSelect', selectedValue, option);
    setValue(selectedValue); // Update local state on select
    args.onSelect?.(selectedValue, option);
  };

  const handleChange = (currentValue: string) => {
    console.log('onChange', currentValue);
    setValue(currentValue); // Update local state on input change
    args.onChange?.(currentValue);
  };

  return (
    <AutoComplete
      {...args}
      options={options}
      value={value}
      onSearch={handleSearch}
      onSelect={handleSelect}
      onChange={handleChange}
      style={{ width: 200, ...args.style }}
    />
  );
};

export const Basic = Template.bind({});
Basic.args = {
  placeholder: 'Basic AutoComplete',
};

export const CustomFiltering: StoryFn<typeof AutoComplete> = (args) => {
  const optionsWithLabels: AutoCompleteOption[] = [
    { value: 'apple', label: 'Apple 🍎' },
    { value: 'banana', label: 'Banana 🍌' },
    { value: 'cherry', label: 'Cherry 🍒' },
    { value: 'date', label: 'Date 📅' },
  ];
  
  const [value, setValue] = useState('');

  return (
    <AutoComplete
      {...args}
      options={optionsWithLabels}
      value={value}
      onChange={setValue}
      filterOption={(inputValue, option) =>
        option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1 ||
        (option!.label && typeof option!.label === 'string' && option!.label.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1)
      }
      placeholder="Type 'Apple' or 'Banana'"
      style={{ width: 300 }}
    />
  );
};
CustomFiltering.args = {};


export const AllowClear = Template.bind({});
AllowClear.args = {
  allowClear: true,
  placeholder: 'Type and try to clear',
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  value: 'Disabled value',
};

export const WithStatus: StoryFn<typeof AutoComplete> = (args) => (
    <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
        <AutoComplete {...args} status="error" placeholder="Error status" value="Error content"/>
        <AutoComplete {...args} status="warning" placeholder="Warning status" value="Warning content"/>
    </div>
);
WithStatus.args = {
    options: [{value: "Error content"}, {value: "Warning content"}, {value: "Option A"}]
};

export const NotFound: StoryFn<typeof AutoComplete> = (args) => (
    <AutoComplete
      {...args}
      options={[{value: "FixedOption"}]} // Only one option
      filterOption={(inputValue, option) => option!.value.toLowerCase().includes(inputValue.toLowerCase())}
      notFoundContent="Sorry, nothing found!"
      placeholder="Type something not 'FixedOption'"
      style={{ width: 250 }}
    />
);
NotFound.args = {};

// Note: `backfill`, `defaultActiveFirstOption`, `dropdownClassName`, `dropdownMatchSelectWidth`, `dropdownStyle`
// are harder to visually test in simple stories without more complex interaction recording or visual testing tools.
// `open` and `onDropdownVisibleChange` are for controlled open state.
// `autoFocus` works on page load.
// `onSearch` is used in the default Template.
// `InputProps` like `prefix`, `suffix` would be passed down if AutoComplete's internal Input supports them.
// This story assumes a basic Input. If the actual Input from '../Input/Input' is more complex,
// stories might need to be adjusted or that Input component needs to be available.
