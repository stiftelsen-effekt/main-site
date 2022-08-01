import styled from "styled-components";
import { gray20 } from "../../../config/colors";

export const InfoText = styled.div`
  margin-left: 5px;
  margin-top: 15px;
  font-size: 1.8rem;
  white-space: pre-wrap;
  color: var(--primary);

  @media only screen and (max-width: 768px) {
    font-size: 2.2rem;
    line-height: 3rem;
  }
`;
