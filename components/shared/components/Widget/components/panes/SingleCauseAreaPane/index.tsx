import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NumericFormat } from "react-number-format";
import { usePlausible } from "next-plausible";
import { PortableText } from "@portabletext/react";
import { Dispatch } from "@reduxjs/toolkit";

import { Pane, PaneContainer, PaneTitle } from "../Panes.style";
import {
  ActionBar,
  InfoParagraph,
  ShareContainer,
  ShareInputContainer,
  ShareLink,
  ShareSelectionSpacer,
  ShareSelectionWrapper,
  SharesSelectorContainer,
  ShowAllOrganizationsLink,
  SumButtonsWrapper,
  SumWrapper,
} from "./SingleCauseAreaPane.style";
import { NextButton } from "../../shared/Buttons/NavigationButtons";
import { ToolTip } from "../../shared/ToolTip/ToolTip";
import { Spinner } from "../../../../Spinner/Spinner";
import { RadioButtonGroup } from "../../../../RadioButton/RadioButtonGroup";
import { EffektButton, EffektButtonVariant } from "../../../../EffektButton/EffektButton";
import { State } from "../../../store/state";
import { RecurringDonation, ShareType } from "../../../types/Enums";
import {
  setRecurring,
  setSum,
  setCauseAreaAmount,
  setOrgAmount,
  setCauseAreaDistributionType,
  setShowAllOrganizations,
  setHasManuallyEditedPrefilledOrgAmount,
} from "../../../store/donation/actions";
import { nextPane } from "../../../store/layout/actions";
import { DonationActionTypes } from "../../../store/donation/types";
import { LayoutActionTypes } from "../../../store/layout/types";
import { thousandize } from "../../../../../../../util/formatting";
import { useAmountCalculation } from "../AmountPane/useAmountCalculation";
import { AmountContext, SmartDistributionContext } from "../../../types/WidgetProps";

interface SingleCauseAreaPaneProps {
  nextButtonText: string;
  enableRecurring: boolean;
  enableSingle: boolean;
  singleDonationText: string;
  monthlyDonationText: string;
  amountContext: AmountContext;
  smartDistributionContext: SmartDistributionContext;
}

/**
 * Amount pane used when a platform has a single (active) cause area, e.g. Norway.
 *
 * It reproduces the pre-rewrite ("main") widget experience — recurring toggle,
 * suggested sums, a smart/custom distribution selector with an explanatory
 * description — using main's markup and styling, but is driven by the rewritten
 * donation state. The one thing carried over from the new widget is that custom
 * organization distribution is entered as direct kroner amounts rather than
 * percentages. Operations/tip is intentionally omitted to match the old widget.
 */
