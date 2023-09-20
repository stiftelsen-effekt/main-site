import styled from "styled-components";

export const SumWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  margin-top: 20px;

  label {
    font-size: 18px;
    margin-bottom: 6px;
  }

  span {
    position: relative;
    display: inline-flex;
    margin-bottom: 24px;

    input {
      background: var(--secondary);
      padding: 8px 20px;
      border-radius: 10px;
      border: 1px solid var(--primary);
      color: var(--primary);
      font-size: 28px;
      width: 100%;
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
      font-size: 28px;
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
      font-size: 28px;
    }

    i {
      margin-top: 2px;
      font-size: 14px;
    }
  }
`;

export const ErrorsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 10px;
  padding: 30px 40px;
  width: calc(100% + 80px);
  position: relative;
  left: -40px;
  background: var(--primary);
  color: red;
  font-size: 16px;

  button {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 10px;
    align-items: start;
    cursor: pointer;

    &:focus {
      outline: 1px solid red;
    }

    span {
      text-align: left;
    }
  }
`;

export const ActionBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-self: flex-end;
  justify-self: ;
  padding-top: 30px;
  padding-bottom: 30px;
`;

export const InfoParagraph = styled.p`
  margin-top: 30px;
  white-space: normal;
  font-size: 18px;
  line-height: 30px;

  @media only screen and (max-width: 768px) {
    font-size: 20px;
    line-height: 30px;
  }
`;

export const ShareSelectionSpacer = styled.div`
  margin-top: 40px;
`;
