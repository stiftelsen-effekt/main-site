import { useState } from "react";
import { DatePickerInput } from "../../components/shared/components/DatePicker/DatePickerInput";
import style from "./DatePickerInput.stories.module.css";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: "Controls/DatePickerInput",
  component: DatePickerInput,
  argTypes: {
    selected: {
      control: false,
    },
    onChange: {
      control: false,
    },
  },
};

export const PickerInput = ({ ...args }) => {
  const [selected, setSelected] = useState<number | undefined>();
  return (
    <div className={style["input-wrapper"]}>
      <DatePickerInput
        selected={selected}
        onChange={(selected) => {
          setSelected(selected);
        }}
      />
    </div>
  );
};
