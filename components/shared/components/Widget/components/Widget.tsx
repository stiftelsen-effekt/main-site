import { groq } from "next-sanity";
import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getClient } from "../../../../../lib/sanity.client";
import { withStaticProps } from "../../../../../util/withStaticProps";
import { fetchCauseAreasAction } from "../store/layout/actions";
import { fetchReferralsAction } from "../store/referrals/actions";
import { State } from "../store/state";
import { WidgetProps } from "../types/WidgetProps";
import { Carousel } from "./Carousel";
import { DonationPane } from "./panes/DonationPane/DonationPane";
import { DonorPane } from "./panes/DonorPane/DonorPane";
import { PaymentPane } from "./panes/PaymentPane/PaymentPane";
import { ProgressBar } from "./shared/ProgressBar/ProgressBar";
import { ApiErrorNotification } from "./shared/ApiErrorNotification/ApiErrorNotification";
import { TaxInfoBox } from "./shared/Layout/Layout.style";
import { token } from "../../../../../token";
import {
  TooltipContent,
  TooltipLink,
  TooltipWrapper,
} from "./shared/ProgressBar/ProgressBar.style";
import {
  useAvailablePaymentMethods,
  useAvailableRecurringOptions,
  useDefaultPaymentMethodEffect,
  usePrefilledDistribution,
  usePrefilledSum,
  useQueryParamsPrefill,
  useWidgetScaleEffect,
} from "./hooks";
import { useElementHeight } from "../../../../../hooks/useElementHeight";
import { PrefilledDistribution } from "../../../../main/layout/WidgetPane/WidgetPane";
import { RecurringDonation } from "../types/Enums";
import { Dispatch } from "@reduxjs/toolkit";
import { Action } from "typescript-fsa";

export const widgetContentQuery = groq`
  ...,
  "locale": *[ _type == "site_settings"][0].main_locale,
  methods[] { 
    _type == 'reference' => @->{
      _type == 'bank' => {
        ...,
        transaction_cost,
        completed_redirect -> {
          "slug": slug.current,
        },
        "locale": *[ _type == "site_settings"][0].main_locale,
      },
      _type == 'vipps' => {
        _id,
        selector_text,
        recurring_title,
        recurring_selector_earliest_text,
        recurring_selector_choose_date_text,
        recurring_selector_date_picker_configuration->,
        recurring_button_text,
        single_title,
        single_button_text,
        transaction_cost,
      },
      _type == 'swish' => {
        ...,
        transaction_cost,
      },
      _type == 'autogiro' => {
        ...,
        transaction_cost,
        recurring_manual_option_config {
          ...,
          date_selector_config->
        }
      },
      _type == 'avtalegiro' => {
        ...,
        transaction_cost,
        date_selector_configuration->
      },
      _type == 'quickpay_card' => {
        ...,
        transaction_cost,
      },
      _type == 'quickpay_mobilepay' => {
        ...,
        transaction_cost,
      },
      _type == 'dkbank' => {
        ...,
        transaction_cost,
      },
    },
  },
  nudges[]{
    _key,
    message,
    minimum_amount,
    recurring_type,
    from_method->{
      _id,
      selector_text
    },
    to_method->{
      _id,
      selector_text
    },
  },
  privacy_policy_link {
    ...,
    "slug": page->slug.current,
    "pagetype": page->_type,
  }
`;

export const widgetQuery = groq`
*[_type == "donationwidget"][0] {
  ${widgetContentQuery}
}
`;

export const WidgetTooltipContext = createContext<[{ text: string; link?: string } | null, any]>([
  null,
  () => {},
]);

