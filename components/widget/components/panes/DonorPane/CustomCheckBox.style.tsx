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
  width: 18px;
  height: 18px;
  border: 1px solid var(--primary);
`;

export const CheckMark = styled.span`
  font-size: 12px;
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
  font-size: 14px;
  margin: 0;
  margin-left: 10px;

  a:link {
    text-decoration: underline;
  }
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
