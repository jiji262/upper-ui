// src/components/ui/other/Util/Util.stories.tsx
import React, { useEffect, useState, useRef } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import * as Utils from './util'; // Import all utils
import Button from '../../general/Button/Button'; // For event listener demo

// This story doesn't render a "Util" component, but demonstrates the functions.
export default {
  title: 'Other/Utils (Demonstration)',
  // component: null, // No single component to associate
  parameters: {
    docs: {
      description: {
        component: 'This story demonstrates various utility functions available in `src/components/ui/other/Util/util.ts`. These are not UI components but helper functions.',
      },
    },
  },
} as Meta;

export const DOMUtils: StoryFn = () => {
  const [scrollPos, setScrollPos] = useState<{ scrollLeft: number; scrollTop: number } | null>(null);
  const [viewportSize, setViewportSize] = useState<{ width: number; height: number } | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  const [isElInViewport, setIsElInViewport] = useState<boolean | null>(null);

  useEffect(() => {
    setScrollPos(Utils.getScroll());
    setViewportSize(Utils.getViewportSize());
    const handleScrollResize = Utils.throttle(() => {
        setScrollPos(Utils.getScroll());
        setViewportSize(Utils.getViewportSize());
        if (elementRef.current) {
            setIsElInViewport(Utils.isInViewport(elementRef.current, true));
        }
    }, 200);
    Utils.addEventListener(window, 'scroll', handleScrollResize);
    Utils.addEventListener(window, 'resize', handleScrollResize);
    if (elementRef.current) setIsElInViewport(Utils.isInViewport(elementRef.current, true)); // Initial check

    return () => {
      Utils.removeEventListener(window, 'scroll', handleScrollResize);
      Utils.removeEventListener(window, 'resize', handleScrollResize);
    };
  }, []);

  return (
    <div style={{ padding: '20px', height: '150vh' /* Make page scrollable */ }}>
      <h3>DOM Utilities</h3>
      <p><strong>Window Scroll Position:</strong> {scrollPos ? `Left: ${scrollPos.scrollLeft}, Top: ${scrollPos.scrollTop}` : 'N/A'}</p>
      <p><strong>Viewport Size:</strong> {viewportSize ? `Width: ${viewportSize.width}, Height: ${viewportSize.height}` : 'N/A'}</p>
      
      <div ref={elementRef} style={{ marginTop: '80vh', padding: '20px', border: '2px solid #1677ff', background: '#e6f4ff' }}>
        This element is used for <code>isInViewport</code> check.
      </div>
      <p style={{position: 'fixed', bottom: '10px', left: '10px', background: 'lightyellow', padding: '5px'}}>
        <strong>Is Element In Viewport (partially)?</strong> {isElInViewport === null ? 'Checking...' : (isElInViewport ? 'Yes' : 'No')}
      </p>
      <p style={{marginTop: '20px'}}>Scroll the page to see values update (throttled).</p>
    </div>
  );
};
DOMUtils.storyName = "DOM Utilities Demo";


export const EventUtils: StoryFn = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [clickCount, setClickCount] = useState(0);

  const handleClick = Utils.debounce(() => {
    setClickCount(prev => prev + 1);
    console.log('Button clicked (debounced)! Count:', clickCount + 1); // Log to console as well
  }, 500, true); // Debounce with 500ms wait, immediate true

  useEffect(() => {
    const currentButtonRef = buttonRef.current;
    if (currentButtonRef) {
      Utils.addEventListener(currentButtonRef, 'click', handleClick);
    }
    return () => {
      if (currentButtonRef) {
        Utils.removeEventListener(currentButtonRef, 'click', handleClick);
      }
    };
  }, [handleClick]); // Re-attach if handleClick changes (though it shouldn't with useCallback/useMemo if used)

  return (
    <div style={{ padding: '20px' }}>
      <h3>Event Utilities & Debounce/Throttle Demo</h3>
      <Button ref={buttonRef as any}>Click Me (Debounced 500ms, immediate)</Button>
      <p>Button Clicked (Debounced): {clickCount} times.</p>
      <p>Try clicking rapidly. The count should only increase once per ~500ms burst due to `immediate: true`.</p>
    </div>
  );
};
EventUtils.storyName = "Event & Debounce/Throttle Demo";


export const OtherUtils: StoryFn = () => {
    const id1 = Utils.getUniqueId();
    const id2 = Utils.getUniqueId('custom-prefix-');
    const hexColor = '#2db7f5';
    const rgbaColor = Utils.hexToRgba(hexColor, 0.8);
    const invalidRgba = Utils.hexToRgba("invalid-hex");

    const testFunc = (message: string) => `Function called with: ${message}`;
    const result1 = Utils.callIfFunction(testFunc, "Hello World");
    const result2 = Utils.callIfFunction(undefined, "Should not call");


    return (
        <div style={{padding: '20px'}}>
            <h3>Other Utilities Demo</h3>
            <p><strong>getUniqueId():</strong> {id1}</p>
            <p><strong>getUniqueId('custom-prefix-'):</strong> {id2}</p>
            <hr/>
            <p><strong>hexToRgba('{hexColor}', 0.8):</strong> {rgbaColor}</p>
            <p style={{color: rgbaColor || undefined}}>This text uses the RGBA color.</p>
            <p><strong>hexToRgba('invalid-hex'):</strong> {invalidRgba === null ? "null (correct for invalid)" : invalidRgba}</p>
            <hr/>
            <p><strong>callIfFunction(testFunc, "Hello World"):</strong> {result1}</p>
            <p><strong>callIfFunction(undefined, "Should not call"):</strong> {result2 === undefined ? "undefined (correct)" : result2}</p>
            <hr/>
            <p><strong>KeyCode.ESC:</strong> {Utils.KeyCode.ESC}</p>
            <p><strong>KeyCode.ENTER:</strong> {Utils.KeyCode.ENTER}</p>
        </div>
    )
}
OtherUtils.storyName = "Misc Utilities Demo";
