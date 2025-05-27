// src/components/ui/other/ConfigProvider/ConfigProvider.tsx
import React, { createContext, useContext, useMemo } from 'react';
import './ConfigProvider.css'; // For any global CSS variables or styles

// Define the shape of the theme configuration
export interface ThemeConfig {
  // Core "upper-ui" styles
  textColor?: string;
  borderColor?: string;
  primaryColor?: string; 
  primaryColorHover?: string;
  destructiveColor?: string;
  destructiveColorHover?: string;
  componentBackgroundColor?: string;
  backgroundColorHover?: string;
  secondaryBackgroundColor?: string;
  secondaryBackgroundColorHover?: string;
  placeholderColor?: string;
  errorColor?: string; 
  fontFamily?: string;
  fontSizeXs?: string; 
  fontSizeSm?: string;
  fontSizeBase?: string;
  fontSizeLg?: string;
  fontWeightMedium?: number | string;
  fontWeightNormal?: number | string; 
  fontWeightSemibold?: number | string; 
  borderRadiusBase?: number; 
  borderRadiusSm?: number;   
  borderRadiusXs?: number; 
  borderWidthBase?: number;
  shadowOffsetNormal?: string; 
  shadowOffsetHover?: string; 
  shadowColorNormal?: string;
  shadowColorError?: string;
  paddingPxBase?: string; 
  paddingPyBase?: string; 
  controlHeightBase?: string; 
  controlHeightSm?: string; 
  controlHeightLg?: string; 

  // Ant Design common colors & styles
  antPrimaryColor?: string; 
  antPrimaryColorHover?: string; 
  antPrimaryColorLightBg?: string; 
  antPrimaryColorOutline?: string; // Added for focus shadows
  antBorderRadiusBase?: number; 
  antErrorColor?: string; 
  antErrorColorBgLight?: string; 
  antErrorColorBgDark?: string;  
  antErrorColorHoverLight?: string; 
  antErrorColorOutline?: string; // Added
  antSuccessColor?: string; 
  antWarningColor?: string; 
  antWarningColorOutline?: string; // Added
  antInfoColor?: string;    
  
  textColorBase?: string; 
  textColorSecondary?: string;
  textColorInverse?: string; 
  textColorInverseSecondary?: string; 
  textColorInverseTertiary?: string; 
  disabledBgColor?: string; 
  disabledInputBorderColor?: string; 
  disabledInputBg?: string;    
  disabledTextColor?: string;
  disabledColorInverse?: string; 
  borderColorBase?: string; 
  borderColorSplit?: string; 
  borderColorSplitLight?: string; 
  borderColorInverseSplit?: string; 
  borderColorDark?: string; 
  backgroundColorLight?: string; 
  itemHoverBg?: string;
  popoverBg?: string; 
  boxShadowBase?: string; 

  // Layout specific colors
  layoutHeaderBg?: string;
  layoutSiderBg?: string; 
  layoutTriggerBg?: string;
  layoutBodyBg?: string; 
}

// Define the shape of the ConfigProvider context
export interface ConfigContextProps {
  getPrefixCls?: (suffixCls: string, customizePrefixCls?: string) => string;
  prefixCls?: string; 
  theme?: ThemeConfig;
}

const defaultConfig: ConfigContextProps = {
  prefixCls: 'ant', 
  getPrefixCls: (suffixCls: string, customizePrefixCls?: string) => {
    if (customizePrefixCls) return customizePrefixCls;
    return `ant-${suffixCls}`;
  },
  theme: {
    // Core "upper-ui" defaults
    textColor: '#000000',
    borderColor: '#000000',
    primaryColor: '#e6d5ff', 
    primaryColorHover: '#d4b5ff',
    destructiveColor: '#fecaca',
    destructiveColorHover: '#fca5a5',
    componentBackgroundColor: '#ffffff',
    backgroundColorHover: '#f3f4f6', 
    secondaryBackgroundColor: '#f3f4f6',
    secondaryBackgroundColorHover: '#e5e7eb',
    placeholderColor: '#6b7280',
    errorColor: '#ef4444', 
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    fontSizeXs: '0.75rem',  
    fontSizeSm: '0.875rem', 
    fontSizeBase: '1rem',    
    fontSizeLg: '1.125rem',  
    fontWeightMedium: 500,
    fontWeightNormal: 400, 
    fontWeightSemibold: 600, 
    borderRadiusBase: 8,    
    borderRadiusSm: 6,      
    borderRadiusXs: 2, 
    borderWidthBase: 2,     
    shadowOffsetNormal: '4px',
    shadowOffsetHover: '2px',
    shadowColorNormal: 'rgba(0,0,0,1)',
    shadowColorError: 'rgba(239,68,68,1)',
    paddingPxBase: '16px',
    paddingPyBase: '8px',
    controlHeightBase: '40px',
    controlHeightSm: '36px', 
    controlHeightLg: '44px', 

    // Ant Design common defaults
    antPrimaryColor: '#1677ff',
    antPrimaryColorHover: '#4096ff',
    antPrimaryColorLightBg: '#e6f4ff', 
    antPrimaryColorOutline: 'rgba(22,119,255,0.2)', // Added
    antBorderRadiusBase: 6, 
    antErrorColor: '#ff4d4f',
    antErrorColorBgLight: '#fff1f0', 
    antErrorColorBgDark: '#a61d24',  
    antErrorColorHoverLight: '#ff7875', 
    antErrorColorOutline: 'rgba(255,77,79,0.2)', // Added
    antSuccessColor: '#52c41a',
    antWarningColor: '#faad14',
    antWarningColorOutline: 'rgba(250,173,20,0.2)', // Added
    antInfoColor: '#1677ff',
    
    textColorBase: 'rgba(0, 0, 0, 0.88)', 
    textColorSecondary: 'rgba(0, 0, 0, 0.45)',
    textColorInverse: '#ffffff',
    textColorInverseSecondary: 'rgba(255, 255, 255, 0.85)', 
    textColorInverseTertiary: 'rgba(255, 255, 255, 0.45)', 
    disabledBgColor: 'rgba(0,0,0,0.04)', 
    disabledInputBorderColor: '#d9d9d9', 
    disabledInputBg: '#f5f5f5',      
    disabledTextColor: 'rgba(0,0,0,0.25)',
    disabledColorInverse: 'rgba(255,255,255,0.25)', 
    borderColorBase: '#d9d9d9', 
    borderColorSplit: '#f0f0f0', 
    borderColorSplitLight: 'rgba(5,5,5,0.06)', 
    borderColorInverseSplit: 'rgba(255,255,255,0.12)', 
    borderColorDark: '#d0d0d0', 
    backgroundColorLight: '#fafafa', 
    itemHoverBg: 'rgba(0,0,0,0.04)',
    popoverBg: '#333333', 
    boxShadowBase: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
  
    // Layout specific defaults
    layoutBodyBg: '#f0f2f5', 
    layoutHeaderBg: '#001529',
    layoutSiderBg: '#001529',
    layoutTriggerBg: '#002140',
  },
};

