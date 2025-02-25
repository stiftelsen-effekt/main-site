import { groq } from "next-sanity";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDebouncedCallback } from "use-debounce";
import { getClient } from "../../../../../lib/sanity.client";
import { withStaticProps } from "../../../../../util/withStaticProps";
import { WidgetContext } from "../../../../main/layout/layout";
import { fetchCauseAreasAction } from "../store/layout/actions";
import { paymentMethodConfigurations } from "../config/methods";
import { setRecurring } from "../store/donation/actions";
import { fetchReferralsAction } from "../store/referrals/actions";
import { State } from "../store/state";
import { RecurringDonation } from "../types/Enums";
import { WidgetProps } from "../types/WidgetProps";
import { Carousel } from "./Carousel";
import { DonationPane } from "./panes/DonationPane/DonationPane";
import { DonorPane } from "./panes/DonorPane/DonorPane";
import { PaymentPane } from "./panes/PaymentPane/PaymentPane";
import { ProgressBar } from "./shared/ProgressBar/ProgressBar";
import { token } from "../../../../../token";
import {
  TooltipContent,
  TooltipLink,
  TooltipWrapper,
} from "./shared/ProgressBar/ProgressBar.style";
import { usePrefilledDistribution, usePrefilledSum, useQueryParamsPrefill } from "./hooks";
import { useElementHeight } from "../../../../../hooks/useElementHeight";
import { PrefilledDistribution } from "../../../../main/layout/WidgetPane/WidgetPane";

