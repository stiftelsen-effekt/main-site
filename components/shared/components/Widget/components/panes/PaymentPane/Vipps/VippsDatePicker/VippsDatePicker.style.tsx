import styled from "styled-components";
import { orange10, orange20 } from "../../../../../config/colors";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const DateBoxWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const Datebox = styled.button`
  width: 28px;
  height: 28px;
  padding: 0;
  margin: 4px;
  font-family: "Roboto", Arial, sans-serif;
  border: none;
  box-shadow: 0px 3px 6px 0 rgba(0, 0, 0, 0.15);
  box-shadow: 0px 0px 0px 1.5px ${orange20};
  background-color: var(--secondary);
  cursor: pointer;

  @media only screen and (max-width: 355px) {
    width: 22px;
    height: 22px;
  }

  &:hover {
    background-color: ${orange10};
  }

  &:active {
    background-color: ${orange20} !important;
  }
`;

export const DateText = styled.p`
  display: inline-block;
  vertical-align: middle;
  padding-bottom: 12px;
  font-size: 20px;
  white-space: pre-wrap;
  max-width: 60%;
`;

export const DateTextWrapper = styled.div`
  padding-left: 3px;
  padding-bottom: 4px;
`;
