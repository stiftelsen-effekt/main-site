import { useEffect, RefObject } from "react";

/**
 * Hook to observe and track an element's height changes
 * @param elementRef React ref object pointing to the target element
 * @param onHeightChange Callback function to handle height changes
 */
export const useElementHeight = <T extends HTMLElement>(
  elementRef: RefObject<T>,
  onHeightChange: (height: number) => void,
) => {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Set initial height
    onHeightChange(element.clientHeight);

    // Create resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      const newHeight = Math.round(entries[0].contentRect.height);
      onHeightChange(newHeight);
    });

    // Start observing
    resizeObserver.observe(element);

    // Cleanup
    return () => {
      resizeObserver.disconnect();
    };
  }, [elementRef.current, onHeightChange]);
};
