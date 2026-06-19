import React from "react";
import elements from "./EffektButton.module.scss";

export const EffektButtonVariant = {
  PRIMARY: elements.buttonprimary,
  SECONDARY: elements.buttonsecondary,
  TERTIARY: elements.buttontertiary,
  ACCENT: elements.buttonaccent,
};

interface EffektButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string;
  cy?: string;
  selected?: boolean;
  useCheckmark?: boolean;
  squared?: boolean;
  extraMargin?: boolean;
  noMinWidth?: boolean;
  fullWidth?: boolean;
}

export const EffektButton: React.FC<EffektButtonProps> = ({
  onClick,
  role,
  variant = EffektButtonVariant.PRIMARY,
  children,
  cy,
  className,
  disabled,
  selected,
  useCheckmark,
  squared,
  extraMargin,
  noMinWidth = false,
  fullWidth = false,
  ...props
}) => {
  const styleClasses = [elements.button, variant, className];
  if (selected) {
    styleClasses.push(elements.selected);
  }
  if (useCheckmark) {
    styleClasses.push(elements.useCheckmark);
  }
  if (squared) {
    styleClasses.push(elements.button__squared);
  }
  if (extraMargin) {
    styleClasses.push(elements.extraMargin);
  }
  if (disabled) {
    styleClasses.push(elements.disabledBtn);
  }
  if (noMinWidth) {
    styleClasses.push(elements.noMinWidth);
  }
  if (fullWidth) {
    styleClasses.push(elements.fullWidth);
  }
  const styleClassesName = styleClasses.join(" ");

  return (
    <button
      className={styleClassesName}
      disabled={disabled}
      onClick={(e) => {
        e.currentTarget.blur();
        if (!disabled) onClick?.(e);
      }}
      role={role}
      data-cy={cy}
      {...props}
    >
      {children}
    </button>
  );
};
