import React, { Children } from "react";

export const InfoBox: React.FC<{ children: React.ReactNode; style: string }> =
  ({ children, style }) => {
    return <div className={style}>{children}</div>;
  };
