import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import prettier from "eslint-config-prettier";

export default [
  { ignores: ["studio/", "public/studio/"] },
  ...nextCoreWebVitals,
  prettier,
  {
    rules: {
      "import/no-unresolved": [2, { ignore: ["^(all|part):"] }],
    },
    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
  },
];
