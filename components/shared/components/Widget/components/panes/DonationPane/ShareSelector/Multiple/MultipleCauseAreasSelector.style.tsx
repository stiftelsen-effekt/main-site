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
