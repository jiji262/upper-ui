// src/components/ui/data-display/Image/Image.stories.tsx
import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Image from './Image';
import Icon from '../../general/Icon/Icon'; // Assuming Icon is available for placeholder

export default {
  title: 'Data Display/Image',
  component: Image,
  argTypes: {
    src: { control: 'text', defaultValue: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
    width: { control: 'text', defaultValue: '200px' },
    height: { control: 'text', defaultValue: '200px' },
    alt: { control: 'text', defaultValue: 'Ant Design Image' },
    preview: { control: 'boolean', defaultValue: true },
    // `fallback`, `placeholder` are shown in specific stories
  },
} as Meta<typeof Image>;

const Template: StoryFn<typeof Image> = (args) => <Image {...args} />;

export const Basic = Template.bind({});
Basic.args = {};

export const CustomSize = Template.bind({});
CustomSize.args = {
  width: 100,
  height: 150,
  src: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  alt: 'SVG Image',
};

export const NoPreview = Template.bind({});
NoPreview.args = {
  preview: false,
  src: 'https://via.placeholder.com/150/771796/FFFFFF?Text=NoPreview',
};

export const FallbackOnError: StoryFn<typeof Image> = (args) => (
    <Image {...args} />
);
FallbackOnError.args = {
    src: "https://example.com/non-existent-image.jpg", // This will cause an error
    fallback: "https://via.placeholder.com/150/FF0000/FFFFFF?Text=Error+Fallback",
    alt: "Image with Fallback",
    width: 150,
    height: 150,
};

export const WithPlaceholder: StoryFn<typeof Image> = (args) => (
    <Image {...args} />
);
WithPlaceholder.args = {
    src: "https://example.com/another-non-existent-image.jpg", // Error
    // No fallback, so placeholder should show
    placeholder: (
        <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e0e0e0'}}>
            <Icon name="SyncOutlined" spin style={{fontSize: '24px', color: '#888'}}/>
            <span style={{marginTop: '8px', fontSize: '12px', color: '#888'}}>Loading Custom...</span>
        </div>
    ),
    width: 150,
    height: 150,
    alt: "Image with custom placeholder",
};

export const NoSrcProvided: StoryFn<typeof Image> = (args) => (
    <Image {...args} />
);
NoSrcProvided.args = {
    src: undefined, // No source
    placeholder: "No image source",
    width: 150,
    height: 150,
    alt: "Image with no source",
};


export const CustomPreviewMask: StoryFn<typeof Image> = (args) => (
    <Image
        {...args}
        preview={{
            mask: <span style={{color: 'white', fontSize: '16px'}}>🔍 Preview</span>
        }}
    />
);
CustomPreviewMask.args = {
    src: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    width: 200,
    height: 200,
};

// Note: The simplified preview in Image.tsx is a basic overlay.
// AntD's full preview includes a modal, toolbar with zoom/rotate, etc.
// `preview.visible`, `preview.onVisibleChange`, `preview.getContainer`, `preview.src`
// are part of more advanced preview control not fully implemented in the simplified version.
