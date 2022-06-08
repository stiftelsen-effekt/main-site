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
  showTooltip?: boolean;
  tooltipText?: string;
  hyperlink?: HyperLink;
}

export const CustomCheckBox: React.FC<CheckBoxProps> = ({
  checked,
  label,
  showTooltip,
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
      {showTooltip && tooltipText && <ToolTip text={tooltipText} />}
    </CheckBoxLabelWrapper>
  </CustomCheckBoxWrapper>
);
