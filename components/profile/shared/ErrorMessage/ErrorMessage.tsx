import styles from "./ErrorMessage.module.scss";
import { useFailureMessage } from "../../../shared/failureToast";

export const ErrorMessage: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const failureMessage = useFailureMessage();

  return <div className={styles.container}>{children ?? `${failureMessage}.`}</div>;
};
