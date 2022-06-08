import styled from "styled-components";
import { gray18 } from "../../../config/colors";

export const RichSelectWrapper = styled.div`
  border-radius: 5px;
  padding: 0 12px;
  border: 1px solid ${gray18};

  & > div:last-child {
    border-bottom: none;
  }
`;
