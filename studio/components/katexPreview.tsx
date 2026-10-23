import React, { useMemo } from "react";
import { Box } from "@sanity/ui";
import { PreviewProps } from "sanity";
import { Latex } from "../sanity.types";
import katex from "katex";
import "katex/dist/katex.min.css";

export const KatexPreview = (props: PreviewProps & Partial<Latex>) => {
  const { latex } = props;

  // Render from the source, since stored renderedHtml from older KaTeX versions
  // uses class names that the current CSS no longer styles
  const html = useMemo(() => {
    if (!latex) return null;
    try {
      return katex.renderToString(latex, { throwOnError: false });
    } catch (e) {
      return null;
    }
  }, [latex]);

  if (!html) return <span>Invalid LaTeX expression</span>;
  return <Box padding={1} dangerouslySetInnerHTML={{ __html: html }} />;
};
