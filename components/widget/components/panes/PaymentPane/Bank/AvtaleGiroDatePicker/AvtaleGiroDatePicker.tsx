import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker } from "../../../../../../elements/datepicker";
import { orange20 } from "../../../../../config/colors";
import { setDueDay } from "../../../../../store/donation/actions";
import { State } from "../../../../../store/state";
import { ScaledDatePicker } from "../../../../shared/Input/ScaledDatePicker.style";
import { ToolTip } from "../../../../shared/ToolTip/ToolTip";
import {
  Datebox,
  Wrapper,
  DateBoxWrapper,
  DateTextWrapper,
  DateText,
} from "../../Vipps/VippsDatePicker/VippsDatePicker.style";
import { formatDateText, getNextChargeDate, isIrregularChargeDay } from "./avtalegirodates";

const tooltipText =
  "Vi må av tekniske grunner melde inn trekk til bankene tidligere enn din valgte trekkdato, derfor utsettes første trekk med én måned. Du kan velge en annen trekkdato om du ønsker å trekkes tidligere.";

export const AvtaleGiroDatePicker: React.FC = () => {
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
          Første trekk blir
          {isIrregularChargeDay(selectedDueDay)
            ? nextChargeDate && <strong>{` ${formatDateText(nextChargeDate)} `}</strong>
            : nextChargeDate && ` ${formatDateText(nextChargeDate)} `}
        </DateText>
        {isIrregularChargeDay(selectedDueDay) && <ToolTip text={tooltipText} />}
      </DateTextWrapper>
      <DateBoxWrapper>
        <ScaledDatePicker
          selected={dueDay}
          onChange={(date) => {
            setSelectedDueDay(date);
          }}
          onClickOutside={() => {}}
        />
      </DateBoxWrapper>
    </Wrapper>
  );
};
