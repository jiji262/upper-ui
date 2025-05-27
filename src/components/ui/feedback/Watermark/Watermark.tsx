// src/components/ui/feedback/Watermark/Watermark.tsx
import React, { useEffect, useRef, useMemo } from 'react';
import './Watermark.css';

interface FontStyle {
  color?: string; // Default 'rgba(0,0,0,.15)'
  fontSize?: number; // Default 16
  fontWeight?: 'normal' | 'light' | 'weight' | number; // Default 'normal'
  fontFamily?: string; // Default 'sans-serif'
  fontStyle?: 'none' | 'normal' | 'italic' | 'oblique'; // Default 'normal'
}

interface WatermarkProps {
  content?: string | string[]; // Text content or array of lines
  image?: string; // Image URL for watermark
  width?: number; // Width of the watermark block (for image or complex content)
  height?: number; // Height of the watermark block
  rotate?: number; // Rotation angle, default -22
  zIndex?: number; // Default 9
  font?: FontStyle;
  gap?: [number, number]; // Gap between watermark instances [gapX, gapY], default [100,100]
  offset?: [number, number]; // Offset from top-left of container [offsetX, offsetY]
  
  children?: React.ReactNode; // Content to be watermarked
  className?: string;
  style?: React.CSSProperties; // Style for the main wrapper
  // inherit?: boolean; // If true, watermark is appended to children's parent node (complex, not implemented)
}

const Watermark: React.FC<WatermarkProps> = ({
  content,
  image,
  width, // Real AntD calculates this based on content/image if not set
  height,
  rotate = -22,
  zIndex = 9,
  font = {},
  gap = [100, 100],
  offset, // Default is gap[0]/2, gap[1]/2
  children,
  className,
  style,
}) => {
  const watermarkContainerRef = useRef<HTMLDivElement>(null);
  const watermarkDivRef = useRef<HTMLDivElement | null>(null); // Ref for the dynamically created watermark div

  const {
    color = 'rgba(0,0,0,.15)',
    fontSize = 16,
    fontWeight = 'normal',
    fontFamily = 'sans-serif',
    fontStyle = 'normal',
  } = font;

  const [gapX, gapY] = gap;
  const [offsetX, offsetY] = offset || [gapX / 2, gapY / 2];


  const base64Url = useMemo(() => {
    if (image) return image; // If image is provided, use it directly (assuming it's URL or base64)
    if (!content) return '';

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    const lines = Array.isArray(content) ? content : [content];
    const lineMargin = 3; // Margin between lines of text
    const  estimatedLineHeight = fontSize + lineMargin;
    
    // Estimate canvas size based on text content
    // This is a simplified estimation. AntD uses more precise measurement.
    const longestLine = lines.reduce((acc, curr) => curr.length > acc.length ? curr : acc, '');
    const textWidth = longestLine.length * fontSize; // Very rough estimate
    const textHeight = lines.length * estimatedLineHeight;

    const canvasWidth = Math.max(width || 120, textWidth) + gapX; // Add gap for tiling effect
    const canvasHeight = Math.max(height || 64, textHeight) + gapY;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.translate(canvasWidth / 2, canvasHeight / 2); // Translate to center for rotation
    ctx.rotate((rotate * Math.PI) / 180); // Rotate
    // ctx.translate(-canvasWidth / 2, -canvasHeight / 2); // Translate back (or adjust text drawing coords)


    ctx.font = `${fontStyle} normal ${fontWeight} ${fontSize}px/${estimatedLineHeight}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center'; // Center text within its block
    ctx.textBaseline = 'middle';

    // Draw text lines
    lines.forEach((line, index) => {
      // Adjust y position for multiple lines from center
      const yPos = (index - (lines.length - 1) / 2) * estimatedLineHeight;
      ctx.fillText(line, 0, yPos); // Draw text at rotated center
    });
    
    try {
      return canvas.toDataURL();
    } catch (err) {
      console.error("Error generating watermark data URL:", err);
      return '';
    }
  }, [content, image, width, height, rotate, fontStyle, fontWeight, fontSize, fontFamily, color, gapX, gapY]);


  useEffect(() => {
    const container = watermarkContainerRef.current;
    if (!container || !base64Url) return;

    // Remove existing watermark div if it exists
    if (watermarkDivRef.current && watermarkDivRef.current.parentNode === container) {
      container.removeChild(watermarkDivRef.current);
    }
    
    // Create new watermark div
    const newWatermarkDiv = document.createElement('div');
    newWatermarkDiv.className = 'ant-watermark-bg'; // Class for direct styling
    Object.assign(newWatermarkDiv.style, {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: `url('${base64Url}')`,
      backgroundRepeat: 'repeat',
      backgroundPosition: `${offsetX}px ${offsetY}px`, // Initial offset
      // backgroundSize: `${width || 'auto'} ${height || 'auto'}`, // Size of each watermark tile (if width/height provided)
      // backgroundSize: `${gapX + (width || 0)}px ${gapY + (height || 0)}px`, // This might be closer to how gap works
      zIndex: zIndex,
      pointerEvents: 'none', // Watermark should not interfere with content interaction
    });
    
    container.appendChild(newWatermarkDiv);
    watermarkDivRef.current = newWatermarkDiv; // Store ref

    // No explicit cleanup needed for watermarkDivRef.current here, as it's removed on next effect run or unmount of parent.
    // However, if this component itself unmounts, ensure the div is cleaned up.
    return () => {
      if (newWatermarkDiv && newWatermarkDiv.parentNode === container) {
        try {
            container.removeChild(newWatermarkDiv);
        } catch (e) {
            // ignore if already removed or container is gone
        }
      }
      watermarkDivRef.current = null;
    };

  }, [base64Url, offsetX, offsetY, zIndex]); // Rerun if these change


  const containerClasses = ['ant-watermark-wrapper', className].filter(Boolean).join(' ');

  return (
    <div ref={watermarkContainerRef} className={containerClasses} style={{ ...style, position: 'relative', overflow: 'hidden' }}>
      {children}
      {/* Watermark div is appended dynamically by useEffect */}
    </div>
  );
};

export default Watermark;
