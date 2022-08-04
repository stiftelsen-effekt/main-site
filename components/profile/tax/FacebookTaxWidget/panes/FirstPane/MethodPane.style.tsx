import styled from "styled-components";
import { gray20 } from "../../../config/colors";

export const MethodWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TextWrapper = styled.div`
  display: flex;
  margin-top: 20px;
  margin-bottom: 20px;
`;

export const BlackTitle = styled.p`
  text-align: center;
  white-space: normal;
  font-size: 16px;
  font-family: Arial, Helvetica, sans-serif;
  line-height: 150%;
  margin-bottom: 20px;
  font-weight: bold;
`;

export const InfoText = styled.p`
  white-space: normal;
  font-size: 14px;
  line-height: 150%;
  color: ${gray20};
  margin: 0;
`;

export const RecurringSelectWrapper = styled.div`
  padding-top: 10px;
  padding-bottom: 15px;
`;
