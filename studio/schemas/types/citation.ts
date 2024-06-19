import { Bookmark } from "react-feather";
import { CitationRenderer } from "../../components/citationRenderer";

export default {
  name: "citation",
  type: "document",
  title: "citation",
  icon: Bookmark,
  component: CitationRenderer,
  fields: [
    {
      type: "string",
      name: "type",
      title: "Type",
      // validation: Rule => Rule.required(),
      options: {
        list: ["book", "article", "workingpaper", "website", "video", "podcast", "misc", "note"],
      },
    },
    {
      name: "author",
      type: "string",
      title: "Author",
      description:
        "Surname, Initial(s). If a reference has more than 3 authors, only write the first author’s surname followed by “et al.”",
      hidden: ({ parent }: any) => typeof parent.type === "undefined" || parent.type === "note",
    },
    {
      name: "title",
      type: "string",
      title: "Title",
      hidden: ({ parent }: any) => typeof parent.type === "undefined" || parent.type === "note",
    },
    {
      name: "journal",
      type: "string",
      title: "Journal",
      hidden: ({ parent }: any) => typeof parent.type === "undefined" || parent.type !== "article",
    },
    {
      name: "year",
      type: "string",
      title: "Year",
      hidden: ({ parent }: any) => typeof parent.type === "undefined" || parent.type === "note",
    },
    {
      name: "volume",
      type: "string",
      title: "Volume",
      hidden: ({ parent }: any) => typeof parent.type === "undefined" || parent.type !== "article",
    },
    {
      name: "number",
      type: "string",
      title: "Number",
      hidden: ({ parent }: any) => typeof parent.type === "undefined" || parent.type !== "article",
    },
    {
      name: "pages",
      type: "string",
      title: "Pages",
      description: "E.g. 509-516",
      hidden: ({ parent }: any) =>
        typeof parent.type === "undefined" || (parent.type !== "article" && parent.type !== "book"),
    },
    {
      name: "edition",
      type: "number",
      title: "Edition",
      hidden: ({ parent }: any) => typeof parent.type === "undefined" || parent.type !== "book",
    },
    {
      name: "publisher",
      type: "string",
      title: "Publisher",
      description: "E.g. Oxford University Press",
      hidden: ({ parent }: any) => typeof parent.type === "undefined" || parent.type !== "book",
    },
    {
      name: "address",
      type: "string",
      title: "Address",
      description: "Or place, e.g. Colombia",
      hidden: ({ parent }: any) => typeof parent.type === "undefined" || parent.type !== "book",
    },
    {
      name: "accessed",
      type: "datetime",
      title: "Accessed",
      hidden: ({ parent }: any) =>
        typeof parent.type === "undefined" ||
        (parent.type !== "website" && parent.type !== "workingpaper"),
    },
    {
      name: "timestamp",
      type: "string",
      title: "Timestamp",
      description: "Optional timestamp for the cited information e.g. 32:45",
      hidden: ({ parent }: any) =>
        typeof parent.type === "undefined" ||
        (parent.type !== "video" && parent.type !== "podcast"),
    },
    {
      name: "serie",
      type: "string",
      title: "Serie",
      hidden: ({ parent }: any) =>
        typeof parent.type === "undefined" || parent.type !== "workingpaper",
    },
    {
      name: "number_in_serie",
      type: "string",
      title: "Number in Serie",
      hidden: ({ parent }: any) =>
        typeof parent.type === "undefined" ||
        parent.type !== "workingpaper" ||
        typeof parent.serie === "undefined",
    },
    {
      name: "url",
      type: "url",
      title: "URL",
      hidden: ({ parent }: any) =>
        typeof parent.type === "undefined" || parent.type === "book" || parent.type === "note",
    },
    {
      name: "notetitle",
      type: "string",
      title: "Note Title",
      hidden: ({ parent }: any) => typeof parent.type === "undefined" || parent.type !== "note",
    },
    {
      name: "note",
      type: "array",
      title: "Note",
      of: [{ type: "block" }],
      hidden: ({ parent }: any) => typeof parent.type === "undefined" || parent.type !== "note",
    },
  ],
  options: {
    modal: "dialog",
    preview: {
      select: {
        title: "title",
        author: "author",
        year: "year",
        type: "type",
        note: "note",
        notetitle: "notetitle",
      },
      prepare(selection: any) {
        const { author, year, title, type, note, notetitle } = selection;
        const noteBlocks = (note || []).find((block: any) => block._type === "block");
        return {
          title: type != "note" ? `${author ?? "-"} (${year ?? "-"})` : notetitle,
          subtitle:
            type != "note"
              ? title
              : noteBlocks
              ? noteBlocks.children
                  .filter((child: any) => child._type === "span")
                  .map((span: any) => span.text)
                  .join("")
              : "No content",
        };
      },
    },
  },
} as const;
