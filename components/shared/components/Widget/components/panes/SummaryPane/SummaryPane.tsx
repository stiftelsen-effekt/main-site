import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../../../store/state";
import {
  selectPaymentMethod,
  setTipEnabled,
  registerDonationAction,
} from "../../../store/donation/actions";
import { Dispatch } from "@reduxjs/toolkit";
import { Action } from "typescript-fsa";
import { DonationActionTypes } from "../../../store/donation/types";
import { WidgetProps } from "../../../types/WidgetProps";
import { Pane, PaneContainer, PaneTitle } from "../Panes.style";
import { CheckBoxWrapper, HiddenCheckBox } from "../Forms.style";
import { CustomCheckBox } from "../DonorPane/CustomCheckBox";
import { PaymentMethod, ShareType } from "../../../types/Enums";
import {
  PaymentButton,
  PaymentButtonsWrapper,
  SummmaryOrganizationsList,
  TotalTable,
} from "./SummaryPane.style";
import { StyledSpinner } from "../../shared/Buttons/NavigationButtons.style";

const mapPaymentMethod = (method: string): PaymentMethod => {
  switch (method) {
    case "bank":
      return PaymentMethod.BANK;
    case "vipps":
      return PaymentMethod.VIPPS;
    case "avtalegiro":
      return PaymentMethod.AVTALEGIRO;
    case "swish":
      return PaymentMethod.SWISH;
    case "autogiro":
      return PaymentMethod.AUTOGIRO;
    default:
      throw new Error(`Unknown payment method: ${method}`);
  }
};

const TIP_PERCENTAGE = 5;

export const SummaryPane: React.FC<{
  paymentMethods: NonNullable<WidgetProps["methods"]>;
}> = ({ paymentMethods }) => {
  const dispatch = useDispatch<Dispatch<DonationActionTypes | Action<undefined>>>();
  const donation = useSelector((state: State) => state.donation);
  const causeAreas = useSelector((state: State) => state.layout.causeAreas) || [];
  const [loadingMethod, setLoadingMethod] = React.useState<string | null>(null);

  const {
    selectionType,
    causeAreaAmounts = {},
    orgAmounts = {},
    causeAreaDistributionType = {},
    tipEnabled = true,
    selectedCauseAreaId,
    recurring,
  } = donation;

  const handleTipToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setTipEnabled(e.target.checked));
  };

  const handlePayment = (methodId: string) => {
    setLoadingMethod(methodId);
    dispatch(selectPaymentMethod(mapPaymentMethod(methodId)));
    dispatch(registerDonationAction.started(undefined));
  };

  const { summaryItems, sum } = React.useMemo(() => {
    const summaryItems: Array<{
      id: number;
      name: string;
      amount: number;
      orgs?: Array<{ id: number; name: string; amount: number }>;
    }> = [];
    let sum = 0;
    causeAreas.forEach((area) => {
      if (selectionType === "single" && area.id !== selectedCauseAreaId) {
        return;
      }

      const areaAmount = causeAreaAmounts[area.id];

      if (areaAmount && causeAreaDistributionType[area.id] === ShareType.STANDARD) {
        if (areaAmount > 0) {
          summaryItems.push({
            id: area.id,
            name: area.name,
            amount: areaAmount,
            orgs: [],
          });
          sum += areaAmount;
        }
      } else if (causeAreaDistributionType[area.id] === ShareType.CUSTOM) {
        const orgs = area.organizations
          .filter((org) => orgAmounts[org.id] > 0)
          .map((org) => ({
            id: org.id,
            name: org.name,
            amount: orgAmounts[org.id] || 0,
          }));
        if (orgs.length > 0) {
          const totalOrgAmount = orgs.reduce((acc, org) => acc + org.amount, 0);

          summaryItems.push({
            id: area.id,
            name: area.name,
            amount: totalOrgAmount,
            orgs,
          });
          sum += totalOrgAmount;
        }
      }
    });

    return { summaryItems, sum };
  }, [selectionType, causeAreaAmounts, orgAmounts, causeAreas, selectedCauseAreaId]);

  const tipAmount = tipEnabled ? Math.round((sum * TIP_PERCENTAGE) / 100) : 0;
  const totalAmount = sum + tipAmount;

  return (
    <Pane>
      <PaneContainer>
        <div>
          <SummmaryOrganizationsList cellSpacing={0}>
            <tr>
              <td colSpan={2} style={{ textAlign: "left" }}>
                {recurring ? "Månadsgivande" : "Enkelt givande"} donation
              </td>
            </tr>
            {summaryItems.map((item) => (
              <>
                <tr key={item.id}>
                  <td>
                    <strong>{item.name}</strong>
                  </td>
                  <td>
                    {item.orgs &&
                      item.orgs.length == 0 &&
                      item.amount.toLocaleString("no-NB") + " kr"}
                  </td>
                </tr>
                {item.orgs &&
                  item.orgs.map((org) => (
                    <tr key={org.id}>
                      <td style={{ paddingLeft: 20 }}>{org.name}</td>
                      <td>{org.amount.toLocaleString("no-NB")} kr</td>
                    </tr>
                  ))}
              </>
            ))}
          </SummmaryOrganizationsList>
          <CheckBoxWrapper>
            <HiddenCheckBox
              type="checkbox"
              checked={tipEnabled}
              onChange={handleTipToggle}
              data-cy="tip-checkbox"
            />
            <CustomCheckBox
              checked={tipEnabled}
              label={`Tip ${TIP_PERCENTAGE}% to operations of Ge Effektivt`}
            />
          </CheckBoxWrapper>

          <TotalTable>
            <tr>
              <td>Sum</td>
              <td> {totalAmount.toLocaleString("no-NB")} kr</td>
            </tr>
          </TotalTable>
          <PaymentButtonsWrapper>
            {paymentMethods.map((method) => (
              <PaymentButton key={method._id} onClick={() => handlePayment(method._id)}>
                {loadingMethod === method._id ? <StyledSpinner /> : method.selector_text}
              </PaymentButton>
            ))}
          </PaymentButtonsWrapper>
        </div>
      </PaneContainer>
    </Pane>
  );
};
