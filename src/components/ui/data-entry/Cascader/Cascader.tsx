// src/components/ui/data-entry/Cascader/Cascader.tsx
import React, { useState, useEffect, useRef } from 'react';
import Input from '../Input/Input'; // Assuming Input is available
import Icon from '../../general/Icon'; // Assuming Icon is available
import './Cascader.css';

export interface CascaderOption {
  value: string | number;
  label: React.ReactNode;
  children?: CascaderOption[];
  disabled?: boolean;
  isLeaf?: boolean; // If true, this node is a leaf even if children is undefined
  loading?: boolean; // For dynamic loading
  [key: string]: any; // Allow other properties
}

interface CascaderProps {
  options: CascaderOption[];
  value?: Array<string | number>; // Selected path values
  defaultValue?: Array<string | number>;
  onChange?: (value: Array<string | number>, selectedOptions: CascaderOption[]) => void;
  onPopupVisibleChange?: (visible: boolean) => void;
  loadData?: (selectedOptions: CascaderOption[]) => void; // For dynamic loading
  
  allowClear?: boolean;
  autoFocus?: boolean;
  changeOnSelect?: boolean; // Select any level, not just leaf
  disabled?: boolean;
  displayRender?: (labels: string[], selectedOptions?: CascaderOption[]) => React.ReactNode;
  expandTrigger?: 'click' | 'hover';
  fieldNames?: { label?: string; value?: string; children?: string }; // Default { label: 'label', value: 'value', children: 'children' }
  notFoundContent?: React.ReactNode;
  placeholder?: string;
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'; // Dropdown placement
  showSearch?: boolean | { filter?: (inputValue: string, path: CascaderOption[], names: {label: string, value: string, children: string}) => boolean; render?: (inputValue: string, path: CascaderOption[], prefixCls?: string, names?: {label: string, value: string, children: string}) => React.ReactNode; limit?: number | false; matchInputWidth?: boolean; sort?: (a: CascaderOption[], b: CascaderOption[], inputValue: string, names: {label: string, value: string, children: string}) => number };
  size?: 'large' | 'middle' | 'small';
  status?: 'error' | 'warning';
  suffixIcon?: React.ReactNode;
  expandIcon?: React.ReactNode;
  dropdownClassName?: string;
  dropdownStyle?: React.CSSProperties;
  open?: boolean; // Controlled open state
  style?: React.CSSProperties;
  className?: string;
}

const defaultFieldNames = { label: 'label', value: 'value', children: 'children' };

