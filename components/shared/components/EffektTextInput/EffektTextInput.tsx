import styles from "./EffektTextInput.module.scss";

export const EffektTextInput: React.FC<{
  value: string | undefined;
  onChange: (val: string) => void;
}> = ({ value, onChange }) => {
  return (
    <input
      className={styles.textInput}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    ></input>
  );
};
