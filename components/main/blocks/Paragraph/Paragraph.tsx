import React, { useEffect } from "react";
import elements from "./Paragraph.module.scss";
import { PortableText } from "@portabletext/react";
import { useDebouncedCallback } from "use-debounce";
import { customComponentRenderers, reflowCitations } from "./Citation";

export type ParagraphProps = {
  tocKey: string;
  title: string;
  blocks: any[];
};

export const Paragraph: React.FC<ParagraphProps> = ({ title, tocKey, blocks }) => {
  const debounceReflowCitations = useDebouncedCallback(
    () => {
      reflowCitations();
    },
    100,
    {
      maxWait: 1000,
    },
  );
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", debounceReflowCitations);
    }
    const resizeObserver = new ResizeObserver((entries) => {
      debounceReflowCitations();
    });
    resizeObserver.observe(document.body);
  }, []);
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
