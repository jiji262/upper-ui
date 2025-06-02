// src/components/ui/navigation/Anchor/Anchor.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import AnchorLink, { AnchorLinkProps } from './AnchorLink';
import './Anchor.css';

interface AnchorProps {
  affix?: boolean;
  bounds?: number; // Scrolling boundary offset, antd default is 5
  container?: Window | HTMLElement; // Defaults to window
  getCurrentAnchor?: (activeLink: string) => string; // Customize the active link
  offsetTop?: number;
  showInkInFixed?: boolean; // Whether to show ink when affix is true
  targetOffset?: number; // Offset from top when scrolling to an anchor
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>, link: { title: React.ReactNode; href: string }) => void;
  onChange?: (currentActiveLink: string) => void;
  children?: React.ReactNode; // Should be AnchorLink components
  direction?: 'vertical' | 'horizontal';
  items?: AnchorLinkProps[]; // Alternative way to pass links
  replace?: boolean; // Whether to update browser history
}

interface AnchorContextProps {
  registerLink: (href: string, nodeRef: React.RefObject<HTMLAnchorElement>) => void;
  unregisterLink: (href: string) => void;
  activeLink: string | null;
  handleClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

export const AnchorContext = React.createContext<AnchorContextProps | null>(null);

const Anchor: React.FC<AnchorProps> = ({
  affix = true,
  bounds = 5,
  container: customContainer,
  getCurrentAnchor,
  offsetTop = 0,
  showInkInFixed = false,
  targetOffset = 0,
  onClick,
  onChange,
  children,
  direction = 'vertical',
  items,
  replace = false,
}) => {
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [isFixed, setIsFixed] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const inkRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<Map<string, React.RefObject<HTMLAnchorElement>>>(new Map());
  const scrollContainer = customContainer || window;

  const registerLink = useCallback((href: string, nodeRef: React.RefObject<HTMLAnchorElement>) => {
    linkRefs.current.set(href, nodeRef);
  }, []);

  const unregisterLink = useCallback((href: string) => {
    linkRefs.current.delete(href);
  }, []);

  const getContainer = (): HTMLElement => {
    return customContainer instanceof HTMLElement ? customContainer : document.documentElement;
  }

  const handleScroll = useCallback(() => {
    const containerElement = getContainer();
    const scrollTop = (customContainer instanceof HTMLElement ? customContainer.scrollTop : window.scrollY) + targetOffset;

    // Handle affix behavior
    if (affix && anchorRef.current) {
        const anchorTop = anchorRef.current.getBoundingClientRect().top;
        if (anchorTop <= offsetTop && !isFixed) {
            setIsFixed(true);
        } else if (anchorTop > offsetTop && isFixed) {
            setIsFixed(false);
        }
    }
    
    let currentActiveLink: string | null = null;
    let minDistance = Infinity;

    linkRefs.current.forEach((nodeRef, href) => {
      const targetElement = document.getElementById(href.substring(1)); // Assumes href is like #target-id
      if (targetElement) {
        const elementTop = targetElement.getBoundingClientRect().top + (customContainer instanceof HTMLElement ? 0 : window.scrollY) - (customContainer instanceof HTMLElement ? containerElement.getBoundingClientRect().top : 0);
        const distance = Math.abs(scrollTop - elementTop);

        if (elementTop <= scrollTop + bounds && scrollTop < elementTop + targetElement.offsetHeight - bounds) {
             // If multiple are in view, pick the one closest to the top of the viewport (or targetOffset)
            if (distance < minDistance) {
                minDistance = distance;
                currentActiveLink = href;
            }
        } else if (elementTop > scrollTop + bounds && currentActiveLink === null && href === Array.from(linkRefs.current.keys())[0]){
            // If no link is "active" (e.g. scrolled above all targets), and this is the first link, make it active.
            // This is a simplification. AntD might have more complex logic for this edge case.
        }
      }
    });
    
    if (getCurrentAnchor) {
        currentActiveLink = getCurrentAnchor(currentActiveLink || '');
    }

    if (activeLink !== currentActiveLink) {
      setActiveLink(currentActiveLink);
      onChange?.(currentActiveLink || '');
    }
  }, [targetOffset, bounds, affix, offsetTop, isFixed, getCurrentAnchor, activeLink, onChange, customContainer]);


  useEffect(() => {
    scrollContainer.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [scrollContainer, handleScroll]);


  // Update ink position
  useEffect(() => {
    if (inkRef.current && activeLink && (showInkInFixed || !isFixed)) {
      const activeNodeRef = linkRefs.current.get(activeLink);
      if (activeNodeRef && activeNodeRef.current && anchorRef.current) {
        const linkElement = activeNodeRef.current;
        const linkTop = linkElement.offsetTop; // Relative to its offsetParent (likely the AnchorLink div)
        const linkHeight = linkElement.offsetHeight;

        if (direction === 'vertical') {
            inkRef.current.style.top = `${linkTop}px`;
            inkRef.current.style.height = `${linkHeight}px`;
            inkRef.current.style.display = 'block';
        } else { // Horizontal
            inkRef.current.style.left = `${linkElement.offsetLeft}px`;
            inkRef.current.style.width = `${linkElement.offsetWidth}px`;
            inkRef.current.style.display = 'block';
        }

      } else if (inkRef.current) {
        inkRef.current.style.display = 'none';
      }
    } else if (inkRef.current) {
      inkRef.current.style.display = 'none';
    }
  }, [activeLink, direction, showInkInFixed, isFixed, children, items]); // Re-run if children/items change, affecting linkRefs

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    onClick?.(e, { title: linkRefs.current.get(href)?.current?.textContent || '', href });

    const targetElement = document.getElementById(href.substring(1));
    if (targetElement) {
      let newScrollTop = targetElement.getBoundingClientRect().top + (customContainer instanceof HTMLElement ? 0 : window.scrollY) - (customContainer instanceof HTMLElement ? getContainer().getBoundingClientRect().top : 0) - targetOffset;
      
      // Adjust for fixed header if offsetTop is used for that purpose
      if (isFixed && affix) {
        // This logic might need refinement based on how offsetTop is intended to be used
        // newScrollTop -= offsetTop; 
      }

      (customContainer || window).scrollTo({
        top: newScrollTop,
        behavior: 'smooth',
      });

      if (replace) {
        window.history.replaceState(null, '', href);
      } else {
        window.history.pushState(null, '', href);
      }
      // Manually set active link and trigger onChange for immediate feedback
      // handleScroll will eventually catch up, but this makes UI more responsive
      if (activeLink !== href) {
        setActiveLink(href);
        onChange?.(href);
      }
    }
  };
  
  const anchorClasses = [
    'ant-anchor',
    `ant-anchor-${direction}`,
    isFixed ? 'ant-anchor-fixed' : '',
  ].filter(Boolean).join(' ');

  const wrapperStyle: React.CSSProperties = isFixed ? { top: `${offsetTop}px`, maxHeight: `calc(100vh - ${offsetTop}px)` } : {};

  const linksToRender = items 
    ? items.map(item => <AnchorLink key={item.href} {...item} />) 
    : children;

  return (
    <AnchorContext.Provider value={{ registerLink, unregisterLink, activeLink, handleClick }}>
      <div ref={anchorRef} className={anchorClasses} style={wrapperStyle}>
        <div className="ant-anchor-wrapper">
          <span ref={inkRef} className="ant-anchor-ink-ball" />
          {linksToRender}
        </div>
      </div>
    </AnchorContext.Provider>
  );
};

// Assign AnchorLink as a static property of Anchor for easy access (e.g., Anchor.Link)
(Anchor as any).Link = AnchorLink;

export default Anchor;
