import katex from "katex";

/**
 * Renders KaTeX in fetched Sanity data at build time, so the rendered HTML always matches
 * the bundled KaTeX CSS and the katex package stays out of the client bundle.
 *
 * - `latex` blocks get an `html` field rendered from their `latex` source. The `renderedHtml`
 *   stored by the Studio is only used as a fallback if rendering throws.
 * - Spans with the `math` decorator are replaced by inline `renderedMath` objects.
 *
 * Only import this from getStaticProps, never from components.
 */
export const renderLatexInData = <T>(data: T): T => transform(data) as T;

const transform = (node: unknown): unknown => {
  if (Array.isArray(node)) return node.map(transform);
  if (node === null || typeof node !== "object") return node;

  const obj = node as Record<string, unknown>;
  if (obj._type === "latex" && typeof obj.latex === "string") {
    return { ...obj, html: renderOrFallback(obj.latex, obj.renderedHtml) };
  }
  if (obj._type === "block" && Array.isArray(obj.children)) {
    return { ...obj, children: obj.children.map(transformSpan) };
  }

  const result: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) result[key] = transform(obj[key]);
  return result;
};

const transformSpan = (child: unknown): unknown => {
  const span = child as { _type?: string; _key?: string; marks?: unknown; text?: unknown };
  if (
    span?._type !== "span" ||
    typeof span.text !== "string" ||
    !Array.isArray(span.marks) ||
    !span.marks.includes("math")
  ) {
    return transform(child);
  }
  return {
    _type: "renderedMath",
    _key: span._key,
    html: renderOrFallback(span.text, escapeHtml(span.text)),
  };
};

// Inline mode, like the Studio, so existing formulas keep their layout
const renderOrFallback = (latex: string, fallback: unknown) => {
  try {
    return katex.renderToString(latex, { throwOnError: false });
  } catch (e) {
    console.error("Failed to render LaTeX", latex, e);
    return typeof fallback === "string" ? fallback : "";
  }
};

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
