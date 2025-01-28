import styles from "./EffektTextInput.module.scss";

export const EffektTextInput: React.FC<{
  value: string | undefined;
  onChange: (val: string) => void;
  name?: string;
  type?: string;
  placeholder?: string;
  denomination?: string;
}> = ({ value, onChange, name, type, placeholder, denomination }) => {
  return (
    <div className={styles.textInputWrapper}>
      <input
        className={styles.textInput}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        name={name}
        type={type}
      ></input>
      {denomination && <span className={styles.denomination}>{denomination}</span>}
    </div>
  );
};
