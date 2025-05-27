// src/components/ui/data-entry/Mentions/Mentions.stories.tsx
import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Mentions, { MentionOption } from './Mentions';

const defaultMentionOptions: MentionOption[] = [
  { value: 'afc163', label: 'afc163' },
  { value: 'zombieJ', label: 'zombieJ' },
  { value: 'yesmeck', label: 'yesmeck' },
  { value: 'react-component', label: 'react-component' },
];

export default {
  title: 'Data Entry/Mentions',
  component: Mentions,
  argTypes: {
    placeholder: { control: 'text', defaultValue: 'Type @ to mention' },
    prefix: { control: 'text', defaultValue: '@' }, // Storybook control for single prefix
    // options is complex, defined in story
    placement: { control: { type: 'select', options: ['top', 'bottom'] }, defaultValue: 'bottom' },
    autoSize: { control: 'boolean', defaultValue: false },
    // status: { control: { type: 'select', options: [undefined, 'error', 'warning'] } },
  },
} as Meta<typeof Mentions>;

const Template: StoryFn<typeof Mentions> = (args) => {
  const [value, setValue] = useState(args.defaultValue || '');

  const handleChange = (text: string) => {
    console.log('Mentions onChange:', text);
    setValue(text);
    args.onChange?.(text);
  };

  const handleSelect = (option: MentionOption, selectedPrefix: string) => {
    console.log('Mentions onSelect:', option, selectedPrefix);
    args.onSelect?.(option, selectedPrefix);
  };

  return (
    <Mentions
      {...args}
      value={value}
      onChange={handleChange}
      onSelect={handleSelect}
      options={defaultMentionOptions} // Default options for basic story
      style={{ width: '300px', ...args.style }}
    />
  );
};

export const Basic = Template.bind({});
Basic.args = {};

export const MultiplePrefixes: StoryFn<typeof Mentions> = (args) => {
    const [value, setValue] = useState('');
    const mentionOptionsWithPrefix: MentionOption[] = [
        { value: 'issue-123', label: 'Issue 123 (#)', prefix: '#' },
        { value: 'feature-request', label: 'Feature Request (#)', prefix: '#' },
        { value: 'important-user', label: 'Important User (@)', prefix: '@' },
        { value: 'team-alpha', label: 'Team Alpha (@)', prefix: '@'},
    ];

    const [currentOptions, setCurrentOptions] = useState<MentionOption[]>([]);

    const handleSearch = (text: string, searchPrefix: string) => {
        console.log("Searching for", text, "with prefix", searchPrefix);
        const filtered = mentionOptionsWithPrefix.filter(opt => 
            opt.prefix === searchPrefix && 
            opt.value.toLowerCase().includes(text.toLowerCase())
        );
        setCurrentOptions(filtered);
    };
    
    // This simplified story doesn't use onSearch from Mentions directly for filtering,
    // but Mentions.tsx's internal filtering will work with options prop.
    // A more complex story might pass a dynamic `options` prop based on search.

    return (
        <Mentions
            {...args}
            value={value}
            onChange={setValue}
            prefix={['@', '#']}
            options={mentionOptionsWithPrefix} // Pass all, let internal filter work
            // For a more dynamic scenario where options change based on prefix:
            // onSearch={handleSearch} // Mentions doesn't have onSearch that provides prefix
            // Instead, filter options passed to Mentions based on current prefix if needed.
            // For this story, Mentions internal filter will handle based on typed query.
            placeholder="Type @ or #"
            style={{ width: '400px' }}
        />
    );
};
MultiplePrefixes.args = {};


export const CustomNotFound = Template.bind({});
CustomNotFound.args = {
  notFoundContent: 'No user found with that name.',
  placeholder: 'Try typing "@unknown"',
};

export const AutoSize: StoryFn<typeof Mentions> = (args) => (
    <Mentions 
        {...args} 
        defaultValue="This textarea will auto-size based on content. @mention someone."
        options={defaultMentionOptions}
    />
);
AutoSize.args = {
  autoSize: { minRows: 2, maxRows: 6 },
};

export const ReadOnlyMode: StoryFn<typeof Mentions> = (args) => (
    <Mentions
        {...args}
        value="This is a read-only mention of @afc163 and #issue-123."
        readOnly // Pass readOnly from TextAreaProps
    />
);
ReadOnlyMode.args = {};

export const DisabledMode: StoryFn<typeof Mentions> = (args) => (
    <Mentions
        {...args}
        defaultValue="This is a disabled mention of @zombieJ."
        disabled
    />
);
DisabledMode.args = {};


// Note: `validateSearch`, `filterOption` (function), `getPopupContainer` are harder to demo visually in Storybook
// without more complex interactions or specific test setups.
// `status` would depend on Textarea component supporting it.
// `autoFocus` applies on load.
// `placement` 'top' might need specific viewport context in story.
// The popup positioning in the current Mentions.tsx is very basic and might not work well for 'top' placement
// without a proper popper.js-like utility.
