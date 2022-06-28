import React from "react";
import { WidgetWrapper } from "./Host.style";

export const Host: React.FC = ({ children }) => {
  return <WidgetWrapper>{children}</WidgetWrapper>;
};
