import { useState } from "react";
import { Lightbox } from "../../../shared/components/Lightbox/Lightbox";
//import { styled } from "styled-components";
import { ActionButton } from "../../../shared/components/Widget/components/shared/ProgressBar/ProgressBar.style";
import { PaneNumber } from "../../../shared/components/Widget/store/state";
import { DonationsTimeline } from "../../../shared/components/Timeline/DonationsTimeline";
import style from "./DonationsStatus.module.scss";
import { LightboxWithoutBotton } from "../../../shared/components/Lightbox/LightboxWithoutBotton";
import { TimelineProps } from "./DonationStatusJson/DonationStatusJsonProps";

//import DonationsTimeline from "../../../shared/components/Timeline/DonationsTimeline.style";
//import { LightboxDonation } from "./LightboxDonation";

export const DonationStatusModal: React.FC<TimelineProps> = ({ description, data }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const listOfPoints = [3, 1, 2, 1];

  //make a function for calculating numMainNodes, numCompletedNodes, numSideNodes and numCompletedSideNodes

  const Provider = data.smart[0];

  const nameProvider = Provider.provider;
  const sum = Provider.amount;
  const numCharities = Provider.involvedCharities.length;

  return (
    <div>
      <button onClick={() => setModalOpen(true)} className={style.caption}>
        {" "}
        {description}
        <LightboxWithoutBotton open={modalOpen} onCancel={() => setModalOpen(false)}>
          <div>
            <h5>Donasjonsstatus</h5>
            {nameProvider}
            {sum}
            {numCharities}
            <DonationsTimeline
              numMainNodes={listOfPoints[0]}
              numCompletedNodes={listOfPoints[1]}
              numSideNodes={listOfPoints[2]}
              numCompletedSideNodes={listOfPoints[3]}
            />
          </div>
        </LightboxWithoutBotton>
      </button>
    </div>
  );
};
