import styled from "styled-components";
import { gray18 } from "../../../../config/colors";

export const ResultWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const HorizontalLine = styled.div`
  height: 1px;
  background-color: ${gray18};
`;

export const TextWrapper = styled.div`
  padding-top: 16px;
  padding-bottom: 16px;
  display: flex;
  justify-content: space-between;
  font-size: 24px;
`;

export const CompleteButtonWrapper = styled.div`
  padding-top: 40px;
  padding-bottom: 16px;
  display: flex;
  justify-content: center;
`;

export const CompleteButton = styled.button`
  cursor: pointer;
  font-size: 20px;
  padding: 14px 40px;
  border-radius: 45px;
  min-width: 140px;
  background-color: var(--primary);
  color: var(--secondary);

  @media only screen and (max-width: 768px) {
    font-size: 25px;
    padding: 18px 68px;
    border-radius: 60px;
    min-width: 210px;
  }
`;
