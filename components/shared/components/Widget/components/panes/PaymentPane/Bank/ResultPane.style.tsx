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
