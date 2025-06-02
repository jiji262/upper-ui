// src/components/ui/data-entry/Upload/UploadList.tsx
import React from 'react';
import Icon from '../../general/Icon'; // Assuming Icon is available
import { UploadFile } from './Upload'; // Main UploadFile type

interface UploadListProps {
  items: UploadFile[];
  onRemove?: (file: UploadFile) => void | boolean | Promise<void | boolean>;
  listType?: 'text' | 'picture' | 'picture-card'; // Simplified, focus on 'text'/'picture'
  showRemoveIcon?: boolean;
  showPreviewIcon?: boolean; // Not implemented in this simplified version
  previewFile?: (file: UploadFile) => void; // For custom preview
  locale?: {
    uploading?: string;
    removeFile?: string;
    downloadFile?: string; // Not implemented
    previewFile?: string; // Not implemented
    uploadError?: string;
  };
  prefixCls?: string;
}

const UploadList: React.FC<UploadListProps> = ({
  items = [],
  onRemove,
  listType = 'text',
  showRemoveIcon = true,
  // showPreviewIcon = true, // Not implemented
  // previewFile, // Not implemented
  locale = { removeFile: 'Remove file', uploadError: 'Upload error', uploading: 'Uploading...' },
  prefixCls = 'upper-upload',
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  const handleRemove = (file: UploadFile) => {
    if (onRemove) {
      const result = onRemove(file);
      if (result === false || (typeof result === 'object' && (result as Promise<any>).then)) {
        // If onRemove returns false or a Promise, prevent default removal or wait for promise
        // This simplified version doesn't handle Promise return from onRemove well.
        return;
      }
    }
  };

  return (
    <div className={`${prefixCls}-list ${prefixCls}-list-type-${listType}`}>
      {items.map(file => {
        const itemCls = [
          `${prefixCls}-list-item`,
          file.status ? `${prefixCls}-list-item-${file.status}` : '',
          // file.originFileObj && file.originFileObj.uid ? `${prefixCls}-list-item-${file.originFileObj.uid}` : '',
        ].filter(Boolean).join(' ');

        let icon: React.ReactNode = <Icon name="FileOutlined" />;
        if (listType === 'picture' || listType === 'picture-card') {
          if (file.status === 'uploading') {
            icon = <Icon name="LoadingOutlined" />;
          } else if (file.thumbUrl || file.url) {
            // Basic image preview for picture types
            icon = <img src={file.thumbUrl || file.url} alt={file.name} className={`${prefixCls}-list-item-image`} />;
          } else {
            icon = <Icon name="PictureOutlined" />;
          }
        } else if (file.status === 'uploading') {
             icon = <Icon name="LoadingOutlined" className={`${prefixCls}-list-item-loading`} />;
        }


        const progressNode = file.status === 'uploading' && file.percent !== undefined ? (
          <div className={`${prefixCls}-list-item-progress`}>
            <div className={`${prefixCls}-progress-outer`}>
              <div className={`${prefixCls}-progress-inner`} style={{ width: `${file.percent}%` }} />
            </div>
          </div>
        ) : null;

        return (
          <div key={file.uid} className={itemCls} title={file.name}>
            <div className={`${prefixCls}-list-item-info`}>
              <span className={`${prefixCls}-list-item-icon`}>{icon}</span>
              <a
                className={`${prefixCls}-list-item-name`}
                href={file.url || undefined} // Link to file if URL exists
                target="_blank"
                rel="noopener noreferrer"
                title={file.name}
              >
                {file.name}
              </a>
              {listType !== 'picture-card' && progressNode}
            </div>
            {listType === 'picture-card' && progressNode}
            <span className={`${prefixCls}-list-item-actions`}>
              {/* Preview icon would go here if implemented */}
              {showRemoveIcon && !file.disabled && (
                <Icon
                  name="DeleteOutlined"
                  title={locale.removeFile}
                  onClick={() => handleRemove(file)}
                />
              )}
            </span>
            {file.status === 'error' && (
                <div className={`${prefixCls}-list-item-error-message`} title={file.error?.message || locale.uploadError}>
                    {file.error?.message || locale.uploadError}
                </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default UploadList;
