import styled from "styled-components";
import { DatePicker } from "../../../../DatePicker/DatePicker";

export const ScaledDatePicker = styled(DatePicker)`
  width: 100%;
  aspect-ratio: 4 / 3;
  row-gap: 0;
  height: auto;
  --primary: #000;
  --secondary: #fafafa;

  div {
    font-size: 20px;
    width: 60px;
    height: 60px;
    font-size: 20px;
  }

  div:last-child {
    width: auto;
    height: 100%;
    font-size: 18px;
    border-radius: 500px;

    div {
      padding: 0 20px;
    }
  }
`;
