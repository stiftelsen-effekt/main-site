import styled from "styled-components";
import { blue10, blue20, gray18 } from "../../../config/colors";

export const RoundedBorder = styled.div`
  width: 92%;
  border: 1px solid ${gray18};
  border-radius: 5px;
  padding-left: 4%;
  padding-right: 4%;
`;

export const InfoBox = styled(RoundedBorder)`
  background: ${blue10};
  border-color: ${blue20};
  padding: 15px;
  white-space: normal;
  font-size: 13px;
  margin-bottom: 12px;
  line-height: 150%;
`;
