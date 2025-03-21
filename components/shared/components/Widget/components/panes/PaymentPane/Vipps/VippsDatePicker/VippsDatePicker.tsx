import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setVippsAgreement } from "../../../../../store/donation/actions";
import { State } from "../../../../../store/state";
import { ToolTip } from "../../../../shared/ToolTip/ToolTip";
import { CustomCheckBox } from "../../../DonorPane/CustomCheckBox";
import { CheckBoxWrapper, HiddenCheckBox } from "../../../Forms.style";
import { DateBoxWrapper, DateText, DateTextWrapper, Wrapper } from "./VippsDatePicker.style";
import { formatDateText, getNextChargeDate, isIrregularChargeDay, showCheckBox } from "./dates";
import { DatePicker } from "../../../../shared/DatePicker/DatePicker";
import { DatePickerInputConfiguration } from "../../../../../../DatePicker/DatePickerInput";
import { Dispatch } from "@reduxjs/toolkit";
import { DonationActionTypes } from "../../../../../store/donation/types";

const tooltipText =
  "Vi kan av tekniske grunner ikke melde trekk 1-3 dager i forveien, så første trekkdato utsettes med én måned. Du kan velge en senere dato eller krysse av for også å bli trukket i dag.";

export const VippsDatePicker: React.FC<{ config: DatePickerInputConfiguration }> = ({ config }) => {
  const dispatch = useDispatch<Dispatch<DonationActionTypes>>();
  const vippsAgreement = useSelector((state: State) => state.donation.vippsAgreement);
  const [selectedChargeDay, setSelectedChargeDay] = useState<number>(
    vippsAgreement.monthlyChargeDay,
  );
  const [nextChargeDate, setNextChargeDate] = useState<Date>();
  const [initialCharge, setinitialCharge] = useState<boolean>(true);

  useEffect(() => {
    setNextChargeDate(getNextChargeDate(selectedChargeDay, initialCharge));
    dispatch(
      setVippsAgreement({
        ...vippsAgreement,
        monthlyChargeDay: selectedChargeDay,
        initialCharge,
      }),
    );
  }, [selectedChargeDay, initialCharge]);

  return (
    <Wrapper>
      <DateTextWrapper>
        <div>
          <DateText>
            {vippsAgreement.initialCharge &&
              `Første trekk blir i dag, deretter den ${
                selectedChargeDay === 0 ? "siste" : `${selectedChargeDay}.`
              } hver måned `}
            {!vippsAgreement.initialCharge && nextChargeDate && "Første trekk blir "}
            {!vippsAgreement.initialCharge && isIrregularChargeDay(selectedChargeDay)
              ? nextChargeDate && <strong>{`${formatDateText(nextChargeDate)} `}</strong>
              : !vippsAgreement.initialCharge &&
                nextChargeDate &&
                `${formatDateText(nextChargeDate)} `}
          </DateText>
          {isIrregularChargeDay(selectedChargeDay) && <ToolTip text={tooltipText} />}
        </div>
        {showCheckBox(selectedChargeDay) && (
          <CheckBoxWrapper>
            <HiddenCheckBox
              name="initialCharge"
              type="checkbox"
              onChange={() => {
                (document.activeElement as HTMLElement).blur();
                setinitialCharge(!initialCharge);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setinitialCharge(!initialCharge);
                  e.preventDefault();
                }
              }}
            />
            <CustomCheckBox label="Trekk meg for denne måneden også" checked={initialCharge} />
          </CheckBoxWrapper>
        )}
      </DateTextWrapper>
      <DateBoxWrapper>
        <DatePicker
          selected={vippsAgreement?.monthlyChargeDay}
          onClickOutside={() => {}}
          onChange={(date) => {
            if (!showCheckBox(date)) {
              setinitialCharge(false);
            }
            setSelectedChargeDay(date);
          }}
          configuration={config}
        />
      </DateBoxWrapper>
    </Wrapper>
  );
};
