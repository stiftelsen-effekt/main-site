import React from "react";
import style from "./DKAgreementMembershipLine.module.scss";

export const DKAgreementMembershipLine: React.FC<{
  prefix: string;
  label: string;
}> = ({ prefix, label }) => (
  <p className={style.membershipLine} data-cy="dk-agreement-membership">
    <span className={style.prefix}>{prefix}</span>
    {label}
  </p>
);
