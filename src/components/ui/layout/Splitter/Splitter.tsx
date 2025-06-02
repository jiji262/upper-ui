// src/components/ui/layout/Splitter/Splitter.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import './Splitter.css';

interface SplitterProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'horizontal' | 'vertical';
  initialSize?: number | string; // Initial size of the first pane (e.g., "50%", 300)
  minSize?: number; // Minimum size for panes (in pixels)
  maxSize?: number; // Maximum size for panes (in pixels)
  onResizeStart?: () => void;
  onResizeEnd?: (sizes: [number, number]) => void; // Returns pixel sizes of panes
  pane1Style?: React.CSSProperties;
  pane2Style?: React.CSSProperties;
  splitterStyle?: React.CSSProperties;
  children: [React.ReactNode, React.ReactNode]; // Expects exactly two children
}

const Splitter: React.FC<SplitterProps> = ({
  direction = 'horizontal',
  initialSize = '50%',
  minSize = 50, // Default min size in pixels
  maxSize,       // No default max size
  onResizeStart,
  onResizeEnd,
  pane1Style,
  pane2Style,
  splitterStyle: customSplitterStyle,
  className,
  style,
  children,
  ...rest
}) => {
  if (React.Children.count(children) !== 2) {
    console.error("Splitter component requires exactly two children.");
    return <div style={{color: 'red'}}>Splitter error: Requires two children.</div>;
  }

  const [isDragging, setIsDragging] = useState(false);
  const [pane1Size, setPane1Size] = useState<string | number>(initialSize);
  const splitterRef = useRef<HTMLDivElement>(null);
  const pane1Ref = useRef<HTMLDivElement>(null);
  const pane2Ref = useRef<HTMLDivElement>(null);

  const isHorizontal = direction === 'horizontal';

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    onResizeStart?.();
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !splitterRef.current || !pane1Ref.current || !pane2Ref.current) return;

    const container = splitterRef.current.parentElement;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    let newSize;

    if (isHorizontal) {
      const clientX = e.clientX;
      newSize = clientX - containerRect.left;
      const containerWidth = containerRect.width;
      if (maxSize !== undefined && newSize > maxSize) newSize = maxSize;
      if (newSize < minSize) newSize = minSize;
      if (containerWidth - newSize < minSize) newSize = containerWidth - minSize;
       // Ensure second pane also respects minSize
      if (newSize > containerWidth - minSize) newSize = containerWidth - minSize;

    } else { // Vertical
      const clientY = e.clientY;
      newSize = clientY - containerRect.top;
      const containerHeight = containerRect.height;
      if (maxSize !== undefined && newSize > maxSize) newSize = maxSize;
      if (newSize < minSize) newSize = minSize;
      if (containerHeight - newSize < minSize) newSize = containerHeight - minSize;
      // Ensure second pane also respects minSize
      if (newSize > containerHeight - minSize) newSize = containerHeight - minSize;
    }
    setPane1Size(newSize);
  }, [isDragging, isHorizontal, minSize, maxSize]);

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    if (pane1Ref.current && pane2Ref.current) {
        const pane1CurrentSize = isHorizontal ? pane1Ref.current.offsetWidth : pane1Ref.current.offsetHeight;
        const pane2CurrentSize = isHorizontal ? pane2Ref.current.offsetWidth : pane2Ref.current.offsetHeight;
        onResizeEnd?.([pane1CurrentSize, pane2CurrentSize]);
    }
  };
  
  useEffect(() => {
    // Cleanup event listeners if component unmounts while dragging
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);


  const containerClasses = ['splitter-container', `splitter-${direction}`, className].filter(Boolean).join(' ');
  const pane1ComputedStyle: React.CSSProperties = {
    ...pane1Style,
    [isHorizontal ? 'width' : 'height']: typeof pane1Size === 'number' ? `${pane1Size}px` : pane1Size,
    [isHorizontal ? 'minWidth' : 'minHeight']: `${minSize}px`,
    ...(maxSize && { [isHorizontal ? 'maxWidth' : 'maxHeight']: `${maxSize}px` }),
  };
  const pane2ComputedStyle: React.CSSProperties = {
    ...pane2Style,
    flex: 1, // Takes remaining space
    [isHorizontal ? 'minWidth' : 'minHeight']: `${minSize}px`,
    ...(maxSize && { [isHorizontal ? 'maxWidth' : 'maxHeight']: `calc(100% - ${typeof pane1Size === 'number' ? `${pane1Size}px` : pane1Size} - 6px)` }), // 6px for splitter width/height
  };

  const splitterBarClasses = ['splitter-bar', `splitter-bar-${direction}`].join(' ');

  return (
    <div ref={splitterRef} className={containerClasses} style={style} {...rest}>
      <div ref={pane1Ref} className="splitter-pane splitter-pane-1" style={pane1ComputedStyle}>
        {children[0]}
      </div>
      <div
        className={splitterBarClasses}
        style={customSplitterStyle}
        onMouseDown={handleMouseDown}
        role="separator"
        aria-valuenow={typeof pane1Size === 'number' ? pane1Size : undefined}
        aria-orientation={direction}
      >
        <div className="splitter-bar-handle" />
      </div>
      <div ref={pane2Ref} className="splitter-pane splitter-pane-2" style={pane2ComputedStyle}>
        {children[1]}
      </div>
    </div>
  );
};

export default Splitter;
