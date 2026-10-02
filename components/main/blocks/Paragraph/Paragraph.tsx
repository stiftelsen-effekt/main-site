import React, { useEffect } from "react";
import elements from "./Paragraph.module.scss";
import { PortableText } from "@portabletext/react";
import { customComponentRenderers, observeCitationLayout, reflowCitations } from "./Citation";

export type ParagraphProps = {
  tocKey: string;
  title: string;
  blocks: any[];
};

export const Paragraph: React.FC<ParagraphProps> = ({ title, tocKey, blocks }) => {
  useEffect(observeCitationLayout, []);
  useEffect(() => {
    reflowCitations();
  }, [blocks]);

  return (
    <div className={elements.paragraphwrapper}>
      <p className="inngress" data-toc-key={tocKey}>
        {title}
      </p>
      <PortableText value={blocks || []} components={customComponentRenderers}></PortableText>
    </div>
  );
};
