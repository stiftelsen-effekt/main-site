import React from "react";
import { MethodButtonWrapper } from "./MethodButton.style";

interface MethodButtonProps {
  onClick: () => void;
  onKeyDown: () => void;
  className: string;
  disabled?: boolean;
}

export const MethodButton: React.FC<MethodButtonProps> = ({
  onClick,
  onKeyDown,
  className,
  disabled,
}) => {
  return (
    <MethodButtonWrapper
      style={disabled ? { opacity: 0.5, cursor: "auto" } : {}}
      tabIndex={0}
      className={className}
      onClick={() => {
        onClick();
        (document.activeElement as HTMLElement).blur();
      }}
      onKeyDown={(e) => (e.key === " " || e.key === "Enter") && onKeyDown()}
    />
  );
};
