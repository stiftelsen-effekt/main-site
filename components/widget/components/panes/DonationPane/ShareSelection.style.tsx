import styled from "styled-components";

export const ShareContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 20px;
  row-gap: 10px;
  margin-top: 20px;
`;

export const ShareInputContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr max-content;
  min-width: 0;
  align-items: center;

  label {
    white-space: normal;
    font-size: 11px;
  }

  input {
    width: 60px;
    background: none;
    border: none;
    border-bottom: 1px solid var(--primary);
    color: var(--primary);
  }
`;
