import styles from "./ErrorMessage.module.scss";

export const ErrorMessage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};
