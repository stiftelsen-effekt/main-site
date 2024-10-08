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
  padding: 10px 18px 10px 18px;
  margin: 0;
  font-size: 20px;
  background-color: var(--secondary);
  color: var(--primary);
  border: 1px solid var(--primary);
  border-radius: 10px;
  width: 100%;

  &:hover {
    cursor: text;
  }

  @media only screen and (max-width: 1520px) and (min-width: 1181px) {
    font-size: 14px;
  }

  @media only screen and (max-width: 1180px) {
    font-size: 14px;
  }
`;
