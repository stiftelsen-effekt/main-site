import { useState } from "react";
import { DonationsTimeline } from "../../../shared/components/Timeline/DonationsTimeline";
import style from "./DonationsStatus.module.scss";
import { LightboxWithXButton } from "../../../shared/components/Lightbox/LightboxWithXButton";
import { TimelineProps } from "./DonationStatusJson/DonationStatusJsonProps";

//import DonationsTimeline from "../../../shared/components/Timeline/DonationsTimeline.style";
//import { LightboxDonation } from "./LightboxDonation";

export const DonationStatusModal: React.FC<TimelineProps> = ({
  description,
  data,
  configuration, //NEED TO ADD {Donasjonsstatus} IN SANITY
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setModalOpen(true)} className={style.caption}>
        {" "}
        {description}
        <LightboxWithXButton open={modalOpen} onCancel={() => setModalOpen(false)}>
          <div>
            <h5>{configuration.status_estimate_header}</h5>
            <DonationsTimeline dataObj={data} configuration={configuration} />
          </div>
        </LightboxWithXButton>
      </button>
    </div>
  );
};