const Cascader: React.FC<CascaderProps> = ({
  options = [],
  value: controlledValue,
  defaultValue = [],
  onChange,
  onPopupVisibleChange,
  loadData,
  allowClear = true,
  autoFocus = false,
  changeOnSelect = false,
  disabled = false,
  displayRender,
  expandTrigger = 'click',
  fieldNames: customFieldNames,
  notFoundContent = 'Not Found',
  placeholder = 'Please select',
  placement = 'bottomLeft',
  showSearch = false,
  size, // For Input size
  status,
  suffixIcon, // Custom suffix icon for input
  expandIcon, // Custom expand icon for options
  dropdownClassName,
  dropdownStyle,
  open: controlledOpen,
  style,
  className,
}) => {
  const fieldNames = { ...defaultFieldNames, ...customFieldNames };
  const [currentValue, setCurrentValue] = useState<Array<string | number>>(defaultValue);
  const [selectedPath, setSelectedPath] = useState<CascaderOption[]>([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [activeColumns, setActiveColumns] = useState<CascaderOption[][]>([options]); // Columns of options displayed
  const [inputValue, setInputValue] = useState(''); // For display and search
  const [hoveredPath, setHoveredPath] = useState<(string|number)[]>([]); // For hover trigger


  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null); // Assuming Input component exposes its ref

  useEffect(() => {
    if (controlledValue !== undefined) {
      setCurrentValue(controlledValue);
      // Update inputValue and selectedPath based on controlledValue
      const newPath = getPathByValue(options, controlledValue, fieldNames);
      setSelectedPath(newPath);
      setInputValue(newPath.map(opt => opt[fieldNames.label]).join(' / '));
      // Update activeColumns if controlledValue changes externally
      const newActiveColumns: CascaderOption[][] = [options];
      let currentOpts = options;
      for (const val of controlledValue) {
          const foundOpt = currentOpts.find(opt => opt[fieldNames.value] === val);
          if (foundOpt && foundOpt[fieldNames.children]) {
              newActiveColumns.push(foundOpt[fieldNames.children]);
              currentOpts = foundOpt[fieldNames.children];
          } else {
              break;
          }
      }
      setActiveColumns(newActiveColumns);
    }
  }, [controlledValue, options, fieldNames]);
  
  useEffect(() => {
    if (controlledOpen !== undefined) {
        setPopupVisible(controlledOpen);
    }
  }, [controlledOpen]);

  useEffect(() => {
    onPopupVisibleChange?.(popupVisible);
    if (popupVisible && options.length > 0 && activeColumns.length === 1 && activeColumns[0] !== options) {
        // If popup becomes visible and only root options are not the current active ones, reset
        // This might happen if options prop changes
        setActiveColumns([options]);
    }
  }, [popupVisible, onPopupVisibleChange, options]);


  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (controlledOpen === undefined) setPopupVisible(false);
      }
    };
    if (popupVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [popupVisible, controlledOpen]);


  const getPathByValue = (opts: CascaderOption[], val: (string|number)[], fNames: any): CascaderOption[] => {
    const path: CascaderOption[] = [];
    let currentLevelOptions = opts;
    for (const v of val) {
      const found = currentLevelOptions.find(opt => opt[fNames.value] === v);
      if (found) {
        path.push(found);
        currentLevelOptions = found[fNames.children] || [];
      } else {
        break; // Value path doesn't exist in options
      }
    }
    return path;
  };

  const handleOptionSelect = (option: CascaderOption, columnIndex: number, isLeaf: boolean) => {
    const newSelectedValuePath = [...currentValue.slice(0, columnIndex), option[fieldNames.value]];
    const newSelectedOptionsPath = [...selectedPath.slice(0, columnIndex), option];

    if (controlledValue === undefined) {
      setCurrentValue(newSelectedValuePath);
      setSelectedPath(newSelectedOptionsPath);
      setInputValue(newSelectedOptionsPath.map(opt => opt[fieldNames.label]).join(' / '));
    }
    
    onChange?.(newSelectedValuePath, newSelectedOptionsPath);

    if (option[fieldNames.children] && option[fieldNames.children].length > 0) {
      setActiveColumns([...activeColumns.slice(0, columnIndex + 1), option[fieldNames.children]]);
    } else if (loadData && !option.isLeaf && !option[fieldNames.children]) {
        // Is not explicitly a leaf, has no children yet, and loadData is provided
        setActiveColumns([...activeColumns.slice(0, columnIndex + 1)]); // Keep current columns, show loading on option
        loadData(newSelectedOptionsPath);
    } else { // Is a leaf or changeOnSelect is true
      if (controlledOpen === undefined && (isLeaf || changeOnSelect)) {
          setPopupVisible(false);
      }
       // If it's a leaf, remove subsequent columns
      if (isLeaf) {
        setActiveColumns(activeColumns.slice(0, columnIndex + 1));
      }
    }
     if (changeOnSelect && !isLeaf) { // If changeOnSelect, and not a leaf, we might not close popup
        // onChange is already called. Popup visibility is handled based on isLeaf or further interaction.
     }
  };

  const handleColumnHover = (option: CascaderOption, columnIndex: number) => {
    if (expandTrigger === 'hover') {
        // Update hoveredPath to reflect the current option being hovered over
        const newHoveredValuePath = [...hoveredPath.slice(0, columnIndex), option[fieldNames.value]];
        setHoveredPath(newHoveredValuePath);

        if (option[fieldNames.children] && option[fieldNames.children].length > 0) {
            setActiveColumns([...activeColumns.slice(0, columnIndex + 1), option[fieldNames.children]]);
        } else if (loadData && !option.isLeaf && !option[fieldNames.children] && !option.loading) {
            // Trigger loadData on hover if not already loading and has no children
            // This might require more state management to prevent multiple calls for same hover
            const currentHoveredOptionsPath = getPathByValue(options, newHoveredValuePath, fieldNames);
            loadData(currentHoveredOptionsPath);
            // Visually, we might want to show loading on the option, and then update columns
            setActiveColumns([...activeColumns.slice(0, columnIndex + 1)]);
        } else if (!option[fieldNames.children] || option[fieldNames.children].length === 0) {
            // If it's a leaf or has no children (and not loading), remove subsequent columns
            setActiveColumns(activeColumns.slice(0, columnIndex + 1));
        }
    }
  };


  const displayValue = displayRender
    ? displayRender(selectedPath.map(opt => opt[fieldNames.label] as string), selectedPath)
    : selectedPath.map(opt => opt[fieldNames.label]).join(' / ');
    
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening dropdown
    if (controlledValue === undefined) {
        setCurrentValue([]);
        setSelectedPath([]);
        setInputValue('');
        setActiveColumns([options]); // Reset columns to root
    }
    onChange?.([], []);
    if (controlledOpen === undefined) setPopupVisible(false);
  };

  const inputSuffix = allowClear && currentValue.length > 0 && !disabled ? (
    <Icon name="CloseCircleFilled" className="ant-cascader-clear" onClick={handleClear} />
  ) : (
    suffixIcon || <Icon name="DownOutlined" />
  );


  const renderColumns = () => {
    return activeColumns.map((columnOptions, colIndex) => (
      <ul key={colIndex} className="ant-cascader-menu">
        {columnOptions.map(option => {
          const val = option[fieldNames.value];
          const label = option[fieldNames.label];
          const childrenCol = option[fieldNames.children];
          const isLeaf = option.isLeaf === undefined ? !(childrenCol && childrenCol.length > 0 || loadData && !option[fieldNames.children]) : option.isLeaf;
          const isSelectedInPath = currentValue[colIndex] === val;
          const isHoveredInPath = expandTrigger === 'hover' && hoveredPath[colIndex] === val;


          const optionClasses = [
            'ant-cascader-menu-item',
            option.disabled ? 'ant-cascader-menu-item-disabled' : '',
            isSelectedInPath ? 'ant-cascader-menu-item-active' : '', // Active if part of current selection path
            isHoveredInPath && !childrenCol && !loadData ? 'ant-cascader-menu-item-hover-leaf' : '', // Special hover for leaf on hover trigger
            // TODO: Loading state class
            option.loading ? 'ant-cascader-menu-item-loading' : '',
          ].filter(Boolean).join(' ');

          return (
            <li
              key={val}
              className={optionClasses}
              title={typeof label === 'string' ? label : undefined}
              onClick={() => !option.disabled && handleOptionSelect(option, colIndex, isLeaf)}
              onMouseEnter={() => !option.disabled && handleColumnHover(option, colIndex)}
              onMouseLeave={() => expandTrigger === 'hover' && setHoveredPath(currentValue)} // Reset hover path on mouse leave
            >
              <span className="ant-cascader-menu-item-label">{label}</span>
              {!isLeaf && (expandIcon || <Icon name="RightOutlined" className="ant-cascader-menu-item-expand-icon" />)}
              {option.loading && <Icon name="LoadingOutlined" className="ant-cascader-menu-item-loading-icon" />}
            </li>
          );
        })}
      </ul>
    ));
  };
  
  // TODO: Implement showSearch functionality (filtering options based on input)

  const cascaderInput = (
    <Input
      ref={inputRef}
      readOnly // Cascader input is typically not directly editable, value comes from selection
      value={inputValue || displayValue} // Show search input or formatted display value
      placeholder={placeholder}
      onClick={() => !disabled && (controlledOpen === undefined ? setPopupVisible(!popupVisible) : onPopupVisibleChange?.(!popupVisible))}
      disabled={disabled}
      size={size}
      status={status}
      autoFocus={autoFocus}
      suffix={inputSuffix}
      // className for input itself if needed
    />
  );


  const popupCls = [
    'ant-cascader-dropdown',
    `ant-cascader-dropdown-placement-${placement}`,
    dropdownClassName,
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={containerRef}
      className={`ant-cascader ${className || ''} ${popupVisible ? 'ant-cascader-picker-open' : ''} ${disabled ? 'ant-cascader-disabled': ''}`}
      style={style}
    >
      {cascaderInput}
      {popupVisible && !disabled && (
        <div className={popupCls} style={dropdownStyle}>
          <div className="ant-cascader-menus">
            {activeColumns.length > 0 && activeColumns[0].length > 0 ? renderColumns() : <div className="ant-cascader-empty">{notFoundContent}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cascader;
