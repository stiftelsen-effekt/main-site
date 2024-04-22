import React, { useState, useEffect } from "react";
import { TextInput, Card, Stack } from "@sanity/ui";
import katex from "katex";

const createPatchFrom = (value) => PatchEvent.from(value === "" ? unset() : set(value));

const KatexInput = React.forwardRef((props, ref) => {
  const { type, value, onChange } = props;
  const [input, setInput] = useState(value.latex || "");

  const handleChange = (event) => {
    const newValue = event.target.value;
    setInput(newValue);

    let renderedHtml = "";
    try {
      renderedHtml = katex.renderToString(newValue, { throwOnError: false });
    } catch (e) {
      // Handle errors or simply use a placeholder/error message in renderedHtml
      renderedHtml = `<span class="katex-error">Invalid LaTeX expression</span>`;
    }

    onChange(
      createPatchFrom({
        _type: type.name,
        _key: value._key,
        latex: newValue,
        renderedHtml: renderedHtml,
      }),
    );
  };

  const renderKatex = () => {
    try {
      return { __html: katex.renderToString(input, { throwOnError: false }) };
    } catch (e) {
      return { __html: `<span class="katex-error">${e.message}</span>` };
    }
  };

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css";
    link.type = "text/css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => document.head.removeChild(link);
  }, []);

  return (
    <Stack space={3}>
      <TextInput value={input} onChange={handleChange} placeholder="Enter LaTeX code" ref={ref} />
      <Card tone="transparent" padding={4} shadow={1}>
        <div dangerouslySetInnerHTML={renderKatex()} />
      </Card>
    </Stack>
  );
});

export default KatexInput;
