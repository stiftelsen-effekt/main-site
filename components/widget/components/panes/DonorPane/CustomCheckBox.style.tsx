import styled from "styled-components";

export const CustomCheckBoxWrapper = styled.span`
  cursor: pointer;
  margin-top: 5px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  pointer-events: none;
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const CheckBoxWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 23px;
  height: 23px;
  border: 1px solid var(--primary);
`;

export const CheckMark = styled.span`
  font-size: 14px;
  color: var(--primary);
  display: none;

  font-weight: bold;
`;

export const StyledInput = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;

  &&:checked ~ ${CheckBoxWrapper} ${CheckMark} {
    display: block;
  }
`;

export const CheckBoxLabelWrapper = styled.div``;

export const CheckBoxLabel = styled.p`
  display: inline-block;
  font-size: 18px;
  margin: 0;
  margin-left: 10px;

  a:link {
    text-decoration: underline;
  }

  @media only screen and (max-width: 768px) {
    font-size: 22px;
    line-height: 30px;
  }
`;