export const Widget = withStaticProps(
  async ({
    draftMode,
    inline,
    prefilled,
    defaultPaymentType,
  }: {
    draftMode: boolean;
    inline?: boolean;
    prefilled?: PrefilledDistribution;
    defaultPaymentType?: RecurringDonation;
  }) => {
    const result = await getClient(draftMode ? token : undefined).fetch<WidgetProps>(widgetQuery);

    if (!result.methods?.length) {
      throw new Error("No payment methods found");
    }

    return {
      data: {
        result,
        query: widgetQuery,
      },
      inline: inline ?? false,
      prefilled: prefilled ?? null,
      defaultPaymentType: defaultPaymentType ?? RecurringDonation.NON_RECURRING,
    };
  },
)(({ data, inline = false, prefilled, defaultPaymentType }) => {
  const widget = data.result;
  const methods = data.result.methods;

  console.log(methods);

  if (!methods) {
    throw new Error("No payment methods found");
  }

  const dispatch = useDispatch<Dispatch<Action<undefined>>>();
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetWrapperRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ text: string; link?: string } | null>(null);
  const causeAreas = useSelector((state: State) => state.layout.causeAreas);

  const availableRecurringOptions = useAvailableRecurringOptions(methods);
  const availablePaymentMethods = useAvailablePaymentMethods(methods);

  const { scaledHeight, scalingFactor } = useWidgetScaleEffect(widgetRef, inline);
  const { scrollPosition } = useWidgetScrollObserver(widgetRef);
  const widgetHeight = useElementHeight(widgetRef);

  useEffect(() => {
    dispatch(fetchCauseAreasAction.started(undefined));
    dispatch(fetchReferralsAction.started(undefined));
  }, [dispatch]);

  usePrefilledDistribution({
    inline,
    causeAreas,
    prefilledDistribution: prefilled,
  });

  usePrefilledSum({
    inline,
  });

  useQueryParamsPrefill({
    inline,
    causeAreas,
    defaultPaymentType,
  });

  useDefaultPaymentMethodEffect(methods);

  let tooltipReadmoreText: string;
  switch (widget.locale) {
    case "no":
      tooltipReadmoreText = "Les mer";
      break;
    case "sv":
      tooltipReadmoreText = "Läs mer";
      break;
    default:
      tooltipReadmoreText = "Read more";
  }

  return (
    <div
      className="widget-wrapper"
      ref={widgetWrapperRef}
      style={{
        height: inline ? `${widgetHeight * scalingFactor}px` : "auto",
        width: scalingFactor * 576,
      }}
    >
      <div
        className="widget"
        ref={widgetRef}
        style={{
          transform: `scale(${scalingFactor})`,
          height: inline ? "auto" : `${scaledHeight}px`,
          flexBasis: inline ? "auto" : `${scaledHeight}px`,
          transformOrigin: inline ? "top left" : undefined,
        }}
      >
        <WidgetTooltipContext.Provider value={[tooltip, setTooltip]}>
          {tooltip !== null && (
            <TooltipWrapper top={20 + scrollPosition}>
              <TooltipContent>{tooltip.text}</TooltipContent>
              {tooltip.link && (
                <TooltipLink href={tooltip.link} target="_blank">
                  {tooltipReadmoreText} ↗
                </TooltipLink>
              )}
            </TooltipWrapper>
          )}
          <ApiErrorNotification genericErrorMessage={widget.api_generic_error_message} />
          {/*(() => {
            const taxInfoText: Record<string, string> = {
              no: "For skattefradrag i 2025 må pengene stå på vår konto innen årsslutt. Bankdonasjoner må overføres før kl. 14:30 den 31. desember.",
              sv: "För skatteavdrag 2025 måste pengarna finnas på vårt konto innan årsskiftet. Banköverföringar måste skickas före kl. 14:30 den 31 december.",
            };
            const text = taxInfoText[widget.locale];
            return text ? <TaxInfoBox>{text}</TaxInfoBox> : null;
          })()}*/}
          <ProgressBar inline={inline} />
          <Carousel minHeight={inline ? 0 : scaledHeight - 116}>
            <DonationPane
              text={{
                single_donation_text: widget.single_donation_text,
                monthly_donation_text: widget.monthly_donation_text,
                amount_context: widget.amount_context,
                smart_distribution_context: widget.smart_distribution_context,
                pane1_button_text: widget.pane1_button_text,
                donation_input_error_templates: widget.donation_input_error_templates,
              }}
              enableRecurring={availableRecurringOptions.recurring}
              enableSingle={availableRecurringOptions.single}
            />
            <DonorPane
              locale={widget.locale}
              text={{
                anon_button_text: widget.anon_button_text,
                anon_button_text_tooltip: widget.anon_button_text_tooltip,
                name_placeholder: widget.name_placeholder,
                name_invalid_error_text: widget.name_invalid_error_text,
                email_placeholder: widget.email_placeholder,
                email_invalid_error_text: widget.email_invalid_error_text,
                tax_deduction_selector_text: widget.tax_deduction_selector_text,
                tax_deduction_ssn_placeholder: widget.tax_deduction_ssn_placeholder,
                tax_deduction_ssn_invalid_error_text: widget.tax_deduction_ssn_invalid_error_text,
                tax_deduction_tooltip_text: widget.tax_deduction_tooltip_text,
                newsletter_selector_text: widget.newsletter_selector_text,
                privacy_policy_text: widget.privacy_policy_text,
                privacy_policy_link: widget.privacy_policy_link,
                pane2_button_text: widget.pane2_button_text,
                api_generic_error_message: widget.api_generic_error_message,
                show_name_field: widget.show_name_field,
                allow_anonymous_donations: widget.allow_anonymous_donations,
                require_privacy_policy_checkbox: widget.require_privacy_policy_checkbox,
                privacy_policy_required_error_text: widget.privacy_policy_required_error_text,
              }}
              paymentMethods={availablePaymentMethods}
              nudges={widget.nudges}
            />
            <PaymentPane
              referrals={{
                referrals_title: widget.referrals_title,
                other_referral_input_placeholder: widget.other_referral_input_placeholder,
                show_referrals: widget.show_referrals,
              }}
              paymentMethods={availablePaymentMethods}
            />
          </Carousel>
        </WidgetTooltipContext.Provider>
      </div>
    </div>
  );
});

export const useWidgetScrollObserver = (elementRef: any) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const observers = useRef(new Set());

  const handleScroll = useCallback((event: any) => {
    const newPosition = event.target.scrollTop;
    setScrollPosition(newPosition);
    observers.current.forEach((observer: any) => observer(newPosition));
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (element) {
      element.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (element) {
        element.removeEventListener("scroll", handleScroll);
      }
    };
  }, [elementRef, handleScroll]);

  const subscribe = useCallback((observer: any) => {
    observers.current.add(observer);
    return () => observers.current.delete(observer);
  }, []);

  return { scrollPosition, subscribe };
};
