import React, { useMemo, useState, useEffect } from "react";
import { Eye } from "react-feather";
import katex from "katex";

export const MathRenderer = (props) => {
  const [showPreview, setShowPreview] = useState(false);

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

    return () => document.head.removeChild(link);
  }, []);

  if (!props || !props.children) {
    return null;
  }

  /* Get the text content of the children */
  const text = props.children.props.text.text;

  const html = useMemo(() => {
    try {
      return katex.renderToString(text, { throwOnError: false });
    } catch (e) {
      return `<span class="katex-error">${e.message}</span>`;
    }
  }, [text]);

  return (
    <span style={{ display: "inline-block", position: "relative", fontFamily: "monospace" }}>
      {props.children}
      <Eye
        size={14}
        onMouseEnter={() => setShowPreview(true)}
        onMouseLeave={() => setShowPreview(false)}
        style={{ margin: "0 0.25rem", verticalAlign: "baseline" }}
      />
      {/* A rendered preview */}
      <span
        style={{
          display: showPreview ? "block" : "none",
          padding: "0.25rem 0.5rem",
          border: "1px solid #ccc",
          position: "absolute",
          top: "0",
          right: "0",
          backgroundColor: "#fff",
          zIndex: "1000",
          transform: "translateX(calc(100% + 1rem))",
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </span>
  );
};
