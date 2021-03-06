import React from "react";
import elements from "./Paragraph.module.scss";
import { PortableText } from "../../../../lib/sanity";

export type ParagraphProps = {
  title: string;
  blocks: any[];
};

export const Paragraph: React.FC<ParagraphProps> = ({ title, blocks }) => {
  return (
    <div className={elements.paragraphwrapper}>
      <p className="inngress">{title}</p>
      <PortableText blocks={blocks || []}></PortableText>
    </div>
  );
};
