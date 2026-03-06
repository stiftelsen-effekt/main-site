import React, { createContext, useContext } from "react";

export type MainLocale = "no" | "sv" | "dk" | "en" | "et";

export const MainLocaleContext = createContext<MainLocale | null>(null);

export const useMainLocale = (): MainLocale => {
  const context = useContext(MainLocaleContext);
  return context ?? "no";
};
