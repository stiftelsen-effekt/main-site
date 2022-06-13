import styled from "styled-components";
import { DatePicker } from "../../../../elements/datepicker";

export const ScaledDatePicker = styled(DatePicker)`
  width: 100%;
  aspect-ratio: 4 / 3;
  row-gap: 10px;
  column-gap: 10px;
  height: auto;

  div {
    width: 100%;
    height: 100%;
    font-size: 18px;
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
