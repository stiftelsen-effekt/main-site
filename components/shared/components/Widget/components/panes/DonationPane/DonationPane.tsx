import React, { useId, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSum, setRecurring } from "../../../store/donation/actions";
import { Pane, PaneContainer, PaneTitle } from "../Panes.style";
import { Donation, DonationError, DonationErrorTypeNames, State } from "../../../store/state";
import { RecurringDonation } from "../../../types/Enums";
import {
  ActionBar,
  ExtraMessageWrapper,
  SumButtonsWrapper,
  SumWrapper,
} from "./DonationPane.style";
import { nextPane } from "../../../store/layout/actions";
import { NextButton } from "../../shared/Buttons/NavigationButtons";
import { EffektButton, EffektButtonVariant } from "../../../../EffektButton/EffektButton";
import { RadioButtonGroup } from "../../../../RadioButton/RadioButtonGroup";
import { DonationInputErrorTemplates, WidgetPane1Props } from "../../../types/WidgetProps";
import { thousandize } from "../../../../../../../util/formatting";
import { SingleCauseAreaSelector } from "./ShareSelector/Single/SingleCauseAreaSelector";
import { MultipleCauseAreasSelector } from "./ShareSelector/Multiple/MultipleCauseAreasSelector";
import { usePlausible } from "next-plausible";
import { ErrorTextsContainer } from "../../shared/ErrorTextsContainer/ErrorTextsContainer";
import { Spinner } from "../../../../Spinner/Spinner";
import { Info } from "react-feather";
import { Dispatch } from "@reduxjs/toolkit";
import { LayoutActionTypes } from "../../../store/layout/types";
import { DonationActionTypes } from "../../../store/donation/types";

export const DonationPane: React.FC<{
  text: WidgetPane1Props;
  enableRecurring: boolean;
  enableSingle: boolean;
  extraMessage?: string;
}> = ({ text, enableRecurring, enableSingle, extraMessage }) => {
  const dispatch = useDispatch<Dispatch<LayoutActionTypes | DonationActionTypes>>();
  const donation = useSelector((state: State) => state.donation);
  const layout = useSelector((state: State) => state.layout);
  const activeCauseAreas = useSelector((state: State) =>
    state.layout.causeAreas?.filter((causeArea) => causeArea.isActive),
  );
  const plausible = usePlausible();
  const sumInputId = useId();
  const [showErrors, setShowErrors] = useState(false);

  const suggestedSums = donation.recurring
    ? text.amount_context.preset_amounts_recurring
    : text.amount_context.preset_amounts_single;

  function onSubmit() {
    plausible("SubmitDonationPane", {
      props: {
        recurring: donation.recurring,
        sum: donation.sum,
        shareType: donation.distributionCauseAreas
          .map((c) => `${c.id}-${c.standardSplit}`)
          .join(","),
      },
    });
    dispatch(nextPane());
  }

  let errorTexts: ErrorText[] = [];
  if (showErrors) {
    errorTexts = getErrorTexts(donation, text.donation_input_error_templates);
  }

  return (
    <Pane>
      <PaneContainer>
        <div>
          <PaneTitle>
            <wbr />
          </PaneTitle>
          {extraMessage && (
            <ExtraMessageWrapper>
              <Info />
              <p>{extraMessage}</p>
            </ExtraMessageWrapper>
          )}
          <RadioButtonGroup
            options={[
              {
                title: text.single_donation_text,
                value: RecurringDonation.NON_RECURRING,
                data_cy: "radio-single",
                disabled: !enableSingle,
              },
              {
                title: text.monthly_donation_text,
                value: RecurringDonation.RECURRING,
                data_cy: "radio-recurring",
                disabled: !enableRecurring,
              },
            ]}
            selected={donation.recurring}
            onSelect={(option) => dispatch(setRecurring(option as RecurringDonation))}
          />

          {activeCauseAreas?.length === 1 && (
            <SumButtonsWrapper>
              {suggestedSums.map((suggested) => (
                <div key={suggested.amount}>
                  <EffektButton
                    variant={EffektButtonVariant.SECONDARY}
                    selected={donation.sum === suggested.amount}
                    onClick={() => {
                      plausible("SelectSuggestedSum", {
                        props: {
                          sum: suggested.amount,
                        },
                      });
                      dispatch(setSum(suggested.amount));
                    }}
                    noMinWidth={true}
                  >{`${suggested.amount ? thousandize(suggested.amount) : "-"} kr`}</EffektButton>
                  {suggested.subtext && <i>{suggested.subtext}</i>}
                </div>
              ))}
            </SumButtonsWrapper>
          )}
          <SumWrapper
            data-error={
              errorTexts.find((error) => error.error.type === "donationSumError")?.error.type
            }
          >
            <label htmlFor={sumInputId}>{text.amount_context.custom_amount_text}</label>
            <span>
              <input
                name={sumInputId}
                type="tel"
                placeholder="0"
                value={donation.sum && donation.sum > 0 ? donation.sum : ""}
                autoComplete="off"
                data-cy="donation-sum-input"
                onChange={(e) => {
                  if (
                    Number.isInteger(parseInt(e.target.value)) === true &&
                    parseInt(e.target.value) > 0
                  ) {
                    dispatch(setSum(parseInt(e.target.value)));
                  } else {
                    dispatch(setSum(-1));
                  }
                }}
              />
            </span>
          </SumWrapper>

          {!layout.causeAreas && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "5rem",
              }}
            >
              <Spinner></Spinner>
            </div>
          )}
          {activeCauseAreas?.length === 1 && (
            <SingleCauseAreaSelector
              configuration={text.smart_distribution_context}
              errorTexts={errorTexts}
            />
          )}
          {activeCauseAreas && activeCauseAreas?.length > 1 && (
            <MultipleCauseAreasSelector
              configuration={text.smart_distribution_context}
              errorTexts={errorTexts}
            />
          )}
        </div>

        <ErrorTextsContainer errorTexts={errorTexts} />

        <ActionBar data-cy="next-button-div">
          <NextButton
            disabled={showErrors && donation.errors.length > 0}
            onClick={() => {
              if (donation.errors.length > 0) {
                setShowErrors(true);
              } else {
                onSubmit();
              }
            }}
          >
            {text.pane1_button_text}
          </NextButton>
        </ActionBar>
      </PaneContainer>
    </Pane>
  );
};

export type ErrorText = { error: DonationError; text: string };
const getErrorTexts = (donation: Donation, templates: DonationInputErrorTemplates): ErrorText[] => {
  let errorTexts: ErrorText[] = [];
  for (const error of donation.errors) {
    let template: string;
    switch (error.type) {
      case "donationSumError":
        template = templates.donation_sum_error_template;
        break;
      case "causeAreaSumError":
        template = templates.donation_distribution_cause_areas_sum_error_template;
        break;
      case "causeAreaShareNegativeError":
        template = templates.donation_distribution_cause_areas_negative_error_template;
        break;
      case "causeAreaOrganizationsSumError":
        template = templates.donation_distribution_cause_areas_organization_sum_error_template;
        break;
      case "causeAreaOrganizationsShareNegativeError":
        template = templates.donation_distribution_cause_areas_organization_negative_error_template;
        break;
      default:
        template = "There is an error in the donation";
        break;
    }
    let text: string = template;
    if (error.variables) {
      for (const [key, value] of Object.entries(error.variables)) {
        // Replace all instances of the key with the value
        text = text.replace(`{${key}}`, value);
      }
    }
    errorTexts.push({
      error,
      text,
    });
  }
  return errorTexts;
};
