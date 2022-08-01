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
  font-size: 1.3rem;
  margin-bottom: 12px;
  line-height: 2rem;
`;
