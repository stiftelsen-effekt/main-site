import styled from "styled-components";

export const CauseAreaSelectionWrapper = styled.div.withConfig({
  shouldForwardProp: (prop, defaultValidatorFn) => !["separated"].includes(prop),
})<{ separated: string }>`
  margin-top: ${(props) => (props.separated === "true" ? "20px" : "0")};
`;

export const SmartDistributionExplanationWrapper = styled.div`
  padding-bottom: 36px;
  font-size: 18px;
  color: var(--primary);
`;

export const SmartDistributionLabel = styled.span.withConfig({
  shouldForwardProp: (prop, defaultValidatorFn) => !["expanded"].includes(prop),
})<{ expanded: string }>`
  cursor: pointer;
  display: inline-block;
  user-select: none;
  font-size: 22px;

  /* UTF8 Arrow down as content */
  &::after {
    content: "↓";
    display: inline-block;
    margin-left: 10px;
    transition: transform 0.2s ease-in-out;
    transform: ${(props) => (props.expanded === "true" ? "rotate(180deg)" : "rotate(0deg)")};
  }
`;

export const CauseAreaShareSelectionTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const CauseAreaShareSelectionTitle = styled.span`
  font-size: 22px;
  margin-bottom: 0;
  margin-top: 0;
`;

export const CauseAreaShareSelectionTitleSmartDistributionWrapper = styled.div`
  display: grid;
  font-size: 18px;
  grid-template-columns: max-content max-content;
  grid-gap: 10px;
  justify-content: flex-end;
  align-items: center;
`;

export const PercentageInputWrapper = styled.div`
  margin: 10px 0px 30px 0px;

  &[data-error] span input {
    /* border-color: #db0000; */
  }

  span {
    position: relative;
    display: inline-flex;
    width: 100%;

    input {
      background: var(--secondary);
      padding: 12px 38px;
      border-radius: 10px;
      border: 1px solid var(--primary);
      color: var(--primary);
      font-size: 30px;
      width: 100%;
      transition: border-color 0.2s ease-in-out;
      text-align: right;
    }
    &:after {
      content: "%";
      color: var(--primary);
      position: absolute;
      right: 10px;
      top: 0px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      font-size: 30px;
    }
  }
`;
