import styled from "styled-components";

export const SumWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  margin-top: 20px;

  label {
    font-size: 22px;
    margin-bottom: 10px;
  }

  &[data-error] span input {
    border-color: #db0000;
  }

  span {
    position: relative;
    display: inline-flex;
    margin-bottom: 24px;

    input {
      background: var(--secondary);
      padding: 12px 45px;
      border-radius: 10px;
      border: 1px solid var(--primary);
      color: var(--primary);
      font-size: 30px;
      width: 100%;
      transition: border-color 0.2s ease-in-out;
      text-align: right;
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
      font-size: 30px;
    }
  }
`;

export const SumButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 75px;
  align-items: flex-start;

  div {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    button {
      margin: 0;
      border-radius: 10px;
      font-size: 28px;

      &::before {
        font-size: 16px;
      }
    }

    i {
      margin-top: 2px;
      font-size: 14px;
    }
  }
`;

export const ActionBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-self: flex-end;
  padding-top: 30px;
  padding-bottom: 30px;
`;

export const InfoParagraph = styled.div`
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
