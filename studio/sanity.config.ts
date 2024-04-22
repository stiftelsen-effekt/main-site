import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemas } from "./schemas/schema";
import { deskStructure } from "./deskStructure";
import { table } from "@sanity/table";

export default defineConfig({
  title: "Gi Effektivt Website",
  projectId: "vf0df6h3",
  dataset: "production",
  plugins: [
    structureTool({
      structure: deskStructure,
    }),
    visionTool(),
    table(),
  ],
  schema: {
    types: schemas,
  },
});
