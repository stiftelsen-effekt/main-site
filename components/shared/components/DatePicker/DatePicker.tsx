import React, { useRef } from "react";
import { useClickOutsideAlerter } from "../../../../hooks/useClickOutsideAlerter";
import style from "./DatePicker.module.scss";

export const DatePicker: React.FC<{
  selected?: number;
  onChange: (selected: number) => void;
  onClickOutside?: () => void;
  className?: string;
  lastDayOfMonthOption: boolean;
  lastDayOfMonthLabel?: string;
}> = ({
  selected,
  onChange,
  onClickOutside,
  className,
  lastDayOfMonthOption,
  lastDayOfMonthLabel,
}) => {
  const dates = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
    27, 28,
  ];

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
            onChange(date);
          }}
          className={
            style["datepicker-button"] +
            " " +
            (selected === date ? style["datepicker-button--selected"] : "")
          }
          data-cy={`date-picker-button-${date}`}
        >
          {date}
        </button>
      ))}
      {lastDayOfMonthOption && (
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
            {lastDayOfMonthLabel}
          </button>
        </div>
      )}
    </div>
  );
};
