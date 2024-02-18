import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDueDay } from "../../../../../store/donation/actions";
import { State } from "../../../../../store/state";
import { DatePicker } from "../../../../shared/DatePicker/DatePicker";
import { ToolTip } from "../../../../shared/ToolTip/ToolTip";
import {
  Wrapper,
  DateBoxWrapper,
  DateTextWrapper,
  DateText,
} from "../../Vipps/VippsDatePicker/VippsDatePicker.style";
import { formatDateText, getNextChargeDate, isIrregularChargeDay } from "./avtalegirodates";
import { DatePickerInputConfiguration } from "../../../../../../DatePicker/DatePickerInput";

const tooltipText =
  "Vi må av tekniske grunner melde inn trekk til bankene tidligere enn din valgte trekkdato, derfor utsettes første trekk med én måned. Du kan velge en annen trekkdato om du ønsker å trekkes tidligere.";

export const AvtaleGiroDatePicker: React.FC<{ configuration: DatePickerInputConfiguration }> = ({
  configuration,
}) => {
  const dispatch = useDispatch();
  const dueDay = useSelector((state: State) => state.donation.dueDay);
  const [selectedDueDay, setSelectedDueDay] = useState<number>(dueDay);
  const [nextChargeDate, setNextChargeDate] = useState<Date>();

  useEffect(() => {
    setNextChargeDate(getNextChargeDate(selectedDueDay));
    dispatch(setDueDay(selectedDueDay));
  }, [selectedDueDay]);

  return (
    <Wrapper>
      <DateTextWrapper>
        <DateText>
          {dueDay === 0
            ? configuration.payment_date_last_day_of_month_template
            : configuration.payment_date_format_template.replace("{{date}}", dueDay.toString())}
        </DateText>
        {isIrregularChargeDay(selectedDueDay) && <ToolTip text={tooltipText} />}
      </DateTextWrapper>
      <DateBoxWrapper>
        <DatePicker
          selected={dueDay}
          onChange={(date) => {
            setSelectedDueDay(date);
          }}
          onClickOutside={() => {}}
          configuration={configuration}
        />
      </DateBoxWrapper>
    </Wrapper>
  );
};
