import AnimateHeight from "react-animate-height";
import { useState } from "react";
import styles from "./Accordion.module.scss";
import { SectionBlockContentRenderer } from "../BlockContentRenderer";

export const Accordion: React.FC<{ title: string; blocks: any[] }> = ({ title, blocks }) => {
  const [open, setOpen] = useState(false);

  const toggleAccordion = () => {
    setOpen(!open);
  };

  return (
    <div className={styles.accordion}>
      <div className={styles.header} onClick={toggleAccordion}>
        <h2>{title}</h2>
        <span style={{ transform: `rotate(${open ? "180deg" : "0deg"})` }}>↓</span>
      </div>
      <AnimateHeight duration={500} height={open ? "auto" : 0} animateOpacity={true}>
        <div className={styles.content}>
          <SectionBlockContentRenderer blocks={blocks} />
        </div>
      </AnimateHeight>
      <div className={styles.bottomBorder}></div>
    </div>
  );
};
