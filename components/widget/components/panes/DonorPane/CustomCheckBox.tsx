import Link from "next/link";
import React from "react";
import { ToolTip } from "../../shared/ToolTip/ToolTip";
import {
  CheckBoxLabel,
  CheckBoxLabelWrapper,
  CheckBoxWrapper,
  CheckMark,
  ComputerLabel,
  CustomCheckBoxWrapper,
  MobileLabel,
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
    <CheckBoxWrapper>
      <CheckMark className="checkmark">✓</CheckMark>
    </CheckBoxWrapper>

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
          <Link target="_blank" href={hyperlink.url}>
            {`${hyperlink.text} ↗`}
          </Link>
        )}
      </CheckBoxLabel>
      {showTooltip && tooltipText && <ToolTip text={tooltipText} />}
    </CheckBoxLabelWrapper>
  </CustomCheckBoxWrapper>
);
