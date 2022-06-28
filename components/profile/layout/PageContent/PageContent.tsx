import React, { ReactNode } from "react";
import elements from "./PageContent.module.scss";

export const PageContent: React.FC<{ children: ReactNode[] | ReactNode }> = ({ children }) => {
  return <section className={elements.pageContent}>{children}</section>;
};
