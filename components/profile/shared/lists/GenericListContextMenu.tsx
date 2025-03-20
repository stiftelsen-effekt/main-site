import React, { ReactNode } from "react";
import style from "./Lists.module.scss";

export type GenericListContextMenuOptions = { label: string; icon?: ReactNode }[];
export type GenericListContextMenuSelect<T> = (option: string, element: T) => void;

type Props<T> = {
  options: GenericListContextMenuOptions;
  element: T;
  onSelect: GenericListContextMenuSelect<T>;
};

export const GenericListContextMenu = <T extends unknown>({
  options,
  element,
  onSelect,
}: Props<T>) => {
  return (
    <div className={style.contextDropdownContainer}>
      {options.map((option, index) => (
        <div
          className={style.contextDropdownItem}
          key={index}
          onClick={() => onSelect(option.label, element)}
        >
          {option.icon}
          <span>{option.label}</span>
        </div>
      ))}
    </div>
  );
};
