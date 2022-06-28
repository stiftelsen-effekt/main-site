import React, { useRef } from "react";
import { useClickOutsideAlerter } from "../../../../hooks/useClickOutsideAlerter";
import style from "./DatePicker.module.scss";

export const DatePicker: React.FC<{
  selected?: number;
  onChange: (selected: number) => void;
  onClickOutside?: () => void;
  className?: string;
}> = ({ selected, onChange, onClickOutside, className }) => {
  const dates = [...Array.from(Array(29).keys()).map((x) => x.toString())].slice(1, 29);

  const datepickerContainerRef = useRef<HTMLDivElement>(null);
  useClickOutsideAlerter(datepickerContainerRef, onClickOutside ? onClickOutside : () => {});

  return (
    <div
      className={[style["datepicker-wrapper"], className].join(" ")}
      ref={datepickerContainerRef}
      data-cy="date-picker"
    >
      {dates.map((date) => (
        <div
          key={date}
          onClick={() => onChange(parseInt(date))}
          className={
            style["datepicker-button"] +
            " " +
            (selected?.toString() === date ? style["datepicker-button--selected"] : "")
          }
          data-cy={`date-picker-button-${date}`}
        >
          {date}
        </div>
      ))}
      <div className={style["datepicker-last-row"]}>
        <div
          className={
            style["datepicker-button-last"] +
            " " +
            (selected === 0 ? style["datepicker-button-last--selected"] : "")
          }
          onClick={() => onChange(0)}
          data-cy="date-picker-button-last"
        >
          Siste dag i måneden
        </div>
      </div>
    </div>
  );
};