export const SingleCauseAreaPane: React.FC<SingleCauseAreaPaneProps> = ({
  nextButtonText,
  enableRecurring,
  enableSingle,
  singleDonationText,
  monthlyDonationText,
  amountContext,
  smartDistributionContext,
}) => {
  const dispatch = useDispatch<Dispatch<DonationActionTypes | LayoutActionTypes>>();
  const plausible = usePlausible();

  const causeAreas = useSelector((state: State) => state.layout.causeAreas);
  const {
    recurring,
    causeAreaAmounts = {},
    orgAmounts = {},
    causeAreaDistributionType = {},
    prefilledShares = null,
    showAllOrganizations = false,
    hasManuallyEditedPrefilledOrgAmount = false,
  } = useSelector((state: State) => state.donation);

  const activeCauseAreas = causeAreas?.filter((ca) => ca.isActive) ?? [];
  const causeArea = activeCauseAreas[0];

  const { totalAmount } = useAmountCalculation("single", causeArea?.id ?? null, causeAreas ?? []);

  const currentAmount = causeArea ? causeAreaAmounts[causeArea.id] || 0 : 0;
  const [inputValue, setInputValue] = React.useState(currentAmount);
  React.useEffect(() => {
    setInputValue(currentAmount);
  }, [currentAmount]);
  const [showErrors, setShowErrors] = React.useState(false);

  // While one or more organizations are prefilled (e.g. arriving from the organizations list -
  // one org at 100% - or a CMS-configured distribution link with several) and the donor hasn't
  // edited any of them yet, each keeps tracking its percentage share of the cause area amount -
  // so typing a sum afterwards still splits it the same way. The tracked amounts are only
  // derived for display; they're committed to orgAmounts (for the actual payload) once the
  // donor moves on, to avoid a dispatch/re-render race while typing. This state lives in Redux
  // (not local component state) because panes unmount/remount when navigating.
  const hasPrefilledOrgs = !!prefilledShares && Object.keys(prefilledShares).length > 0;
  const isTrackingPrefilledShares = hasPrefilledOrgs && !hasManuallyEditedPrefilledOrgAmount;
  const displayOrgAmount = (orgId: number) => {
    const share = prefilledShares?.[orgId];
    if (isTrackingPrefilledShares && share !== undefined) {
      return Math.round((share / 100) * currentAmount);
    }
    return orgAmounts[orgId] || 0;
  };
  // totalAmount is derived from orgAmounts while in custom mode, which hasn't been synced yet
  // for still-tracking prefilled organizations - currentAmount is the real intended total then.
  const effectiveTotalAmount = isTrackingPrefilledShares ? currentAmount : totalAmount;

  if (!causeAreas) {
    return (
      <Pane>
        <PaneContainer>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Spinner />
          </div>
        </PaneContainer>
      </Pane>
    );
  }

  if (!causeArea) {
    return (
      <Pane>
        <PaneContainer>
          <div>Missing cause area</div>
        </PaneContainer>
      </Pane>
    );
  }

  const activeOrganizations = causeArea.organizations
    .filter((org) => org.isActive)
    .sort((a, b) => a.ordering - b.ordering);
  const hasMultipleOrgs = activeOrganizations.length > 1;
  const distributionType = causeAreaDistributionType[causeArea.id] ?? ShareType.STANDARD;

  const suggestedSums = recurring
    ? amountContext.preset_amounts_recurring
    : amountContext.preset_amounts_single;

  const setAmount = (amount: number) => {
    setInputValue(amount);
    dispatch(setCauseAreaAmount(causeArea.id, amount));
    // With a single organization the cause area amount is the organization amount.
    if (activeOrganizations.length <= 1 && activeOrganizations[0]) {
      dispatch(setOrgAmount(activeOrganizations[0].id, amount));
    }
  };

  const handleDistributionChange = (value: ShareType) => {
    dispatch(setCauseAreaDistributionType(causeArea.id, value));

    // When switching to custom, seed the per-organization amounts from the
    // standard split so the user has a sensible starting point.
    if (value === ShareType.CUSTOM) {
      const hasSetOrgAmounts = activeOrganizations.some((org) => (orgAmounts[org.id] || 0) > 0);
      if (!hasSetOrgAmounts) {
        const causeAreaAmount = causeAreaAmounts[causeArea.id] || 0;
        for (const org of causeArea.organizations) {
          if (!org.standardShare) continue;
          const orgShare = Math.round((org.standardShare / 100) * causeAreaAmount);
          dispatch(setOrgAmount(org.id, orgShare));
        }
      }
    }
  };

  const amountInput = (
    <>
      <SumButtonsWrapper>
        {suggestedSums.map((suggested) => (
          <div key={suggested.amount}>
            <EffektButton
              variant={EffektButtonVariant.SECONDARY}
              selected={inputValue === suggested.amount}
              onClick={() => {
                plausible("SelectSuggestedSum", { props: { sum: suggested.amount } });
                setAmount(suggested.amount);
              }}
              noMinWidth={true}
              data-cy={`suggested-sum-${causeArea.id}-${suggested.amount}`}
            >{`${suggested.amount ? thousandize(suggested.amount) : "-"} kr`}</EffektButton>
            {suggested.subtext && <i>{suggested.subtext}</i>}
          </div>
        ))}
      </SumButtonsWrapper>
      <SumWrapper>
        <label>{amountContext.custom_amount_text}</label>
        <span>
          <NumericFormat
            name={`sum-${causeArea.id}`}
            thousandSeparator=" "
            allowNegative={false}
            decimalScale={0}
            type="tel"
            placeholder="0"
            value={inputValue > 0 ? inputValue : ""}
            autoComplete="off"
            data-cy={`donation-sum-input-${causeArea.id}`}
            onValueChange={(values) => setAmount(values.floatValue ?? 0)}
          />
        </span>
      </SumWrapper>
    </>
  );

  return (
    <Pane>
      <PaneContainer>
        <div>
          <PaneTitle>
            <wbr />
          </PaneTitle>

          <RadioButtonGroup
            options={[
              {
                title: singleDonationText,
                value: RecurringDonation.NON_RECURRING,
                data_cy: "radio-single",
                disabled: !enableSingle,
              },
              {
                title: monthlyDonationText,
                value: RecurringDonation.RECURRING,
                data_cy: "radio-recurring",
                disabled: !enableRecurring,
              },
            ]}
            selected={recurring}
            onSelect={(value) => dispatch(setRecurring(value as RecurringDonation))}
          />

          {amountInput}

          {hasMultipleOrgs && (
            <ShareSelectionSpacer>
              <RadioButtonGroup
                options={[
                  {
                    title: smartDistributionContext.smart_distribution_radiobutton_text,
                    value: ShareType.STANDARD,
                    data_cy: "radio-smart-share",
                  },
                  {
                    title: smartDistributionContext.custom_distribution_radiobutton_text,
                    value: ShareType.CUSTOM,
                    data_cy: "radio-custom-share",
                  },
                ]}
                selected={distributionType}
                onSelect={(value) => handleDistributionChange(value as ShareType)}
              />

              {distributionType === ShareType.STANDARD &&
                smartDistributionContext.smart_distribution_description && (
                  <InfoParagraph>
                    <PortableText value={smartDistributionContext.smart_distribution_description} />
                  </InfoParagraph>
                )}

              {distributionType === ShareType.CUSTOM && (
                <SharesSelectorContainer>
                  <ShareSelectionWrapper>
                    <ShareContainer>
                      {(hasPrefilledOrgs && !showAllOrganizations
                        ? activeOrganizations.filter(
                            (org) => prefilledShares?.[org.id] !== undefined,
                          )
                        : activeOrganizations
                      ).map((org) => (
                        <ShareInputContainer key={org.id}>
                          <div>
                            <ShareLink href={org.informationUrl}>
                              {org.widgetDisplayName || org.name}
                            </ShareLink>
                            {org.widgetContext && <ToolTip text={org.widgetContext} />}
                          </div>
                          <NumericFormat
                            id={`org-${org.id}`}
                            aria-label={org.widgetDisplayName || org.name}
                            type="tel"
                            placeholder="0"
                            value={displayOrgAmount(org.id) || ""}
                            step={1}
                            decimalScale={0}
                            allowNegative={false}
                            thousandSeparator=" "
                            autoComplete="off"
                            data-cy={`org-${org.id}`}
                            onValueChange={(values, sourceInfo) => {
                              // react-number-format also fires this when `value` changes because
                              // of the auto-tracking prop above, not just on real keystrokes -
                              // only a genuine user edit should freeze the auto-tracked amount.
                              if (sourceInfo.source !== "event") return;
                              // Only editing one of the actually-tracked (prefilled) organizations
                              // should freeze tracking - editing an unrelated one (after revealing
                              // "show all") shouldn't erase the still-tracked prefilled amounts.
                              if (prefilledShares?.[org.id] !== undefined) {
                                dispatch(setHasManuallyEditedPrefilledOrgAmount(true));
                              }
                              dispatch(setOrgAmount(org.id, values.floatValue ?? 0));
                            }}
                          />
                        </ShareInputContainer>
                      ))}
                    </ShareContainer>
                    {hasPrefilledOrgs && !showAllOrganizations && (
                      <ShowAllOrganizationsLink
                        type="button"
                        onClick={() => dispatch(setShowAllOrganizations(true))}
                        data-cy="show-all-organizations-button"
                      >
                        {smartDistributionContext.show_all_organizations_text} ↓
                      </ShowAllOrganizationsLink>
                    )}
                  </ShareSelectionWrapper>
                </SharesSelectorContainer>
              )}
            </ShareSelectionSpacer>
          )}
        </div>

        <ActionBar>
          <NextButton
            // Matches the pre-rewrite behavior: don't dim the button just
            // because no amount has been entered yet - only after the donor
            // has actually tried to proceed with an invalid amount
            disabled={showErrors && effectiveTotalAmount <= 0}
            onClick={() => {
              if (effectiveTotalAmount <= 0) {
                setShowErrors(true);
                return;
              }
              if (isTrackingPrefilledShares && prefilledShares) {
                Object.entries(prefilledShares).forEach(([orgId, share]) => {
                  dispatch(setOrgAmount(Number(orgId), Math.round((share / 100) * currentAmount)));
                });
              }
              dispatch(setSum(effectiveTotalAmount));
              dispatch(nextPane());
            }}
            data-cy="next-button"
          >
            {nextButtonText}
          </NextButton>
        </ActionBar>
      </PaneContainer>
    </Pane>
  );
};
