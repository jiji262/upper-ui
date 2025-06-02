// src/components/ui/data-display/Descriptions/Descriptions.stories.tsx
import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Descriptions from './Descriptions';
// import DescriptionsItem from './DescriptionsItem'; // Use Descriptions.Item

export default {
  title: 'Data Display/Descriptions',
  component: Descriptions,
  subcomponents: { Item: (Descriptions as any).Item },
  argTypes: {
    title: { control: 'text', defaultValue: 'User Details' },
    bordered: { control: 'boolean', defaultValue: false },
    layout: {
      control: { type: 'select', options: ['horizontal', 'vertical'] },
      defaultValue: 'horizontal',
    },
    size: {
      control: { type: 'select', options: ['default', 'middle', 'small'] },
      defaultValue: 'default',
    },
    colon: { control: 'boolean', defaultValue: true },
    // `column` can be complex (responsive object), shown in specific story
    // `items` prop is an alternative to children, shown in specific story
  },
} as Meta<typeof Descriptions>;

const Template: StoryFn<typeof Descriptions> = (args) => (
  <Descriptions {...args}>
    <(Descriptions as any).Item label="Product">Cloud Database</(Descriptions as any).Item>
    <(Descriptions as any).Item label="Billing Mode">Prepaid</(Descriptions as any).Item>
    <(Descriptions as any).Item label="Automatic Renewal">YES</(Descriptions as any).Item>
    <(Descriptions as any).Item label="Order time">2018-04-24 18:00:00</(Descriptions as any).Item>
    <(Descriptions as any).Item label="Usage Time" span={2}>
      2019-04-24 18:00:00 to 2020-04-24 18:00:00
    </(Descriptions as any).Item>
    <(Descriptions as any).Item label="Status" span={3}>
      <span style={{color: 'green'}}>Running</span>
    </(Descriptions as any).Item>
    <(Descriptions as any).Item label="Negotiated Amount">$80.00</(Descriptions as any).Item>
    <(Descriptions as any).Item label="Discount">$20.00</(Descriptions as any).Item>
    <(Descriptions as any).Item label="Official Receipts">$60.00</(Descriptions as any).Item>
    <(Descriptions as any).Item label="Config Info">
      Data disk type: MongoDB
      <br />
      Database version: 3.4
      <br />
      Package: dds.mongo.mid
      <br />
      Storage space: 10 GB
      <br />
      Replication factor: 3
      <br />
      Region: East China 1
      <br />
    </(Descriptions as any).Item>
  </Descriptions>
);

export const Basic = Template.bind({});
Basic.args = {};

export const Bordered = Template.bind({});
Bordered.args = {
  bordered: true,
  title: 'User Info (Bordered)',
};

export const VerticalLayout = Template.bind({});
VerticalLayout.args = {
  layout: 'vertical',
  title: 'User Info (Vertical)',
};

export const VerticalBordered = Template.bind({});
VerticalBordered.args = {
  layout: 'vertical',
  bordered: true,
  title: 'User Info (Vertical, Bordered)',
};

export const SmallSize = Template.bind({});
SmallSize.args = {
  size: 'small',
  title: 'User Info (Small)',
  bordered: true, // Bordered looks better with small size
};

export const MiddleSize = Template.bind({});
MiddleSize.args = {
  size: 'middle',
  title: 'User Info (Middle)',
  bordered: true,
};


export const WithExtraNode = Template.bind({});
WithExtraNode.args = {
  title: 'Service Details',
  extra: <button onClick={() => alert('Edit clicked!')}>Edit</button>,
  bordered: true,
};

export const ResponsiveColumns: StoryFn<typeof Descriptions> = (args) => (
    <Descriptions {...args}>
        <(Descriptions as any).Item label="Username">Zhou Maomao</(Descriptions as any).Item>
        <(Descriptions as any).Item label="Telephone">1810000000</(Descriptions as any).Item>
        <(Descriptions as any).Item label="Live">Hangzhou, Zhejiang</(Descriptions as any).Item>
        <(Descriptions as any).Item label="Address" span={args.layout === 'vertical' ? undefined : 2}>
            No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
        </(Descriptions as any).Item>
        <(Descriptions as any).Item label="Remark">Empty</(Descriptions as any).Item>
    </Descriptions>
);
ResponsiveColumns.args = {
    title: "Responsive Columns",
    bordered: true,
    column: { xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 },
};


export const UsingItemsProp: StoryFn<typeof Descriptions> = (args) => {
    const descriptionItems = [
        { key: '1', label: 'User Name (from prop)', children: 'Lin Dongdong' },
        { key: '2', label: 'Contact Number (from prop)', children: '17600000000' },
        { key: '3', label: 'Residence (from prop)', children: 'Beijing' },
        { key: '4', label: 'Address (from prop)', children: 'Chaoyang District, Beijing', span: 2 },
        { key: '5', label: 'Postal Code (from prop)', children: '100000' },
    ];
    return <Descriptions {...args} items={descriptionItems} />;
};
UsingItemsProp.args = {
    title: "Details from Items Prop",
    bordered: true,
};
