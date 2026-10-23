import { useSyncExternalStore } from "react";

const subscribe = (onChange: () => void) => {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
};

// Tracking is disabled when the plausible_ignore localstorage flag is set
const getSnapshot = () => localStorage.getItem("plausible_ignore") !== "true";
// Tracking is disabled on the server and during hydration
const getServerSnapshot = () => false;

export const useTrackingEnabled = () => {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
