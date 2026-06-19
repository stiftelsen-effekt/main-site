import styled from "styled-components";
import { blue10, blue20, gray18 } from "../../../config/colors";

export const RoundedBorder = styled.div`
  border: 1px solid var(--primary);
  border-radius: 15px;
  padding-left: 20px;
  padding-right: 20px;
  margin-bottom: 20px;
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

export const TaxInfoBox = styled.div`
  background: white;
  color: black;
  border-bottom: 1px solid var(--primary);
  padding: 12px 20px;
  white-space: normal;
  font-size: 13px;
  line-height: 150%;
`;
