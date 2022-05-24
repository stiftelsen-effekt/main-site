import S from '@sanity/desk-tool/structure-builder';
import { Book, Settings } from 'react-feather'

export default () =>
  S.list()
    .title('Base')
    .items([
      S.listItem()
        .title('Pages')
        .icon(Book)
        .child(
          S.list().title('pages').items([
            S.listItem()
              .title('Frontpage')
              .child(
                S.document().schemaType('frontpage').documentId('frontpage')
              ),
            S.listItem()
              .title('About us page')
              .child(
                S.document().schemaType('about_us').documentId('about_us')
              ),
            S.listItem()
              .title('Organizations page')
              .child(
                S.document()
                  .schemaType('organizations')
                  .documentId('organizations')
              ),
            S.listItem()
              .title('Profile page')
              .child(S.document().schemaType('profile').documentId('profile')),
          ])
        ),
      S.listItem()
        .title('Settings')
        .icon(Settings)
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings')
        ),
    ]);
