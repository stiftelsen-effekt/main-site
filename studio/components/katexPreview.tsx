import React, { useEffect } from "react";
import { Box } from "@sanity/ui";
import { PreviewProps } from "sanity";
import { Latex } from "../sanity.types";

export const KatexPreview = (props: PreviewProps & Latex) => {
  const { renderedHtml } = props;

  useEffect(() => {
    /** Check if  css is already loaded */
    if (
      document.querySelector(
        "link[href='https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css']",
      )
    ) {
      return;
    }

    const link = document.createElement("link");
    link.href = "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css";
    link.type = "text/css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  if (!renderedHtml) return <span>Invalid LaTeX expression</span>;
  return <Box padding={1} dangerouslySetInnerHTML={{ __html: renderedHtml }} />;
};
