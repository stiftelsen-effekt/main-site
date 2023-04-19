// https://www.sanity.io/guides/edit-document

/**
 * Convenient way to edit a document in your $EDITOR.
 * Usage: `node scripts/editDocument.js <documentId>`
 */
const { spawn } = require("child_process");

const [dataset] = process.argv.slice(2);

const isValidDataset = ["production", "production-se", "dev", "dev-se"].includes(dataset);
const isExplicitDataset = typeof dataset === "string";

if (isExplicitDataset && !isValidDataset) {
  throw new Error(`Invalid dataset: ${dataset}`);
}

console.log(
  `Listing documents in dataset ${
    isExplicitDataset ? dataset : process.env.SANITY_STUDIO_API_DATASET
  }.`,
);

const childProcess = spawn(
  "sanity",
  [
    "documents",
    "query",
    `'*[_type == "generic_page"] {
      _id,
      slug { current }
    }'`,
    ...(isExplicitDataset ? ["--dataset", dataset] : []),
  ],
  {
    shell: true,
  },
);

childProcess.stdout.on("data", (data) => {
  const json = JSON.parse(data);
  json.forEach((doc) => {
    console.log(`${doc._id} - ${doc.slug.current}`);
  });
});
