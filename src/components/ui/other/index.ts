// src/components/ui/other/index.ts
export { default as Affix } from './Affix';
// export type { AffixProps } from './Affix';

export { default as App } from './App';
export { useApp } from './App'; // Export useApp hook
// export type { AppProps } from './App';

export { default as ConfigProvider } from './ConfigProvider';
export { useConfig as useConfigProvider } from './ConfigProvider'; // Renaming useConfig to avoid conflicts if other useConfig exists
export type { ConfigContextProps as ConfigProviderContextProps, ThemeConfig as ConfigProviderThemeConfig } from './ConfigProvider';

// For Util, export all named exports from the util module
export * as Util from './Util';
// Or, if specific utils are preferred for direct import:
// export { getScroll, getViewportSize, /* etc. */ } from './Util';
