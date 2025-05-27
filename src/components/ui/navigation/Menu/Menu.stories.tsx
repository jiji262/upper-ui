// src/components/ui/navigation/Menu/Menu.stories.tsx
import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Menu from './Menu';
// Import subcomponents if you need to refer to their types or for specific story setups,
// but typically you'd use Menu.Item, Menu.SubMenu etc. from the Menu export.
// import MenuItem from './MenuItem';
// import SubMenu from './SubMenu';
// import ItemGroup from './ItemGroup';
// import MenuDivider from './MenuDivider';
import Icon from '../../general/Icon'; // Assuming Icon component is available

export default {
  title: 'Navigation/Menu',
  component: Menu,
  argTypes: {
    mode: {
      control: { type: 'select', options: ['vertical', 'horizontal', 'inline'] },
      defaultValue: 'vertical',
    },
    theme: {
      control: { type: 'select', options: ['light', 'dark'] },
      defaultValue: 'light',
    },
    inlineCollapsed: {
      control: 'boolean',
      defaultValue: false,
    },
    // selectedKeys, openKeys are controlled internally by stories for demonstration
  },
} as Meta<typeof Menu>;

const Template: StoryFn<typeof Menu> = (args) => {
  const [selectedKeys, setSelectedKeys] = useState(['1']);
  const [openKeys, setOpenKeys] = useState<string[]>(['sub1']);

  const handleSelect = (info: { key: string; selectedKeys: string[] }) => {
    console.log('Selected:', info);
    setSelectedKeys(info.selectedKeys);
  };

  const handleOpenChange = (keys: string[]) => {
    console.log('Open Changed:', keys);
    setOpenKeys(keys);
  };

  return (
    <Menu
      {...args}
      selectedKeys={selectedKeys}
      openKeys={openKeys}
      onSelect={handleSelect}
      onOpenChange={handleOpenChange}
      style={{ width: args.mode === 'inline' && args.inlineCollapsed ? 'auto' : 256, ...args.style }}
    >
      <Menu.Item key="1" icon={<Icon name="MailOutlined" />}>
        Navigation One
      </Menu.Item>
      <Menu.Item key="2" icon={<Icon name="AppstoreOutlined" />} disabled>
        Navigation Two (Disabled)
      </Menu.Item>
      <Menu.SubMenu key="sub1" icon={<Icon name="SettingOutlined" />} title="Navigation Three - Submenu">
        <Menu.ItemGroup title="Item Group 1">
          <Menu.Item key="3">Option 3</Menu.Item>
          <Menu.Item key="4">Option 4</Menu.Item>
        </Menu.ItemGroup>
        <Menu.SubMenu key="sub1-2" title="Submenu Level 2">
          <Menu.Item key="5">Option 5</Menu.Item>
          <Menu.Item key="6">Option 6</Menu.Item>
        </Menu.SubMenu>
      </Menu.SubMenu>
      <Menu.Divider />
      <Menu.Item key="7" danger>
        Navigation Four (Danger)
      </Menu.Item>
       <Menu.SubMenu key="sub2" icon={<Icon name="AppstoreAddOutlined" />} title="Navigation Five - Another Submenu">
          <Menu.Item key="8">Option 8</Menu.Item>
          <Menu.Item key="9">Option 9</Menu.Item>
          <Menu.Item key="10">Option 10</Menu.Item>
      </Menu.SubMenu>
    </Menu>
  );
};

export const VerticalMenu = Template.bind({});
VerticalMenu.args = {
  mode: 'vertical',
};

export const HorizontalMenu: StoryFn<typeof Menu> = (args) => {
    const [selectedKeys, setSelectedKeys] = useState(['mail']);
    return (
        <Menu 
            {...args} 
            selectedKeys={selectedKeys} 
            onSelect={({key, selectedKeys}) => setSelectedKeys(selectedKeys || [])}
            style={{ borderBottom: 'none', ...args.style }} // Remove bottom border for horizontal
        >
            <Menu.Item key="mail" icon={<Icon name="MailOutlined" />}>
            Navigation One
            </Menu.Item>
            <Menu.Item key="app" icon={<Icon name="AppstoreOutlined" />}>
            Navigation Two
            </Menu.Item>
            <Menu.SubMenu key="SubMenu" icon={<Icon name="SettingOutlined" />} title="Navigation Three - Submenu">
                <Menu.ItemGroup title="Item 1">
                    <Menu.Item key="setting:1">Option 1</Menu.Item>
                    <Menu.Item key="setting:2">Option 2</Menu.Item>
                </Menu.ItemGroup>
                <Menu.ItemGroup title="Item 2">
                    <Menu.Item key="setting:3">Option 3</Menu.Item>
                    <Menu.Item key="setting:4">Option 4</Menu.Item>
                </Menu.ItemGroup>
            </Menu.SubMenu>
            <Menu.Item key="alipay">
                <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
                    Navigation Four - Link
                </a>
            </Menu.Item>
        </Menu>
    );
};
HorizontalMenu.args = {
  mode: 'horizontal',
  theme: 'light',
};

export const InlineMenu = Template.bind({});
InlineMenu.args = {
  mode: 'inline',
  defaultOpenKeys: ['sub1'], // Default open for inline example
};

