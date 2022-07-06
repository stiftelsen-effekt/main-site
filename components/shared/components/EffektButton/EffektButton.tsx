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
  squared?: boolean;
  extraMargin?: boolean;
}> = ({ onClick, role, type = EffektButtonType.PRIMARY, children, cy, className, disabled, selected, squared, extraMargin }) => {
  const styleClasses = [elements.button, type, className]
  if (selected) {
    styleClasses.push(elements.selected)
  }
  if (squared) {
    styleClasses.push(elements.button__squared)
  }
  if (extraMargin) {
    styleClasses.push(elements.extraMargin)
  }
  if (disabled) {
    styleClasses.push(elements.disabledBtn)
  }
  const styleClassesName = styleClasses.join(" ")
  
  return (
    <button
      className={styleClassesName}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.blur();
        if (!disabled) onClick(e);
      }}
      role={role}
      data-cy={cy}
    >
      {children}
    </button>
  );
};
