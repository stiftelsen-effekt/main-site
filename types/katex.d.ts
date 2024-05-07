declare module "katex" {
  /**
   * Renders a string of LaTeX into a string of HTML.
   * This function is a wrapper around KaTeX's renderToString method.
   * @param text The LaTeX text to be rendered.
   * @param options Configuration options for rendering.
   * @returns The rendered HTML string.
   */
  export function renderToString(
    text: string,
    options?: {
      throwOnError?: boolean;
    },
  ): string;
}
