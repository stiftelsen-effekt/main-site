import styled from "styled-components";
import { gray18, orange15 } from "../../../config/colors";

export interface TextInputProps extends TextInputWrapperProps {
  type: string;
  name?: string;
  inputMode?: "text" | "numeric";
  placeholder?: string;
  defaultValue?: string | number;
  selectOnClick?: boolean;
  innerRef?: React.Ref<HTMLInputElement>;
  clustered?: boolean;
  value?: string | undefined;
  tooltipText?: string;
  autoComplete?: "off";
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface TextInputWrapperProps {
  label?: string;
  denomination?: string;
  clustered?: boolean;
}

export const TextInputWrapper = styled.div`
  display: block;
  margin-bottom: 5px;
  font-size: 1.5rem;
  border: 1px solid ${gray18};
  border-radius: 5px;
  box-sizing: border-box;
  position: relative;
  height: 60px;
  z-index: 1;

  ${(props: TextInputWrapperProps) => {
    if (props.clustered) {
      return `
        border-radius: 0px;
        margin-bottom: 0px;
        border-bottom-style: none;

        &:first-child {
          border-top-right-radius: 5px;
          border-top-left-radius: 5px;
        }

        &:last-child {
          border-bottom-right-radius: 5px;
          border-bottom-left-radius: 5px;
          border-bottom-style: solid;
        }
      `;
    }
    return "";
  }}

  ${(props: TextInputWrapperProps) => {
    if (props.denomination) {
      return `
        &:after {
          content: "${props.denomination}";
          height: 100%;
          position: absolute;
          width: 14px;
          right: 12px;
          top: 0;
          color: var(--primary);
          display: flex;
          justify-content: left;
          align-items: center;
          font-weight: normal;
        }
      `;
    }
    return "";
  }}

  transition: box-shadow 180ms;
  &:focus-within {
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.3);
  }
`;

export const TextInputField = styled.input`
  z-index: 1;
  padding: 20px;
  ${(props: TextInputProps) => {
    if (props.denomination) {
      return `
        padding-right: 30px;
      `;
    }
    return "";
  }}
  text-align: ${(props: TextInputProps) => (props.label ? "right" : "left")};
  border: none;
  box-sizing: border-box;
  width: 100%;
  background: transparent;
  box-shadow: none;
  position: absolute;
  border-radius: 5px;
  left: 0px;

  transition: box-shadow 180ms;
  &:focus {
    outline: none;
    box-shadow: 0px 0px 0px 1.5px ${orange15};
  }
`;

export const ComputerInputLabel = styled.p`
  display: inline-block;
  padding: 5px;
  padding-left: 15px;
  font-weight: bold;

  @media only screen and (max-width: 385px) {
    font-size: 1.3rem;
    padding-top: 10px;
  }

  @media only screen and (max-width: 355px) {
    display: none;
  }
`;

export const MobileInputLabel = styled.p`
  display: inline-block;
  padding: 5px;
  padding-left: 15px;
  font-weight: bold;
  padding-top: 10px;
  font-size: 1.4rem;
  display: none;

  @media only screen and (max-width: 355px) {
    display: inline-block;
  }

  @media only screen and (max-width: 355px) {
    display: inline-block;
    font-size: 1.1rem;
    padding-top: 12px;
  }
`;
