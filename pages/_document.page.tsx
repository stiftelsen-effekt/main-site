import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  // You can set this via NEXT_PUBLIC_LANG in your deployment environment
  const lang = process.env.NEXT_PUBLIC_LANG || "no";

  return (
    <Html lang={lang}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
