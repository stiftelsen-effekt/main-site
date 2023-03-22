import { useState } from "react";
import AnimateHeight from "react-animate-height";
import { ChevronDown } from "react-feather";
import styles from "./EffektDropdown.module.scss";

export const EffektDropdown: React.FC<{
  placeholder: string;
  searchable?: boolean;
  options: string[];
  onChange: (value: string) => void;
  value: string;
}> = ({ placeholder, searchable, options, onChange, value }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(value);
  const [search, setSearch] = useState("");

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const select = (value: string) => {
    setSelected(value);
    setIsOpen(false);
    onChange(value);
  };

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.dropdown}>
        <div className={styles.dropdown__input} onClick={toggleOpen}>
          <span className={styles.dropdown__input__text}>{selected || placeholder}</span>
          <div className={styles.dropdown__input__icon}>
            <ChevronDown />
          </div>
        </div>
        {isOpen && (
          <div className={styles.dropdown__options}>
            {searchable && (
              <div className={styles.dropdown__options__search}>
                <input
                  type="text"
                  placeholder="Søk"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            )}
            <div className={styles.dropdown__options__list}>
              {filteredOptions.map((option) => (
                <div
                  key={option}
                  className={styles.dropdown__options__list__option}
                  onClick={() => select(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