export const DarkThemeMenu = Template.bind({});
DarkThemeMenu.args = {
  mode: 'inline', // Or vertical
  theme: 'dark',
  defaultOpenKeys: ['sub1'],
};

export const InlineCollapsedMenu: StoryFn<typeof Menu> = (args) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(['1']);
  const [openKeys, setOpenKeys] = useState<string[]>([]);


  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    if (collapsed) { // If was collapsed, now opening, restore openKeys if needed
        // setOpenKeys(['sub1']); // Example: auto-open a default submenu
    } else { // If was open, now collapsing, clear openKeys
        setOpenKeys([]);
    }
  };

  return (
    <div style={{ width: 256 }}>
      <button onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
        <Icon name={collapsed ? "MenuUnfoldOutlined" : "MenuFoldOutlined"} />
      </button>
      <Menu
        {...args}
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onSelect={({key, selectedKeys}) => setSelectedKeys(selectedKeys || [])}
        onOpenChange={(keys) => setOpenKeys(keys)}
        inlineCollapsed={collapsed}
      >
        <Menu.Item key="1" icon={<Icon name="PieChartOutlined" />} title="Option 1">
          Option 1
        </Menu.Item>
        <Menu.Item key="2" icon={<Icon name="DesktopOutlined" />} title="Option 2">
          Option 2
        </Menu.Item>
        <Menu.Item key="3" icon={<Icon name="ContainerOutlined" />} title="Option 3">
          Option 3
        </Menu.Item>
        <Menu.SubMenu key="sub1" icon={<Icon name="MailOutlined" />} title="Navigation One">
          <Menu.Item key="5">Option 5</Menu.Item>
          <Menu.Item key="6">Option 6</Menu.Item>
          <Menu.Item key="7">Option 7</Menu.Item>
          <Menu.Item key="8">Option 8</Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu key="sub2" icon={<Icon name="AppstoreOutlined" />} title="Navigation Two">
          <Menu.Item key="9">Option 9</Menu.Item>
          <Menu.Item key="10">Option 10</Menu.Item>
          <Menu.SubMenu key="sub3" title="Submenu">
            <Menu.Item key="11">Option 11</Menu.Item>
            <Menu.Item key="12">Option 12</Menu.Item>
          </Menu.SubMenu>
        </Menu.SubMenu>
      </Menu>
    </div>
  );
};
InlineCollapsedMenu.args = {
  mode: 'inline',
  theme: 'light',
};

// Example using `items` prop (AntD 4.20.0+)
const menuItems = [
    { key: '1', icon: <Icon name="MailOutlined" />, label: 'Navigation One (Items Prop)' },
    { key: '2', icon: <Icon name="CalendarOutlined" />, label: 'Navigation Two (Items Prop)', disabled: true },
    {
      key: 'sub1',
      label: 'Navigation Three - Submenu (Items Prop)',
      icon: <Icon name="AppstoreOutlined" />,
      children: [
        { type: 'group', label: 'Item Group 1', children: [ // 'group' type for ItemGroup
            { key: 'setting:1', label: 'Option 1' },
            { key: 'setting:2', label: 'Option 2' },
        ]},
        { type: 'divider' }, // 'divider' type
        { key: 'sub1-2', label: 'Submenu Level 2', children: [
            { key: 'setting:3', label: 'Option 3' },
            { key: 'setting:4', label: 'Option 4' },
        ]},
      ],
    },
    { key: '4', icon: <Icon name="SettingOutlined" />, label: 'Navigation Four (Items Prop)', danger: true },
];


export const FromItemsProp: StoryFn<typeof Menu> = (args) => {
    const [selectedKeys, setSelectedKeys] = useState(['1']);
    // This mapping from AntD's `items` structure to our components is conceptual
    // and needs to be handled within Menu.tsx
    const mapAntdItemsToMenuComponents = (items: any[]): React.ReactNode[] => {
        return items.map(item => {
            if (!item) return null;
            const { key, label, icon, children, type, disabled, danger, title } = item;
            
            if (type === 'divider') {
                return <Menu.Divider key={key || Math.random()} />;
            }
            if (type === 'group') {
                return (
                    <Menu.ItemGroup key={key || Math.random()} title={label}>
                        {children ? mapAntdItemsToMenuComponents(children) : null}
                    </Menu.ItemGroup>
                );
            }
            if (children && children.length > 0) {
                return (
                    <Menu.SubMenu key={key} title={label} icon={icon} disabled={disabled}>
                        {mapAntdItemsToMenuComponents(children)}
                    </Menu.SubMenu>
                );
            }
            return (
                <Menu.Item key={key} icon={icon} disabled={disabled} danger={danger} title={title}>
                    {label}
                </Menu.Item>
            );
        });
    };


    return (
        <Menu 
            {...args}
            // items={menuItems} // Pass items directly if Menu.tsx supports it
            selectedKeys={selectedKeys}
            onSelect={({key, selectedKeys}) => setSelectedKeys(selectedKeys || [])}
        >
            {mapAntdItemsToMenuComponents(menuItems)}
        </Menu>
    );
};
FromItemsProp.args = {
    mode: 'inline',
    // `items` prop would be used by Menu component internally.
    // Storybook controls for `items` can be complex.
};
