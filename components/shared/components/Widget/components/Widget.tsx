import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DonationPane } from "./panes/DonationPane/DonationPane";
import { DonorPane } from "./panes/DonorPane/DonorPane";
import { PaymentPane } from "./panes/PaymentPane/PaymentPane";
import { Carousel } from "./Carousel";
import { fetchOrganizationsAction } from "../store/layout/actions";
import { State } from "../store/state";
import { fetchReferralsAction } from "../store/referrals/actions";
import { ProgressBar } from "./shared/ProgressBar/ProgressBar";
import { useDebouncedCallback } from "use-debounce";
import { WidgetContext } from "../../../../main/layout/layout";
import { WidgetProps } from "../types/WidgetProps";

export const WidgetTooltipContext = createContext<[string | null, any]>([null, () => {}]);

export const Widget: React.FC<{ text: WidgetProps }> = ({ text }) => {
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
    dispatch(fetchOrganizationsAction.started(undefined));
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
              preset_donation_amount_1: text.preset_donation_amount_1,
              preset_donation_amount_2: text.preset_donation_amount_2,
              preset_donation_amount_3: text.preset_donation_amount_3,
              smart_fordeling_text: text.smart_fordeling_text,
              smart_fordeling_description: text.smart_fordeling_description,
              choose_your_own_text: text.choose_your_own_text,
              button_text: text.button_text,
            }}
          />
          <DonorPane />
          <PaymentPane />
        </Carousel>
      </WidgetTooltipContext.Provider>
    </div>
  );
};
