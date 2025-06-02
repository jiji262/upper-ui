// src/components/ui/layout/Layout/Layout.stories.tsx
import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Layout from './Layout';
import Header from './Header';
import Content from './Content';
import Footer from './Footer';
import Sider from './Sider';
import Icon from '../../general/Icon'; // Assuming Icon component is available

export default {
  title: 'Layout/Layout',
  component: Layout,
  subcomponents: { Header, Content, Footer, Sider },
  parameters: {
    layout: 'fullscreen', // Often better for layout components
  },
} as Meta<typeof Layout>;

const commonStyle: React.CSSProperties = {
  textAlign: 'center',
  lineHeight: 'normal', // Reset line height if needed
  color: 'white',
};

const headerStyle: React.CSSProperties = {
  ...commonStyle,
  backgroundColor: '#7dbcea',
  height: '64px',
  lineHeight: '64px',
  paddingInline: '50px',
};

const contentStyle: React.CSSProperties = {
  ...commonStyle,
  backgroundColor: '#108ee9',
  minHeight: '120px',
  lineHeight: '120px',
};

const siderStyle: React.CSSProperties = {
  ...commonStyle,
  backgroundColor: '#3ba0e9',
  lineHeight: '120px', // Example, adjust as needed
};

const footerStyle: React.CSSProperties = {
  ...commonStyle,
  backgroundColor: '#7dbcea',
  height: '64px',
  lineHeight: '64px',
};

export const Basic: StoryFn<typeof Layout> = (args) => (
  <Layout {...args} style={{ minHeight: '300px' }}>
    <Header style={headerStyle}>Header</Header>
    <Content style={contentStyle}>Content</Content>
    <Footer style={footerStyle}>Footer</Footer>
  </Layout>
);
Basic.args = {};

export const WithSider: StoryFn<typeof Layout> = (args) => (
  <Layout {...args} style={{ minHeight: '400px' }} hasSider>
    <Sider style={siderStyle} width={200}>Sider</Sider>
    <Layout>
      <Header style={headerStyle}>Header</Header>
      <Content style={contentStyle}>Content</Content>
      <Footer style={footerStyle}>Footer</Footer>
    </Layout>
  </Layout>
);
WithSider.args = {};

export const WithSiderRight: StoryFn<typeof Layout> = (args) => (
  <Layout {...args} style={{ minHeight: '400px' }} hasSider>
    <Layout>
      <Header style={headerStyle}>Header</Header>
      <Content style={contentStyle}>Content</Content>
      <Footer style={footerStyle}>Footer</Footer>
    </Layout>
    <Sider style={{ ...siderStyle, backgroundColor: '#1890ff' }} width={200}>Sider Right</Sider>
  </Layout>
);
WithSiderRight.args = {};


export const HeaderContentFooterSider: StoryFn<typeof Layout> = (args) => (
  <Layout {...args} style={{ minHeight: '500px' }} hasSider>
    <Header style={headerStyle}>Header</Header>
    <Layout hasSider>
        <Sider style={siderStyle} width="25%">Sider</Sider>
        <Content style={contentStyle}>Content</Content>
    </Layout>
    <Footer style={footerStyle}>Footer</Footer>
  </Layout>
);
HeaderContentFooterSider.args = {};


export const CollapsibleSider: StoryFn<typeof Layout> = (args) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout {...args} style={{ minHeight: '400px' }} hasSider>
      <Sider
        style={siderStyle}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        // Example using Icon component for trigger (if available and works like antd icons)
        // trigger={collapsed ? <Icon name="MenuUnfoldOutlined" /> : <Icon name="MenuFoldOutlined" />}
      >
        {!collapsed && "Collapsible Sider"}
        {collapsed && <Icon name="HomeOutlined" style={{color: 'white', fontSize: '24px', margin: '16px 0'}} />}
      </Sider>
      <Layout>
        <Header style={headerStyle}>Header</Header>
        <Content style={contentStyle}>
          Content
          <button onClick={() => setCollapsed(!collapsed)} style={{ marginLeft: 16, color: 'black'}}>
            Toggle Sider
          </button>
        </Content>
        <Footer style={footerStyle}>Footer</Footer>
      </Layout>
    </Layout>
  );
};
CollapsibleSider.args = {};

export const ResponsiveSider: StoryFn<typeof Layout> = (args) => {
    return (
      <Layout {...args} style={{ minHeight: '400px' }} hasSider>
        <Sider
          style={siderStyle}
          breakpoint="lg" // Collapse if screen width is less than lg (992px)
          collapsedWidth="0" // Example: Sider disappears on collapse
          onCollapse={(collapsed, type) => {
            console.log('Sider collapsed:', collapsed, type);
          }}
        >
          Responsive Sider (collapses below lg, disappears if collapsedWidth is 0)
        </Sider>
        <Layout>
          <Header style={headerStyle}>Header</Header>
          <Content style={contentStyle}>Content</Content>
          <Footer style={footerStyle}>Footer</Footer>
        </Layout>
      </Layout>
    );
  };
ResponsiveSider.args = {};

export const CustomTriggerSider: StoryFn<typeof Layout> = (args) => {
    const [collapsed, setCollapsed] = useState(false);
    return (
      <Layout {...args} style={{ minHeight: '400px' }} hasSider>
        <Sider
          style={siderStyle}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          trigger={<div style={{ color: 'white', padding: '8px', cursor: 'pointer', backgroundColor: 'rgba(0,0,0,0.2)'}}>
            {collapsed ? "Expand" : "Collapse"}
          </div>}
        >
          Sider with Custom Trigger
        </Sider>
        <Layout>
          <Header style={headerStyle}>Header</Header>
          <Content style={contentStyle}>Content</Content>
          <Footer style={footerStyle}>Footer</Footer>
        </Layout>
      </Layout>
    );
};
CustomTriggerSider.args = {};

export const SiderTheme: StoryFn<typeof Layout> = (args) => (
    <Layout {...args} style={{ minHeight: '400px' }} hasSider>
      <Sider style={siderStyle} theme="light" width={200}>Light Sider</Sider>
      <Layout>
        <Header style={headerStyle}>Header</Header>
        <Content style={contentStyle}>Content</Content>
        <Footer style={footerStyle}>Footer</Footer>
      </Layout>
    </Layout>
  );
SiderTheme.args = {};
