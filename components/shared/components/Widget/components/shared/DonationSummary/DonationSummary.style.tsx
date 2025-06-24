import styled from "styled-components";

export const DonationSummaryWrapper = styled.div`
  width: 100%;
  margin-top: 20px;
  margin-bottom: 40px;
  border: 1px solid var(--primary);
  border-radius: 10px;
`;

export const DonationSummaryHeader = styled.div`
  padding: 20px;
  background-color: var(--primary);
  color: var(--secondary);
  font-weight: bold;
  border-radius: 10px 10px 0 0;
`;

export const SummmaryOrganizationsList = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;

  tr {
    td:first-child {
      padding-left: 20px;
    }

    td:last-child {
      text-align: right;
      padding-right: 20px;
    }

    &:first-child {
      td {
        border-top: 1px solid var(--primary);
        padding-top: 20px;
      }
    }

    &:last-child {
      td {
        padding-bottom: 10px;
      }
    }
  }
`;

export const TotalTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  border-top: 1px solid var(--primary);

  tr td {
    padding-top: 10px;
    padding-bottom: 10px;

    &:first-child {
      font-weight: bold;
      padding-left: 20px;
    }
    &:last-child {
      text-align: right;
      padding-right: 20px;
    }
  }
`;

export const PaymentButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-top: 40px;
  gap: 20px;
`;

export const PaymentButton = styled.button`
  font-size: 20px;
  padding: 18px 20px;
  border: 1px solid var(--primary);
  border-radius: 10px;
  flex: 1;
  cursor: pointer;
  background-color: var(--primary);
  color: var(--secondary);
  position: relative;

  &:hover {
    background-color: var(--secondary);
    color: var(--primary);
  }

  & > div {
    filter: invert(1);
  }
`;
