import React, { ReactElement } from "react";
import { Bookmark } from "react-feather";

export const CitationRenderer: React.FC<{ children: ReactElement }> = ({ children }) => {
  return (
    <span>
      {children}
      <sup>
        <Bookmark size={12} />
      </sup>
    </span>
  );
};
