import styled from "styled-components";

export const ReferralButtonsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;

  button {
    margin-bottom: 15px;
    margin-right: 5px;
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
