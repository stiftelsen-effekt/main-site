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
`;

export const TextField = styled.input`
  padding: 20px;
  display: block;
  margin: 5px;
  font-size: 15px;
  border: 1px solid ${gray18};
  border-radius: 5px;
  box-sizing: border-box;
`;

export const CheckBoxWrapper = styled.div`
  display: block;
  height: 40px;
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
  &:focus + span > span {
    box-shadow: 0px 0px 0px 1.5px ${orange15};
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
  font-size: 15px;
  margin-left: 5px;
  display: inline-block;
  pointer-events: none;
`;
