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
  padding-top: 25px;
  padding-bottom: 25px;
  display: flex;
  justify-content: space-between;
`;
