// src/components/ui/data-display/Empty/Empty.stories.tsx
import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Empty from './Empty';
import Button from '../../general/Button/Button'; // Assuming Button is available

export default {
  title: 'Data Display/Empty',
  component: Empty,
  argTypes: {
    description: { control: 'text', defaultValue: 'No Data' },
    // `image` can be complex (ReactNode or string 'default'/'simple'), shown in specific stories
    // `imageStyle` for custom styling of the image
  },
} as Meta<typeof Empty>;

const Template: StoryFn<typeof Empty> = (args) => <Empty {...args} />;

export const Basic = Template.bind({});
Basic.args = {};

export const SimpleImage = Template.bind({});
SimpleImage.args = {
  image: 'simple',
  description: 'No items found',
};

export const CustomDescription: StoryFn<typeof Empty> = (args) => (
  <Empty {...args} />
);
CustomDescription.args = {
  description: (
    <span>
      Customize <a href="#customize">Description</a>
    </span>
  ),
};

export const CustomImage: StoryFn<typeof Empty> = (args) => (
  <Empty
    {...args}
    image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg" // Example custom image URL
    imageStyle={{ height: 60 }} // Style for the custom image if it's a URL or needs override
  />
);
CustomImage.args = {
  description: 'Data Not Available',
};

export const WithFooterContent: StoryFn<typeof Empty> = (args) => (
  <Empty {...args}>
    <Button type="primary" onClick={() => alert('Create Now Clicked!')}>Create Now</Button>
  </Empty>
);
WithFooterContent.args = {
  description: 'No data. Want to create one?',
};

export const NoDescription = Template.bind({});
NoDescription.args = {
  description: false, // AntD allows `false` to hide description
  image: 'simple',
};

export const NoImage: StoryFn<typeof Empty> = (args) => (
    <Empty {...args} image={null} /> // Pass null or undefined to hide image
);
NoImage.args = {
    description: "Content without an image, only description."
};
