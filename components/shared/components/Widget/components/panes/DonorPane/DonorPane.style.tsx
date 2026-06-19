import styled from "styled-components";
import { InputFieldWrapper } from "../Forms.style";

export const DonorForm = styled.form`
  margin: 0 auto;
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  font-size: 18px;

  a:focus {
    outline: 2px solid var(--primary);
  }

  a:active {
    outline: none;
  }

  input[type="text"],
  input[type="email"],
  input[type="tel"] {
    background: var(--secondary);
    color: var(--primary);
    border: none;
    border-bottom: 1px solid var(--primary);
    font-size: 24px;
    padding: 10px 0px;
    width: 100%;
    outline: none;
    font-family: "ESKlarheitGrotesk";
    border-radius: 0px;
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 1000px var(--secondary) inset !important;
    -webkit-text-fill-color: var(--primary) !important;
    background-clip: content-box !important;
    border-bottom: 1px solid var(--primary);
  }

  @media only screen and (max-width: 768px) {
    font-size: 22px;
  }
`;

export const ActionBar = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  flex-grow: 1;
  justify-content: center;
  align-items: flex-end;
  padding-top: 30px;
  padding-bottom: 40px;
`;

export const CheckBoxGroupWrapper = styled.div`
  margin-top: 40px;
  margin-bottom: 40px;
  display: grid;
  grid-auto-rows: max-content;
`;

export const StyledSwishInputFieldWrapper = styled(InputFieldWrapper)`
  margin-top: 20px;
`;

export const InfoMessageWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 10px;
  margin-top: 16px;
`;

export const PaymentNudgeWrapper = styled.div`
  margin-top: 16px;
  width: 100%;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: -12px;
    left: var(--nudge-arrow-left, 24px);
    transform: translateX(-50%);
    width: 22px;
    height: 14px;
    background: white;
    clip-path: polygon(50% 0, 0 100%, 100% 100%);
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.16));
    z-index: 1;
  }
`;

export const PaymentNudgeContainer = styled.div`
  width: calc(100% + 80px);
  transform: translateX(-40px);
  padding: 0 20px;
`;

export const PaymentNudge = styled.div`
  display: grid;
  grid-template-columns: min-content 1fr;
  gap: 12px;
  align-items: start;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid var(--primary);
  background: white;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.1);
  color: var(--secondary);

  svg {
    margin-top: 2px;
    color: var(--secondary);
    opacity: 0.85;
  }

  p {
    margin: 4px 0 0 0;
    font-size: 16px;
    line-height: 1.5;
    color: inherit;
  }
`;
