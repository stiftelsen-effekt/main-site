import { describe, expect, it } from "@jest/globals";
import katex from "katex";
import { renderLatexInData } from "./renderLatex";

describe("renderLatexInData", () => {
  it("renders nested latex blocks from their source instead of the stored HTML", () => {
    const data = {
      page: {
        blocks: [
          {
            _type: "paragraph",
            content: [{ _type: "latex", latex: "\\frac{a}{b}", renderedHtml: "old" }],
          },
        ],
      },
    };
    const latex = renderLatexInData(data).page.blocks[0].content[0] as any;

    expect(latex.html).toBe(katex.renderToString("\\frac{a}{b}", { throwOnError: false }));
    expect(latex.html).toContain("katex-base");
    expect(latex.latex).toBe("\\frac{a}{b}");
    expect(data.page.blocks[0].content[0]).not.toHaveProperty("html");
  });

  it("replaces math spans with rendered inline objects and leaves other spans alone", () => {
    const block = {
      _type: "block",
      children: [
        { _type: "span", _key: "a", marks: [], text: "Let " },
        { _type: "span", _key: "b", marks: ["math"], text: "x^2" },
      ],
    };
    const [text, math] = (renderLatexInData([block])[0] as any).children;

    expect(text).toEqual(block.children[0]);
    expect(math).toEqual({
      _type: "renderedMath",
      _key: "b",
      html: katex.renderToString("x^2", { throwOnError: false }),
    });
  });

  it("shows invalid LaTeX as a KaTeX error instead of throwing", () => {
    const latex = renderLatexInData({ _type: "latex", latex: "\\frac{" }) as any;
    expect(latex.html).toContain("katex-error");
  });
});
