import styled from "styled-components";
import { orange20 } from "../../../config/colors";

export const CustomCheckBoxWrapper = styled.span`
  position: absolute;
  cursor: pointer;
  margin-top: 5px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  pointer-events: none;
  z-index: 1;
`;

export const CheckMark = styled.span`
  position: absolute;
  top: 0;
  left: 1px;
  height: 25px;
  width: 25px;
  border: 1px solid #b9b9b9;
  border-radius: 5px;

  box-shadow: ${(props: CheckMarkProps) => props.checked && "none"} !important;

  &&:after {
    content: "";
    position: absolute;
    display: none;
  }

  &&::after {
    left: 9px;
    top: 5px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
`;

export const StyledInput = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;

  &&:checked ~ ${CheckMark} {
    background-color: #ffaa2b;
    border: 1px solid #ffaa2b;
  }

  &&:checked ~ ${CheckMark}:after {
    display: block;
  }
`;

export const CheckBoxLabelWrapper = styled.div`
  padding-top: 3px;
`;

export const CheckBoxLabel = styled.p`
  display: inline-block;
  font-size: 14px;
  margin: 0;
  padding-left: 35px;
  padding-right: 0px;
`;

export const ComputerLabel = styled.span`
  display: inline-block;
  margin: 0;
  font-size: 14px;
  @media only screen and (max-width: 350px) {
    display: none;
  }
`;

export const MobileLabel = styled.span`
  display: none;
  margin: 0;
  font-size: 12px;
  @media only screen and (max-width: 350px) {
    display: inline-block;
  }
`;

export const OrangeLink = styled.a`
  color: ${orange20};
  pointer-events: all;

  &&:visited {
    color: ${orange20};
  }

  &&:hover {
    opacity: 0.5;
  }

  @media only screen and (max-width: 350px) {
    display: inline-block;
    font-size: 12px;
  }
`;

interface CheckMarkProps {
  checked: boolean;
}
