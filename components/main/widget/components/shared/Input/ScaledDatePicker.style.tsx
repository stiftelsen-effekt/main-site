import styled from "styled-components";
import { DatePicker } from "../../../../../shared/components/DatePicker/DatePicker";

export const ScaledDatePicker = styled(DatePicker)`
  width: 100%;
  aspect-ratio: 4 / 3;
  row-gap: 10px;
  column-gap: 10px;
  height: auto;
  --primary: #000;
  --secondary: #fafafa;
  padding-left: 0;

  div {
    width: 100%;
    height: 100%;
    font-size: 2rem;
  }

  div:last-child {
    width: auto;
    height: 100%;
    font-size: 1.8rem;
    border-radius: 500px;

    div {
      padding: 0 20px;
    }
  }
`;
