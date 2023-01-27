import styled from "styled-components";
import { EffektButton } from "../../../shared/components/EffektButton/EffektButton";
import { Spinner } from "../../../shared/components/Spinner/Spinner";

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
  margin-bottom: 24px;

  label {
    margin-bottom: 4px;
  }
`;

export const TaxInput = styled.input`
  background: none;
  border: 1px solid var(--primary);
  color: var(--primary);
  padding: 0.5em 1.2em;
  border-radius: 45px;
  font-size: 1em;
`;

export const TextField = styled.input`
  padding: 20px;
  display: block;
  margin: 5px;
  font-size: 15px;
  border: 1px solid black;
  border-radius: 5px;
  box-sizing: border-box;
`;

export const CheckBoxWrapper = styled.div`
  display: flex;
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
    box-shadow: 0px 0px 0px 1.5px black;
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

export const InfoText = styled.p`
  white-space: normal;
  font-size: normal;
  line-height: 150%;
  color: var(--primary);
  margin: 0;
  margin-bottom: 20px;
`;

export const LoadingButtonSpinner = styled(Spinner)`
  transform: scale(0.3);
  height: 20px;
  width: 20px;
  position: relative;
  top: -10px;
  left: -10px;
  transform-origin: center center;
  mix-blend-mode: difference;
`;

export const SubmitButton = styled(EffektButton)`
  min-width: 160px;
  max-width: 160px;
  min-height: 37.5px
  align-self: flex-end;
`;
