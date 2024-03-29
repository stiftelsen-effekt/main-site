import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import elements from "./Paragraph.module.scss";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { useDebouncedCallback } from "use-debounce";
import { useClickOutsideAlerter } from "../../../../hooks/useClickOutsideAlerter";
import { customComponentRenderers, reflowCitations } from "./Citation";

export type ParagraphProps = {
  title: string;
  blocks: any[];
};

export const Paragraph: React.FC<ParagraphProps> = ({ title, blocks }) => {
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
      <p className="inngress">{title}</p>
      <PortableText value={blocks || []} components={customComponentRenderers}></PortableText>
    </div>
  );
};
