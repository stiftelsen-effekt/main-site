import styled from "styled-components";

export const ShareSelectionWrapper = styled.div`
  display: grid;
  grid-template-colums: 1fr;
  grid-gap: 20px;
  margin-bottom: 40px;

  &[data-error] input {
    /* border-color: #db0000; */
  }
`;

export const ShareContainer = styled.div`
  display: grid;
  grid-auto-rows: 1fr;
  row-gap: 15px;
  align-items: flex-end;
`;

export const PrefilledSharesWrapper = styled.div`
  display: grid;
  grid-auto-rows: max-content;
  row-gap: 10px;
`;

export const ShareLink = styled.a`
  border: none !important;

  &:hover > label {
    cursor: pointer;
    text-decoration: underline;
  }
`;

export const ShowAllOrganizations = styled.span<{ open?: boolean }>`
  cursor: pointer;
  user-select: none;
  font-size: 16px;

  &::after {
    content: "↓";
    display: inline-block;
    transition: transform 0.2s ease-in-out;
    margin-left: 10px;
    transform: ${({ open }) => (open ? "rotate(180deg)" : "rotate(0)")};
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
    transition: border-color 0.2s ease-in-out;
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

export const ErrorContainer = styled.div`
  margin-bottom: 10px;
  font-size: 18px;
`;
