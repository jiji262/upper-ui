// src/components/ui/other/ConfigProvider/ConfigProvider.stories.tsx
import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import ConfigProvider, { useConfig, ThemeConfig } from './ConfigProvider';
import Button from '../../general/Button/Button'; // Assuming Button can consume theme (needs adaptation)
import Alert from '../../feedback/Alert/Alert';   // Assuming Alert can consume theme (needs adaptation)
import Tag from '../../data-display/Tag/Tag';     // Assuming Tag can consume theme

export default {
  title: 'Other/ConfigProvider',
  component: ConfigProvider,
  argTypes: {
    // Props for ConfigProvider itself
    prefixCls: { control: 'text', description: 'Global CSS class prefix (e.g., "custom-ant").' },
    // Theme object is complex, better to show variations in stories.
  },
  parameters: {
    docs: {
      description: {
        component: 'Provides global configuration for components, such as theme, locale, prefixCls. Components within its scope can consume these configurations via context. This simplified version focuses on basic theme properties (primaryColor, borderRadius) and prefixCls.',
      },
    },
  },
} as Meta<typeof ConfigProvider>;

// Example component that uses the config context
const DemoThemedComponent: React.FC = () => {
  const { getPrefixCls, theme } = useConfig();
  const buttonPrefixCls = getPrefixCls('btn', undefined); // Example: get class for button

  const style: React.CSSProperties = {
    padding: '20px',
    border: `1px solid ${theme?.primaryColor || '#ccc'}`,
    borderRadius: theme?.borderRadius !== undefined ? `${theme.borderRadius}px` : '6px',
    marginBottom: '16px',
    color: theme?.primaryColor || 'inherit',
  };

  return (
    <div style={style}>
      <h4>Themed Component Area</h4>
      <p>This component's border and text color should reflect the primaryColor from ConfigProvider.</p>
      <p>Border radius should be: {theme?.borderRadius !== undefined ? `${theme.borderRadius}px` : 'default'}</p>
      <p>Button class prefix example: (not visually applied here) <code>{buttonPrefixCls}</code></p>
      <Button type="primary" style={{marginRight: 8}}>Primary Button (Themed)</Button>
      <Button>Default Button (Themed)</Button>
      <div style={{marginTop: 10}}>
        <Tag color={theme?.primaryColor || 'blue'}>Themed Tag</Tag>
      </div>
    </div>
  );
};

const Template: StoryFn<typeof ConfigProvider> = (args) => (
  <ConfigProvider {...args}>
    <Alert message="This Alert is inside the ConfigProvider." type="info" showIcon style={{marginBottom: 16}} />
    <DemoThemedComponent />
    <div>
        <h4>Outside DemoThemedComponent, but still within ConfigProvider:</h4>
        <Button type="dashed">Dashed Button</Button>
    </div>
  </ConfigProvider>
);

export const DefaultConfig = Template.bind({});
DefaultConfig.args = {
  // Uses default theme from ConfigProvider itself
};

export const CustomTheme: StoryFn<typeof ConfigProvider> = (args) => {
    const customTheme: ThemeConfig = {
        primaryColor: '#52c41a', // Green
        borderRadius: 12,
    };
    return (
        <ConfigProvider {...args} theme={customTheme}>
            <Alert message="Theme Override: Primary color is Green, Border Radius is 12px." type="success" showIcon style={{marginBottom: 16}} />
            <DemoThemedComponent />
            <Button>Button with Custom Theme</Button>
        </ConfigProvider>
    );
};
CustomTheme.args = {};


export const CustomPrefixCls: StoryFn<typeof ConfigProvider> = (args) => {
    // Example component that would use getPrefixCls (simplified demo)
    const MyCustomButton: React.FC = () => {
        const { getPrefixCls } = useConfig();
        const prefix = getPrefixCls('custom-button'); // Would be 'my-app-custom-button'
        return <button className={`${prefix} ${prefix}-primary`}>Prefixed Button ({prefix})</button>;
    };
    return (
        <ConfigProvider {...args}>
            <p>
                This story demonstrates changing the global CSS prefix. 
                Inspect the `MyCustomButton` (not visually styled by default antd classes now).
            </p>
            <MyCustomButton />
            <hr style={{margin: '10px 0'}}/>
            <DemoThemedComponent /> {/* Will also use the new prefix internally if components are adapted */}
        </ConfigProvider>
    );
};
CustomPrefixCls.args = {
  prefixCls: 'my-app', // All components should now use `my-app-xxx` if they use getPrefixCls
  theme: { primaryColor: '#722ED1' } // Purple theme for this example
};

// Note:
// - For the theme to actually apply to child components like Button, Alert, Tag,
//   those components would need to be modified to:
//   1. Consume the `ConfigContext` (e.g., using `useConfig()`).
//   2. Use the theme properties (e.g., `theme.primaryColor`) in their styles,
//      OR reference CSS custom properties (e.g., `var(--ant-primary-color)`) if ConfigProvider sets them globally.
//   The current simplified ConfigProvider sets CSS custom properties on its root div.
//   So, child components' CSS would need to use these variables for theming to work.
//   E.g., Button's CSS: `background-color: var(--ant-primary-color);`
// - `locale`, `direction`, `renderEmpty`, etc., are other common ConfigProvider props not implemented here.
// - The `getPrefixCls` function is provided, but child components need to use it for their class names.
