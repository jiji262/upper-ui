// src/components/ui/data-entry/Transfer/TransferSearch.tsx
import React from 'react';
import Input from '../Input/Input'; // Assuming Input is available
import Icon from '../../general/Icon'; // Assuming Icon is available

interface TransferSearchProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClear?: () => void;
  disabled?: boolean;
}

const TransferSearch: React.FC<TransferSearchProps> = ({
  placeholder,
  value,
  onChange,
  handleClear,
  disabled,
}) => {
  const suffix = value ? (
    <Icon name="CloseCircleFilled" onClick={!disabled ? handleClear : undefined} className="ant-transfer-list-search-action" />
  ) : (
    <Icon name="SearchOutlined" className="ant-transfer-list-search-action" />
  );

  return (
    <div className="ant-transfer-list-search">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="ant-transfer-list-search-input"
        suffix={suffix}
      />
    </div>
  );
};

export default TransferSearch;
