import styled from "styled-components";

export const DonorForm = styled.form`
  padding-bottom: 16px;
  margin: 0 auto;

  input[type="text"] {
    background: var(--secondary);
    color: var(--primary);
    border: none;
    border-bottom: 1px solid var(--primary);
    font-size: 14px;
    padding: 10px 0px;
    max-width: 280px;
    margin-bottom: 20px;
  }
`;

export const ActionBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-top: 30px;
  padding-bottom: 40px;
`;
