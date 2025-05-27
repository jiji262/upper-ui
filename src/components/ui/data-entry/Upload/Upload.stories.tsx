// src/components/ui/data-entry/Upload/Upload.stories.tsx
import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Upload, { UploadFile, RcFile } from './Upload';
import Button from '../Button/Button'; // Assuming Button is available
import Icon from '../../general/Icon'; // Assuming Icon is available

export default {
  title: 'Data Entry/Upload',
  component: Upload,
  argTypes: {
    disabled: { control: 'boolean', defaultValue: false },
    multiple: { control: 'boolean', defaultValue: false },
    accept: { control: 'text', defaultValue: '' },
    listType: {
      control: { type: 'select', options: ['text', 'picture', 'picture-card'] },
      defaultValue: 'text',
    },
    // `fileList`, `defaultFileList`, `onChange` are controlled in stories
    // `action` is mocked, no real upload
  },
} as Meta<typeof Upload>;

const Template: StoryFn<typeof Upload> = (args) => {
  const [fileList, setFileList] = useState<UploadFile[]>(args.defaultFileList || []);

  const handleChange = (info: { file: UploadFile; fileList: UploadFile[] }) => {
    console.log('Upload onChange:', info.file.name, info.file.status, info.fileList);
    // For this story, let Upload component manage its internal fileList via defaultFileList
    // If controlled, then: setFileList([...info.fileList]);
    // For mock, just log. The internal mock upload will update status.
    // To make it controlled in story:
    if (args.fileList !== undefined) { // If story is trying to control fileList
        setFileList([...info.fileList]);
    }
    args.onChange?.(info);
  };

  const handleRemove = (file: UploadFile): boolean => {
    console.log('Upload onRemove:', file.name);
    // If controlled:
    // setFileList(prevList => prevList.filter(f => f.uid !== file.uid));
    args.onRemove?.(file);
    return true; // Allow removal
  };

  return (
    <Upload
      {...args}
      fileList={args.fileList !== undefined ? fileList : undefined} // Pass fileList if story controls it
      defaultFileList={args.fileList === undefined ? fileList : undefined} // Or defaultFileList
      onChange={handleChange}
      onRemove={handleRemove}
      action="https://mock.upload.url/api/upload" // Mock action URL
    />
  );
};

export const Basic = Template.bind({});
Basic.args = {
    defaultFileList: [
        { uid: '-1', name: 'existing-file.png', status: 'done', url: '#' },
    ]
};

export const MultipleFiles = Template.bind({});
MultipleFiles.args = {
  multiple: true,
  defaultFileList: [
    { uid: '-1', name: 'image.png', status: 'done', url: '#', thumbUrl: 'https://via.placeholder.com/150/0000FF/808080?Text=Image1' },
    { uid: '-2', name: 'document.pdf', status: 'done', url: '#' },
  ]
};

export const PictureList = Template.bind({});
PictureList.args = {
  listType: 'picture',
  accept: 'image/*',
  defaultFileList: [
    { uid: '-1', name: 'pic1.png', status: 'done', url: '#', thumbUrl: 'https://via.placeholder.com/60x60/00FF00/FFFFFF?Text=Pic1' },
    { uid: '-2', name: 'pic2.jpg', status: 'error', error: {message: 'Server Error 500'}, url: '#', thumbUrl: 'https://via.placeholder.com/60x60/FF0000/FFFFFF?Text=Pic2' },
  ],
};

export const PictureCard: StoryFn<typeof Upload> = (args) => {
    const [fileList, setFileList] = useState<UploadFile[]>([
        { uid: '-1', name: 'card-image1.png', status: 'done', url: '#', thumbUrl: 'https://via.placeholder.com/100x100/0000FF/FFFFFF?Text=Card1' },
        { uid: '-2', name: 'card-image2.png', status: 'uploading', percent: 50, url: '#', thumbUrl: 'https://via.placeholder.com/100x100/00FFFF/000000?Text=Load...' },

    ]);
    const handleChange = (info: { file: UploadFile; fileList: UploadFile[] }) => {
        setFileList([...info.fileList]); // Controlled for picture-card to manage adding new upload slots
        args.onChange?.(info);
    };
    const uploadButton = (
        <div>
          <Icon name="PlusOutlined" />
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    return (
        <Upload
            {...args}
            fileList={fileList}
            onChange={handleChange}
            action="https://mock.upload.url/api/upload"
        >
            {fileList.length >= 3 ? null : uploadButton} {/* Max 3 files for demo */}
        </Upload>
    );
};
PictureCard.args = {
  listType: 'picture-card',
  accept: 'image/*',
};


export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  defaultFileList: [
    { uid: '-1', name: 'disabled-upload.txt', status: 'done', url: '#' },
  ],
};

export const CustomTrigger: StoryFn<typeof Upload> = (args) => (
  <Upload {...args} action="https://mock.upload.url/api/upload">
    <Button icon={<Icon name="PaperClipOutlined" />}>Attach File</Button>
    <span style={{marginLeft: 8, color: '#888'}}>(Click button to select)</span>
  </Upload>
);
CustomTrigger.args = {
    showUploadList: true,
    listType: 'text',
};

export const BeforeUploadCheck: StoryFn<typeof Upload> = (args) => {
    const handleBeforeUpload = (file: RcFile) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          alert('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          alert('Image must smaller than 2MB!');
        }
        const canUpload = isJpgOrPng && isLt2M;
        if (canUpload) {
            console.log("File allowed:", file.name);
        } else {
            console.log("File rejected:", file.name);
        }
        return canUpload || Upload.LIST_IGNORE; // Upload.LIST_IGNORE to prevent adding to list
                                                // For this simplified version, just return boolean
    };
    return <Upload {...args} beforeUpload={handleBeforeUpload} />;
};
BeforeUploadCheck.args = {
    accept: 'image/*',
    children: <Button icon={<Icon name="UploadOutlined"/>}>Upload JPG/PNG less than 2MB</Button>
};

// Note: `action` as a function, `headers`, `data`, `name`, `onPreview` (requires modal),
// `customRequest` are more advanced features.
// The mock upload in Upload.tsx simulates progress and success/error.
// `showUploadList` object with custom icons is also possible.
// `onScroll` is for lists with many items.
