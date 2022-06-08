import styled from "styled-components";

export const SumWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;

  label {
    font-size: 14px;
    margin-bottom: 6px;
  }

  span {
    position: relative;
    display: inline-flex;
    max-width: 180px;

    input {
      background: var(--secondary);
      padding: 8px 20px;
      border-radius: 10px;
      border: 1px solid var(--primary);
      color: var(--primary);
      font-size: 16px;
      max-width: 180px;
    }

    &:after {
      content: "kr";
      color: var(--primary);
      position: absolute;
      right: 10px;
      top: 0px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
  }
`;

export const SumButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
  align-items: flex-start;

  div {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    button {
      margin: 0;
      border-radius: 10px;
    }

    i {
      margin-top: 2px;
      font-size: 11px;
    }
  }
`;

export const ActionBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
