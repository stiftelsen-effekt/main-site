import { useState, useEffect, RefObject } from "react";

/**
 * Hook to observe and return an element's height
 * @param elementRef React ref object pointing to the target element
 * @returns The current height of the element in pixels
 */
export const useElementHeight = <T extends HTMLElement>(elementRef: RefObject<T>): number => {
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
  const [heights, setHeights] = useState<number[]>(new Array(elementRefs.length).fill(0));

  useEffect(() => {
    // Skip if no refs provided
    if (!elementRefs.length) return;

    // Create observers for each element
    const observers: ResizeObserver[] = [];
    const elements: (T | null)[] = elementRefs.map((ref) => ref.current);

    // Update a specific height in the heights array
    const updateHeight = (index: number, newHeight: number) => {
      setHeights((prevHeights) => {
        const newHeights = [...prevHeights];
        newHeights[index] = newHeight;
        return newHeights;
      });
    };

    // Set initial heights and create observers
    elements.forEach((element, index) => {
      if (!element) return;

      // Set initial height
      updateHeight(index, element.clientHeight);

      // Create and store resize observer
      const resizeObserver = new ResizeObserver((entries) => {
        const newHeight = Math.round(entries[0].contentRect.height);
        updateHeight(index, newHeight);
      });

      // Start observing
      resizeObserver.observe(element);
      observers.push(resizeObserver);
    });

    // Cleanup
    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [elementRefs]); // Only re-run if the refs array changes

  return heights;
};
