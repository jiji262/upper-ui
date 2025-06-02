// src/components/ui/other/Util/util.ts

// --- DOM Utilities ---

/**
 * Get the current scroll position of the window or a specific element.
 * @param target Optional. The element to get scroll position from. Defaults to window.
 * @returns Object with { scrollLeft, scrollTop }
 */
export function getScroll(target?: HTMLElement | Window | null): { scrollLeft: number; scrollTop: number } {
  const T = target || window;
  return {
    scrollLeft: T === window ? window.pageXOffset : (T as HTMLElement).scrollLeft,
    scrollTop: T === window ? window.pageYOffset : (T as HTMLElement).scrollTop,
  };
}

/**
 * Get the dimensions of the viewport.
 * @returns Object with { width, height }
 */
export function getViewportSize(): { width: number; height: number } {
  return {
    width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
  };
}

/**
 * Check if an element is currently in the viewport.
 * @param el The element to check.
 * @param partiallyVisible If true, returns true if any part of the element is visible. Default false.
 * @returns boolean
 */
export function isInViewport(el: HTMLElement, partiallyVisible: boolean = false): boolean {
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  const viewportHeight = getViewportSize().height;
  const viewportWidth = getViewportSize().width;

  if (partiallyVisible) {
    return (
      rect.bottom > 0 &&
      rect.right > 0 &&
      rect.left < viewportWidth &&
      rect.top < viewportHeight
    );
  }
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= viewportHeight &&
    rect.right <= viewportWidth
  );
}


// --- Event Utilities ---

/**
 * Add an event listener to an element, cross-browser.
 * @param element The element to attach the event to.
 * @param type The type of event (e.g., 'click').
 * @param handler The event handler function.
 * @param options Optional event listener options.
 */
export function addEventListener(
  element: EventTarget,
  type: string,
  handler: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
): void {
  element.addEventListener(type, handler, options);
}

/**
 * Remove an event listener from an element, cross-browser.
 * @param element The element to remove the event from.
 * @param type The type of event (e.g., 'click').
 * @param handler The event handler function.
 * @param options Optional event listener options.
 */
export function removeEventListener(
  element: EventTarget,
  type: string,
  handler: EventListenerOrEventListenerObject,
  options?: boolean | EventListenerOptions
): void {
  element.removeEventListener(type, handler, options);
}


// --- Debounce and Throttle (from Ant Design's internal utils or common implementations) ---

/**
 * Debounce function: Limits the rate at which a function can fire.
 * @param func The function to debounce.
 * @param wait The time to wait before firing in milliseconds.
 * @param immediate If true, trigger the function on the leading edge instead of the trailing.
 * @returns A debounced version of the function.
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null;
  return function(this: any, ...args: Parameters<T>) {
    const context = this;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

/**
 * Throttle function: Ensures a function is only executed at most once every specified period.
 * @param func The function to throttle.
 * @param wait The time period in milliseconds.
 * @param options Optional options object {leading, trailing}.
 * @returns A throttled version of the function.
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): (...args: Parameters<T>) => any {
  let timeout: NodeJS.Timeout | null = null;
  let context: any;
  let args: any;
  let result: any;
  let previous = 0;
  if (!options) options = {};

  const later = function() {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  const throttled = function(this: any, ...params: Parameters<T>) {
    const now = Date.now();
    if (!previous && options.leading === false) previous = now;
    const remaining = wait - (now - previous);
    context = this;
    args = params;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  (throttled as any).cancel = () => {
    if (timeout) clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
}


// --- Other Utilities ---

/**
 * Generate a unique ID.
 * @param prefix Optional prefix for the ID.
 * @returns A unique string ID.
 */
let uniqueIdCounter = 0;
export function getUniqueId(prefix: string = 'ant-unique-'): string {
  return `${prefix}${++uniqueIdCounter}`;
}

/**
 * A simple utility to call a function if it exists.
 * @param func The function to call.
 * @param args Arguments to pass to the function.
 */
export function callIfFunction(func: Function | undefined | null, ...args: any[]): any {
    if (typeof func === 'function') {
        return func(...args);
    }
}

// Example: Color manipulation utils (very basic)
// For more advanced color utils, a library like `tinycolor2` is recommended.
export function hexToRgba(hex: string, alpha: number = 1): string | null {
    if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) return null;
    let c = hex.substring(1).split('');
    if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    const num = parseInt(c.join(''), 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r},${g},${b},${alpha})`;
}


// This is just a small collection. Ant Design's internal utils are extensive.
// Other common utils could include:
// - Type checking (isString, isNumber, isObject, etc.)
// - Array manipulation (flatten, unique)
// - String manipulation (camelCase, kebabCase)
// - DOM manipulation (addClass, removeClass, hasClass, getStyle, setStyle)
// - Keycode constants
// - Animation frame helpers (requestAnimationFrame polyfill)
// - Warning/error logging utilities for development
// - etc.

export const KeyCode = {
    ESC: 27,
    ENTER: 13,
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    TAB: 9,
    SPACE: 32,
};
