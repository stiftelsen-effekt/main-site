import styled from "styled-components";

export const ReferralButtonsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;

  button {
    margin-bottom: 15px;
    margin-right: 15px;
  }
`;

export const ReferralTextInput = styled.input`
  padding: 10px 10px 10px 10px;
  margin: 0;
  background-color: var(--primary);
  color: var(--secondary);
  border: 1px solid white;
  border-radius: 10px;
  width: 100%;

  &:hover {
    cursor: text;
  }
`;
