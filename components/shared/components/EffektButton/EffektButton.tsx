import React from "react";
import elements from "./EffektButton.module.scss";

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
  disabled?: boolean;
  selected?: boolean;

}> = ({ onClick, role, type = EffektButtonType.PRIMARY, children, cy, className, disabled, selected }) => {
  const styleClasses = [elements.button, type, className]
  if (selected) {
    styleClasses.push(elements.selected)
  }
  const styleClassesName = styleClasses.join(" ")
  
  return (
    <button
      className={styleClassesName}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.blur();
        onClick();
      }}
      role={role}
      data-cy={cy}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
