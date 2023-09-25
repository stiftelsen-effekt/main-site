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

  &[data-error] span input {
    border-color: red;
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
      transition: border-color 0.2s ease-in-out;
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

export const ActionBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-self: flex-end;
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
