import styled from "styled-components";
import { gray18, orange15 } from "../../../../config/colors";

export const ReferralsWrapper = styled.div``;

export const ReferralButtonsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

interface ButtonProps {
  selected: boolean;
}

export const ReferralButton = styled.button<ButtonProps>`
  padding: 10px 10px 10px 10px;
  margin: 5px;
  font-size: 16px;
  background-color: ${props => props.selected ? "white" : "black"};
  color: ${props => props.selected ? "black" : "white"};
  border: 1px solid white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }

  &:focus {
    text-decoration: underline;
  }
`;

export const ReferralTextInput = styled.input`
  padding: 10px 10px 10px 10px;
  margin: 1%;
  font-size: 16px;
  background-color: black;
  color: white;
  border: 1px solid white;
  border-radius: 10px;
  width: 98%;

  &:hover {
    cursor: text;
  }
`;
