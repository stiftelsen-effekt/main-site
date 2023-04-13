import React from "react";
import { Bookmark } from "react-feather";

export const CitationRenderer = (props) => {
  if (!props) {
    return null;
  }
  return (
    <span>
      {props.children}
      <sup>
        <Bookmark size={12} />
      </sup>
    </span>
  );
};