export const widgetContentQuery = groq`
...,
  "locale": *[ _type == "site_settings"][0].main_locale,
  methods[] { 
    _type == 'reference' => @->{
      _type == 'bank' => {
        ...,
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
      },
      _type == 'swish' => {
        ...
      },
      _type == 'autogiro' => {
        ...,
        recurring_manual_option_config {
          ...,
          date_selector_config->
        }
      },
      _type == 'avtalegiro' => {
        ...,
        date_selector_configuration->
      },
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

/**
 * Determine available recurring options based on the configured payment methods
 */
const useAvailableRecurringOptions = (paymentMethods: NonNullable<WidgetProps["methods"]>) => {
  const recurring = useMemo(
    () =>
      paymentMethods.some((method) => {
        const configuration = paymentMethodConfigurations.find(
          (config) => config.id === method._id,
        );
        return configuration?.recurringOptions.includes(RecurringDonation.RECURRING);
      }),
    [paymentMethods],
  );

  const single = useMemo(
    () =>
      paymentMethods.some((method) => {
        const configuration = paymentMethodConfigurations.find(
          (config) => config.id === method._id,
        );
        return configuration?.recurringOptions.includes(RecurringDonation.NON_RECURRING);
      }),
    [paymentMethods],
  );

  return useMemo(() => ({ recurring, single }), [recurring, single]);
};

/**
 * Determine available payment methods based on the selected recurring option
 */
const useAvailablePaymentMethods = (paymentMethods: NonNullable<WidgetProps["methods"]>) => {
  const recurring = useSelector((state: State) => state.donation.recurring);

  const availablePaymentMethods = useMemo(
    () =>
      paymentMethods.filter((method) => {
        const configuration = paymentMethodConfigurations.find(
          (config) => config.id === method._id,
        );
        return configuration?.recurringOptions.includes(recurring);
      }),
    [paymentMethods, recurring],
  );

  return availablePaymentMethods;
};

/**
 * This effect is used to set the default payment method to single if recurring is not enabled
 */
const useDefaultPaymentMethodEffect = (paymentMethods: NonNullable<WidgetProps["methods"]>) => {
  const dispatch = useDispatch();
  const recurring = useSelector((state: State) => state.donation.recurring);

  const availableRecurringOptions = useAvailableRecurringOptions(paymentMethods);

  useEffect(() => {
    if (recurring === RecurringDonation.RECURRING && !availableRecurringOptions.recurring) {
      dispatch(setRecurring(RecurringDonation.NON_RECURRING));
    }
  }, [recurring, availableRecurringOptions.recurring, dispatch]);
};

/**
 * Scale the widget to fit the screen
 */
const useWidgetScaleEffect = (widgetRef: React.RefObject<HTMLDivElement>, inline: boolean) => {
  const [widgetContext, setWidgetContext] = useContext(WidgetContext);
  const [scalingFactor, setScalingFactor] = useState(1);
  const [scaledHeight, setScaledHeight] = useState(979);
  const [lastHeight, setLastHeight] = useState(979);
  const [lastWidth, setLastWidth] = useState(400);

  const scaleWidget = useCallback(() => {
    if (!inline || window.innerWidth < 1180) {
      setScalingFactor(
        (window.innerWidth >= 1180 ? Math.min(window.innerWidth * 0.4, 720) : window.innerWidth) /
          576,
      );
      setScaledHeight(Math.ceil(window.innerHeight / scalingFactor));
      if (window.innerHeight != lastHeight && window.innerWidth == lastWidth) {
        // This is probably the android keyboard opening
        const delta = lastHeight - window.innerHeight;
        if (delta > 0) widgetRef.current?.scrollTo(0, Math.ceil(delta / scalingFactor));
        else widgetRef.current?.scrollTo(0, 0);
      }
      setLastWidth(window.innerWidth);
      setLastHeight(window.innerHeight);
    }
  }, [
    setScalingFactor,
    setScaledHeight,
    scalingFactor,
    scaledHeight,
    setLastWidth,
    setLastHeight,
    inline,
  ]);

  useEffect(() => scaleWidget, [widgetContext.open, scaleWidget]);

  const debouncedScaleWidget = useDebouncedCallback(() => scaleWidget(), 1000, { maxWait: 1000 });

  useEffect(() => {
    if (!inline) {
      window.addEventListener("resize", debouncedScaleWidget);

      return () => {
        window.removeEventListener("resize", debouncedScaleWidget);
      };
    }
  }, [debouncedScaleWidget, inline]);

  useEffect(() => {
    scaleWidget();
  }, [widgetContext, scaleWidget]);

  return useMemo(() => ({ scaledHeight, scalingFactor }), [scaledHeight, scalingFactor]);
};

export const Widget = withStaticProps(
  async ({
    draftMode,
    inline,
    prefilled,
  }: {
    draftMode: boolean;
    inline?: boolean;
    prefilled?: PrefilledDistribution;
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
    };
  },
)(({ data, inline = false, prefilled }) => {
  const widget = data.result;
  const methods = data.result.methods;

  if (!methods) {
    throw new Error("No payment methods found");
  }

  const dispatch = useDispatch();
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetWrapperRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ text: string; link?: string } | null>(null);
  const causeAreas = useSelector((state: State) => state.layout.causeAreas);

  const availableRecurringOptions = useAvailableRecurringOptions(methods);
  const availablePaymentMethods = useAvailablePaymentMethods(methods);
  const distributionCauseAreas = useSelector(
    (state: State) => state.donation.distributionCauseAreas,
  );

  const { scaledHeight, scalingFactor } = useWidgetScaleEffect(widgetRef, inline);
  const { scrollPosition } = useWidgetScrollObserver(widgetRef);
  const widgetHeight = useElementHeight(widgetRef);

  useEffect(() => {
    dispatch(fetchCauseAreasAction.started(undefined));
    dispatch(fetchReferralsAction.started(undefined));
  }, [dispatch]);

  usePrefilledDistribution({
    inline,
    distributionCauseAreas,
    prefilledDistribution: prefilled,
  });

  usePrefilledSum({
    inline,
  });

  useQueryParamsPrefill({
    inline,
    causeAreas,
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
              }}
              paymentMethods={availablePaymentMethods}
            />
            <PaymentPane
              referrals={{
                referrals_title: widget.referrals_title,
                other_referral_input_placeholder: widget.other_referral_input_placeholder,
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
