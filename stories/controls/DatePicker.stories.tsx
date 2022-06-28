import { useState } from "react";
import { DatePicker } from "../../components/shared/components/DatePicker/DatePicker";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: "Controls/DatePicker",
  component: DatePicker,
  argTypes: {
    selected: {
      control: false,
    },
    onChange: {
      control: false,
    },
  },
};

export const Picker = ({ ...args }) => {
  const [selected, setSelected] = useState<number | undefined>();
  return (
    <DatePicker
      selected={selected}
      onChange={(selected) => {
        setSelected(selected);
      }}
      onClickOutside={() => {}}
    />
  );
};
