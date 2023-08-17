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
import { getClient } from "../../../../../lib/sanity.server";
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

type QueryResult = {
  widget: [WidgetProps];
};

const widgetQuery = groq`
  {
    "widget": *[_type == "donationwidget"] {
      ...,
      methods[] { 
        _type == 'reference' => @->{
          _type == 'bank' => {
            ...
          },
          _type == 'vipps' => {
            _id,
            selector_text,
            recurring_title,
            recurring_selector_earliest_text,
            recurring_selector_choose_date_text,
            recurring_button_text,
            single_title,
            single_button_text,
          },
          _type == 'swish' => {
            ...
          },
        },
      }
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
  const [widgetOpen, setWidgetOpen] = useContext(WidgetContext);
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

  useEffect(() => scaleWidget, [widgetOpen, scaleWidget]);

  const debouncedScaleWidget = useDebouncedCallback(() => scaleWidget(), 100, { maxWait: 100 });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", debouncedScaleWidget);
    }
  });

  useEffect(() => {
    scaleWidget();
  }, [widgetOpen, scaleWidget]);

  return useMemo(() => ({ scaledHeight, scalingFactor }), [scaledHeight, scalingFactor]);
};

export const Widget = withStaticProps(async ({ preview }: { preview: boolean }) => {
  const result = await getClient(preview).fetch<QueryResult>(widgetQuery);

  const widget = result.widget[0];

  if (!widget.methods?.length) {
    throw new Error("No payment methods found");
  }

  return {
    widget,
    methods: widget.methods,
  };
})(({ widget, methods }) => {
  const dispatch = useDispatch();
  const widgetRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<string | null>(null);

  const availableRecurringOptions = useAvailableRecurringOptions(methods);
  const availablePaymentMethods = useAvailablePaymentMethods(methods);

  const { scaledHeight, scalingFactor } = useWidgetScaleEffect(widgetRef);

  useEffect(() => {
    dispatch(fetchCauseAreasAction.started(undefined));
    dispatch(fetchReferralsAction.started(undefined));
  }, [dispatch]);

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
        <ProgressBar />
        <Carousel minHeight={scaledHeight - 116}>
          <DonationPane
            text={{
              single_donation_text: widget.single_donation_text,
              monthly_donation_text: widget.monthly_donation_text,
              preset_amounts_recurring: widget.preset_amounts_recurring,
              preset_amounts_single: widget.preset_amounts_single,
              smart_distribution_context: widget.smart_distribution_context,
              pane1_button_text: widget.pane1_button_text,
              donation_input_error_templates: widget.donation_input_error_templates,
            }}
            enableRecurring={availableRecurringOptions.recurring}
            enableSingle={availableRecurringOptions.single}
          />
          <DonorPane
            text={{
              anon_button_text: widget.anon_button_text,
              name_placeholder: widget.name_placeholder,
              email_placeholder: widget.email_placeholder,
              tax_deduction_selector_text: widget.tax_deduction_selector_text,
              tax_deduction_ssn_placeholder: widget.tax_deduction_ssn_placeholder,
              tax_deduction_tooltip_text: widget.tax_deduction_tooltip_text,
              newsletter_selector_text: widget.newsletter_selector_text,
              privacy_policy_text: widget.privacy_policy_text,
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
