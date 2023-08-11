import { groq } from "next-sanity";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useDebouncedCallback } from "use-debounce";
import { getClient } from "../../../../../lib/sanity.server";
import { withStaticProps } from "../../../../../util/withStaticProps";
import { WidgetContext } from "../../../../main/layout/layout";
import { fetchCauseAreasAction } from "../store/layout/actions";
import { fetchReferralsAction } from "../store/referrals/actions";
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
    "widget": *[_type == "donationwidget"]
  }
`;

export const WidgetTooltipContext = createContext<[string | null, any]>([null, () => {}]);

export const Widget = withStaticProps(async ({ preview }: { preview: boolean }) => {
  const result = await getClient(preview).fetch<QueryResult>(widgetQuery);

  return {
    text: result.widget[0],
  };
})(({ text }) => {
  const dispatch = useDispatch();
  const widgetRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    dispatch(fetchCauseAreasAction.started(undefined));
    dispatch(fetchReferralsAction.started(undefined));
  }, [dispatch]);

  const [tooltip, setTooltip] = useState<string | null>(null);

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
              single_donation_text: text.single_donation_text,
              monthly_donation_text: text.monthly_donation_text,
              preset_amounts_recurring: text.preset_amounts_recurring,
              preset_amounts_single: text.preset_amounts_single,
              smart_fordeling_text: text.smart_fordeling_text,
              smart_fordeling_description: text.smart_fordeling_description,
              choose_your_own_text: text.choose_your_own_text,
              pane1_button_text: text.pane1_button_text,
            }}
          />
          <DonorPane
            text={{
              anon_button_text: text.anon_button_text,
              name_placeholder: text.name_placeholder,
              email_placeholder: text.email_placeholder,
              tax_deduction_selector_text: text.tax_deduction_selector_text,
              tax_deduction_ssn_placeholder: text.tax_deduction_ssn_placeholder,
              tax_deduction_tooltip_text: text.tax_deduction_tooltip_text,
              newsletter_selector_text: text.newsletter_selector_text,
              privacy_policy_text: text.privacy_policy_text,
              payment_method_selector_bank_text: text.payment_method_selector_bank_text,
              payment_method_selector_vipps_text: text.payment_method_selector_vipps_text,
              pane2_button_text: text.pane2_button_text,
            }}
          />
          <PaymentPane
            text={{
              pane3_bank_recurring_title: text.pane3_bank_recurring_title,
              pane3_bank_recurring_selector_earliest_text:
                text.pane3_bank_recurring_selector_earliest_text,
              pane3_bank_recurring_selector_choose_date_text:
                text.pane3_bank_recurring_selector_choose_date_text,
              pane3_bank_recurring_button_text: text.pane3_bank_recurring_button_text,
              pane3_bank_single_title: text.pane3_bank_single_title,
              pane3_bank_single_kontonr_title: text.pane3_bank_single_kontonr_title,
              pane3_bank_single_kid_title: text.pane3_bank_single_kid_title,
              pane3_bank_single_explanatory_text: text.pane3_bank_single_explanatory_text,
              pane3_vipps_single_title: text.pane3_vipps_single_title,
              pane3_vipps_single_button_text: text.pane3_vipps_single_button_text,
              pane3_vipps_recurring_title: text.pane3_vipps_recurring_title,
              pane3_vipps_recurring_selector_earliest_text:
                text.pane3_vipps_recurring_selector_earliest_text,
              pane3_vipps_recurring_selector_choose_date_text:
                text.pane3_vipps_recurring_selector_choose_date_text,
              pane3_vipps_recurring_button_text: text.pane3_vipps_recurring_button_text,
              pane3_referrals_title: text.pane3_referrals_title,
            }}
          />
        </Carousel>
      </WidgetTooltipContext.Provider>
    </div>
  );
});
