import { useCallback, useSyncExternalStore } from "react";

const debounce = (fn: () => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;

  const debounced = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(fn, delay);
  };
  debounced.cancel = () => clearTimeout(timeoutId);

  return debounced;
};

const getSnapshot = () => window.innerWidth < 1180;
// Default to mobile on the server and during hydration
const getServerSnapshot = () => true;

export const useIsMobile = (delay = 250) => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const handleResize = debounce(onChange, delay);

      window.addEventListener("resize", handleResize);
      return () => {
        handleResize.cancel();
        window.removeEventListener("resize", handleResize);
      };
    },
    [delay],
  );

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
