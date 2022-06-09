import React, { useEffect } from "react";
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

export const Widget: React.FC = () => {
  const dispatch = useDispatch();
  const answeredReferral = useSelector((state: State) => state.layout.answeredReferral);

  const [rerender, setRerender] = React.useState(false);
  useEffect(() => {
    setTimeout(() => {
      setRerender(!rerender);
    }, 1000);
  }, [rerender]);
  useEffect(() => {
    setTimeout(() => {
      setRerender(!rerender);
    }, 1000);
  }, []);

  useEffect(() => {
    dispatch(fetchOrganizationsAction.started(undefined));
    dispatch(fetchReferralsAction.started(undefined));
  }, []);

  const scalingFactor = typeof window !== "undefined" ? (window.innerWidth * 0.4) / 576 : 1;
  const scaledHeight = typeof window !== "undefined" ? window.innerHeight / scalingFactor : 978;

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
      <Carousel>
        <DonationPane />
        <DonorPane />
        {/* answeredReferral !== true && <ReferralPane /> */}
        <PaymentPane />
      </Carousel>
    </div>
  );
};
