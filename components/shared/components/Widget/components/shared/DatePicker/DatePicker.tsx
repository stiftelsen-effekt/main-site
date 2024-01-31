import React, { useRef } from "react";
import { useClickOutsideAlerter } from "../../../../../../../hooks/useClickOutsideAlerter";
import style from "./DatePicker.module.scss";
import { DatePickerInputConfiguration } from "../../../../DatePicker/DatePickerInput";

export const DatePicker: React.FC<{
  selected?: number;
  onChange: (selected: number) => void;
  onClickOutside?: () => void;
  className?: string;
  configuration: DatePickerInputConfiguration;
}> = ({ selected, onChange, onClickOutside, className, configuration }) => {
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
        <button
          key={date}
          tabIndex={0}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.blur();
            onChange(parseInt(date));
          }}
          className={
            style["datepicker-button"] +
            " " +
            (selected?.toString() === date ? style["datepicker-button--selected"] : "")
          }
          data-cy={`date-picker-button-${date}`}
        >
          {date}
        </button>
      ))}
      <div className={style["datepicker-last-row"]}>
        <button
          tabIndex={0}
          className={
            style["datepicker-button-last"] +
            " " +
            (selected === 0 ? style["datepicker-button-last--selected"] : "")
          }
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.blur();
            onChange(0);
          }}
          data-cy="date-picker-button-last"
        >
          {configuration.last_day_of_month_label}
        </button>
      </div>
    </div>
  );
};
