declare module "textures";

// Side-effect stylesheet imports (e.g. `import "../styles/globals.css"`).
// TypeScript 6 requires a declaration for side-effect imports of non-code
// modules; Next ships this from 16.2+, but declaring it explicitly keeps the
// build working regardless of the Next version.
declare module "*.css";
