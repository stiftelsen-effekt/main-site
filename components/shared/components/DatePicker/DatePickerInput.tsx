import React, { useState } from "react";
import style from "./DatePickerInput.module.scss";
import { DatePicker } from "./DatePicker";
import { Calendar } from "react-feather";

export type DatePickerInputConfiguration = {
  last_day_of_month_label: string;
  payment_last_date_of_month_option: boolean;
  payment_date_format_template: string;
  payment_date_last_day_of_month_template: string;
};

export const DatePickerInput: React.FC<{
  selected?: number;
  onChange: (selected: number) => void;
  configuration?: DatePickerInputConfiguration;
}> = ({ selected, configuration, onChange }) => {
  const [pickerOpen, setPickerOpen] = useState(false);

  if (!configuration) return <span>Missing date input config</span>;

  let textValue = getTextValue(selected, configuration);

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
          lastDayOfMonthOption={configuration.payment_last_date_of_month_option}
          lastDayOfMonthLabel={configuration.last_day_of_month_label}
        />
      </div>
      <input
        readOnly={true}
        type={"text"}
        value={textValue}
        onClick={() => setPickerOpen(true)}
        data-cy="date-picker-input"
      />
      <Calendar />
    </div>
  );
};

const getTextValue = (
  selected: number | undefined,
  configuration: DatePickerInputConfiguration,
) => {
  if (typeof selected !== "undefined")
    if (selected === 0) {
      if (configuration.payment_last_date_of_month_option) {
        return configuration.payment_date_last_day_of_month_template;
      } else {
        return "Invalid date";
      }
    } else {
      return configuration.payment_date_format_template.replace("{{date}}", selected.toString());
    }
  return "";
};
