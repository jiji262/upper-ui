// src/components/ui/other/Affix/Affix.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Affix.css';

interface AffixProps {
  offsetTop?: number;
  offsetBottom?: number;
  target?: () => Window | HTMLElement | null; // Default window
  onChange?: (affixed: boolean) => void;
  children: React.ReactNode;
  className?: string; // Applied to the wrapper when affixed
  style?: React.CSSProperties; // Applied to the wrapper when affixed
  wrapperClassName?: string; // Applied to the placeholder div
}

const Affix: React.FC<AffixProps> = ({
  offsetTop,
  offsetBottom,
  target: getTarget = () => window,
  onChange,
  children,
  className,
  style,
  wrapperClassName,
}) => {
  const [isAffixed, setIsAffixed] = useState(false);
  const [placeholderStyle, setPlaceholderStyle] = useState<React.CSSProperties | null>(null);
  const [affixStyle, setAffixStyle] = useState<React.CSSProperties | null>(null);
  
  const placeholderRef = useRef<HTMLDivElement>(null); // For the placeholder div
  const contentRef = useRef<HTMLDivElement>(null);   // For the actual content that gets fixed

  const getTargetElement = useCallback(() => {
    const targetNode = getTarget();
    return targetNode || window;
  }, [getTarget]);

  const updatePosition = useCallback(() => {
    const placeholderNode = placeholderRef.current;
    const contentNode = contentRef.current;
    if (!placeholderNode || !contentNode) return;

    const targetElement = getTargetElement();
    const targetIsWindow = targetElement === window;
    
    const placeholderRect = placeholderNode.getBoundingClientRect();
    // const contentRect = contentNode.getBoundingClientRect(); // Not needed if using placeholderRect for dimensions

    let newIsAffixed = false;
    let newAffixStyle: React.CSSProperties = { ...style }; // Start with user-provided style

    if (offsetTop !== undefined) {
      const targetRectTop = targetIsWindow ? 0 : (targetElement as HTMLElement).getBoundingClientRect().top;
      if (placeholderRect.top - targetRectTop <= offsetTop) {
        newIsAffixed = true;
        newAffixStyle.position = 'fixed';
        newAffixStyle.top = `${targetRectTop + offsetTop}px`;
      }
    } else if (offsetBottom !== undefined) {
      const targetRectBottom = targetIsWindow ? window.innerHeight : (targetElement as HTMLElement).getBoundingClientRect().bottom;
      if (placeholderRect.bottom + (targetIsWindow ? 0 : (targetElement as HTMLElement).scrollTop) >= targetRectBottom - offsetBottom) {
        newIsAffixed = true;
        newAffixStyle.position = 'fixed';
        newAffixStyle.bottom = `${offsetBottom}px`; // For window, bottom is from viewport bottom
        // For element target, bottom offset needs to calculate from element's bottom relative to viewport
        if (!targetIsWindow) {
            const viewportBottomOffset = window.innerHeight - (targetElement as HTMLElement).getBoundingClientRect().bottom;
            newAffixStyle.bottom = `${viewportBottomOffset + offsetBottom}px`;
        }
      }
    }
    
    if (newIsAffixed) {
        // Match placeholder dimensions to prevent layout shift
        newAffixStyle.width = `${placeholderRect.width}px`;
        newAffixStyle.height = `${placeholderRect.height}px`;
        // If affixing to top/bottom of a scrollable element, left position needs to match placeholder's
        if (!targetIsWindow) {
            newAffixStyle.left = `${placeholderRect.left}px`;
        }
    }


    if (isAffixed !== newIsAffixed) {
      setIsAffixed(newIsAffixed);
      onChange?.(newIsAffixed);
      if (newIsAffixed) {
        setPlaceholderStyle({ width: placeholderRect.width, height: placeholderRect.height });
      } else {
        setPlaceholderStyle(null);
      }
    }
    
    setAffixStyle(newIsAffixed ? newAffixStyle : null);

  }, [offsetTop, offsetBottom, getTargetElement, isAffixed, onChange, style]);


  useEffect(() => {
    const targetElement = getTargetElement();
    targetElement.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition); // Also update on window resize
    
    // Initial check
    updatePosition();

    return () => {
      targetElement.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [getTargetElement, updatePosition]);
  
  // Re-run updatePosition if props that affect it change
  useEffect(() => {
    updatePosition();
  }, [offsetTop, offsetBottom, style]);


  const affixClasses = [
    'ant-affix',
    isAffixed ? 'ant-affix-fixed' : '', // Custom class when fixed
    className, // User-provided class for fixed state
  ].filter(Boolean).join(' ');
  
  // The placeholder takes up space when content is affixed.
  // The content itself is in `contentRef` and gets fixed positioning.

  return (
    <div ref={placeholderRef} style={isAffixed ? placeholderStyle || undefined : undefined} className={wrapperClassName}>
      <div ref={contentRef} className={isAffixed ? affixClasses : className} style={isAffixed ? affixStyle || undefined : style}>
        {children}
      </div>
    </div>
  );
};

export default Affix;
