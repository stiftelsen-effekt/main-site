import styled from "styled-components";
import { gray14, gray18, gray20, orange15, orange20 } from "../../../config/colors";

export const Wrapper = styled.div`
  border-bottom: 1px solid ${gray14};

  h2 {
    font-weight: 600;
    font-size: 14px;
    margin: 0;
    margin-bottom: 4px;
    white-space: normal;
  }

  h3 {
    font-size: 11px;
    color: ${gray20};
    font-weight: 300;
    margin: 0;
    white-space: normal;
  }
`;

export const HeaderWrapper = styled.div`
  width: 90%;
  padding-top: 4px;
  margin-left: 10px;
`;

export const RadioBall = styled.div`
  display: block;
  width: 24px;
  height: 24px;
  background: var(--secondary);
  color: var(--primary);
  border-radius: 50%;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border-radius: 50%;
    transition: all 100ms;
    border: ${(props: RadioBallProps) =>
      props.selected ? `7px solid ${orange20}` : `1px solid ${gray18}`} !important;
    box-shadow: ${(props: RadioBallProps) => props.selected && "none"} !important;
  }
`;

export const LabelWrapper = styled.div`
  display: flex;
  flex-direction: row;
  cursor: pointer;
  padding: 16px 0;
  user-select: none;

  &:focus {
    outline: none;
  }

  &:focus > ${RadioBall} {
    &::after {
      box-shadow: 0px 0px 0px 1.5px ${orange15};
    }
  }
`;

interface RadioBallProps {
  selected: boolean | undefined;
}

export const Content = styled.div`
  height: ${(props: ContentProps) => (props.selected ? "auto" : "0px")};
  overflow: ${(props: ContentProps) => (props.selected ? "visible" : "hidden")};
  display: ${(props: ContentProps) => (props.selected ? "block" : "none")};
  box-sizing: border-box;
`;

interface ContentProps {
  selected: boolean;
}
