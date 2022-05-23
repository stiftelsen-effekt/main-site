import S from '@sanity/desk-tool/structure-builder';

export default () =>
  S.list()
    .title('Base')
    .items([
      S.listItem()
        .title('Pages')
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
            ...S.documentTypeListItems().filter(
              (listItem) =>
                !['frontpage'].includes(listItem.getId() || '') &&
                !['about_us'].includes(listItem.getId() || '') &&
                !['organizations'].includes(listItem.getId() || '') &&
                !['profile'].includes(listItem.getId() || '') &&
                !['siteSettings'].includes(listItem.getId() || '')
            ),
          ])
        ),
      S.listItem()
        .title('Settings')
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings')
        ),
    ]);
