import styled from "styled-components";

export const ShareContainer = styled.div`
  display: grid;
  grid-auto-rows: 1fr;
  row-gap: 15px;
  align-items: flex-end;
`;

export const ShareLink = styled.a`
  border: none !important;

  &:hover > label {
    cursor: pointer;
    text-decoration: underline;
  }
`;

export const ShareInputContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr max-content;
  min-width: 0;
  align-items: flex-end;
  position: relative;

  label {
    white-space: normal;
    font-size: 18px;
  }

  input {
    width: 60px;
    height: 36px;
    font-size: 22px;
    background: none;
    border: none;
    border-bottom: 1px solid var(--primary);
    color: var(--primary);
    margin-left: 8px;
    text-align: right;
    padding-right: 22px;
  }

  &::after {
    content: "%";
    position: absolute;
    right: 0;
    line-height: 1;
    font-size: 22px;
    line-height: 36px;
    pointer-events: none;
  }
`;
