import React from "react";
import elements from "../../styles/Elements.module.css";

export const EffektButtonType = {
  PRIMARY: elements.buttonprimary,
  SECONDARY: elements.buttonsecondary,
  TERTIARY: elements.buttontertiary
}

export const EffektButton: React.FC<{ onClick: () => void, role?: string, type?: string, children: React.ReactNode, cy?: string }> = ({ onClick, role, type = EffektButtonType.PRIMARY, children, cy }) => {
  return <button 
    className={elements.button + " " + type} 
    onClick={onClick} 
    role={role}
    data-cy={cy}>
      {children}
    </button>
}