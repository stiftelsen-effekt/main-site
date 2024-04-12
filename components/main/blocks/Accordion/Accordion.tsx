import { PortableText } from "@portabletext/react";
import AnimateHeight from "react-animate-height";
import { customComponentRenderers } from "../Paragraph/Citation";
import { useState } from "react";
import styles from "./Accordion.module.scss";

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
      <AnimateHeight duration={500} height={open ? "auto" : 0}>
        <div className={styles.content}>
          <PortableText value={blocks || []} components={customComponentRenderers}></PortableText>
        </div>
      </AnimateHeight>
    </div>
  );
};
