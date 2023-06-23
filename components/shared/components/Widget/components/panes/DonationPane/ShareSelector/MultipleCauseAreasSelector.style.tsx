import styled from "styled-components";

export const CauseAreaShareSelectionTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const CauseAreaShareSelectionTitle = styled.span`
  font-size: 1.2rem;
  margin-bottom: 0;
  margin-top: 0;
`;

export const CauseAreaShareSelectionTitleSmartDistributionWrapper = styled.div`
  display: grid;
  font-size: 1rem;
  grid-template-columns: max-content max-content;
  grid-gap: 10px;
  justify-content: flex-end;
  align-items: center;
`;

export const PercentageInputWrapper = styled.div`
  margin: 20px 0;

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
