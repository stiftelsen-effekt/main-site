import styled from "styled-components";

export const CauseAreaSelectionWrapper = styled.div<{ separated: boolean }>`
  margin-top: ${(props) => (props.separated ? "20px" : "0")};
`;

export const SmartDistributionExplanationWrapper = styled.div`
  padding-bottom: 36px;
  font-size: 18px;
  color: var(--primary);
`;

export const SmartDistributionLabel = styled.span<{ expanded: boolean }>`
  cursor: pointer;
  display: inline-block;
  user-select: none;
  font-size: 18px;

  /* UTF8 Arrow down as content */
  &::after {
    content: "↓";
    display: inline-block;
    margin-left: 10px;
    transition: transform 0.2s ease-in-out;
    transform: ${(props) => (props.expanded ? "rotate(180deg)" : "rotate(0deg)")};
  }
`;

export const CauseAreaShareSelectionTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const CauseAreaShareSelectionTitle = styled.span`
  font-size: 18px;
  margin-bottom: 0;
  margin-top: 0;
`;

export const CauseAreaShareSelectionTitleSmartDistributionWrapper = styled.div`
  display: grid;
  font-size: 16px;
  grid-template-columns: max-content max-content;
  grid-gap: 10px;
  justify-content: flex-end;
  align-items: center;
`;

export const PercentageInputWrapper = styled.div`
  margin: 10px 0px 30px 0px;

  span {
    position: relative;
    display: inline-flex;
    width: 100%;

    input {
      background: var(--secondary);
      padding: 8px 20px;
      border-radius: 10px;
      border: 1px solid var(--primary);
      color: var(--primary);
      font-size: 28px;
      width: 100%;
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
      font-size: 28px;
    }
  }
`;
