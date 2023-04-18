// https://www.sanity.io/guides/edit-document

/**
 * Convenient way to edit a document in your $EDITOR.
 * Usage: `node scripts/editDocument.js <documentId>`
 */
const { spawn } = require("child_process");

const [documentId, dataset] = process.argv.slice(2);

if (!documentId) {
  throw new Error("No document id was provided.");
}

const isValidDataset = ["production", "production-se", "dev", "dev-se"].includes(dataset);
const isExplicitDataset = typeof dataset === "string";

if (isExplicitDataset && !isValidDataset) {
  throw new Error(`Invalid dataset: ${dataset}`);
}

console.log(
  `Editing document ${documentId} in dataset ${
    isExplicitDataset ? dataset : process.env.SANITY_STUDIO_API_DATASET
  }.`,
);

spawn(
  "sanity",
  [
    "documents",
    "create",
    "--id",
    documentId,
    ...(isExplicitDataset ? ["--dataset", dataset] : []),
    "--replace",
  ],
  {
    cwd: process.cwd(),
    stdio: "inherit",
    shell: true,
  },
);
