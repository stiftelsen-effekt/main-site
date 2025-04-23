import styled from "styled-components";

export const SummmaryOrganizationsList = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  margin-bottom: 10px;

  tr {
    td:last-child {
      text-align: right;
    }

    &:first-child {
      td {
        border-top: 1px solid var(--primary);
        padding-bottom: 10px;
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
  margin-bottom: 20px;
  border-bottom: 1px solid var(--primary);
  border-top: 1px solid var(--primary);

  tr td {
    padding-top: 10px;
    padding-bottom: 10px;

    &:first-child {
      font-weight: bold;
    }
    &:last-child {
      text-align: right;
    }
  }
`;
