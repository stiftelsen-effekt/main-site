import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemas } from "./schemas/schema";
import { deskStructure } from "./deskStructure";
import { table } from "@sanity/table";
import { defineDocuments, presentationTool } from "sanity/presentation";
import { Article_page, Articles, Generic_page } from "./sanity.types";

export default defineConfig({
  title: process.env.SANITY_STUDIO_TITLE,
  projectId: process.env.SANITY_STUDIO_API_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_API_DATASET,
  document: {
    productionUrl: async (prev, context) => {
      const { dataset, document } = context;

      const client = context.getClient({
        apiVersion: "2024-07-25",
      });

      if (document._type === "generic_page") {
        if (!document.slug) {
          return;
        }

        const slug = (document as Generic_page).slug.current;

        const query = `*[_type == "generic_page" && slug.current == $slug]`;
        const params = { slug };

        const [result] = await client.fetch(query, params);

        if (result) {
          return `${
            process.env.SANITY_STUDIO_SITE_URL || "http://localhost:3333"
          }/studio/presentation?preview=/${slug}`;
        }
      } else if (document._type === "article_page") {
        const slug = (document as Article_page).slug.current;
        const query = `*[_type == "article_page" && slug.current == $slug]`;
        const params = { slug };

        const [result] = await client.fetch(query, params);

        // Get article subslug from the document with id articles
        const articlesOverviewPage = `*[_id == "articles"]`;

        const [articlesOverview] = await client.fetch(articlesOverviewPage);
        const articlesSlug = (articlesOverview as Articles).slug.current;

        if (result && articlesSlug) {
          return `${
            process.env.SANITY_STUDIO_SITE_URL || "http://localhost:3333"
          }/studio/presentation?preview=/${articlesSlug}/${slug}`;
        }
      }
    },
  },
  plugins: [
    structureTool({
      structure: deskStructure,
    }),
    visionTool(),
    table(),
    presentationTool({
      previewUrl: {
        origin: process.env.SANITY_STUDIO_SITE_URL || "http://localhost:3000",
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
