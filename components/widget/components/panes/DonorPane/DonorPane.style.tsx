import styled from "styled-components";

export const DonorForm = styled.form`
  margin: 0 auto;
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  font-size: 18px;

  input[type="text"],
  input[type="email"] {
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
