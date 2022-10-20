import React from "react";
import style from "./Lists.module.scss";

export type GenericListContextMenuOptions = { label: string; icon?: JSX.Element }[];
export type GenericListContextMenuSelect = (option: string) => void;

export const GenericListContextMenu: React.FC<{
  options: GenericListContextMenuOptions;
  onSelect: GenericListContextMenuSelect;
}> = ({ options, onSelect }) => {
  return (
    <div className={style.contextDropdownContainer}>
      {options.map((option, index) => (
        <div
          className={style.contextDropdownItem}
          key={index}
          onClick={() => onSelect(option.label)}
        >
          {option.icon}
          <span>{option.label}</span>
        </div>
      ))}
    </div>
  );
};
