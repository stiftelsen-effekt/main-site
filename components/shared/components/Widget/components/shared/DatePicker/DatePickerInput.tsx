import React, { useState } from "react";
import style from "./DatePicker.module.scss";
import { DatePicker } from "./DatePicker";

export const DatePickerInput: React.FC<{
  selected?: number;
  onChange: (selected: number) => void;
}> = ({ selected, onChange }) => {
  const [pickerOpen, setPickerOpen] = useState(false);

  let textValue = "";
  if (typeof selected !== "undefined")
    textValue = `${selected === 0 ? "Siste dag i måneden" : selected + ". månedlig"}`;

  return (
    <div className={style["datepicker-input-wrapper"]}>
      <div
        className={style["datepicker-container"]}
        style={{ display: pickerOpen ? undefined : "none" }}
      >
        <DatePicker
          selected={selected}
          onChange={(selected) => {
            onChange(selected);
            setPickerOpen(false);
          }}
          onClickOutside={() => setPickerOpen(false)}
        />
      </div>
      <input
        readOnly={true}
        type={"text"}
        value={textValue}
        onClick={() => setPickerOpen(true)}
        data-cy="date-picker-input"
      />
    </div>
  );
};
