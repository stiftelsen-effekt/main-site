import { useState, useEffect, RefObject, useRef } from "react";

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

/**
 * Hook to observe and return heights for multiple elements
 * @param elementRefs Array of React ref objects pointing to target elements
 * @returns Array of current heights for each element in pixels
 */
export const useMultipleElementHeights = <T extends HTMLElement>(
  elementRefs: RefObject<T>[],
): number[] => {
  // Initialize heights array with zeros matching the length of refs array
  const [heights, setHeights] = useState<number[]>(() => new Array(elementRefs.length).fill(0));

  // Main effect to set up observers and measure heights
  useEffect(() => {
    // Skip if no refs provided
    if (!elementRefs.length) return;

    // Create observers for each element
    const observers: ResizeObserver[] = [];

    // Immediately measure heights once on mount
    const measureInitialHeights = () => {
      const newHeights = [...heights];
      let hasChanges = false;

      elementRefs.forEach((ref, index) => {
        const element = ref.current;
        if (!element) return;

        const height = Math.round(element.getBoundingClientRect().height);
        if (height > 0 && newHeights[index] !== height) {
          newHeights[index] = height;
          hasChanges = true;
        }
      });

      if (hasChanges) {
        setHeights(newHeights);
      }
    };

    // Initial measurement - do it immediately
    measureInitialHeights();

    // And also after a short delay to ensure content is rendered
    const initialTimerId = setTimeout(measureInitialHeights, 50);

    // Set up resize observers for continuous tracking
    elementRefs.forEach((ref, index) => {
      const element = ref.current;
      if (!element) return;

      const resizeObserver = new ResizeObserver((entries) => {
        const newHeight = Math.round(entries[0].contentRect.height);
        if (newHeight > 0) {
          setHeights((prevHeights) => {
            if (prevHeights[index] === newHeight) return prevHeights;
            const newHeights = [...prevHeights];
            newHeights[index] = newHeight;
            return newHeights;
          });
        }
      });

      // Start observing
      resizeObserver.observe(element);
      observers.push(resizeObserver);
    });

    // Cleanup function
    return () => {
      clearTimeout(initialTimerId);
      observers.forEach((observer) => observer.disconnect());
    };
  }, [elementRefs]); // Only re-run if the refs array changes

  // Handle array length changes
  useEffect(() => {
    if (heights.length !== elementRefs.length) {
      setHeights((prev) => {
        const newHeights = new Array(elementRefs.length).fill(0);
        // Preserve existing height values when possible
        prev.forEach((height, i) => {
          if (i < elementRefs.length) {
            newHeights[i] = height;
          }
        });
        return newHeights;
      });
    }
  }, [elementRefs.length, heights.length]);

  return heights;
};
