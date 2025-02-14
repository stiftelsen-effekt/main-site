import { useState, useEffect, useRef } from "react";

const debounce = (fn: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

export const useIsMobile = (delay = 250) => {
  const [isMobile, setIsMobile] = useState(true); // Default to mobile

  useEffect(() => {
    const handleResize = debounce(() => {
      setIsMobile(window.innerWidth < 1180);
    }, delay);

    // Set initial value
    setIsMobile(window.innerWidth < 1180);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [delay]);

  return isMobile;
};
