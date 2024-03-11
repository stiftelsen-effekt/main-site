import React, { useEffect } from "react";
import { Box } from "@sanity/ui";

export const KatexPreview = (props) => {
  const { value } = props;

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css";
    link.type = "text/css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => document.head.removeChild(link);
  }, []);

  if (!value.renderedHtml) return <span>Invalid LaTeX expression</span>;
  return <Box padding={1} dangerouslySetInnerHTML={{ __html: value.renderedHtml }} />;
};
