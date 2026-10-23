import React, { useMemo, useState } from "react";
import { Eye } from "react-feather";
import katex from "katex";
import { BlockDecoratorProps } from "sanity";
import "katex/dist/katex.min.css";

export const MathRenderer = (props: BlockDecoratorProps) => {
  const [showPreview, setShowPreview] = useState(false);

  if (!props || !props.children) {
    return null;
  }

  /* Get the text content of the children */
  const text = props.children.props.text.text;

  const html = useMemo(() => {
    try {
      return katex.renderToString(text, { throwOnError: false });
    } catch (e) {
      return `<span class="katex-error">${(e as Error).message}</span>`;
    }
  }, [text]);

  return (
    <span style={{ display: "inline-block", position: "relative", fontFamily: "monospace" }}>
      {props.children}
      <Eye
        size={14}
        onMouseEnter={() => setShowPreview(true)}
        onMouseLeave={() => setShowPreview(false)}
        style={{
          padding: "0.25rem",
          margin: "0 0.1rem",
          verticalAlign: "text-bottom",
          cursor: "context-menu",
        }}
      />
      {/* A rendered preview */}
      <span
        style={{
          display: showPreview ? "block" : "none",
          padding: "0.25rem 0.5rem",
          border: "1px solid #ccc",
          position: "absolute",
          top: "-100%",
          right: "0",
          backgroundColor: "#fff",
          zIndex: "1000",
          transform: "translateX(calc(100% + 0.25rem)) translateY(50%)",
          whiteSpace: "nowrap",
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </span>
  );
};
