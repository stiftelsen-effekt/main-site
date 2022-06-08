import React from "react";
import { Content, HeaderWrapper, LabelWrapper, RadioBall, Wrapper } from "./RichSelectOption.style";

export interface OptionProps {
  label: string;
  sublabel?: string;
  // An enum
  value: number;
  selected?: boolean;
  select?: (value: number) => void;
}

export const RichSelectOption: React.FC<OptionProps> = ({
  label,
  sublabel,
  value,
  selected,
  children,
  select,
}) => {
  return (
    <Wrapper>
      <LabelWrapper
        tabIndex={0}
        role="button"
        aria-pressed={selected}
        onKeyDown={(e) => (e.key === " " || e.key === "Enter") && select && select(value)}
        onClick={() => select && select(value)}
      >
        <RadioBall selected={selected} />
        <HeaderWrapper>
          <h2>{label}</h2>
          <h3>{sublabel}</h3>
        </HeaderWrapper>
      </LabelWrapper>
      <Content selected={selected || false}>{children}</Content>
    </Wrapper>
  );
};
