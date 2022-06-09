import React from "react";
import elements from "../../styles/Elements.module.css";

export const EffektButtonType = {
  PRIMARY: elements.buttonprimary,
  SECONDARY: elements.buttonsecondary,
  TERTIARY: elements.buttontertiary,
};

export const EffektButton: React.FC<{
  onClick: (e?: any) => void;
  role?: string;
  type?: string;
  children: React.ReactNode;
  cy?: string;
  className?: string;
}> = ({ onClick, role, type = EffektButtonType.PRIMARY, children, cy, className }) => {
  return (
    <button
      className={[elements.button, type, className].join(" ")}
      onClick={onClick}
      role={role}
      data-cy={cy}
    >
      {children}
    </button>
  );
};
