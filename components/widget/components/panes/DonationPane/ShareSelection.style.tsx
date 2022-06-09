import styled from "styled-components";

export const ShareContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 40px;
  row-gap: 15px;
  margin-top: 50px;
  align-items: flex-end;
`;

export const ShareInputContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr max-content;
  min-width: 0;
  align-items: flex-end;

  label {
    white-space: normal;
    font-size: 18px;
  }

  input {
    width: 63px;
    font-size: 18px;
    background: none;
    border: none;
    border-bottom: 1px solid var(--primary);
    color: var(--primary);
    margin-left: 10px;
  }
`;
