// src/components/ui/data-display/Image/Image.tsx
import React, { useState, useEffect } from 'react';
import Icon from '../../general/Icon/Icon'; // Assuming Icon is available
import './Image.css';

interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'placeholder'> {
  src?: string;
  width?: string | number;
  height?: string | number;
  alt?: string;
  fallback?: string; // Image source for fallback if src fails
  placeholder?: React.ReactNode; // Content to show while image is loading (or if it fails and no fallback)
  preview?: boolean | { visible?: boolean; onVisibleChange?: (visible: boolean, prevVisible: boolean) => void; getContainer?: () => HTMLElement; src?: string; mask?: React.ReactNode; maskClassName?: string; }; // Simplified preview
  
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  // AntD has more preview options like icons, scale steps, etc.
}

const Image: React.FC<ImageProps> = ({
  src,
  width,
  height,
  alt = 'image',
  fallback,
  placeholder,
  preview = true, // Enable preview by default if it's a boolean
  wrapperClassName,
  wrapperStyle,
  className,
  style,
  onError, // Native img onError
  ...restImgProps
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  useEffect(() => {
    if (!src) { // If src is initially empty or becomes empty
        setIsLoading(false);
        setHasError(true); // Treat no src as an error for fallback/placeholder logic
        return;
    }
    setIsLoading(true);
    setHasError(false);
    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      setIsLoading(false);
      setHasError(false);
    };
    img.onerror = (e) => {
      setIsLoading(false);
      setHasError(true);
      onError?.(e as any); // Propagate original error event
    };
  }, [src, onError]);
  
  const previewOptions = typeof preview === 'object' ? preview : {};
  const canPreview = !!preview; // True if preview is true or an object

  const handleImageClick = () => {
    if (canPreview && !hasError && !isLoading && !previewOptions.visible) { // Don't open preview if image failed or loading
      setIsPreviewVisible(true);
      previewOptions.onVisibleChange?.(true, false);
    }
  };

  const closePreview = (e?: React.MouseEvent) => {
    e?.stopPropagation(); // Prevent image click if close button is on mask
    setIsPreviewVisible(false);
    previewOptions.onVisibleChange?.(false, true);
  };

  const renderPlaceholder = () => {
    if (placeholder) return <div className="ant-image-placeholder">{placeholder}</div>;
    return (
      <div className="ant-image-placeholder ant-image-placeholder-default">
        <Icon name="PictureOutlined" />
        <span>{alt || 'Image'}</span>
      </div>
    );
  };

  const imageSrc = hasError && fallback ? fallback : src;
  const showPlaceholder = isLoading || (hasError && !fallback && !src); // Show placeholder if loading, or error without fallback, or no src

  const imgStyle: React.CSSProperties = {
    width,
    height,
    objectFit: style?.objectFit || 'fill', // Default object-fit, can be overridden
    ...style,
    cursor: canPreview && !hasError && !isLoading ? 'pointer' : 'default',
  };
  
  const finalWrapperStyle = {
      width,
      height,
      ...wrapperStyle,
      display: 'inline-block', // Ensure wrapper respects width/height for placeholder
      position: 'relative', // For placeholder and mask positioning
  } as React.CSSProperties;
  
  if (showPlaceholder) {
      finalWrapperStyle.display = 'inline-flex';
      finalWrapperStyle.alignItems = 'center';
      finalWrapperStyle.justifyContent = 'center';
      finalWrapperStyle.background = '#f5f5f5'; // Default placeholder background
  }


  return (
    <div
      className={`ant-image ${wrapperClassName || ''}`}
      style={finalWrapperStyle}
      onClick={!showPlaceholder ? handleImageClick : undefined}
    >
      {showPlaceholder ? (
        renderPlaceholder()
      ) : (
        <img
          src={imageSrc}
          alt={alt}
          style={imgStyle}
          className={className}
          {...restImgProps}
          // onError is handled by useEffect to set hasError and use fallback
        />
      )}
      {canPreview && isPreviewVisible && (
        <div
          className={`ant-image-preview-mask ${previewOptions.maskClassName || ''}`}
          onClick={closePreview}
        >
          {previewOptions.mask || <Icon name="EyeOutlined" />}
        </div>
      )}
      {/* Simplified Modal-like Preview */}
      {canPreview && isPreviewVisible && (
        <div className="ant-image-preview-wrap" onClick={closePreview}>
          <div className="ant-image-preview-img-wrapper">
            <img src={previewOptions.src || src} alt={alt} className="ant-image-preview-img" />
          </div>
          <div className="ant-image-preview-operations">
            <Button shape="circle" icon={<Icon name="CloseOutlined" />} onClick={closePreview} />
            {/* Other operations like zoom, rotate would go here */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Image;
