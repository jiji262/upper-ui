// src/components/ui/data-entry/Transfer/TransferList.tsx
import React from 'react';
import Checkbox from '../Checkbox/Checkbox'; // Assuming Checkbox is available
import TransferSearch from './TransferSearch'; // The search component just created
import { TransferItem } from './Transfer'; // Main TransferItem type

interface TransferListProps {
  titleText?: React.ReactNode;
  dataSource: TransferItem[];
  selectedKeys: string[];
  onItemSelect: (key: string, selected: boolean) => void;
  onItemSelectAll: (keys: string[], selected: boolean) => void;
  render?: (item: TransferItem) => React.ReactNode; // Custom item rendering
  disabled?: boolean;
  showSearch?: boolean;
  searchPlaceholder?: string;
  filterOption?: (inputValue: string, item: TransferItem) => boolean;
  // Footer for list actions, not implemented in this simplified version
  // footer?: (props: TransferListProps) => React.ReactNode; 
  // Header for list title/stats
  // header?: (props: TransferListProps) => React.ReactNode;
  listStyle?: React.CSSProperties;
  prefixCls?: string; // Base CSS class prefix, e.g., "ant-transfer"
}

const TransferList: React.FC<TransferListProps> = ({
  titleText,
  dataSource,
  selectedKeys,
  onItemSelect,
  onItemSelectAll,
  render,
  disabled,
  showSearch = false,
  searchPlaceholder = 'Search here',
  filterOption,
  listStyle,
  prefixCls = 'ant-transfer',
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const filteredDataSource = dataSource.filter(item => {
    if (!searchTerm) return true;
    if (filterOption) {
      return filterOption(searchTerm, item);
    }
    // Default simple text search in title or description if render is not used
    const itemText = typeof item.title === 'string' ? item.title : 
                     (typeof item.description === 'string' ? item.description : item.key);
    return itemText.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const allKeysInList = filteredDataSource.filter(item => !item.disabled).map(item => item.key);
  const allSelectedInList = allKeysInList.length > 0 && allKeysInList.every(key => selectedKeys.includes(key));
  const someSelectedInList = allKeysInList.some(key => selectedKeys.includes(key)) && !allSelectedInList;

  const handleSelectAll = (checked: boolean) => {
    onItemSelectAll(allKeysInList, checked);
  };

  const defaultRenderItem = (item: TransferItem) => item.title || item.description || item.key;

  return (
    <div className={`${prefixCls}-list`} style={listStyle}>
      <div className={`${prefixCls}-list-header`}>
        <Checkbox
          indeterminate={someSelectedInList}
          checked={allSelectedInList}
          onChange={(e) => handleSelectAll(e.target.checked)}
          disabled={disabled || filteredDataSource.filter(item => !item.disabled).length === 0}
        />
        <span className={`${prefixCls}-list-header-selected`}>
          {selectedKeys.filter(key => filteredDataSource.find(item => item.key === key)).length} / {filteredDataSource.length} items
        </span>
        <span className={`${prefixCls}-list-header-title`}>{titleText}</span>
      </div>
      {showSearch && (
        <TransferSearch
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={handleFilter}
          handleClear={handleClearSearch}
          disabled={disabled}
        />
      )}
      <div className={`${prefixCls}-list-body ${showSearch ? `${prefixCls}-list-body-with-search` : ''}`}>
        {filteredDataSource.length === 0 ? (
          <div className={`${prefixCls}-list-body-not-found`}>Not Found</div>
        ) : (
          <ul className={`${prefixCls}-list-content`}>
            {filteredDataSource.map(item => {
              const itemDisabled = disabled || item.disabled;
              const itemChecked = selectedKeys.includes(item.key);
              return (
                <li
                  key={item.key}
                  className={`${prefixCls}-list-content-item ${itemDisabled ? `${prefixCls}-list-content-item-disabled` : ''} ${itemChecked ? `${prefixCls}-list-content-item-checked` : ''}`}
                  onClick={() => !itemDisabled && onItemSelect(item.key, !itemChecked)}
                >
                  <Checkbox
                    checked={itemChecked}
                    disabled={itemDisabled}
                    // onChange is handled by li click for better UX
                  />
                  <span className={`${prefixCls}-list-content-item-text`}>
                    {render ? render(item) : defaultRenderItem(item)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {/* Footer can be added here if needed */}
      {/* <div className={`${prefixCls}-list-footer`}></div> */}
    </div>
  );
};

export default TransferList;
