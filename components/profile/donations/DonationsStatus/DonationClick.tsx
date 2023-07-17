import { useState } from "react";
import { Lightbox } from "../../../shared/components/Lightbox/Lightbox";
//import { styled } from "styled-components";
import { ActionButton } from "../../../shared/components/Widget/components/shared/ProgressBar/ProgressBar.style";
import { PaneNumber } from "../../../shared/components/Widget/store/state";
import { DonationsTimeline } from "../../../shared/components/Timeline/DonationsTimeline";
import style from "./DonationsStatus.module.scss";
//import DonationsTimeline from "../../../shared/components/Timeline/DonationsTimeline.style";
//import { LightboxDonation } from "./LightboxDonation";

export const DonationStatus: React.FC<{ description: string }> = ({ description }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setModalOpen(true)} className={style.caption}>
        {" "}
        {description}
        <Lightbox open={modalOpen} onConfirm={() => setModalOpen(false)} showOkay={false}>
          <div>
            <h4> Donasjonsstatus</h4>
            <DonationsTimeline />
            <div>
              <ActionButton
                className={style.cornerButton}
                data-cy="close-widget"
                onClick={(e) => {
                  setModalOpen(false);
                  e.currentTarget.blur();
                }}
              >
                ✕
              </ActionButton>
            </div>
          </div>
        </Lightbox>
      </button>
    </div>
  );
};
