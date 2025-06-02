// src/components/ui/data-entry/ColorPicker/ColorPicker.tsx
import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../general/Icon'; // Assuming Icon is available
import './ColorPicker.css';

// Helper to validate a hex color (basic)
const isValidHex = (color: string): boolean => /^#([0-9A-F]{3}){1,2}$/i.test(color);

interface ColorPickerProps {
  value?: string; // Hex color string, e.g., "#RRGGBB" or "#RGB"
  defaultValue?: string;
  onChange?: (color: string) => void; // Returns hex string
  disabled?: boolean;
  showText?: boolean; // Show hex value next to color block
  allowClear?: boolean;
  size?: 'large' | 'middle' | 'small';
  trigger?: 'click' | 'hover'; // How to open the picker panel
  open?: boolean; // Controlled open state
  onOpenChange?: (open: boolean) => void;
  placement?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  presets?: Array<{ label: string; colors: string[] }>; // Predefined color palettes
  className?: string;
  style?: React.CSSProperties;
  panelRender?: (panel: React.ReactNode) => React.ReactNode; // Customize panel rendering
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  value: controlledValue,
  defaultValue = '#1677ff', // AntD default blue
  onChange,
  disabled = false,
  showText = false,
  allowClear = false,
  size = 'middle',
  trigger = 'click',
  open: controlledOpen,
  onOpenChange,
  placement = 'bottomLeft',
  presets,
  className,
  style,
  panelRender,
}) => {
  const [currentColor, setCurrentColor] = useState(defaultValue);
  const [inputValue, setInputValue] = useState(defaultValue); // For hex input in panel
  const [isPanelVisible, setIsPanelVisible] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (controlledValue !== undefined && isValidHex(controlledValue)) {
      setCurrentColor(controlledValue);
      setInputValue(controlledValue);
    }
  }, [controlledValue]);
  
  useEffect(() => {
    if (controlledOpen !== undefined) {
        setIsPanelVisible(controlledOpen);
    }
  }, [controlledOpen]);

  useEffect(() => {
    onOpenChange?.(isPanelVisible);
  }, [isPanelVisible, onOpenChange]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current && !containerRef.current.contains(event.target as Node) &&
        panelRef.current && !panelRef.current.contains(event.target as Node)
      ) {
        if (controlledOpen === undefined) setIsPanelVisible(false);
      }
    };
    if (isPanelVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPanelVisible, controlledOpen]);


  const handleColorChange = (newColor: string) => {
    if (isValidHex(newColor)) {
      if (controlledValue === undefined) {
        setCurrentColor(newColor);
        setInputValue(newColor);
      }
      onChange?.(newColor);
    } else {
        // Potentially handle invalid input, e.g., show error or revert
        setInputValue(currentColor); // Revert to last valid color
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    // AntD's clear might revert to default or a transparent/null state.
    // Here, let's revert to default or an empty string if that's preferred.
    const clearedColor = defaultValue; // Or "" if a "no color" state is desired
     if (controlledValue === undefined) {
        setCurrentColor(clearedColor);
        setInputValue(clearedColor);
    }
    onChange?.(clearedColor);
    if (controlledOpen === undefined && isPanelVisible) setIsPanelVisible(false);
  };

  const togglePanel = () => {
    if (!disabled) {
        if (controlledOpen === undefined) setIsPanelVisible(!isPanelVisible);
        else onOpenChange?.(!isPanelVisible); // If controlled, just notify
    }
  };
  
  const handleTriggerEvent = (eventType: 'click' | 'hover', action: 'open' | 'close') => {
    if (disabled) return;
    if (trigger === eventType) {
        if (controlledOpen === undefined) {
            setIsPanelVisible(action === 'open');
        } else {
            onOpenChange?.(action === 'open');
        }
    }
  };


  const containerClasses = [
    'ant-color-picker',
    `ant-color-picker-size-${size}`,
    disabled ? 'ant-color-picker-disabled' : '',
    className,
  ].filter(Boolean).join(' ');

  const triggerBlockClasses = [
    'ant-color-picker-trigger',
    // Potentially add classes based on current color (e.g., light/dark background for checkerboard)
  ].filter(Boolean).join(' ');


  const defaultPanelContent = (
    <>
      <div className="ant-color-picker-panel-input">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={() => handleColorChange(inputValue)}
          onKeyDown={(e) => e.key === 'Enter' && handleColorChange(inputValue)}
          disabled={disabled}
        />
        <button type="button" onClick={() => handleColorChange(inputValue)} disabled={disabled}>Apply</button>
      </div>
      {presets && presets.length > 0 && (
        <div className="ant-color-picker-presets">
          {presets.map((presetGroup, groupIndex) => (
            <div key={groupIndex} className="ant-color-picker-presets-group">
              {presetGroup.label && <div className="ant-color-picker-presets-label">{presetGroup.label}</div>}
              <div className="ant-color-picker-presets-colors">
                {presetGroup.colors.map((presetColor, colorIndex) => (
                  <div
                    key={colorIndex}
                    className="ant-color-picker-presets-color-block"
                    style={{ backgroundColor: presetColor }}
                    onClick={() => !disabled && handleColorChange(presetColor)}
                    title={presetColor}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {/* A more complex picker would have HSB/RGB sliders, opacity, etc. */}
      {/* For this simplified version, we'll stick to hex input and presets. */}
    </>
  );
  
  const panelNode = panelRender ? panelRender(defaultPanelContent) : defaultPanelContent;

  const panelClasses = [
      'ant-color-picker-panel',
      `ant-color-picker-panel-placement-${placement}`
      // Add other classes as needed e.g. for theme
  ].filter(Boolean).join(' ');

  return (
    <div ref={containerRef} className={containerClasses} style={style}>
      <div
        className={triggerBlockClasses}
        onClick={() => handleTriggerEvent('click', isPanelVisible ? 'close' : 'open')}
        onMouseEnter={() => handleTriggerEvent('hover', 'open')}
        onMouseLeave={() => handleTriggerEvent('hover', 'close')} // Simple hover, might need delay for panel interaction
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-disabled={disabled}
        aria-haspopup="dialog" // Or "true" if panel is not a dialog
        aria-expanded={isPanelVisible}
      >
        <div className="ant-color-picker-color-block">
          <div className="ant-color-picker-color-block-inner" style={{ backgroundColor: currentColor }} />
        </div>
        {showText && <span className="ant-color-picker-text">{currentColor}</span>}
        {allowClear && !disabled && currentColor !== defaultValue && ( // Show clear if not default, or always if value exists
          <Icon name="CloseCircleFilled" className="ant-color-picker-clear" onClick={handleClear} />
        )}
      </div>
      {isPanelVisible && !disabled && (
        <div ref={panelRef} className={panelClasses}>
            {panelNode}
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
