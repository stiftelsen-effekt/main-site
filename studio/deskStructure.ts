import {
  Activity,
  Archive,
  BarChart,
  Book,
  Bookmark,
  Briefcase,
  DollarSign,
  File,
  Filter,
  Lock,
  Paperclip,
  Phone,
  PhoneCall,
  Settings,
  Tool,
  User,
} from "react-feather";

export const deskStructure = (S) =>
  S.list()
    .title("GiEffektivt.no")
    .items([
      S.listItem()
        .schemaType("generic_page")
        .title("Pages")
        .icon(Book)
        .child(
          S.documentList()
            .title("Pages by category")
            .apiVersion("v2024-09-19")
            .schemaType("generic_page")
            .filter('_type == "category"')
            .child((catId) =>
              S.documentList()
                .title("Pages")
                .schemaType("generic_page")
                .apiVersion("v2024-09-19")
                .filter('_type == "generic_page" && category._ref == $catId')
                .params({ catId })
                .defaultOrdering([{ field: "sitemap_priority", direction: "desc" }])
                .child((id) =>
                  S.document().schemaType("generic_page").documentId(id).views([S.view.form()]),
                ),
            ),
        ),
      S.listItem()
        .title("Pages without category")
        .icon(Archive)
        .child(
          S.documentList()
            .title("Pages")
            .schemaType("generic_page")
            .apiVersion("v2024-09-19")
            .filter('_type == "generic_page" && !defined(category)')
            .defaultOrdering([{ field: "sitemap_priority", direction: "desc" }])
            .child((id) =>
              S.document().schemaType("generic_page").documentId(id).views([S.view.form()]),
            ),
        ),
      S.divider(),
      S.listItem()
        .title("Articles page")
        .icon(File)
        .child(S.document().schemaType("articles").documentId("articles").views([S.view.form()])),
      S.listItem()
        .schemaType("article_page")
        .title("Articles")
        .icon(Book)
        .child(
          S.documentList()
            .title("Articles by category")
            .apiVersion("v2024-09-19")
            .filter('_type == "category"')
            .child((catId) =>
              S.documentList()
                .title("Articles")
                .schemaType("article_page")
                .apiVersion("v2024-09-19")
                .filter('_type == "article_page" && category._ref == $catId')
                .params({ catId })
                .child((id) =>
                  S.document().schemaType("article_page").documentId(id).views([S.view.form()]),
                ),
            ),
        ),
      S.listItem()
        .title("Articles without category")
        .icon(Archive)
        .child(
          S.documentList()
            .title("Articles")
            .schemaType("article_page")
            .apiVersion("v2024-09-19")
            .filter('_type == "article_page" && !defined(category)')
            .child((id) =>
              S.document().schemaType("article_page").documentId(id).views([S.view.form()]),
            ),
        ),
      S.divider(),
      S.listItem()
        .title("Fundraisers")
        .icon(User)
        .child(
          S.documentList()
            .title("Fundraisers")
            .schemaType("fundraiser_page")
            .apiVersion("v2024-09-19")
            .filter('_type == "fundraiser_page"')
            .child((id) =>
              S.document().schemaType("fundraiser_page").documentId(id).views([S.view.form()]),
            ),
        ),
      S.divider(),
      S.listItem()
        .title("Results")
        .icon(BarChart)
        .child(S.document().schemaType("results").documentId("results").views([S.view.form()])),
      S.divider(),
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
                .title("Tax")
                .icon(DollarSign)
                .child(S.editor().id("tax").schemaType("tax").documentId("tax")),
            ]),
        ),
      S.divider(),
      S.listItem()
        .schemaType("donationwidget")
        .title("Donation widget")
        .icon(DollarSign)
        .child(
          S.document()
            .schemaType("donationwidget")
            .documentId("donationwidget")
            .views([S.view.form()]),
        ),
      S.listItem()
        .title("Payment methods")
        .icon(Tool)
        .child(
          S.list()
            .title("Payment methods")
            .items([
              S.listItem()
                .title("Bank")
                .icon(Briefcase)
                .child(S.document().schemaType("bank").documentId("bank")),
              S.listItem()
                .title("Vipps")
                .icon(Phone)
                .child(S.document().schemaType("vipps").documentId("vipps")),
              S.listItem()
                .title("Swish")
                .icon(PhoneCall)
                .child(S.document().schemaType("swish").documentId("swish")),
              S.listItem()
                .title("Autogiro")
                .icon(Briefcase)
                .child(S.document().schemaType("autogiro").documentId("autogiro")),
              S.listItem()
                .title("AvtaleGiro")
                .icon(Briefcase)
                .child(S.document().schemaType("avtalegiro").documentId("avtalegiro")),
              S.listItem()
                .title("QuickPay")
                .icon(Briefcase)
                .child(S.document().schemaType("quickpay").documentId("quickpay")),
            ]),
        ),
      S.listItem()
        .title("Categories")
        .icon(Filter)
        .child(S.documentTypeList("category").title("Page and article categories")),
      S.listItem()
        .title("Bibliography")
        .schemaType("citation")
        .icon(Bookmark)
        .child(S.documentTypeList("citation").title("Entries")),
      S.listItem()
        .title("Site settings")
        .icon(Settings)
        .child(S.document().schemaType("site_settings").documentId("site_settings")),
    ]);
