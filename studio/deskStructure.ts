import S from '@sanity/desk-tool/structure-builder'

export default () =>
  S.list()
    .title('Base')
    .items([
      S.listItem()
        .title('About us')
        .child(
          S.document()
            .schemaType('about_us')
            .documentId('about_us')
        ),
      ...S.documentTypeListItems().filter(listItem => !['about_us'].includes(listItem.getId() || ''))
    ])