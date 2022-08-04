/* eslint-disable no-useless-concat */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/destructuring-assignment */
import React from "react";
import { ToolTip } from "../../shared/ToolTip/ToolTip";
import {
  CheckBoxLabel,
  CheckBoxLabelWrapper,
  CheckMark,
  ComputerLabel,
  CustomCheckBoxWrapper,
  MobileLabel,
  OrangeLink,
  StyledInput,
} from "./CustomCheckBox.style";

interface HyperLink {
  text: string;
  url: string;
}

interface CheckBoxProps {
  checked: boolean;
  label?: string;
  mobileLabel?: string;
  tooltipText?: string;
  hyperlink?: HyperLink;
}

export const CustomCheckBox: React.FC<CheckBoxProps> = ({
  checked,
  label,
  tooltipText,
  mobileLabel,
  hyperlink,
}) => (
  <CustomCheckBoxWrapper>
    <StyledInput type="checkbox" tabIndex={-1} checked={checked} readOnly />
    <CheckMark checked={checked} className="checkmark" />
    <CheckBoxLabelWrapper>
      <CheckBoxLabel>
        <ComputerLabel>
          {`${label}`}
          &nbsp;
        </ComputerLabel>
        <MobileLabel>
          {`${mobileLabel || label}`}
          &nbsp;
        </MobileLabel>
        {hyperlink && (
          <OrangeLink target="_blank" href={hyperlink.url}>
            {`${hyperlink.text}`}
          </OrangeLink>
        )}
      </CheckBoxLabel>
      {tooltipText && <ToolTip text={tooltipText} />}
    </CheckBoxLabelWrapper>
  </CustomCheckBoxWrapper>
);
