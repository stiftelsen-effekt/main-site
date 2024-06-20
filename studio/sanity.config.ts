import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemas } from "./schemas/schema";
import { deskStructure } from "./deskStructure";
import { table } from "@sanity/table";
import { defineDocuments, presentationTool } from "sanity/presentation";

export default defineConfig({
  title: process.env.SANITY_STUDIO_TITLE,
  projectId: process.env.SANITY_STUDIO_API_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_API_DATASET,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: deskStructure,
    }),
    visionTool(),
    table(),
    presentationTool({
      previewUrl: {
        origin: "http://localhost:3000",
        draftMode: {
          enable: "/api/draft",
        },
      },
      resolve: {
        mainDocuments: defineDocuments([
          {
            route: "/:slug",
            filter: `_type == "generic_page" && slug.current == $slug`,
          },
          {
            route: "/",
            filter: `_type == "generic_page" && slug.current == "/"`,
          },
        ]),
      },
    }),
  ],
  schema: {
    types: schemas,
  },
});
