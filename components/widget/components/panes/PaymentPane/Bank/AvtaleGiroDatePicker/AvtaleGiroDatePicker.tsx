import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { orange20 } from "../../../../../config/colors";
import { setDueDay } from "../../../../../store/donation/actions";
import { State } from "../../../../../store/state";
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

  const dateBoxes: JSX.Element[] = [];
  for (let i = 1; i <= 28; i += 1) {
    dateBoxes.push(
      <Datebox
        key={i}
        style={{
          backgroundColor: selectedDueDay === i ? orange20 : "white",
        }}
        onClick={() => {
          setSelectedDueDay(i);
        }}
      >
        {i}
      </Datebox>,
    );
  }

  return (
    <Wrapper>
      <DateBoxWrapper>
        {dateBoxes.map((box) => {
          return box;
        })}
        <Datebox
          key="0"
          style={{
            backgroundColor: selectedDueDay === 0 ? orange20 : "white",
            width: "120px",
          }}
          onClick={() => {
            setSelectedDueDay(0);
          }}
        >
          Siste hver måned
        </Datebox>
      </DateBoxWrapper>
      <DateTextWrapper>
        <DateText>
          Første trekk blir
          {isIrregularChargeDay(selectedDueDay)
            ? nextChargeDate && <strong>{` ${formatDateText(nextChargeDate)} `}</strong>
            : nextChargeDate && ` ${formatDateText(nextChargeDate)} `}
        </DateText>
        {isIrregularChargeDay(selectedDueDay) && <ToolTip text={tooltipText} />}
      </DateTextWrapper>
    </Wrapper>
  );
};
