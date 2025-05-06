import styled from "styled-components";

export const InputList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const OrganizationInputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  width: 100%;
  font-size: 16px;

  span {
    position: relative;
    display: inline-flex;
    width: 40%;
    flex-shrink: 0;

    input {
      background: var(--secondary);
      padding: 12px 0;
      padding-right: 45px;
      border-radius: 10px;
      border: 1px solid var(--primary);
      color: var(--primary);
      font-size: 24px;
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
      font-size: 24px;
    }
  }
`;

export const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;

  & > div {
    border: 1px solid var(--primary);
    border-bottom: none;
    padding: 20px;

    &:first-child {
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }

    &:last-child {
      border-bottom: 1px solid var(--primary);
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
    }
  }
`;

export const TotalAmountWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 10px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 20px;
  border: 1px solid var(--primary);
  border-radius: 10px;
  font-weight: 700;
  font-size: 20px;
`;

export const TotalSumWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

export const CauseAreaTitle = styled.div`
  font-size: 24px;
  margin: 0;
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;

  & > div {
    width: 30px;
    height: 30px;
  }
`;

export const CauseAreaContext = styled.div`
  font-size: 14px;
  line-height: 20px;
  margin-top: 5px;
  margin-bottom: 0px;
  margin-left: 40px;
`;

export const CauseAreasWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
  justify-content: flex-start;
  flex-direction: column;
`;

export const RecurringSelectionWrapper = styled.div`
  padding-top: 30px;
  padding-bottom: 30px;
`;

export const SumWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;

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

export const ErrorContainer = styled.div`
  margin-bottom: 10px;
  font-size: 18px;
`;
