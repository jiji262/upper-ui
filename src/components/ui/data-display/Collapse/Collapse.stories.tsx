// src/components/ui/data-display/Collapse/Collapse.stories.tsx
import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Collapse from './Collapse';
// import CollapsePanel from './CollapsePanel'; // Use Collapse.Panel
import Icon from '../../general/Icon/Icon'; // Assuming Icon component

export default {
  title: 'Data Display/Collapse',
  component: Collapse,
  subcomponents: { Panel: (Collapse as any).Panel },
  argTypes: {
    accordion: { control: 'boolean', defaultValue: false },
    bordered: { control: 'boolean', defaultValue: true },
    ghost: { control: 'boolean', defaultValue: false },
    expandIconPosition: {
      control: { type: 'select', options: ['left', 'right'] },
      defaultValue: 'left',
    },
    // `activeKey`, `defaultActiveKey`, `onChange` controlled in stories
    // `collapsible`, `expandIcon` shown in specific stories
  },
} as Meta<typeof Collapse>;

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const Template: StoryFn<typeof Collapse> = (args) => (
  <Collapse {...args} defaultActiveKey={['1']}>
    <(Collapse as any).Panel header="This is panel header 1" key="1">
      <p>{text}</p>
    </(Collapse as any).Panel>
    <(Collapse as any).Panel header="This is panel header 2" key="2">
      <p>{text}</p>
    </(Collapse as any).Panel>
    <(Collapse as any).Panel header="This is panel header 3 (disabled)" key="3" disabled>
      <p>{text}</p>
    </(Collapse as any).Panel>
  </Collapse>
);

export const Basic = Template.bind({});
Basic.args = {};

export const AccordionMode = Template.bind({});
AccordionMode.args = {
  accordion: true,
  defaultActiveKey: '1', // For accordion, defaultActiveKey should be string or not set
};

export const Borderless = Template.bind({});
Borderless.args = {
  bordered: false,
};

export const GhostMode = Template.bind({});
GhostMode.args = {
  ghost: true,
  style: { background: '#f0f2f5', padding: '16px' } // Ghost often used on colored background
};

export const CustomExpandIcon: StoryFn<typeof Collapse> = (args) => (
  <Collapse
    {...args}
    defaultActiveKey={['1']}
    expandIcon={({ isActive }) => <Icon name={isActive ? "CaretDownOutlined" : "CaretRightOutlined"} style={{transition: 'transform 0.2s'}} />}
  >
    <(Collapse as any).Panel header="Panel with Custom Icon" key="1">
      <p>{text}</p>
    </(Collapse as any).Panel>
    <(Collapse as any).Panel header="Another Panel" key="2">
      <p>{text}</p>
    </(Collapse as any).Panel>
  </Collapse>
);
CustomExpandIcon.args = {
  expandIconPosition: 'left',
};

export const ExpandIconRight = Template.bind({});
ExpandIconRight.args = {
  expandIconPosition: 'right',
};

export const WithExtraNode: StoryFn<typeof Collapse> = (args) => (
  <Collapse {...args} defaultActiveKey={['1']}>
    <(Collapse as any).Panel header="Panel with Extra Node" key="1" extra={<Icon name="SettingOutlined" onClick={(e) => {e.stopPropagation(); alert('Settings clicked!')}}/>}>
      <p>{text}</p>
    </(Collapse as any).Panel>
    <(Collapse as any).Panel header="Normal Panel" key="2">
      <p>{text}</p>
    </(Collapse as any).Panel>
  </Collapse>
);
WithExtraNode.args = {};


export const CollapsibleArea: StoryFn<typeof Collapse> = (args) => (
    <Collapse {...args} defaultActiveKey={['1']}>
      <(Collapse as any).Panel header="Collapsible on Icon Only" key="1" collapsible="icon">
        <p>{text}</p>
      </(Collapse as any).Panel>
      <(Collapse as any).Panel header="Collapsible on Header (Default)" key="2">
        <p>{text}</p>
      </(Collapse as any).Panel>
      <(Collapse as any).Panel header="Not Collapsible (Disabled Panel)" key="3" collapsible="disabled">
        <p>{text}</p>
      </(Collapse as any).Panel>
    </Collapse>
  );
CollapsibleArea.args = {
    // `collapsible` prop is set on individual panels for this story
};


export const UsingItemsProp: StoryFn<typeof Collapse> = (args) => {
    const collapseItems = [
        {
            key: 'item1',
            header: 'This is Item 1 Header (from prop)',
            children: <p>{text}</p>,
        },
        {
            key: 'item2',
            header: 'This is Item 2 Header (from prop)',
            children: <p>{text}</p>,
            extra: <Icon name="InfoCircleOutlined" />
        },
        {
            key: 'item3',
            header: 'This is Item 3 Header (disabled, from prop)',
            children: <p>{text}</p>,
            disabled: true,
        }
    ];
    return <Collapse {...args} items={collapseItems} />;
}
UsingItemsProp.args = {
    defaultActiveKey: ['item1'],
};

export const ControlledCollapse: StoryFn<typeof Collapse> = (args) => {
    const [activeKeys, setActiveKeys] = useState<string[]>(['panel1']);

    const handleChange = (keys: string | string[]) => {
        console.log("Controlled onChange:", keys);
        setActiveKeys(Array.isArray(keys) ? keys : [keys]);
        args.onChange?.(keys);
    };

    return (
        <div>
            <p>Active Keys: {activeKeys.join(', ')}</p>
            <Button onClick={() => setActiveKeys(activeKeys.includes('panel1') ? ['panel2'] : ['panel1'])} style={{marginBottom: '10px'}}>
                Toggle Panel 1 (current active: {activeKeys.includes('panel1') ? 'Yes' : 'No'})
            </Button>
             <Button onClick={() => setActiveKeys([])} style={{marginBottom: '10px', marginLeft: '5px'}}>
                Close All
            </Button>
            <Collapse {...args} activeKey={activeKeys} onChange={handleChange}>
                <(Collapse as any).Panel header="This is panel 1" key="panel1">
                    <p>{text}</p>
                </(Collapse as any).Panel>
                <(Collapse as any).Panel header="This is panel 2" key="panel2">
                    <p>{text}</p>
                </(Collapse as any).Panel>
            </Collapse>
        </div>
    );
};
ControlledCollapse.args = {
    // `activeKey` and `onChange` are controlled by the story state.
};