export const ConfigContext = createContext<ConfigContextProps>(defaultConfig);

export const useConfig = () => {
  return useContext(ConfigContext);
};


interface ConfigProviderProps extends Partial<ConfigContextProps> { 
  children: React.ReactNode;
}

const ConfigProvider: React.FC<ConfigProviderProps> = (props) => {
  const {
    children,
    prefixCls: newPrefixCls,
    getPrefixCls: newGetPrefixCls,
    theme: newTheme,
  } = props;

  const parentConfig = useContext(ConfigContext); 

  const configValue = useMemo(() => {
    const base = parentConfig !== defaultConfig && Object.keys(parentConfig).length > 0 ? parentConfig : defaultConfig;

    const mergedTheme = {
      ...(base.theme || {}),
      ...(newTheme || {}),
    };

    const currentGetPrefixCls = newGetPrefixCls || base.getPrefixCls || ((suffixCls: string, customizePrefixCls?: string) => {
        const effectivePrefix = newPrefixCls || base.prefixCls || 'ant';
        if (customizePrefixCls) return customizePrefixCls;
        return `${effectivePrefix}-${suffixCls}`;
    });
    
    return {
      ...base, 
      prefixCls: newPrefixCls || base.prefixCls,
      getPrefixCls: currentGetPrefixCls,
      theme: mergedTheme,
    };
  }, [newPrefixCls, newGetPrefixCls, newTheme, parentConfig]);
  
  const themeStyle: React.CSSProperties = {};
  const theme = configValue.theme || {};
  for (const key in theme) {
    if (Object.prototype.hasOwnProperty.call(theme, key)) {
        const value = (theme as any)[key];
        if (value !== undefined && value !== null) {
            const kebabKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
            const antSpecificKeys = [
                'antPrimaryColor', 'antPrimaryColorHover', 'antPrimaryColorLightBg', 'antPrimaryColorOutline',
                'antBorderRadiusBase', 'antErrorColor', 'antErrorColorBgLight', 'antErrorColorOutline',
                'antErrorColorBgDark', 'antErrorColorHoverLight', 'antSuccessColor', 
                'antWarningColor', 'antWarningColorOutline', 'antInfoColor', 'textColorBase', 'textColorSecondary', 
                'textColorInverse', 'textColorInverseSecondary', 'textColorInverseTertiary', 
                'disabledBgColor', 'disabledInputBorderColor', 'disabledInputBg', 
                'disabledTextColor', 'disabledColorInverse', 
                'borderColorBase', 'borderColorSplit', 'borderColorSplitLight', 
                'borderColorInverseSplit', 'borderColorDark', 'backgroundColorLight', 
                'itemHoverBg', 'popoverBg', 'boxShadowBase', 'layoutHeaderBg', 
                'layoutSiderBg', 'layoutTriggerBg', 'layoutBodyBg'
            ];
            const cssVarName = antSpecificKeys.includes(key) || key.startsWith('ant')
                ? `--ant-${kebabKey.replace(/^ant-/, '')}` 
                : `--upper-ui-${kebabKey}`;
            
            if (typeof value === 'number' && (kebabKey.includes('radius') || kebabKey.includes('width-base') || kebabKey.includes('font-size') )) { 
                 themeStyle[cssVarName as any] = `${value}px`;
            } else {
                 themeStyle[cssVarName as any] = value;
            }
        }
    }
  }
  
  return (
    <ConfigContext.Provider value={configValue}>
      <div className="ant-config-provider" style={themeStyle}>
        {children}
      </div>
    </ConfigContext.Provider>
  );
};

export default ConfigProvider;
