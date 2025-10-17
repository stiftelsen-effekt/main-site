import React from "react";
import { FundraiserOrganizationInfo } from "../../FundraiserOrganizationInfo/FundraiserOrganizationInfo";
import { SanityImageObject } from "@sanity/image-url/lib/types/types";
import styles from "../FundraiserWidget.module.scss";

interface OrganizationInfoPaneProps {
  organizationInfo: {
    name: string;
    logo: SanityImageObject;
    textTemplate: string;
    organizationSlug: string;
  };
  buttonText: string;
  onNext: () => void;
  className?: string;
  visible?: boolean;
}

export const OrganizationInfoPane = React.forwardRef<HTMLDivElement, OrganizationInfoPaneProps>(
  ({ organizationInfo, buttonText, onNext, className, visible }, ref) => {
    return (
      <div ref={ref} className={className} style={{ display: visible ? "block" : "none" }}>
        <FundraiserOrganizationInfo
          name={organizationInfo.name}
          logo={organizationInfo.logo}
          textTemplate={organizationInfo.textTemplate}
          organizationSlug={organizationInfo.organizationSlug}
        ></FundraiserOrganizationInfo>
        <button type="submit" className={styles["donation-widget__button"]} onClick={onNext}>
          {buttonText}
        </button>
      </div>
    );
  },
);

OrganizationInfoPane.displayName = "OrganizationInfoPane";
