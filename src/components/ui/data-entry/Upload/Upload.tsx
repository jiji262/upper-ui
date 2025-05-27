// src/components/ui/data-entry/Upload/Upload.tsx
import React, { useState, useRef, ChangeEvent } from 'react';
import Button from '../Button/Button'; // Assuming Button is available for trigger
import Icon from '../../general/Icon'; // Assuming Icon is available
import UploadList from './UploadList';
import './Upload.css';

let fileUid = 0; // Simple UID generator

export interface UploadFile<T = any> {
  uid: string;
  name: string;
  status?: 'error' | 'success' | 'done' | 'uploading' | 'removed';
  percent?: number; // For progress
  originFileObj?: File; // Original browser File object
  url?: string; // Download or preview URL
  thumbUrl?: string; // Thumbnail URL for images
  response?: T; // Server response for success cases
  error?: any; // Error object or message
  linkProps?: any; // Props for link in file list
  type?: string; // File type
  size?: number; // File size
  disabled?: boolean; // Disable remove for this specific file
}

// Simplified version of RcFile from antd internal types
export interface RcFile extends File {
  uid: string;
}


interface UploadProps {
  accept?: string;
  action?: string | ((file: RcFile) => string | PromiseLike<string>); // Upload URL or function
  method?: 'POST' | 'PUT' | 'PATCH' | 'GET'; // Default 'POST'
  headers?: HeadersInit;
  data?: object | ((file: RcFile) => object | Promise<object>); // Extra data for upload
  name?: string; // File parameter name, default 'file'
  
  multiple?: boolean;
  disabled?: boolean;
  showUploadList?: boolean | { showPreviewIcon?: boolean; showRemoveIcon?: boolean; showDownloadIcon?: boolean; removeIcon?: React.ReactNode; downloadIcon?: React.ReactNode; previewIcon?: React.ReactNode; };
  listType?: 'text' | 'picture' | 'picture-card';
  
  fileList?: UploadFile[]; // Controlled file list
  defaultFileList?: UploadFile[];
  
  onChange?: (info: { file: UploadFile; fileList: UploadFile[]; event?: { percent: number } }) => void;
  onPreview?: (file: UploadFile) => void; // Not implemented in this simplified version
  onRemove?: (file: UploadFile) => boolean | Promise<boolean> | void;
  beforeUpload?: (file: RcFile, FileList: RcFile[]) => boolean | Promise<any>; // Return false to prevent upload

  children?: React.ReactNode; // Custom trigger
  className?: string;
  style?: React.CSSProperties;
  prefixCls?: string; // Default 'ant-upload'
  // `customRequest` for overriding upload behavior is advanced, not implemented here
  // `withCredentials`, `directory` also not implemented
}

