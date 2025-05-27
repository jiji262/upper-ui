// src/components/ui/data-entry/Transfer/Transfer.tsx
import React, { useState, useEffect } from 'react';
import TransferList from './TransferList';
import Button from '../Button/Button'; // Assuming Button is available
import Icon from '../../general/Icon'; // Assuming Icon is available
import './Transfer.css';

export interface TransferItem {
  key: string;
  title?: React.ReactNode;
  description?: string;
  disabled?: boolean;
  [name: string]: any; // Allow other props
}

interface TransferProps {
  dataSource: TransferItem[];
  targetKeys?: string[]; // Keys of items in the right list
  selectedKeys?: string[]; // Keys of selected items in both lists
  onChange?: (nextTargetKeys: string[], direction: 'left' | 'right', moveKeys: string[]) => void;
  onSelectChange?: (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => void;
  onScroll?: (direction: 'left' | 'right', e: React.SyntheticEvent<HTMLUListElement>) => void; // Not fully implemented here
  
  render?: (item: TransferItem) => React.ReactNode;
  disabled?: boolean;
  titles?: [React.ReactNode, React.ReactNode]; // Titles for left and right panels
  operations?: [React.ReactNode, React.ReactNode]; // Custom operation texts/icons
  showSearch?: boolean;
  filterOption?: (inputValue: string, item: TransferItem) => boolean;
  searchPlaceholder?: string; // Can be array for [left, right] or single string
  listStyle?: React.CSSProperties | ((props: {direction: 'left' | 'right'}) => React.CSSProperties);
  // oneWay?: boolean; // One-way transfer, not implemented
  // pagination?: object; // Pagination for lists, not implemented
  // showSelectAll?: boolean; // Default true, part of TransferList
  // selectAllLabels?: [React.ReactNode, React.ReactNode]; // Part of TransferList header
  className?: string;
  style?: React.CSSProperties;
  prefixCls?: string; // Default 'ant-transfer'
}

const Transfer: React.FC<TransferProps> = ({
  dataSource = [],
  targetKeys: controlledTargetKeys = [],
  selectedKeys: controlledSelectedKeys,
  onChange,
  onSelectChange,
  // onScroll,
  render,
  disabled = false,
  titles = ['Source', 'Target'],
  operations = [], // Default will be icons
  showSearch = false,
  filterOption,
  searchPlaceholder, // Simplified: use one placeholder or specific logic in TransferList
  listStyle,
  className,
  style,
  prefixCls = 'ant-transfer',
}) => {
  const [currentSourceKeys, setCurrentSourceKeys] = useState<string[]>([]);
  const [currentTargetKeys, setCurrentTargetKeys] = useState<string[]>(controlledTargetKeys);
  const [currentSelectedKeys, setCurrentSelectedKeys] = useState<string[]>([]); // All selected keys

  useEffect(() => {
    setCurrentTargetKeys(controlledTargetKeys);
  }, [controlledTargetKeys]);

  useEffect(() => {
    // Separate dataSource into source and target lists based on currentTargetKeys
    const source = dataSource.filter(item => !currentTargetKeys.includes(item.key));
    setCurrentSourceKeys(source.map(item => item.key));
  }, [dataSource, currentTargetKeys]);
  
  useEffect(() => {
    if (controlledSelectedKeys !== undefined) {
        setCurrentSelectedKeys(controlledSelectedKeys);
    }
  }, [controlledSelectedKeys]);


  const handleSelectChange = (listType: 'source' | 'target', selected: string[], allKeysInList: string[]) => {
    let newSelectedKeys = [...currentSelectedKeys];
    // Remove all keys from this list first, then add back the selected ones
    newSelectedKeys = newSelectedKeys.filter(key => !allKeysInList.includes(key));
    newSelectedKeys.push(...selected);
    
    if (controlledSelectedKeys === undefined) {
        setCurrentSelectedKeys(newSelectedKeys);
    }

    if (onSelectChange) {
        const sourceSelected = newSelectedKeys.filter(key => currentSourceKeys.includes(key));
        const targetSelected = newSelectedKeys.filter(key => currentTargetKeys.includes(key));
        onSelectChange(sourceSelected, targetSelected);
    }
  };
  
  const getListSelectedKeys = (listKeys: string[]) => {
    return currentSelectedKeys.filter(key => listKeys.includes(key));
  };

  const moveTo = (direction: 'left' | 'right') => {
    if (disabled) return;

    const movingKeys: string[] = [];
    let newTargetKeys = [...currentTargetKeys];

    if (direction === 'right') { // Move from source to target
      const sourceSelected = getListSelectedKeys(currentSourceKeys);
      movingKeys.push(...sourceSelected);
      newTargetKeys = [...currentTargetKeys, ...sourceSelected];
    } else { // Move from target to source
      const targetSelected = getListSelectedKeys(currentTargetKeys);
      movingKeys.push(...targetSelected);
      newTargetKeys = currentTargetKeys.filter(key => !targetSelected.includes(key));
    }
    
    // Update target keys and clear selection of moved items
    if (controlledTargetKeys === undefined) {
        setCurrentTargetKeys(newTargetKeys);
    }
    const nextSelectedKeys = currentSelectedKeys.filter(key => !movingKeys.includes(key));
    if (controlledSelectedKeys === undefined) {
        setCurrentSelectedKeys(nextSelectedKeys);
    }
    
    onChange?.(newTargetKeys, direction, movingKeys);
    if (onSelectChange) { // Also notify that selection has changed due to move
        const sourceSelectedAfterMove = nextSelectedKeys.filter(key => currentSourceKeys.filter(k => !movingKeys.includes(k)).includes(key));
        const targetSelectedAfterMove = nextSelectedKeys.filter(key => newTargetKeys.includes(key));
        onSelectChange(sourceSelectedAfterMove, targetSelectedAfterMove);
    }
  };

  const sourceListDataSource = dataSource.filter(item => !currentTargetKeys.includes(item.key));
  const targetListDataSource = dataSource.filter(item => currentTargetKeys.includes(item.key));
  
  const leftActive = getListSelectedKeys(targetListDataSource.map(item => item.key)).length > 0;
  const rightActive = getListSelectedKeys(sourceListDataSource.map(item => item.key)).length > 0;


  const getListStyle = (dir: 'left' | 'right'): React.CSSProperties | undefined => {
    if (typeof listStyle === 'function') {
      return listStyle({ direction: dir });
    }
    return listStyle;
  };

  const transferCls = [
    prefixCls,
    disabled ? `${prefixCls}-disabled` : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={transferCls} style={style}>
      <TransferList
        prefixCls={prefixCls}
        titleText={titles[0]}
        dataSource={sourceListDataSource}
        selectedKeys={getListSelectedKeys(sourceListDataSource.map(item => item.key))}
        onItemSelect={(key, sel) => {
            const currentListSelected = getListSelectedKeys(sourceListDataSource.map(item => item.key));
            const newSelection = sel ? [...currentListSelected, key] : currentListSelected.filter(k => k !== key);
            handleSelectChange('source', newSelection, sourceListDataSource.map(item => item.key));
        }}
        onItemSelectAll={(keys, sel) => handleSelectChange('source', sel ? keys : [], sourceListDataSource.map(item => item.key))}
        render={render}
        disabled={disabled}
        showSearch={showSearch}
        searchPlaceholder={Array.isArray(searchPlaceholder) ? searchPlaceholder[0] : searchPlaceholder}
        filterOption={filterOption}
        listStyle={getListStyle('left')}
      />
      <div className={`${prefixCls}-operation`}>
        <Button
          type="primary"
          onClick={() => moveTo('right')}
          disabled={disabled || !rightActive}
          icon={<Icon name="RightOutlined" />}
        >
          {operations[0]}
        </Button>
        <Button
          type="primary"
          onClick={() => moveTo('left')}
          disabled={disabled || !leftActive}
          icon={<Icon name="LeftOutlined" />}
        >
          {operations[1]}
        </Button>
      </div>
      <TransferList
        prefixCls={prefixCls}
        titleText={titles[1]}
        dataSource={targetListDataSource}
        selectedKeys={getListSelectedKeys(targetListDataSource.map(item => item.key))}
        onItemSelect={(key, sel) => {
            const currentListSelected = getListSelectedKeys(targetListDataSource.map(item => item.key));
            const newSelection = sel ? [...currentListSelected, key] : currentListSelected.filter(k => k !== key);
            handleSelectChange('target', newSelection, targetListDataSource.map(item => item.key));
        }}
        onItemSelectAll={(keys, sel) => handleSelectChange('target', sel ? keys : [], targetListDataSource.map(item => item.key))}
        render={render}
        disabled={disabled}
        showSearch={showSearch}
        searchPlaceholder={Array.isArray(searchPlaceholder) ? searchPlaceholder[1] : searchPlaceholder}
        filterOption={filterOption}
        listStyle={getListStyle('right')}
      />
    </div>
  );
};

export default Transfer;
