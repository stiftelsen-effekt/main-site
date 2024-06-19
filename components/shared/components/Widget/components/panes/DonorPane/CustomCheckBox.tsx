import Link from "next/link";
import React from "react";
import { ToolTip } from "../../shared/ToolTip/ToolTip";
import {
  CheckBoxLabel,
  CheckBoxLabelWrapper,
  CheckBoxWrapper,
  CheckMark,
  CustomCheckBoxWrapper,
  InputWrapper,
  StyledInput,
  ToolTipWrapper,
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
    <InputWrapper>
      <StyledInput type="checkbox" tabIndex={-1} checked={checked} readOnly />
      <CheckBoxWrapper>
        <CheckMark className="checkmark">✓</CheckMark>
      </CheckBoxWrapper>

      <CheckBoxLabelWrapper>
        <CheckBoxLabel>
          {`${label} `}
          {hyperlink && (
            <Link href={hyperlink.url} passHref target="_blank">
              {`${hyperlink.text} ↗`}
            </Link>
          )}
        </CheckBoxLabel>
      </CheckBoxLabelWrapper>
    </InputWrapper>
    <ToolTipWrapper>{showTooltip && tooltipText && <ToolTip text={tooltipText} />}</ToolTipWrapper>
  </CustomCheckBoxWrapper>
);
