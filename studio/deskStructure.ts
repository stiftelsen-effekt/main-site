import S from "@sanity/desk-tool/structure-builder";
import {
  Activity,
  Book,
  Bookmark,
  Briefcase,
  DollarSign,
  Filter,
  HelpCircle,
  Lock,
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
        .title("Dashboard")
        .icon(Lock)
        .child(
          S.list()
            .title("Dashboard")
            .items([
              S.listItem()
                .title("Settings")
                .icon(Settings)
                .child(S.editor().id("settings").schemaType("dashboard").documentId("dashboard")),
              S.divider(),
              S.listItem()
                .title("Donations")
                .icon(Activity)
                .child(S.editor().id("donations").schemaType("donations").documentId("donations")),
              S.listItem()
                .title("Agreements")
                .icon(Paperclip)
                .child(
                  S.editor().id("agreements").schemaType("agreements").documentId("agreements"),
                ),
              S.listItem()
                .title("Profile")
                .icon(User)
                .child(S.editor().id("profile").schemaType("profile").documentId("profile")),
              S.listItem()
                .title("Tax deduction")
                .icon(DollarSign)
                .child(
                  S.editor()
                    .id("taxdeduction")
                    .schemaType("taxdeduction")
                    .documentId("taxdeduction"),
                ),
              S.listItem()
                .title("Tax units")
                .icon(DollarSign)
                .child(S.editor().id("taxunits").schemaType("taxunits").documentId("taxunits")),
              S.listItem()
                .title("Tax statements")
                .icon(DollarSign)
                .child(
                  S.editor()
                    .id("taxstatements")
                    .schemaType("taxstatements")
                    .documentId("taxstatements"),
                ),
              S.listItem()
                .title("Meta receipt")
                .icon(DollarSign)
                .child(
                  S.editor().id("metareceipt").schemaType("metareceipt").documentId("metareceipt"),
                ),
              S.listItem()
                .title("Vipps anonymous agreement")
                .icon(DollarSign)
                .child(
                  S.editor()
                    .id("vipps-anonymous")
                    .schemaType("vipps-anonymous")
                    .documentId("vipps-anonymous"),
                ),
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
