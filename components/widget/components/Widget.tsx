import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DonationPane } from "./panes/DonationPane/DonationPane";
import { DonorPane } from "./panes/DonorPane/DonorPane";
import { PaymentPane } from "./panes/PaymentPane/PaymentPane";
import { ReferralPane } from "./panes/ReferralPane/ReferralPane";
import { Carousel } from "./Carousel";
import { fetchOrganizationsAction } from "../store/layout/actions";
import { State } from "../store/state";
import { fetchReferralsAction } from "../store/referrals/actions";
import { ProgressBar } from "./shared/ProgressBar/ProgressBar";
import { WidgetContext } from "../../main/layout";

export const Widget: React.FC = () => {
  const dispatch = useDispatch();
  const answeredReferral = useSelector((state: State) => state.layout.answeredReferral);
  const [widgetOpen, setWidgetOpen] = useContext(WidgetContext);
  const [scalingFactor, setScalingFactor] = useState(1);
  const [scaledHeight, setScaledHeight] = useState(979);

  const [rerender, setRerender] = React.useState(false);
  useEffect(() => {
    setRerender((r) => !r);
  }, [widgetOpen]);

  useEffect(() => {
    dispatch(fetchOrganizationsAction.started(undefined));
    dispatch(fetchReferralsAction.started(undefined));
  }, [dispatch]);

  useEffect(() => {
    setScalingFactor(
      (window.innerWidth >= 900 ? Math.min(window.innerWidth * 0.4, 720) : window.innerWidth) / 576,
    );
    setScaledHeight(window.innerHeight / scalingFactor);
  }, [rerender]);

  return (
    <div
      id="widget"
      style={{
        transform: `scale(${scalingFactor})`,
        height: `${scaledHeight}px`,
        flexBasis: `${scaledHeight}px`,
      }}
    >
      <ProgressBar />
      <Carousel minHeight={scaledHeight - 116}>
        <DonationPane />
        <DonorPane />
        {/* answeredReferral !== true && <ReferralPane /> */}
        <PaymentPane />
      </Carousel>
    </div>
  );
};
