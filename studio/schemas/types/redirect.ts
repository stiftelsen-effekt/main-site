import { CornerUpRight } from "react-feather";
import { defineField, defineType } from "sanity";
import { dashboardpages } from "../dashboard/_dashboardPages";
import { pages } from "../pages/_pages";

export const REDIRECT_HOSTS = [
  { title: "Norway (gieffektivt.no)", value: "gieffektivt.no" },
  { title: "Sweden (geeffektivt.se)", value: "geeffektivt.se" },
  { title: "Denmark (giveffektivt.dk)", value: "giveffektivt.dk" },
] as const;

export default defineType({
  name: "redirect",
  title: "Redirect",
  type: "document",
  icon: CornerUpRight,
  fields: [
    defineField({
      name: "source",
      title: "From path",
      type: "string",
      description:
        "Path to match, starting with /. Next.js patterns such as /articles/:slug* are supported.",
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value) return true;
          if (!value.startsWith("/")) return "Must start with /";
          return true;
        }),
    }),
    defineField({
      name: "page",
      title: "To page",
      type: "reference",
      description:
        "Preferred. Uses the same path rules as nav links, so the redirect stays valid if the page slug changes.",
      to: [
        ...pages.map((p) => ({ type: p.name })),
        ...dashboardpages.map((p) => ({ type: p.name })),
      ],
    }),
    defineField({
      name: "destination",
      title: "To path or URL",
      type: "string",
      description:
        "Use only when the target is not a CMS page, or is an external URL. Hidden when a page is selected.",
      hidden: ({ parent }) => Boolean(parent?.page),
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const page = (context.parent as { page?: unknown } | undefined)?.page;
          if (!page && !value) return "Pick a page or enter a path / URL";
          if (!value) return true;
          if (!value.startsWith("/") && !/^https?:\/\//.test(value)) {
            return "Must start with / or be an absolute http(s) URL";
          }
          const source = (context.document as { source?: string } | undefined)?.source;
          if (source && value === source) return "Destination cannot be the same as the source";
          return true;
        }),
    }),
    defineField({
      name: "query",
      title: "Query parameters",
      type: "string",
      description: "Optional. Kept if the page slug changes. Example: recurring=1",
    }),
    defineField({
      name: "hash",
      title: "Hash / fragment",
      type: "string",
      description: "Optional. Kept if the page slug changes. Example: organizations",
    }),
    defineField({
      name: "hosts",
      title: "Countries",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Leave empty to apply on every host for this deployment. Select one or more country domains to scope the redirect the same way next.config host rules do today.",
      options: {
        list: [...REDIRECT_HOSTS],
        layout: "list",
      },
    }),
    defineField({
      name: "permanent",
      title: "Permanent (301)",
      type: "boolean",
      description: "On for a 301 (cached by browsers and search engines). Off for a temporary 302.",
      initialValue: true,
    }),
    defineField({
      name: "enabled",
      title: "Enabled",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "note",
      title: "Note",
      type: "string",
      description: "Optional editor-only context. Not used by the site.",
    }),
  ],
  preview: {
    select: {
      source: "source",
      destination: "destination",
      pageTitle: "page.header.title",
      pageName: "page.title",
      pageSlug: "page.slug.current",
      query: "query",
      hash: "hash",
      hosts: "hosts",
      permanent: "permanent",
      enabled: "enabled",
    },
    prepare({
      source,
      destination,
      pageTitle,
      pageName,
      pageSlug,
      query,
      hash,
      hosts,
      permanent,
      enabled,
    }) {
      const countryLabels: Record<string, string> = {
        "gieffektivt.no": "NO",
        "geeffektivt.se": "SE",
        "giveffektivt.dk": "DK",
      };
      const scope = hosts?.length
        ? hosts.map((host: string) => countryLabels[host] ?? host).join(", ")
        : "all countries";
      const status = enabled === false ? "disabled · " : "";
      const kind = permanent === false ? "302" : "301";
      const targetPath = pageSlug
        ? `/${String(pageSlug).replace(/^\/+/, "")}`
        : destination || pageTitle || pageName;
      const queryPart = query ? (String(query).startsWith("?") ? query : `?${query}`) : "";
      const hashPart = hash ? (String(hash).startsWith("#") ? hash : `#${hash}`) : "";
      const target = targetPath ? `${targetPath}${queryPart}${hashPart}` : "Redirect";
      return {
        title: source && targetPath ? `${source} → ${target}` : source || "Redirect",
        subtitle: `${status}${kind} · ${scope}`,
      };
    },
  },
  orderings: [
    {
      title: "Source",
      name: "sourceAsc",
      by: [{ field: "source", direction: "asc" }],
    },
  ],
});
