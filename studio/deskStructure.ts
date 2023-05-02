import S from "@sanity/desk-tool/structure-builder";
import {
  Book,
  Bookmark,
  Briefcase,
  DollarSign,
  Filter,
  HelpCircle,
  Paperclip,
  Phone,
  Settings,
  Tool,
  User,
  Users,
  Zap,
} from "react-feather";
import Iframe from "sanity-plugin-iframe-pane";
import resolveProductionUrl from "./resolveProductionUrl";

export default () =>
  S.list()
    .title("GiEffektivt.no")
    .items([
      S.listItem()
        .title("Custom pages")
        .icon(Book)
        .child(
          S.list()
            .title("Pages")
            .items([
              S.listItem()
                .title("Articles")
                .icon(Paperclip)
                .child(
                  S.document()
                    .schemaType("articles")
                    .documentId("articles")
                    .views([
                      S.view.form(),
                      S.view
                        .component(Iframe)
                        .options({
                          url: (doc: any) => resolveProductionUrl(doc),
                        })
                        .title("Preview"),
                    ]),
                ),
            ]),
        ),
      S.listItem()
        .schemaType("generic_page")
        .title("Generic pages")
        .icon(Book)
        .child(
          S.documentList()
            .title("Pages")
            .schemaType("generic_page")
            .filter('_type == "generic_page"')
            .defaultOrdering([{ field: "sitemap_priority", direction: "desc" }])
            .child((id) =>
              S.document()
                .schemaType("generic_page")
                .documentId(id)
                .views([
                  S.view.form(),
                  S.view
                    .component(Iframe)
                    .options({
                      url: (doc: any) => resolveProductionUrl(doc),
                    })
                    .title("Preview"),
                ]),
            ),
        ),
      S.listItem()
        .schemaType("article_page")
        .title("Articles")
        .icon(Paperclip)
        .child(
          S.documentList()
            .title("Articles")
            .schemaType("article_page")
            .filter('_type == "article_page"')
            .child((id) =>
              S.document()
                .schemaType("article_page")
                .documentId(id)
                .views([
                  S.view.form(),
                  S.view
                    .component(Iframe)
                    .options({
                      url: (doc: any) => resolveProductionUrl(doc),
                    })
                    .title("Preview"),
                ]),
            ),
        ),
      S.listItem()
        .title("Profile pages")
        .icon(Book)
        .child(
          S.list()
            .title("Profile pages")
            .items([
              S.listItem()
                .title("Profile details")
                .icon(User)
                .child(S.document().schemaType("profile").documentId("profile")),
              S.listItem()
                .title("Tax")
                .icon(DollarSign)
                .child(S.document().schemaType("tax").documentId("tax")),
            ]),
        ),
      S.listItem()
        .title("Bibliography")
        .schemaType("citation")
        .icon(Bookmark)
        .child(S.documentTypeList("citation").title("Entries")),
      S.listItem()
        .schemaType("donationwidget")
        .title("Donation widget")
        .icon(DollarSign)
        .child(
          S.document()
            .schemaType("donationwidget")
            .documentId("donationwidget")
            .views([
              S.view.form(),
              S.view
                .component(Iframe)
                .options({
                  url: (doc: any) => resolveProductionUrl(doc),
                })
                .title("Preview"),
            ]),
        ),
      S.listItem()
        .title("Settings")
        .icon(Settings)
        .child(S.document().schemaType("site_settings").documentId("site_settings")),
      S.listItem()
        .title("Payment providers")
        .icon(Tool)
        .child(
          S.list()
            .title("Payment providers")
            .items([
              S.listItem()
                .title("Vipps")
                .icon(Tool)
                .child(S.document().schemaType("vipps").documentId("vipps")),
            ]),
        ),
    ]);
