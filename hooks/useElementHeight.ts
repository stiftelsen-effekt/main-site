import { useState, useEffect, RefObject } from "react";

/**
 * Hook to observe and return an element's height
 * @param elementRef React ref object pointing to the target element
 * @returns The current height of the element in pixels
 */
export const useElementHeight = <T extends HTMLElement>(
  elementRef: RefObject<T | null>,
): number => {
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Set initial height
    setHeight(element.clientHeight);

    // Create resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      const newHeight = Math.round(entries[0].contentRect.height);
      setHeight(newHeight);
    });

    // Start observing
    resizeObserver.observe(element);

    // Cleanup
    return () => {
      resizeObserver.disconnect();
    };
  }, [elementRef]);

  return height;
};
