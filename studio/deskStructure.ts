import S from '@sanity/desk-tool/structure-builder';
import { Book, Briefcase, HelpCircle, Settings, User, Users, Zap } from 'react-feather'

export default () =>
  S.list()
    .title('GiEffektivt.no')
    .items([
      S.listItem()
        .title('Custom pages')
        .icon(Book)
        .child(
          S.list().title('Pages').items([
            S.listItem()
              .title('Frontpage')
              .icon(Zap)
              .child(
                S.document().schemaType('frontpage').documentId('frontpage')
              ),
            S.listItem()
              .title('About us')
              .icon(Users)
              .child(
                S.document().schemaType('about_us').documentId('about_us')
              ),
            S.listItem()
              .title('Organizations')
              .icon(Briefcase)
              .child(
                S.document()
                  .schemaType('organizations')
                  .documentId('organizations')
              ),
            S.listItem()
              .title('Support')
              .icon(HelpCircle)
              .child(
                S.document().schemaType('support').documentId('support')
              ),
            S.listItem()
              .title('Profile')
              .icon(User)
              .child(S.document().schemaType('profile').documentId('profile')),
            S.divider(),
          ])
        ),
      S.listItem()
        .schemaType('generic_page')
        .title('Generic pages')
        .icon(Book)
        .child(
          S.documentList()
            .title('Pages')
            .schemaType('generic_page')
            .filter('_type == "generic_page"')
        ),
      S.listItem()
        .title('Settings')
        .icon(Settings)
        .child(
          S.document().schemaType('site_settings').documentId('site_settings')
        ),
    ]);
