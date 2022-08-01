import styled from "styled-components";
import { gray18, orange15 } from "../../config/colors";

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const InputFieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

export const TextField = styled.input`
  padding: 20px;
  display: block;
  margin: 5px;
  border: 1px solid ${gray18};
  border-radius: 5px;
  box-sizing: border-box;
`;

export const CheckBoxWrapper = styled.div`
  display: inline-flex;
  vertical-align: middle;
  margin-bottom: 12px;
  position: relative;
`;

export const HiddenCheckBox = styled.input`
  position: absolute;
  margin: 5px;
  margin-left: 0;
  width: 100%;
  height: 30px;
  opacity: 0;
  &:hover {
    cursor: pointer;
  }
  &:focus + span > div > span {
    outline: 2px solid var(--primary);
  }
  &:active + span > div > span {
    outline: none;
  }
`;

export const RadioWrapper = styled.div``;

export const RadioButton = styled.input`
  margin-left: 10px;
  &:hover {
    cursor: pointer;
  }
`;

export const InputLabel = styled.p`
  position: absolute;
  align-self: start;
  margin-left: 5px;
  display: inline-block;
  pointer-events: none;
`;