const Upload: React.FC<UploadProps> = ({
  accept,
  action, // Mock behavior, no real upload
  method = 'POST',
  headers,
  data,
  name = 'file',
  multiple = false,
  disabled = false,
  showUploadList = true,
  listType = 'text',
  fileList: controlledFileList,
  defaultFileList = [],
  onChange,
  // onPreview,
  onRemove,
  beforeUpload,
  children,
  className,
  style,
  prefixCls = 'ant-upload',
}) => {
  const [internalFileList, setInternalFileList] = useState<UploadFile[]>(defaultFileList.map(f => ({...f, uid: f.uid || String(fileUid++)})));
  const inputRef = useRef<HTMLInputElement>(null);

  const fileList = controlledFileList !== undefined ? controlledFileList : internalFileList;

  const updateFileList = (newFile: UploadFile, newFileList?: UploadFile[]) => {
    const updatedList = newFileList || [...fileList.filter(f => f.uid !== newFile.uid), newFile].sort((a,b) => parseFloat(a.uid) - parseFloat(b.uid)); // Basic sort by uid
    if (controlledFileList === undefined) {
      setInternalFileList(updatedList);
    }
    onChange?.({ file: { ...newFile }, fileList: [...updatedList] });
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (disabled || !e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    e.target.value = ''; // Reset input to allow selecting the same file again

    for (const file of selectedFiles) {
      const rcFile = file as RcFile;
      rcFile.uid = String(fileUid++);

      let canUpload = true;
      if (beforeUpload) {
        const result = await beforeUpload(rcFile, selectedFiles as RcFile[]); // Pass all selected files
        if (result === false) {
          canUpload = false;
        }
        // TODO: Handle Promise result from beforeUpload for async validation
      }

      if (!canUpload) continue;

      const uploadFile: UploadFile = {
        uid: rcFile.uid,
        name: rcFile.name,
        status: 'uploading',
        percent: 0,
        originFileObj: rcFile,
        size: rcFile.size,
        type: rcFile.type,
      };
      updateFileList(uploadFile);

      // --- Mock Upload Process ---
      // Simulating an upload with progress and success/error
      // In a real app, this would be an actual XHR/fetch request.
      let mockProgress = 0;
      const progressInterval = setInterval(() => {
        mockProgress += 20;
        if (mockProgress <= 100) {
          const progressFile = { ...uploadFile, percent: mockProgress, status: 'uploading' as const };
          updateFileList(progressFile);
          onChange?.({ file: {...progressFile}, fileList: [...fileList.filter(f => f.uid !== progressFile.uid), progressFile].sort((a,b) => parseFloat(a.uid) - parseFloat(b.uid)), event: { percent: mockProgress } });

        } else {
          clearInterval(progressInterval);
          // Simulate success or error
          const isSuccess = Math.random() > 0.3; // 70% chance of success
          const finalStatus = isSuccess ? 'done' : 'error';
          const finalFile = {
            ...uploadFile,
            percent: 100,
            status: finalStatus as 'done' | 'error',
            response: isSuccess ? 'Mock server response' : undefined,
            error: !isSuccess ? { message: 'Mock upload failed' } : undefined,
          };
          updateFileList(finalFile);
        }
      }, 200);
      // --- End Mock Upload Process ---
    }
  };

  const handleRemove = (file: UploadFile): boolean | void => {
    let canRemove: boolean | Promise<boolean> | void = true;
    if (onRemove) {
      canRemove = onRemove(file);
    }

    if (canRemove === false) return false;
    
    if (typeof canRemove === 'object' && (canRemove as Promise<any>).then) {
        // If onRemove returns a promise, wait for it
        (canRemove as Promise<boolean>).then(resolvedCanRemove => {
            if (resolvedCanRemove !== false) {
                const newFileList = fileList.filter(f => f.uid !== file.uid);
                if (controlledFileList === undefined) {
                    setInternalFileList(newFileList);
                }
                onChange?.({ file: { ...file, status: 'removed' }, fileList: newFileList });
            }
        }).catch(err => console.error("Error in onRemove promise:", err));
        return; // Let promise handle actual removal
    }

    // Default synchronous removal
    const newFileList = fileList.filter(f => f.uid !== file.uid);
    if (controlledFileList === undefined) {
      setInternalFileList(newFileList);
    }
    onChange?.({ file: { ...file, status: 'removed' }, fileList: newFileList });
  };

  const triggerUpload = () => {
    if (inputRef.current && !disabled) {
      inputRef.current.click();
    }
  };

  const uploadButton = children ? (
    React.cloneElement(children as React.ReactElement, { onClick: triggerUpload, disabled })
  ) : (
    <Button onClick={triggerUpload} disabled={disabled} icon={<Icon name="UploadOutlined"/>}>
      Click to Upload
    </Button>
  );

  const showList = typeof showUploadList === 'boolean' ? showUploadList : true;
  const listProps = typeof showUploadList === 'object' ? showUploadList : {};


  const uploadClasses = [
    prefixCls,
    `${prefixCls}-select`, // Wrapper for the trigger button/area
    // TODO: Add classes for listType (e.g., picture-card might change trigger appearance)
    // e.g. if listType === 'picture-card' && !children -> `${prefixCls}-select-picture-card`
    disabled ? `${prefixCls}-disabled` : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={uploadClasses} style={style}>
      <div className={`${prefixCls}-trigger-wrapper`} onClick={!children ? triggerUpload : undefined}>
        <input
            type="file"
            ref={inputRef}
            accept={accept}
            multiple={multiple}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            disabled={disabled}
        />
        {children ? React.cloneElement(children as React.ReactElement<any>, { onClick: triggerUpload, disabled }) : uploadButton}
      </div>
      {showList && (
        <UploadList
          items={fileList}
          listType={listType}
          onRemove={handleRemove}
          prefixCls={prefixCls}
          {...listProps} // Pass down showPreviewIcon, showRemoveIcon etc.
        />
      )}
    </span>
  );
};

export default Upload;
