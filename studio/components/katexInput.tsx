import React, { useState, useEffect } from "react";
import { TextInput, Card, Stack } from "@sanity/ui";
import katex from "katex";
import { ObjectInputProps, set, unset } from "sanity";

const KatexInput = (props: ObjectInputProps) => {
  const { value, onChange, readOnly } = props;
  const [input, setInput] = useState(value?.latex || "");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInput(newValue);

    let renderedHtml = "";
    try {
      renderedHtml = katex.renderToString(newValue, { throwOnError: false });
    } catch (e) {
      renderedHtml = `<span class="katex-error">Invalid LaTeX expression</span>`;
    }

    onChange(
      set({
        _key: value?._key,
        _type: value?._type,
        latex: newValue,
        renderedHtml: renderedHtml,
      }),
    );
  };

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css";
    link.type = "text/css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  return (
    <Stack space={3}>
      <TextInput
        value={input}
        onChange={handleChange}
        placeholder="Enter LaTeX code"
        readOnly={readOnly}
      />
      <Card tone="transparent" padding={4} shadow={1}>
        <div
          dangerouslySetInnerHTML={{ __html: katex.renderToString(input, { throwOnError: false }) }}
        />
      </Card>
    </Stack>
  );
};

export default KatexInput;
