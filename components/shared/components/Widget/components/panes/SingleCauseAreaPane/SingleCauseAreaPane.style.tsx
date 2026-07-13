import styled from "styled-components";

/**
 * Styles ported verbatim from the pre-rewrite ("main") DonationPane /
 * ShareSelection so the single-cause-area widget matches the old Norway look.
 * The only change is that the per-organization input renders a "kr" suffix
 * instead of "%" (and is a little wider) because distribution is now entered
 * as direct kroner amounts.
 */

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

export const SharesSelectorContainer = styled.div`
  padding-top: 20px;
`;

export const ShareSelectionWrapper = styled.div`
  display: grid;
  grid-template-colums: 1fr;
  grid-gap: 20px;
  margin-bottom: 40px;
`;

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
    width: 120px;
    height: 36px;
    font-size: 22px;
    background: none;
    border: none;
    border-bottom: 1px solid var(--primary);
    color: var(--primary);
    margin-left: 8px;
    text-align: right;
    padding-right: 32px;
    transition: border-color 0.2s ease-in-out;
  }

  &::after {
    content: "kr";
    position: absolute;
    right: 0;
    font-size: 22px;
    line-height: 36px;
    pointer-events: none;
  }
`;
