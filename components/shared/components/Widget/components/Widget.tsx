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
import { WidgetContext, WidgetContextType } from "../../../../main/layout/layout";
import { fetchCauseAreasAction } from "../store/layout/actions";
import { paymentMethodConfigurations } from "../config/methods";
import {
  setCauseAreaPercentageShare,
  setRecurring,
  setShareType,
  setShares,
} from "../store/donation/actions";
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
import { useRouter } from "next/router";
import { PrefilledDistribution } from "../../../../main/layout/WidgetPane/WidgetPane";
import { TooltipWrapper } from "./shared/ProgressBar/ProgressBar.style";

const widgetQuery = groq`
*[_type == "donationwidget"][0] {
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
}
`;

export const WidgetTooltipContext = createContext<[string | null, any]>([null, () => {}]);

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
const useWidgetScaleEffect = (widgetRef: React.RefObject<HTMLDivElement>) => {
  const [widgetContext, setWidgetContext] = useContext(WidgetContext);
  const [scalingFactor, setScalingFactor] = useState(1);
  const [scaledHeight, setScaledHeight] = useState(979);
  const [lastHeight, setLastHeight] = useState(979);
  const [lastWidth, setLastWidth] = useState(400);

  const scaleWidget = useCallback(() => {
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
  }, [setScalingFactor, setScaledHeight, scalingFactor, scaledHeight, setLastWidth, setLastHeight]);

  useEffect(() => scaleWidget, [widgetContext.open, scaleWidget]);

  const debouncedScaleWidget = useDebouncedCallback(() => scaleWidget(), 1000, { maxWait: 1000 });

  useEffect(() => {
    window.addEventListener("resize", debouncedScaleWidget);

    return () => {
      window.removeEventListener("resize", debouncedScaleWidget);
    };
  }, [debouncedScaleWidget]);

  useEffect(() => {
    scaleWidget();
  }, [widgetContext, scaleWidget]);

  return useMemo(() => ({ scaledHeight, scalingFactor }), [scaledHeight, scalingFactor]);
};

export const Widget = withStaticProps(async ({ draftMode }: { draftMode: boolean }) => {
  const result = await getClient(draftMode ? token : undefined).fetch<WidgetProps>(widgetQuery);

  if (!result.methods?.length) {
    throw new Error("No payment methods found");
  }

  return {
    data: {
      result,
      query: widgetQuery,
    },
  };
})(({ data }) => {
  const widget = data.result;
  const methods = data.result.methods;

  if (!methods) {
    throw new Error("No payment methods found");
  }

  const router = useRouter();
  const dispatch = useDispatch();
  const [widgetContext, setWidgetContext] = useContext(WidgetContext);
  const widgetRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const causeAreas = useSelector((state: State) => state.layout.causeAreas);

  const availableRecurringOptions = useAvailableRecurringOptions(methods);
  const availablePaymentMethods = useAvailablePaymentMethods(methods);
  const distributionCauseAreas = useSelector(
    (state: State) => state.donation.distributionCauseAreas,
  );

  const { scaledHeight, scalingFactor } = useWidgetScaleEffect(widgetRef);
  const { scrollPosition } = useWidgetScrollObserver(widgetRef);

  useEffect(() => {
    dispatch(fetchCauseAreasAction.started(undefined));
    dispatch(fetchReferralsAction.started(undefined));
  }, [dispatch]);

  useEffect(() => {
    if (widgetContext.prefilled && distributionCauseAreas.length > 0) {
      const prefilled = widgetContext.prefilled;
      // Overwrite distribution cause areas with prefilled data
      distributionCauseAreas.forEach((causeArea) => {
        const prefilledCauseArea = prefilled.find(
          (prefilledCauseArea) => prefilledCauseArea.causeAreaId === causeArea.id,
        );
        if (prefilledCauseArea) {
          dispatch(setCauseAreaPercentageShare(causeArea.id, prefilledCauseArea.share.toString()));
          dispatch(setShareType(causeArea.id, false));
          let newCauseAreaOrganizations = causeArea.organizations.map((organization) => {
            const prefilledOrganization = prefilledCauseArea.organizations.find(
              (prefilledOrganization) => prefilledOrganization.organizationId === organization.id,
            );
            if (prefilledOrganization) {
              return {
                ...organization,
                percentageShare: prefilledOrganization.share.toString(),
              };
            } else {
              return {
                ...organization,
                percentageShare: "0",
              };
            }
          });

          dispatch(setShares(causeArea.id, newCauseAreaOrganizations));
        } else {
          dispatch(setCauseAreaPercentageShare(causeArea.id, "0"));
          dispatch(setShareType(causeArea.id, true));
          let newCauseAreaOrganizations = causeArea.organizations.map((organization) => {
            return {
              ...organization,
              percentageShare: "0",
            };
          });

          dispatch(setShares(causeArea.id, newCauseAreaOrganizations));
        }
        return causeArea;
      });
    }
  }, [widgetContext.prefilled]);

  /** Look at the URL and look for a query param
   *  that specifies a payment distribution to prefill
   *  If found, set the distribution cause areas and organizations
   *  to the prefilled values.
   *  Find the corresponding cause area and organization in the state
   *  Use next router to look at the query params
   *
   *  The format of the query param is:
   *  distribution=causeAreaId:share:organizationId-share:organizationId-share
   *
   *  E.g.
   *  1:100:4-50:1-25:12-25
   *
   *  This would set cause area 1 to 100% and distribute the shares
   *  between organizations 4, 1 and 12 with 50%, 25% and 25% respectively
   */
  useEffect(() => {
    const query = router.query;
    if (query && query["distribution"] && causeAreas) {
      const distribution = query["distribution"] as string;
      const prefilledDistribution: PrefilledDistribution = distribution
        .split(",")
        .map((prefilledCauseArea) => {
          const [causeAreaId, share, ...organizations] = prefilledCauseArea.split(":");
          return {
            causeAreaId: parseInt(causeAreaId),
            share: parseFloat(share),
            organizations: organizations.map((organization) => {
              const [organizationId, share] = organization.split("-");
              return {
                organizationId: parseInt(organizationId),
                share: parseFloat(share),
              };
            }),
          };
        });
      setWidgetContext({ open: true, prefilled: prefilledDistribution });
    }
  }, [router.query, causeAreas]);

  useDefaultPaymentMethodEffect(methods);

  return (
    <div
      id="widget"
      ref={widgetRef}
      style={{
        transform: `scale(${scalingFactor})`,
        height: `${scaledHeight}px`,
        flexBasis: `${scaledHeight}px`,
      }}
    >
      <WidgetTooltipContext.Provider value={[tooltip, setTooltip]}>
        {tooltip !== null && <TooltipWrapper top={20 + scrollPosition}>{tooltip}</TooltipWrapper>}
        <ProgressBar />
        <Carousel minHeight={scaledHeight - 116}>
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
              pane3_referrals_title: widget.pane3_referrals_title,
            }}
            paymentMethods={availablePaymentMethods}
          />
        </Carousel>
      </WidgetTooltipContext.Provider>
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
