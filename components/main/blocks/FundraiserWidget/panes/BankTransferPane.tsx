import React from "react";
import styles from "../FundraiserWidget.module.scss";

interface BankTransferPaneProps {
  kid: string | null;
  showBankInfo: boolean;
  bankDetails:
    | {
        account_number_prefix: string;
        account_number: string;
        kid_prefix: string;
        transfer_delay_text: string;
        account_owner_text: string;
        bank_transfer_info: string;
      }
    | undefined;
  className?: string;
  visible?: boolean;
}

export const BankTransferPane = React.forwardRef<HTMLDivElement, BankTransferPaneProps>(
  ({ kid, showBankInfo, bankDetails, className, visible }, ref) => {
    // Parse templated text by replacing tokens with values
    const parseTemplate = (template: string): string => {
      return template.replace(/\{(\w+)\}/g, (match, key) => {
        if (key === "accountNumber" && bankDetails?.account_number) {
          return bankDetails.account_number;
        }
        return match;
      });
    };

    if (!showBankInfo || !bankDetails) {
      return (
        <div ref={ref} className={className} style={{ display: visible ? "block" : "none" }}></div>
      );
    }

    return (
      <div ref={ref} className={className} style={{ display: visible ? "block" : "none" }}>
        <div className={styles["donation-widget__form"]}>
          <p>{parseTemplate(bankDetails.bank_transfer_info)}</p>

          <div className={styles["donation-widget__account-info"]}>
            <p>
              <strong>{bankDetails.account_number_prefix}</strong> {bankDetails.account_number}
            </p>
            <p>
              <strong>{bankDetails.kid_prefix}</strong> {kid}
            </p>
          </div>

          <p>{parseTemplate(bankDetails.transfer_delay_text)}</p>
          <p style={{ paddingBottom: "2rem" }}>{parseTemplate(bankDetails.account_owner_text)}</p>
        </div>
      </div>
    );
  },
);

BankTransferPane.displayName = "BankTransferPane";
