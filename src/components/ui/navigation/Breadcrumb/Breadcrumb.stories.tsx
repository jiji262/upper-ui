// src/components/ui/navigation/Breadcrumb/Breadcrumb.stories.tsx
import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Breadcrumb from './Breadcrumb';
// import BreadcrumbItem from './BreadcrumbItem'; // Not needed if using Breadcrumb.Item
import Icon from '../../general/Icon'; // Assuming Icon component is available

export default {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
  argTypes: {
    separator: {
      control: 'text',
      defaultValue: '/',
    },
    // `routes` and `itemRender` are more complex props, demonstrated in specific stories.
  },
} as Meta<typeof Breadcrumb>;

const Template: StoryFn<typeof Breadcrumb> = (args) => (
  <Breadcrumb {...args}>
    <Breadcrumb.Item>Home</Breadcrumb.Item>
    <Breadcrumb.Item href="/components">Components</Breadcrumb.Item>
    <Breadcrumb.Item>
      <a href="/navigation">Navigation</a>
    </Breadcrumb.Item>
    <Breadcrumb.Item>Breadcrumb</Breadcrumb.Item>
  </Breadcrumb>
);

export const Basic = Template.bind({});
Basic.args = {};

export const WithCustomSeparator = Template.bind({});
WithCustomSeparator.args = {
  separator: '>',
};

export const WithIcons: StoryFn<typeof Breadcrumb> = (args) => (
  <Breadcrumb {...args}>
    <Breadcrumb.Item href="/">
      <Icon name="HomeOutlined" />
    </Breadcrumb.Item>
    <Breadcrumb.Item href="/components">
      <Icon name="AppstoreOutlined" />
      <span>Components</span>
    </Breadcrumb.Item>
    <Breadcrumb.Item>
      <Icon name="LinkOutlined" />
      <span>Breadcrumb</span>
    </Breadcrumb.Item>
  </Breadcrumb>
);
WithIcons.args = {
  separator: <Icon name="RightOutlined" style={{ fontSize: '12px', margin: '0 4px' }}/>,
};


const routes: any[] = [ // Use 'any' for simplicity with story, define Route type in component
  {
    path: '/',
    breadcrumbName: 'Home',
  },
  {
    path: '/level1',
    breadcrumbName: 'Level 1',
    children: [
      {
        path: '/level1/item1',
        breadcrumbName: 'Level 1 Item 1',
      },
      {
        path: '/level1/item2',
        breadcrumbName: 'Level 1 Item 2',
      },
    ],
  },
  {
    path: '/level2',
    breadcrumbName: 'Level 2',
  },
];

export const FromRoutes: StoryFn<typeof Breadcrumb> = (args) => (
  <Breadcrumb {...args} />
);
FromRoutes.args = {
  routes: routes,
  itemRender: (route: any, _params: any, allRoutes: any, _paths: any) => {
    const isLast = allRoutes.indexOf(route) === allRoutes.length - 1;
    return isLast ? (
      <span>{route.breadcrumbName}</span>
    ) : (
      <a href={`#${route.path}`}>{route.breadcrumbName}</a>
    );
  },
};

// Example with onClick handler
const handleClick = (e: React.MouseEvent, path?: string) => {
    e.preventDefault();
    alert(`Clicked on breadcrumb. Intended path: ${path || 'current page'}`);
};

export const WithOnClick: StoryFn<typeof Breadcrumb> = (args) => (
    <Breadcrumb {...args}>
      <Breadcrumb.Item onClick={(e) => handleClick(e, '/')}>Home (Click Me)</Breadcrumb.Item>
      <Breadcrumb.Item href="/components" onClick={(e) => handleClick(e, '/components')}>
        Components (Click Me)
      </Breadcrumb.Item>
      <Breadcrumb.Item>Breadcrumb</Breadcrumb.Item>
    </Breadcrumb>
  );
WithOnClick.args = {};
