import { useSyncExternalStore } from "react";

const subscribe = (onChange: () => void) => {
  const queries = [
    window.matchMedia("(max-width: 1520px) and (min-width: 1181px)"),
    window.matchMedia("(max-width: 1180px)"),
  ];

  queries.forEach((query) => {
    query.addEventListener("change", onChange);
  });

  return () => {
    queries.forEach((query) => {
      query.removeEventListener("change", onChange);
    });
  };
};

const getSnapshot = () => parseFloat(getComputedStyle(document.documentElement).fontSize);
const getServerSnapshot = () => 16;

export const useRemSize = () => {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
